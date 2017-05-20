Working with legacy code can be a real pain. With this type of code, adding a new feature can open the door for bugs. We know that the existing code works fine, but the second we change one little piece of code here, something we thought was unrelated breaks in the process. 

When code becomes so entangled with logic and dependencies, it's time to start cleaning the code and breaking dependencies to reduce the fragility of the system. But how do you do this with as little risk as possible?

One method to approach refactoring this code is to use golden master testing (aka guru checks changes)
http://wiki.c2.com/?GuruChecksChanges

With this method, we are not checking for correctness, but to check if the output of the system has changed after making some changes. We want to create a "Golden Master" that acts as a change detector to let us know if something changes with the output of the thing we're modifying. 

The goal with this technique is to modify the system enough where we can introduce testing seams with which we can make the system more testable. Eventually, we'll replace all the golden master tests with unit tests and we'll be able to delete the slow-running golden master tests (or keep them depending on your preference). 

I'll be demonstrating this technique with everybody's favorite fizzbuzz test, except with an inexplicably horrible implementation of it. Between you and me, I'm going to create it with TDD, but afterwards, I'm going to apply some "techniques" to make the code glow! (and by glow, I mean a horrible mess that you'd never want dropped on your plate for dinner @.o). 

http://wiki.c2.com/?FizzBuzzTest

Low and behold the greatest code eva invented!

