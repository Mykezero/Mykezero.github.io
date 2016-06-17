---
layout: post
title: "Unit Testing Naming Conventions"
date: 2016-2-26
---

When working with open source project, you run across a few different ways to name your unit tests. 

Let's take a look at a few of them by example testing a simple calculator with one operation: Divide

```
public class Calculator
{
	public void Divide(int x, int y) => x / y;
}
```

## With - Will
DivideWithDivisorEqualZeroWillThrowDivideByZeroException()

## Given - Should
DivideGivenAZeroDivisorShouldThrowDivideByZeroException()

## Given When Then
GivenAZeroDivisor_WhenDivideIsCalled_ThenDivideByZeroExceptionIsThrown. 

Hopefully I can expand upon this list when a few more examples come to mind!


