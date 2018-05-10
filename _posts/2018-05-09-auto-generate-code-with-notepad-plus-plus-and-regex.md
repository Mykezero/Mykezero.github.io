---
layout: post
title: "Auto-generating code with notepad++ and regular expressions"
date: 2018-05-09
---

There's a tremendous amount of text manipulation you can do with notepad++ such as transforming SQL table output to markdown tables 
and auto generating code instead of having to type it by hand. 

I ran into a problem recently where I accidentally created some interacting unit tests. 
The Config class is a singleton with a global access point refernced in 99+ places.
Since everything in the program uses this class, if the SUT references this class,
then there's a chance that another test will change a value on this classes causing an unrelated test to fail for no reason. 

As a temporary solution, I came up with the idea of introducing a ProxyConfig class in front of the global config class. 
This will limit direct access to the singleton config, and will allow consumers to hold a reference to ProxyConfig instead of Config. 
That way, I can give each test its very own ProxyConfig, and the tests will no longer interact with each other. 

```
public class Config
{
   public static Config Instance { get; set; } = new Config();
   
   public bool AggroFilter = false;
}
```

```
public class ProxyConfig : IConfig
{
  public bool AggroFilter 
  { 
    get => Config.Instance.AggroFilter;
    set => Config.Instance.AggroFilter = value;
  }
}

```

Now we can create a new TestConfig for testing purposes.

```
public class TestConfig : IConfig
{
  // Simple getter / setter for easy testing. 
  // Will not interact through Config.Instance with other tests!
  public bool AggroFilter { get; set; }
}
```

Sadly, Config has 15+ fields that need to be converted to properties for use in the IConfig interface and on the ProxyConfig class. 

Luckly, we can use notpad++ to do this text manipulation with ease!

Here's the complete list of fields on the config class: 

#### Config fields

```
bool AggroFilter 
BattleLists BattleLists 
bool ClaimedFilter 
double DetectionDistance 
int GlobalCooldown 
double HeightThreshold 
int HighHealth 
int HighMagic 
ObservableCollection<string> IgnoredMobs 
string IgnoredName 
bool IsApproachEnabled 
bool IsEngageEnabled 
bool IsHealthEnabled 
bool IsMagicEnabled 
int LowHealth 
int LowMagic 
double MeleeDistance 
bool PartyFilter 
ObservableCollection<string> TargetedMobs 
string TargetName 
bool UnclaimedFilter 
double WanderDistance 
bool StraightRoute 
bool MinimizeToTray 
int TrustPartySize 
bool HomePointOnDeath 
bool EnableTabTargeting 
bool IsObjectAvoidanceEnabled 
double FollowDistance 
string FollowedPlayer 
```

Now, with notepad++ you can use the following regex and replace to create getters and setters for all of the fields: 

* Pattern: `(.*) (.*) (.*)`
* Replace: `public $1 $2 {\r\nget => Config.Instance.$2;\r\nset => Config.Instance.$2 = value;\r\n}`

You'll end up with the following as a result. 


```
public bool AggroFilter {
get => Config.Instance.AggroFilter;
set => Config.Instance.AggroFilter = value;
}
public BattleLists BattleLists {
get => Config.Instance.BattleLists;
set => Config.Instance.BattleLists = value;
}
public bool ClaimedFilter {
get => Config.Instance.ClaimedFilter;
set => Config.Instance.ClaimedFilter = value;
}
public double DetectionDistance {
get => Config.Instance.DetectionDistance;
set => Config.Instance.DetectionDistance = value;
}
public int GlobalCooldown {
get => Config.Instance.GlobalCooldown;
set => Config.Instance.GlobalCooldown = value;
}
public double HeightThreshold {
get => Config.Instance.HeightThreshold;
set => Config.Instance.HeightThreshold = value;
}
public int HighHealth {
get => Config.Instance.HighHealth;
set => Config.Instance.HighHealth = value;
}
public int HighMagic {
get => Config.Instance.HighMagic;
set => Config.Instance.HighMagic = value;
}
public ObservableCollection<string> IgnoredMobs {
get => Config.Instance.IgnoredMobs;
set => Config.Instance.IgnoredMobs = value;
}
public string IgnoredName {
get => Config.Instance.IgnoredName;
set => Config.Instance.IgnoredName = value;
}
public bool IsApproachEnabled {
get => Config.Instance.IsApproachEnabled;
set => Config.Instance.IsApproachEnabled = value;
}
public bool IsEngageEnabled {
get => Config.Instance.IsEngageEnabled;
set => Config.Instance.IsEngageEnabled = value;
}
public bool IsHealthEnabled {
get => Config.Instance.IsHealthEnabled;
set => Config.Instance.IsHealthEnabled = value;
}
public bool IsMagicEnabled {
get => Config.Instance.IsMagicEnabled;
set => Config.Instance.IsMagicEnabled = value;
}
public int LowHealth {
get => Config.Instance.LowHealth;
set => Config.Instance.LowHealth = value;
}
public int LowMagic {
get => Config.Instance.LowMagic;
set => Config.Instance.LowMagic = value;
}
public double MeleeDistance {
get => Config.Instance.MeleeDistance;
set => Config.Instance.MeleeDistance = value;
}
public bool PartyFilter {
get => Config.Instance.PartyFilter;
set => Config.Instance.PartyFilter = value;
}
public ObservableCollection<string> TargetedMobs {
get => Config.Instance.TargetedMobs;
set => Config.Instance.TargetedMobs = value;
}
public string TargetName {
get => Config.Instance.TargetName;
set => Config.Instance.TargetName = value;
}
public bool UnclaimedFilter {
get => Config.Instance.UnclaimedFilter;
set => Config.Instance.UnclaimedFilter = value;
}
public double WanderDistance {
get => Config.Instance.WanderDistance;
set => Config.Instance.WanderDistance = value;
}
public bool StraightRoute {
get => Config.Instance.StraightRoute;
set => Config.Instance.StraightRoute = value;
}
public bool MinimizeToTray {
get => Config.Instance.MinimizeToTray;
set => Config.Instance.MinimizeToTray = value;
}
public int TrustPartySize {
get => Config.Instance.TrustPartySize;
set => Config.Instance.TrustPartySize = value;
}
public bool HomePointOnDeath {
get => Config.Instance.HomePointOnDeath;
set => Config.Instance.HomePointOnDeath = value;
}
public bool EnableTabTargeting {
get => Config.Instance.EnableTabTargeting;
set => Config.Instance.EnableTabTargeting = value;
}
public bool IsObjectAvoidanceEnabled {
get => Config.Instance.IsObjectAvoidanceEnabled;
set => Config.Instance.IsObjectAvoidanceEnabled = value;
}
public double FollowDistance {
get => Config.Instance.FollowDistance;
set => Config.Instance.FollowDistance = value;
}
public string FollowedPlayer {
get => Config.Instance.FollowedPlayer;
set => Config.Instance.FollowedPlayer = value;
}
```
It took me 2 minutes to come up with the pattern, but saved me 5 to 10 minutes of typing! 
I would have hated to type all of that by hand. The only thing left to do is auto-format the text to make it look pretty ^^;
