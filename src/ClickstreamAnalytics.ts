/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */
import { NativeModules, Platform } from 'react-native';
import type { ClickstreamConfiguration, ClickstreamEvent } from './types';

const LINKING_ERROR =
  `The package 'clickstream-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ClickstreamReactNative = NativeModules.ClickstreamReactNative
  ? NativeModules.ClickstreamReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class ClickstreamAnalytics {
  public static multiply(a: number, b: number): Promise<number> {
    return ClickstreamReactNative.multiply(a, b);
  }

  public static configure(
    configuration: ClickstreamConfiguration
  ): Promise<boolean> {
    let initConfiguration: ClickstreamConfiguration = {
      appId: '',
      endpoint: '',
      sendEventsInterval: 10000,
      isTrackScreenViewEvents: true,
      isTrackUserEngagementEvents: true,
      isTrackAppExceptionEvents: false,
      isLogEvents: false,
      isCompressEvents: true,
      sessionTimeoutDuration: 1800000,
      authCookie: '',
    };
    Object.assign(initConfiguration, configuration);
    if (initConfiguration.appId === '' || initConfiguration.endpoint === '') {
      console.log('Please configure your appId and endpoint');
      return new Promise(() => {
        return false;
      });
    }
    return ClickstreamReactNative.configure(initConfiguration);
  }

  public static record(event: ClickstreamEvent) {
    if (event.name === null || event.name === '') {
      console.log('Please set your event name');
    }
    ClickstreamReactNative.record(event);
  }
}
