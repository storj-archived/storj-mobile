# Storj mobile client
Mobile client for secure file storing.
All files will be encrypted before sending to distributed network.

# Overview

- [Getting started](#anchor)
- [Storj API Description](#anchor)
 - [Authorization](#anchorAuthorization)
 	  - [Generate mnemonic](#anchorAuthGenerateMnemonic) 
 	  - [Check mnemonic](#anchorAuthCheckMnemonic) 
 	  - [Verify keys](#anchorAuthVerifyKeys)
 	  - [Check keys exists](#anchorAuthCheckKeysExists) 
 	  - [Import keys](#anchorAuthImportKeys) 
 	  - [Delete keys](#anchorAuthDeleteKeys) 
 	  - [Get keys](#anchorAuthGetKeys)
 	  - [Registration](#anchorAuthRegistration)
 - [Buckets](#anchorBuckets) 
     - [Buckets list](#anchorBucketList) 
     - [Bucket creation](#anchorBucketCreate) 
     - [Bucket deletion](#anchorBucketDelete)
  - [Files](#anchor)
	  - [File Upload](#anchor)
	  - [File Download](#anchor)
- [Features](#anchor)	
- [Project Structure](#anchor)
  - [Frontend](#anchor)
  - [Android](#anchor)
  - [iOS](#anchor)
- [Known Issues](#anchor)
- [](#anchor)

<a name="anchor"></a>
## Getting Started
Install react native(Building projects with native code) -> https://facebook.github.io/react-native/docs/getting-started.html 

1. ```git clone git@github.com:storj/storj-mobile.git```
2. ```cd storj-mobile``` 
3. ```npm install```
4. Run
  * Android 
     * ```react-native run-android```
  * iOS
     * ```react-native run-ios```
5. Run on physical device
  * Android
     * ```react-native run-android --device```
  * iOS
     * ```react-native run-ios --device```

<a name="anchorStorjApiDescription"></a>
## Storj API description

As current implmentation of Storj API we used [libstorj](https://github.com/storj/libstorj) and its wrappers for [android](https://github.com/storj/android-libstorj) and [IOS](https://github.com/storj/ios-libstorj).
But you are able implement all API calls by yourself, [look](https://storj.io/api.html)

<a name="anchorAuthorization"></a>
#### Authorization

Authorization is based on auth files that is stored on the device and can can be encrypted with password(PIN code). Auth file contains email, password and menmonic

General description of auth file content: 

```
string email
string password
string mnemonic
```

Authorization metnods for Android from [java-libstorj](https://github.com/storj/java-libstorj/)

Authorization methods for iOS from [ios-libstorj](https://github.com/storj/ios-libstorj/)

<a name="anchorAuthGenerateMnemonic"></a>
##### Generate new mnemonic
Generates new mnemonic. 24 words

###### Android

```static native String generateMnemonic(int var)```

###### iOS

```-(NSString *_Nullable)generateMnemonic:(int)strength```

<a name="anchorAuthCheckMnemonic"></a>
##### Check mnemonic
Checks if mnemonic is correct. The only parameter - is mnemonic string.

###### Android

```static native boolean checkMnemonic(String var)```

###### iOS

```-(BOOL)checkMnemonic:(NSString *_Nonnull)mnemonic```

<a name="anchorAuthVerifyKeys"></a>
##### Verify keys
Verifies if user with such credentials exists. It won't return true if user hasn't confirmed his email after registration.

###### Android

```int verifyKeys(String user, String pass)```

###### iOS

```
-(BOOL)verifyKeysWithUserEmail:(NSString *_Nonnull) email 
andPassword:(NSString *_Nonnull)password
```

<a name="anchorAuthCheckKeysExists"></a>
##### Check keys exists

Checks if ther is auth file on the device. Return true if file exists, false otherwise.

###### Android

```boolean keysExist()```

###### iOS

<a name="anchorAuthImportKeys"></a>
##### Import keys
Stores new auth file on the device that is encrypted with passcode. By default, passcode is an empty string which means that auth file is not encrypted.

###### Android

```importKeys(email, password, mnemonic, passcode)```

###### iOS

```
-(BOOL)importKeysWithEmail:(NSString *) email
              password:(NSString *) password
              mnemonic:(NSString *) mnemonic
           andPasscode:(NSString *) passcode
```

<a name="anchorAuthDeleteKeys"></a>
##### Delete keys
Deletes auth file from the device.

###### Android

```boolean deleteKeys()```

###### iOS

```-(BOOL) deleteAuthFile```

<a name="anchorAuthGetKeys"></a>
##### Get keys
Reads keys from auth file. If it's encrypted should supply valid one. By default empty string is passed for not encrypted auth file. 

###### Android 

```Keys getKeys(String passphrase)```

Return instance of Keys: 

```
class Keys {
    private String user;
    private String pass;
    private String mnemonic;
}
```

###### iOS

```-(NSDictionary *_Nullable)getKeysWithPassCode:(NSString *_Nonnull) passcode```

Returns NSDictionary with keys data :

```
@{@"email":email,
  @"password":password,
  @"mnemonic":mnemonic}
```

<a name="anchorAuthRegistration"></a>
##### Registration
Register new user with given email and password. Send email with confirmation link if registration is successfull

###### Android

```void register(String user, String pass, RegisterCallback callback)```

Check what is [RegisterCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/RegisterCallback.java)

###### iOS

```
-(void)registerUser:(NSString * _Nonnull)username
           password:(NSString * _Nonnull)password
       withCallback:(RegistrationCallback* _Nonnull) callback;
```

<a name="anchorBuckets"></a>
#### Buckets

Bucket - is some kind of a folder. All buckets should be in root directory.

* Currently, there is no possibility to create one bucket inside of another.
* You can not have two buckets with the same name.

You are able to create and to delete buckets. 

Bucket model general scheme: 

```
string id
string name
string created
boolean decrypted
```
<a name="anchorBucketList"></a>
##### Bucket list

###### Android

```public void getBuckets(GetBucketsCallback callback)```

[GetBucketsCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/GetBucketsCallback.java)

###### iOS

```-(void)getBucketListWithCompletion:(BucketListCallback* _Nonnull)completion```

[BucketListCallback]()

<a name="anchorBucketCreate"></a>
##### Bucket creation

###### Android 
```
void createBucket(String bucketName, CreateBucketCallback callback)
```
This method has two parameters - bucket name and [CreateBucketCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/CreateBucketCallback.java) callback.

###### IOS 

```
-(void)createBucket:(NSString *_Nonnull)bucketName
       withCallback:(BucketCreateCallback* _Nonnull)callback;
```

[BucketCreateCallback]()

<a name="anchorBucketDelete"></a>
##### Bucket deletion
Deletion of the bucket will also delete all files, that are uploaded to this bucket.

To delete bucket you should call:

###### Android

```
void deleteBucket(String bucketId, DeleteBucketCallback callback)
```

This method has two parameters - String bucketId and [DeleteBucketCallback](https://github.com/storj/java-libstorj/blob/master/src/main/java/io/storj/libstorj/DeleteBucketCallback.java) callback.

###### iOS

```
-(void)deleteBucket:(NSString *_Nonnull)bucketName
     withCompletion:(BucketDeleteCallback* _Nonnull)callback;
```

[BucketDeleteCallback]()

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

## Step by step tutorials
1. ### Android

In this tutorial we will show you how to use storjlib in native android application.
We will use Android Studio, Java lang and Ubuntu 18 machine.

1. Create new application.
Lets open android studio and create new application, called MyStorjApp.
In Target Android Devices select Android API 25: Android 7.1.1 (Nougat).
Next select Basic Activity pattern.

2. Add libstorj-android dependency to build.gradle (Module:app)
After adding it should looks like:

dependencies {
    implementation 'io.storj:libstorj-android:0.7.2'
    ...
}

If you are using older versions of Android it could be a bit different. For example:
dependencies {
    compile 'io.storj:libstorj-android:0.7.2'
    ...
}

After this press File -> Sync project with gradle files

3. Implement own StorjLibModule

We have already attach android-libstorj lib to our project, so lets start implementing simple module with basic functionality.

Create new package called StorjLibModule.
Create new class with the same name there.


2. ### IOS
3. ### React-native

