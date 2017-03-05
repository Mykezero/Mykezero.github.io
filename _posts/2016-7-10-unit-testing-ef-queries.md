---
layout: post
title: "Unit testing queries with Entity Framework"
date: 2016-7-10
---

When working with the entity framework, sometimes you'd just like to test the output of your linq to sql statements without invoking the database. 

In the past, I've tried using fake, in-memory dbsets to test these queries but the resulting test doubles always felt clunky. 

You would end up creating a header interface for the DbContext which is a pain to maintain when you have many dbsets in one dbcontext. 

```
public class DatabaseContext : DbContext, IDatabaseContext
{
	DbSet<Customer> Customers { get; set; }
	// 26 other sets...
}

public interface IDatabaseContext :
{
	DbSet<Customer> Customers { get; set; }
	// 26 other sets...
}

public class TestWebContext : IDatabaseContext
{
	DbSet<Customer> Customers { get; set; } = new TestDbSet<Customer> // Fake, In Memory DB Set
	// 26 other sets...

	public override int SaveChanges() => 0;
}

```

Instead, what I propose is following Jimmy's advice and to use queries instead. His article can be found here:
https://lostechies.com/jimmybogard/2012/10/08/favor-query-objects-over-repositories/

In this case, we should prefer query objects over repositories, limiting the number of entity framework related things you have to mock for a single test.

With that in mind we can more easily test these queries by using the .NET Framework's built in ienumerable classes without much hassle.

```
public class CustomerQuery
{
	public string Name { get; set; }

	public Expression<Func<Customer, bool>> AsExpression()
	{
		return c => c.Name == Name;
	}

	public IEnumerable<Customer> Execute(IQueryable<Customer> customers)
	{
		return customers.Where(AsExpression).ToList();
	}
}
```

With all that in place, we can now test the output of linq to sql expressions. 

```
public class CustomerQueryTest
{
	[Fact]
	public void WithMatchingCustomerNameWillReturnCustomer()
	{
		// fixture setup
		var customers = new List<Customer>
		{
			new Customer { Name = "Joe" }
		}

		var sut = new CustomerQuery();

		// exercise system
		var results = sut.Execute(customers.AsQueryable());

		// verify outcome
		Assert.Equal(1, results.Count());

		// teardown
	}
}
```

Finally, you can use the new query by passing the dbset directly to the query object's execute method. 

```
public ActionResult DisplayCustomers(string customerName)
{
	var model = new DisplayCustomersViewModel();

	using(var dbContext = new DatabaseContext())
	{
		var query = new CustomerQuery();
		var customers = query.Execute(dbContext.Customers);
		model = CustomerViewModelMapper.Map(customers);
	}

	return View(DisplayCustomersViewModel);
}
```

This definitely makes testing the logic much simpler without having to stub the whole dbcontext. 

Sadly, this doesn't guarantee that your linq to sql statements will work correctly against a real database but this will definitely help with testing code containing linq to sql expressions. 
