---
layout: post
title: "Abstract test cases for enforcing contracts"
date: 2017-03-01
---

Often when programming, we must guard against invalid inputs that can come
from users, databases and web services.

Guarding against these inputs can seem like a lot work, and that there's
*more important* tests that we should be focusing on.

Note: Boundary testing is very important so don't skimp on it! Plus, these
types are test are very easy to write.

We'll there's good news: In some cases, we can leverage abstract test cases to
reduce the cost of writing these checks.

The cases where this works extremely well is where we have an abstraction,
with many implementers. An example of such a system is a FileUploader
abstraction: The goal is to upload a file, but there are many
different ways to do it.

```cs
public interface IFileUploader
{
    void Upload(string path, object contents);
}
```

```cs
public class S3FileUploader : IFileUploader
{
    public void Upload(string path, object contents)
    {
        // Perform upload to Amazon S3
    }
}
```

```cs
public class FTPFileUploader : IFileUploader
{
        public void Upload(string path, object contents)
        {
            // Perform an FTP upload
        }
}
```

In this case, we need to do a lot of parameter checking. In addition, If I ever
decide to support SFTP uploads as well, I'd need to create even more tests to
check those parameters as well; even though the code to test them would be
pretty much the same!

To avoid all of that work, we could put those checks into an abstract test case
to reuse them. The abstract test case would contain all of tests to guard
against invalid values.

```cs
public abstract class FileUploaderAbstractTestCase
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void UploadWithNullOrEmptyPathThrowsException(string path)
    {
        // Fixture setup
        var sut = CreateSut();

        // Exercise system
        var exception = Record.Exception(() => sut.Upload(path, new object()));

        // Verify outcome
        AssertException<ArgumentException>("Path cannot be null or empty", exception);

        // Teardown
    }

    [Fact]
    public void UploadWithNullContentThrowsException()
    {
        // Fixture setup
        var sut = CreateSut();

        // Exercise system
        var exception = Record.Exception(() => sut.Upload("validPath", null));

        // Verify outcome
        AssertException<ArgumentException>("Content cannot be null", exception);

        // Teardown
    }    

    public static void AssertException<T>(string expectedMessage, Exception actualException)
    {
            Assert.IsType<T>(actualException);
            Assert.Equal(expectedMessage, actualException.Message);
    }

    public abstract IFileUploader CreateSut();
}
```

Now we can use those tests for each specific class implementing that behavior
to ensure that they act appropriately.

```cs
public class S3FileUploaderTestCase : FileUploaderAbstractTestCase
{
    public override IFileUploader CreateSut()
    {
        return new S3FileUploader();
    }
}

public class FTPFileUploaderTestCase : FileUploaderAbstractTestCase
{
    public override IFileUploader CreateSut()
    {
        return new FTPFileUploader();
    }
}
```

Now, when a new SFTP file uploader is created, it will be a matter of
sub classing from our abstract test case to ensure that the SFTP file uploader
upholds the contract for guarding against these invalid inputs.

Of course, this approach doesn't only apply to gaurding against invalid inputs, 
but could be use to verify the behavior of each file uploader as a whole. 

New tests for "When upload is called, with given path and contents, will upload file" 
could be added to ensure that each uploader performs some upload action with the path 
and content information. 

This would ensure each implementer properly implements the contract for that 
particular abstraction. 
