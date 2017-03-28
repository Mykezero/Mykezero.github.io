---
layout: post
title: "Crazy idea involving SQL and Domain Logic"
date: 2017-03-27
---

Many applications these days are using relational databases as the data store for information (except for the projects I work on in my spare time ~.^). Today, I did a lot of thinking about SQL's affect on application performance and design, and have come to a strange conclusion: domain logic in the database is for performance, and domain logic in the application is for correctness.

What I'm suggesting is that we keep the filtering in both places. In that way, there are less rows to process and I can sleep at night knowing that my application will work well. None of this will make sense without an example, so here's one about sending customer's abandoned cart emails. 

**ShoppingCarts**

| ID | OrderNumber | DateCreated | DateUpdated |
|----|-------------|-------------|-------------|
| 1  | NULL        | 3/18/2017   | 3/20/2017   |

From this, we can see that the customer never finished the checkout process (OrderNumber is null) and the cart is abandoned (Today's date is 3/27/2017, and a week has passed). 

Now, we have a rule where the DateUpdated is only updated when shopping cart line items are modified. That way, we don't have to worry about what the ShoppingCartLineItems table looks like in this example ^^;

In SQL, we can find the abandoned carts pretty easily like so: 

```sql
SELECT * FROM ShoppingCarts sc
INNER JOIN ShoppingCartLineItems scli ON scli.ShoppingCartID = sc.ID
WHERE OrderNumber IS NULL AND DATEDIFF(DAY, sc.DateUpdated, GETDATE()) > 7
```

Basically, we check see if the shopping cart didn't make it to checkout by checking the OrderNumber and DateUpdated fields. 

That's all and good, but now what's the application part in this ordeal? Pretty much to call this query and, if results are returned, to send out an email to the customer with the shopping cart line items they left in their cart (I left out those details intentionally as well). 

This is all and good except now is become incredibly hard to test this logic. In order to test it, I better have a good set of database migration scripts, and create a nice set of integration tests. 

Instead of doing that, I'm thinking we can go another way with this: we'll leave the domain logic in the database like it already is, but we'll also add that logic to the application as well. WHAATT?!?!!!

This is what the application code could look like:

```cs
public class ShoppingCartModel
{
	public int ID { get; set; }	
	public string OrderNumber { get; set; }	
	public DateTime DateUpdated { get;set; }
	
	// The domain logic for abandoned carts
	public bool IsAbandoned()
	{
		if(OrderNumber == null && DbFunctions.DateDiff(DateUpdated, DateTime.Now) > 7)
	}
	
	public void SendMessage()
	{
		// sends the email
	}
}

public ShoppingCartAbandonmentNotifier
{
	private IShoppingCartRepository repository;
	
	public ShoppingCartAbandonmentNotifier(
		IShoppingCartRepository repository)
	{
		this.repository = repository;
	}
	
	public void NotifyAbandonedCarts()
	{
		var shoppingCarts = repository.GetAbandonedShoppingCarts();
		var abandonedCarts = shoppingCarts.Where(cart => cart.IsAbandoned()).ToList();
		abandonedCarts.ForEach(cart => cart.SendMessage())
	}
}
```

At this point, it would be right to question what the benefits to leaving the logic in both places. Mostly, we gain a whole lot of confidence in our code because, if designed right, we can still use TDD and a fast feedback loop to develop the code. This should result in high code coverage. 

As a result of that confidence, we gain these two benefits as well. 

The contents of the SQL query becomes more of a performance thing. Your DBA can rentlessly tear up this SQL script to tune the performance without worrying about wreacking havoc upon the application code. As long as the correct rows are still returned, everything is all good in the world. 

In addition, we no longer have to concern ourselves with what database implementation we are using. The repository pattern will handle most of the transition since it doesn't have any knowledge of the database engine. Since we ensure correctness in the application itself, it's not too important what the new query will be or if we don't come up with the optimal query at the time of transition; as long as that query is semi-performant, and returns the correct rows then everything will be fine. 

Surely, I haven't had the confidence to move forward this this approach in any applications, but the benefits are pretty sound in theory. I don't think the database implementation would change all that often, but having the option to relentlessly refactor my database code just like my application code would be priceless.

Indeed, this is still just a crazy theory, but maybe ...

*Side note*
Quick listing of possible reasons why this is a bad idea: 

1. Duplication of logic where only one place is changed, but not the other (hard to predict bugs)
2. Takes more effort to TDD the logic in the application and codify the same thing in SQL

Both are symptoms of not keeping the code DRY enough. But when one lives in a swamp where things weren't too dry to begin with, then maybe this wouldn't be the worse of your worries. 
