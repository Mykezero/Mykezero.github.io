---
layout: post
title: "Using NUnit with Visual Studio's Test Explorer"
date: 2016-2-26
---

Currently there's a problem with the 3.0+ versions of NUnit using the NUnitTestAdapter where tests are not added to Visual Studio's test explorer on build. We can work around this by using NUnit 2.6.4 along with the NUnitTestAdapter 2.0 so that they are compatible with each other:

1: Install NUnit with NUGET package manager

![image](https://cloud.githubusercontent.com/assets/5349608/13361159/05d6c97e-dc8b-11e5-98d1-b791c3082811.png)

2: Install the NUnitTestAdapter 

![image](https://cloud.githubusercontent.com/assets/5349608/13361218/4fdb0616-dc8b-11e5-81c6-07bf7f6a49c6.png)

Now since both versions of NUnit and the adapter match, Visual Studio shouldn't have any problems find the tests automagically now!

*Someone already posted a solution for this  but I figured I would summarize it in a quick post.*
