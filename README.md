# AWS Solution Clickstream Analytics SDK for React Native

## Introduction

Clickstream React Native SDK can help you easily collect and report events from React Native apps to AWS. This SDK is
part of an AWS solution - [Clickstream Analytics on AWS](https://github.com/awslabs/clickstream-analytics-on-aws), which
provisions data pipeline to ingest and process event data into AWS services such as S3, Redshift.

The SDK relies on the [Clickstream Android SDK](https://github.com/awslabs/clickstream-android)
and [Clickstream Swift SDK](https://github.com/awslabs/clickstream-swift). Therefore, Clickstream React Native SDK also
supports automatically collect common preset events and attributes (e.g., session start, first open). In addition, we've
added easy-to-use APIs to simplify data collection in React Native apps.

Visit
our [Documentation site](https://awslabs.github.io/clickstream-analytics-on-aws/en/latest/sdk-manual/react-native/) to
learn more about Clickstream React Native SDK.

### Platform Support

**Android**: Supports Android 4.1 (API level 16) and later.

**iOS**: Supports iOS 13 and later.

## Integrate SDK

### Include SDK

```bash
npm install @aws/clickstream-react-native
```

After complete, you need to install the pod dependencies for iOS:

```bash
cd ios && pod install
```

### Initialize the SDK

Copy your configuration code from your clickstream solution web console, we recommended you add the code to your app's
entry point like `index.js`, the configuration code should look like as follows. You can also manually add this code
snippet and replace the values of appId and endpoint after you registered app to a data pipeline in the Clickstream
Analytics solution web console.

```javascript
// index.js

import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.init({
  appId: 'your appId',
  endpoint: 'https://example.com/collect',
});
```

Your `appId` and `endpoint` are already set up in it.

> Make sure you call `ClickstreamAnalytics.init` as early as possible in your application’s life-cycle. And make sure
> the SDK is initialized when calling other APIs.

### Start using

#### Record events

Add the following code where you need to record events.

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

// record event with attributes
ClickstreamAnalytics.record({
  name: 'button_click',
  attributes: {
    event_category: 'shoes',
    currency: 'CNY',
    value: 279.9,
  },
});

// record event with name
ClickstreamAnalytics.record({ name: 'button_click' });
```

#### Login and logout

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

// when user login success.
ClickstreamAnalytics.setUserId("userId");

// when user logout
ClickstreamAnalytics.setUserId(null);
```

#### Add user attributes

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.setUserAttributes({
  userName: "carl",
  userAge: 22
});
```

When opening the Apps for the first time after integrating the SDK, you need to manually set the user attributes once,
and current login user's attributes will be cached in disk, so the next time app open you don't need to set all user
attributes again, of course you can use the same API `ClickstreamAnalytics.setUserAttributes()` to update the current
user's attribute when it changes.

#### Add global attributes

1. Add global attributes when initializing the SDK

   ```typescript
   ClickstreamAnalytics.init({
      appId: "your appId",
      endpoint: "https://example.com/collect",
      globalAttributes:{
        _traffic_source_medium: "Search engine",
        _traffic_source_name: "Summer promotion",
      }
   });
   ```

2. Add global attributes after initializing the SDK

   ``` typescript
   ClickstreamAnalytics.setGlobalAttributes({
     _traffic_source_medium: "Search engine",
     level: 10,
   });
   ```

It is recommended to set global attributes when initializing the SDK, global attributes will be included in all events
that occur after it is set.

#### Delete global attributes

``` typescript
ClickstreamAnalytics.deleteGlobalAttributes(['level','_traffic_source_medium']);
```

#### Record event with items

You can add the following code to log an event with an item.

**Note: Only pipelines from version 1.1+ can handle items with custom attribute.**

```typescript
import { ClickstreamAnalytics, Item } from '@aws/clickstream-react-native';

const itemBook: Item = {
  id: '123',
  name: 'Nature',
  category: 'book',
  price: 99,
  book_publisher: "Nature Research",
};
ClickstreamAnalytics.record({
  name: 'view_item',
  attributes: {
    currency: 'USD',
    event_category: 'recommended',
  },
  items: [itemBook],
});
```

#### Record Screen View events manually

By default, SDK will automatically track the preset `_screen_view` event when Android Activity triggers `onResume` or
iOS ViewController triggers `viewDidAppear`.

You can also manually record screen view events whether automatic screen view tracking is enabled, add the following
code to record a screen view event with two attributes.

* `SCREEN_NAME` Required. Your screen's name.
* `SCREEN_UNIQUE_ID` Optional. Set the id of your Component. If you do not set, the SDK will set a default value based
  on the hashcode of the current Activity or ViewController.

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.record({
  name: ClickstreamAnalytics.Event.SCREEN_VIEW,
  attributes: {
    [ClickstreamAnalytics.Attr.SCREEN_NAME]: 'HomeComponet',
    [ClickstreamAnalytics.Attr.SCREEN_UNIQUE_ID]: '123adf',
  },
});
```

#### Other configurations

In addition to the required `appId` and `endpoint`, you can configure other information to get more customized usage
when initialing the SDK:

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.init({
  appId: 'your appId',
  endpoint: 'https://example.com/collect',
  isLogEvents: true,
  isCompressEvents: true,
  isTrackScreenViewEvents: false,
  isTrackUserEngagementEvents: true,
  isTrackAppExceptionEvents: true,
  sendEventsInterval: 15000,
  sessionTimeoutDuration: 1800000,
  authCookie: 'your auth cookie',
  globalAttributes: {
    _traffic_source_medium: 'Search engine',
  },
});
```

Here is an explanation of each property:

- **appId (Required)**: the app id of your project in solution web control.
- **endpoint (Required)**: the endpoint path you will upload the event to ingestion server.
- **isLogEvents**: whether to print out event json for debugging, default is `false`.
- **isCompressEvents**: whether to compress event content when uploading events, default is `true`.
- **sendEventsInterval**: event sending interval millisecond, works only bath send mode, the default value is `5000`
- **isTrackScreenViewEvents**: whether auto record native screen view events, default is `true`
- **isTrackUserEngagementEvents**: whether auto record user engagement events, default is `true`
- **isTrackAppExceptionEvents**: whether auto record exception events of native apps, default is `false`
- **sendEventsInterval**: event sending interval millisecond, the default value is `10000` (10s)
- **sessionTimeoutDuration**: the duration for session timeout millisecond, default is `1800000` (30 minutes)
- **authCookie**: your auth cookie for AWS application load balancer auth cookie.
- **globalAttributes**: the global attributes when initializing the SDK.

#### Configuration update

You can update the default configuration after initializing the SDK, below are the additional configuration options you
can customize.

```typescript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.updateConfigure({
  appId: 'your appId',
  endpoint: 'https://example.com/collect',
  isLogEvents: true,
  authCookie: 'your auth cookie',
  isCompressEvents: true,
  isTrackPageViewEvents: false,
  isTrackUserEngagementEvents: false,
  isTrackAppExceptionEvents: false,
});
```

#### Logging events json in debug mode

```javascript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

ClickstreamAnalytics.init({
  appId: 'your appId',
  endpoint: 'https://example.com/collect',
  isLogEvents: true,
});
```

After configuring `isLogEvents:true` when initializing the SDK, when you record an event, you can see the event raw json
in AndroidStudio Logcat or Xcode debug console by filter `EventRecorder`.

#### Disable SDK

You can disable the SDK in the scenario you need. After disabling the SDK, the SDK will not handle the logging and
sending of any events. Of course, you can enable the SDK when you need to continue logging events.

```javascript
import { ClickstreamAnalytics } from '@aws/clickstream-react-native';

// disable SDK
ClickstreamAnalytics.disable();

// enable SDK
ClickstreamAnalytics.enable();
```

## How to integrate and test locally

Clone this repository locally and execute the following script to generate `clickstream-react-native-0.0.1.tgz` zip
package, which will be located in the project root folder.

```bash
cd clickstream-react-native && yarn && yarn run pack
```

Copy the `clickstream-react-native-0.0.1.tgz` into your project, then execute the script in your project root folder to
install the SDK.

```bash
yarn add ./clickstream-react-native-0.0.1.tgz
```

**Note**: Please correct the SDK version and change the path to where the `clickstream-react-native-0.0.1.tgz` file is
located.

You can also find the `clickstream-react-native-0.0.1.tgz` file in
the [Release](https://github.com/awslabs/clickstream-react-native/releases) page.

### Test

```bash
yarn run test
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the [Apache 2.0 License](./LICENSE).
