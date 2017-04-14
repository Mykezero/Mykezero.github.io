---
layout: post
title: "Unit Testing Naming Conventions"
date: 2016-6-17
---

# Test Naming Conventions

When working with open source projects, you run across a few different ways to name your unit tests. 

Let's take a look at a few of them by example testing a simple calculator with one operation: Divide

```cs
public class Calculator
{
	public void Divide(int x, int y) => x / y;
}
```

## Test Method Naming Conventions

With/Will
```cs
DivideWithDivisorEqualZeroWillThrowDivideByZeroException()
```

Given/Should
```cs
DivideGivenAZeroDivisorShouldThrowDivideByZeroException()
```

Given/When/Then
```cs
GivenAZeroDivisor_WhenDivideIsCalled_ThenDivideByZeroExceptionIsThrown.
```

## Fixture naming conventions

Test class per method
```cs
public class CalculatorTests
{
	public class Divide
	{
		[Fact] DivideWithZeroDivisorThrowsDivideByZeroException() { /* ... */ }	
	}
}
```

When - Should fixture
```cs
public class WhenDividingByZero
{
	[Fact] ShouldThrowDivideByZeroException() { /**/ }
}
```

Hopefully I can expand upon this list when a few more examples come to mind!
