---
layout: post
title: "Unit testing queries with Entity Framework"
date: 2016-7-10
---

EF is a pretty hard framework to unit test. In the past, I've tried using fake, in-memory dbsets to test my queries but they always felt so clunky.

You would end up creating a header interface for the DbContext which is just a pain when you have 26 dbsets in one DbContext ...

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

What I suggest is following his advice with regards to testing; preferring queries over repositories limiting the number of dbsets you have to mock for a single test.

With that in mind we can easily test EF and use .Net's built in IEnumerable classes without much hassle.

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

With all that in place, you can write a test for your new query using regular list data.

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

Finally, you can add this to your application with a data context like so

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

This definitely makes testing the logic much simpler with less setup needed than the TestDatabase setup.

Of course, like others have said already, this doesn't guarantee that your LINQ to SQL statements will work correctly against a real database,
but this is definitely a step forward for testing database intensive with lots of logic built into LINQ queries.
