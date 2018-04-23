# Storj mobile client
Mobile client for secure file storing.
All files will be encrypted before sending to distributed network.
## Getting Started
* Install react native(Building projects with native code) -> https://facebook.github.io/react-native/docs/getting-started.html 
* npm install
* android: react-native run-android
* ios: react-native run-ios
* to run on physical device, add "--device" param
## Storj API description
As current implmentation of Storj API we used [libstorj](https://github.com/storj/libstorj) and its wrappers for [android](https://github.com/storj/android-libstorj) and [IOS](https://github.com/storj/ios-libstorj).
But you are able implement all API calls by yourself, [look](https://storj.io/api.html)
#### Authorization



#### Buckets
Bucket - is some kind of a folder. All buckets should be in root directory, for now there is no possibility to create one bucket inside of another. Example of Buket class described in Java-libstorj wrapper:

```
public class Bucket {
    private String id;
    private String name;
    private String created;
    private boolean decrypted;
...
}
```
You are able to create and to delete buckets. Also you can not have two buckets with the same name.

##### Bucket creation

To create bucket you should call:

Android - 
```
void createBucket(String bucketName, CreateBucketCallback callback)
```
This method has two parameters - bucket name and [CreateBucketCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/CreateBucketCallback.java) callback.

IOS - 


##### Bucket deletion
Deletion of the bucket will also delete all files, that are uploaded to this bucket.

To delete bucket you should call:

Android - 
```
void deleteBucket(String bucketId, DeleteBucketCallback callback)
```

This method has two parameters - String bucketId and [DeleteBucketCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/DeleteBucketCallback.java) callback.

IOS - 




#### Files
All files stored in Storj distibuted systen as encrypted shards of your original file.

Files could be uploaded to Storj Network, downloaded from it and deleted.

Example of file class in [Java-libstorj](https://github.com/storj/java-libstorj)

```
public class File {
    private String id;
    private String bucketId;
    private String name;
    private String created;
    private boolean decrypted;
    private long size;
    private String mimeType;
    private String erasure;
    private String index;
    private String hmac;
}
```

##### File uploading
Before uploading file will be encrypted, and splitted on little chunks. During this process all file will be placed in virtual memory of your device. In case if your device doesn't have enough free virtual memory - your application will crash.

To upload file you should call

Android:
 ```long uploadFile(String bucketId, String localPath, UploadFileCallback callback)```
 
 This method has three parameters - id of the bucket, path, to the file, and [UploadFileCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/UploadFileCallback.java)

Return value of this method - is fileHandle, that is needed to cancel upload.

File upload cancellation:

```boolean cancelUpload(long uploadState)```

Just save you fileHandle and pass it as a parameter to this method.

File uploading propgress: 

in your [UploadFileCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/UploadFileCallback.java)
you can find 
```void onProgress(String filePath, double progress, long uploadedBytes, long totalBytes)```
callback. It parameters contain all needed information to implement progress of file uploading in your application.

IOS:

##### File downloading
Android: 

Before file downloading you should check that your device has enough free memory in its disk space. In other case - you can face issues in download behaviour.

```long downloadFile(String bucketId, String fileId, String localPath, DownloadFileCallback callback)```

This method has three parameters - id of the file, path, to the file, and [DownloadFileCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/DownloadFileCallback.java)

Return value of this method - is fileHandle, that is needed to cancel download.

File download cancellation:

```boolean cancelDownload(long downloadState)```

Just save you fileHandle and pass it as a parameter to this method.

IOS:

## Features
## Project structure
## Issues
