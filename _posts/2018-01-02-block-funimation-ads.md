---
layout: post
title: "Blocking Ads on Funimation"
date: 2018-01-02
---

Well, I finally got sick of seeing the same National Grid commercial on Funimation for the one-thousandth time so I've come up with a strategy for blocking ads on their site. 

You'll need the following chrome plugin to get this to work correct: 

1. [Custom JavaScript for websites](https://chrome.google.com/webstore/detail/custom-javascript-for-web/poakhlngfciodnhlhhgnaaelnpjljija?hl=en) to inject custom javascript into the loading page. 

Funimation will load a blockadblock.js file when it detects adblockplus which will place four black overlay divs over the video content. 

At first, I attempted to block the blockadblock.js http get request, but the other funimation javascript code depends on it. 

What we'll do instead is to load a timer that looks specifically for those div elements and will remove them from the page. 

## Code Snippet and Example
  
### Javascript
  
```js
// Create interval to repeatedly remove 'funimation-error-screen' every half second.
setInterval(function(){ $("funimation-error-screen").remove() }, 500);
```

### CJS Settings

![image](https://user-images.githubusercontent.com/5349608/34525686-d3d83720-f06d-11e7-84cd-c66174bc7d8a.png)

The plugin should load this javascript before the page loads and will eliminate the black overlay when they pop up. 

Pretty simple solution for what was looking like a complex problem. 

Hopefully this helps!
