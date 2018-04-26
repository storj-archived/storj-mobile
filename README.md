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

Authorization is based on auth files that is stored on the device and can can be encrypted with password(PIN code). Auth file contains email, password and menmonic

Authorization methods from [java-libstorj](https://github.com/storj/java-libstorj)

```static native String generateMnemonic(int var)``` - generates new menominc. 24 words

```static native boolean checkMnemonic(String var)``` - checks if mnemonic is correct. The only parameter - is mnemonic string.

```int verifyKeys(String user, String pass)``` - verifies if user with such credentials exists in . It won't return true if user hasn't confirmed his email after registration.

```boolean keysExist()``` - check if there is auth file on the device.

```importKeys(email, password, mnemonic, passcode);``` - stores new auth file on the device that is encrypted with passcode. By default passcode is an empty string which means that authfile is not encrypted.

```boolean deleteKeys()``` - deletes auth file from the device

```Keys getKeys(String passphrase)``` - reads keys from auth file. If it's encrypted should supply valid one. By default empty string is passed for not encrypted auth file. Return instance of Keys:

```
class Keys {
    private String user;
    private String pass;
    private String mnemonic;
}
```

```void register(String user, String pass, RegisterCallback callback)``` - register new user with given email and password. OnSuccess it will send email with new user confirmation link. Check what is [RegisterCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/RegisterCallback.java)

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

The project consists of 3 main parts:
1. Cross-platform view implemented with [React-Native Framework](https://facebook.github.io/react-native/)
2. Source code for android devices, written in Java language
3. Source code for Ios devices, written in Objective-C language

Main functionality of source code for android and Ios devices:
1. Database layer
2. Background services for long-running operations, such as upload, download, synchronization of local files with Storj network
3. [Native modules](https://facebook.github.io/react-native/docs/native-modules-android.html)

### Frontend
We used React-native + Redux approach and tried to design our code in appropriate way.

Main parts of frondend structure:

**Containers** - container components connected with Store, incaplulates all client logic inside and provides all callbacks to the presentations components.

**Components** - presentations components, only concerned with how things look. Have no dependencies on the rest of the app, such as store, reducers or reducer actions.

**Reducers** - specify how the application's state changes in response to actions sent to the store. Also contains initial state of application.

**Navigators** - to implement navigation (tab navigation, stack navigators) we use [React Navigation](https://reactnavigation.org/) framework.

### Android 

Android part is written in Java language and its main modules are:

1. **dataprovider** - out database layer. This layer includes:
    - **data contracts** - entities, that describes correspondings tables.
    
    - **dbo** - Data base objects. Dbo - is an object that defines how the data will be sent to the database.
    
    - **repositories** - We use a repository to separate the logic that retrieves the data and maps it to the entity model from the         business logic that acts on the model.
    
    In our current implementation whe have 4 tables:
    
    -**Buckets** - stores already uploaded buckets and its metadata.
    
    -**Files**- stores already uploaded files metadata. Also stores thumbnail of downloaded/uploaded file as base64 String.
    
    -**UploadingFiles** - stores all uplaoding files. When uploading finish files will be removed and placed to the Files table.
    
    -**Settings** - stores all settings
    
    We use SQLite3 as local database.
    
2. **services** - list of our background services that executes long-running operations.
     
     - **ServiceModule** - entry point that is responsible for binding another services.
     
     Next methods of this service are called from frontend part to bind all services when application started.
     ```void bindGetBucketsService(Promise promise)
        void bindUploadService(Promise promise)
        void bindDownloadService(Promise promise)
     ```
     
## Issues
