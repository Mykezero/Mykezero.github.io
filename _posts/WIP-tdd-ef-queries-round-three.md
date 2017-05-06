**Article is a work in progress!!**

Time for a quick update for testing in the Entity Framework world. I'm still using EF 6.0 and the few approaches I've been trying either require adding a new interface method for each dbcontext change (header interfaces over dbcontexts) or suffer from parameter massive explosion (query object accepting several dbsets). 

You can read about the two approaches I've taken in a [previous article](https://mykezero.github.io/2016/07/10/unit-testing-ef-queries). 

After some research and heavy thinking, I think I've come up with a solution that's more maintainable than the previous approaches. 
*Note:* I can't seem to remember where I borrowed some of this code from, please forgive me! ^^; 

Combining the previous approaches, we come out with what seems like a flexible approach to querying for customers!
**Warning: Most of this code has not been compiled and is mostly a theory for a future expirement**

First, we'll define the customer's dbcontext and entity classes. 

```
public class CustomerContext : DbContext
{
	DbSet<Customer> Customers { get; set; }
}

public class Customer
{
	public string Name { get; set; }
}
```

Next, we create the query class which we'll use to filter the customers. 

```
public class Query<T> where T : class
{
	public Expression<Func<T, bool>> Expression { get; set; }
}

public class GetCustomersByNameQuery : Query<Customer>
{
	public GetCustomersByNameQuery()
	{
		Expression = c => c.Name == Name;
	}
}
```

Afterwards, we need access to dbsets without having to hardcode which sets we need in advanced which the context adapter provides for us. 

```
public interface IContextAdapter : IDisposable
{
	DbSet<T> Set<T>() where T : class;
	void SaveChanges();
}

public class ContextAdapter : IDisposable, IContextAdapter
{
	private readonly DbContext _dbContext;

	public ContextAdapter(DbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public DbSet<T> Set<T>() where T : class
	{
		return _dbContext.Set<T>();
	}

	public void SaveChanges()
	{
		_dbContext.SaveChanges();
	}

	public void Dispose()
	{
		_dbContext.Dispose();
	}
}
```

Finally, we need a query handler class that takes the adapter class, grabs dbsets from it and executes the query on them. 

```
public class CustomerQueryHandler
{
	private ContextAdapter _adapter { get; set; }
	
	public CustomerQueryHandler(ContextAdapter adapter)
	{
		_adapter = adapter;
	}

	public IEnumerable<Customer> Execute(CustomerQuery customerQuery)
	{
		var customers = _adapter.Set<Customers>().AsQueryable();
		return customers.Where(customerQuery.Expression).ToList();
	}
}
```

With all that in place, querying the customers becomes pretty easy. 

```
public class CustomerManager
{
	public static IQueryable<Customer> FindCustomersByName()
	{
		var customerQuery = new CustomerQuery();
		var customerQueryHandler = new CustomerQueryHandler(
			new ContextAdapter(new CustomerContext())
		);
		return customerQueryHandler.Execute(customerQuery);
	}
}
```

```
public class TestContextAdapter : InMemoryDatabase, IContextAdapter
{
	public void Dispose()
	{
	}

	public DbSet<T> Set<T>() where T : class
	{
		return FindDbSet<T>();
	}        

	public void SaveChanges()
	{
	}
}
```

```
public class InMemoryDatabase
{
	private readonly Dictionary<Type, object> _dbSets = new Dictionary<Type, object>();

	public DbSet<T> FromSingle<T>(T value) where T : class
	{
		var dbSet = FindDbSet<T>();
		dbSet.Add(value);
		return dbSet;
	}

	public DbSet<T> FromMany<T>(IEnumerable<T> values) where T : class
	{
		var dbSet = FindDbSet<T>();
		dbSet.AddRange(values.ToList());
		return dbSet;
	}

	public DbSet<T> FindDbSet<T>() where T : class
    {
        var dbSet = _dbSets.ContainsKey(typeof(T)) ? 
            _dbSets[typeof(T)] as DbSet<T> :
            new TestDbSet<T>();

        if (!_dbSets.ContainsKey(typeof(T)))
        {
            _dbSets.Add(typeof(T), dbSet);
        }

        return dbSet;
	}
		
	public DbSet<T> FromEmpty<T>() where T : class
	{
		var dbSet = FindDbSet<T>();
		return dbSet;
	}
}
```
