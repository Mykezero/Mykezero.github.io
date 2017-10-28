---
layout: post
title: "Restarting mysql with --skip-grant-tables option on linux"
date: 2017-10-28
---

I wasn't expecting so much trouble resetting the root password for a mysql instance. 

The documentation said to use the --skip-grant-tables option and to pass that when the service is restarted. 

[skip-grant-tables](https://dev.mysql.com/doc/refman/5.7/en/server-options.html#option_mysqld_skip-grant-tables)

The problem is systemd does not allow you to pass arguments to services upon restart. 

Instead of overriding the startup parameters for the mysql systemd unit, you can edit the /etc/mysql/my.cnf for the same effect. 

#### /etc/mysql/my.cnf
```
[mysqld] 
skip-grant-tables
```

Now you should be able to log into your mysql instance without a password. 

Just remember to remove that from your configuration file after reseting your password!
