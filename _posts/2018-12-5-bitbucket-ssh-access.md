---
layout: post
title: "Bitbucket - Setting up SSH key without using default id_rsa"
date: 2018-12-5
---

These are the the steps to generating a new SSH key and testing Bitbucket ssh keys on Windows. 

This set up will allow you to use a custom ssh key specifically for Bitbucket, without having to change your id_rsa key. 

1. Run ssh-keygen to create a new ssh key 
    * Use bitbucket_rsa for key name
    * Don't specify a password, if you don't want to enter it every time.

2. Add the **public key** to the ssh-keys section inside of Bitbucket (use the file with the .pub extension)

3. Create ssh config file with the following settings for bitbucket.org

    ##### FileName: ~.\ssh\config
  
    ```
    Host bitbucket.org
      IdentityFile ~/.ssh/bitbucket_rsa
      IdentitiesOnly yes
    ```
    
4. Test your new key against Bitbucket to see if it uses the correct file

    ```ssh -T git@bitbucket.org```

5. Verify you've successfully logged in.
  
    ```
    logged in as <UserName>.
     
    You can use git or hg to connect to Bitbucket. Shell access is disabled.
    ```
    
 Now, you should be able to push / pull from Bitbucket without needing to specify your ssh key: 
 
 SSH will use the correct key when connecting to bitbucket.org. 
