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
import { ClickstreamAttribute, Configuration } from './types';

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
  public static init(configure: ClickstreamConfiguration): Promise<boolean> {
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
    Object.assign(initConfiguration, configure);
    if (initConfiguration.appId === '' || initConfiguration.endpoint === '') {
      console.log('Please configure your appId and endpoint');
      return Promise.resolve(false);
    }
    return ClickstreamReactNative.init(initConfiguration);
  }

  public static record(event: ClickstreamEvent) {
    if (event.name === undefined || event.name === null || event.name === '') {
      console.log('Please set your event name');
      return;
    }
    ClickstreamReactNative.record(event);
  }

  public static setUserId(userId: string | null) {
    ClickstreamReactNative.setUserId(userId);
  }

  public static setUserAttributes(userAttributes: ClickstreamAttribute) {
    if (this.isNotEmpty(userAttributes)) {
      ClickstreamReactNative.setUserAttributes(userAttributes);
    }
  }

  public static setGlobalAttributes(globalAttributes: ClickstreamAttribute) {
    if (this.isNotEmpty(globalAttributes)) {
      ClickstreamReactNative.setGlobalAttributes(globalAttributes);
    }
  }

  public static deleteGlobalAttributes(globalAttributes: string[]) {
    if (globalAttributes.length > 0) {
      ClickstreamReactNative.deleteGlobalAttributes(globalAttributes);
    }
  }

  public static updateConfigure(configure: Configuration) {
    if (this.isNotEmpty(configure)) {
      ClickstreamReactNative.updateConfigure(configure);
    }
  }

  public static flushEvents() {
    ClickstreamReactNative.flushEvents();
  }

  public static disable() {
    ClickstreamReactNative.disable();
  }

  public static enable() {
    ClickstreamReactNative.enable();
  }

  static isNotEmpty(obj: any): boolean {
    return obj !== undefined && obj !== null && Object.keys(obj).length > 0;
  }

  /**
   * @deprecated The static object should not be used.
   * please update to: `import { Event } from '@aws/clickstream-react-native'`.
   */
  static readonly Event = {
    SCREEN_VIEW: '_screen_view',
  };

  /**
   * @deprecated The static object should not be used.
   * please update to: `import { Attr } from '@aws/clickstream-react-native'`.
   */
  static readonly Attr = {
    SCREEN_NAME: '_screen_name',
    SCREEN_UNIQUE_ID: '_screen_unique_id',
  };
}
