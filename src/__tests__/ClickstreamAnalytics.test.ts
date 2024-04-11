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
import { ClickstreamAnalytics, Attr, Event } from '../index';
import { NativeModules } from 'react-native';

jest.mock('react-native', () => {
  const actualNativeModules = jest.requireActual('react-native').NativeModules;
  return {
    NativeModules: {
      ...actualNativeModules,
      ClickstreamReactNative: {
        init: jest.fn().mockImplementation(() => {
          return Promise.resolve(true);
        }),
        record: jest.fn(),
        setUserId: jest.fn(),
        setUserAttributes: jest.fn(),
        setGlobalAttributes: jest.fn(),
        deleteGlobalAttributes: jest.fn(),
        updateConfigure: jest.fn(),
        flushEvents: jest.fn(),
        disable: jest.fn(),
        enable: jest.fn(),
      },
    },
    Platform: {
      ...actualNativeModules.Platform,
      select: jest.fn((obj) => obj.ios || obj.default),
    },
  };
});
describe('ClickstreamAnalytics test', () => {
  test('test init SDK with default configuration', async () => {
    const res = await ClickstreamAnalytics.init({
      appId: 'testAppId',
      endpoint: 'https://example.com/collect',
    });
    expect(res).toBeTruthy();
    expect(NativeModules.ClickstreamReactNative.init).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'testAppId',
        endpoint: 'https://example.com/collect',
        sendEventsInterval: 10000,
        isTrackScreenViewEvents: true,
        isTrackUserEngagementEvents: true,
        isTrackAppExceptionEvents: false,
        isLogEvents: false,
        isCompressEvents: true,
        sessionTimeoutDuration: 1800000,
        authCookie: '',
      })
    );
  });

  test('test init SDK with custom configuration', async () => {
    await ClickstreamAnalytics.init({
      appId: 'testAppId',
      endpoint: 'https://example.com/collect',
      isLogEvents: true,
      sendEventsInterval: 10000,
      isTrackScreenViewEvents: true,
      isCompressEvents: false,
      sessionTimeoutDuration: 30000,
    });
    expect(NativeModules.ClickstreamReactNative.init).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'testAppId',
        endpoint: 'https://example.com/collect',
        isLogEvents: true,
        sendEventsInterval: 10000,
        isTrackScreenViewEvents: true,
        isCompressEvents: false,
        sessionTimeoutDuration: 30000,
        isTrackUserEngagementEvents: true,
        isTrackAppExceptionEvents: false,
        authCookie: '',
      })
    );
  });

  test('test init SDK with empty appId', async () => {
    const res = await ClickstreamAnalytics.init({
      appId: '',
      endpoint: 'https://example.com/collect',
    });
    expect(res).toBeFalsy();
    expect(NativeModules.ClickstreamReactNative.init).not.toHaveBeenCalled();
  });

  test('test init SDK with empty endpoint', async () => {
    const res = await ClickstreamAnalytics.init({
      appId: 'testAppId',
      endpoint: '',
    });
    expect(res).toBeFalsy();
    expect(NativeModules.ClickstreamReactNative.init).not.toHaveBeenCalled();
  });

  test('test record event with valid event name', () => {
    ClickstreamAnalytics.record({
      name: 'product_view',
      attributes: {
        category: 'shoes',
        currency: 'CNY',
        price: 279.9,
      },
    });
    expect(NativeModules.ClickstreamReactNative.record).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'product_view',
        attributes: {
          category: 'shoes',
          currency: 'CNY',
          price: 279.9,
        },
      })
    );
  });

  test('test record custom screen view events', () => {
    ClickstreamAnalytics.record({
      name: Event.SCREEN_VIEW,
      attributes: {
        [Attr.SCREEN_NAME]: 'HomeComponent',
        [Attr.SCREEN_UNIQUE_ID]: '123adf',
      },
    });
    expect(NativeModules.ClickstreamReactNative.record).toHaveBeenCalledWith(
      expect.objectContaining({
        name: Event.SCREEN_VIEW,
        attributes: {
          [Attr.SCREEN_NAME]: 'HomeComponent',
          [Attr.SCREEN_UNIQUE_ID]: '123adf',
        },
      })
    );
  });

  test('test record event with empty event name', () => {
    ClickstreamAnalytics.record({
      name: '',
    });
    expect(NativeModules.ClickstreamReactNative.record).not.toHaveBeenCalled();
  });

  test('test set userId', () => {
    ClickstreamAnalytics.setUserId('123');
    expect(NativeModules.ClickstreamReactNative.setUserId).toHaveBeenCalledWith(
      '123'
    );
  });

  test('test set userId null', () => {
    ClickstreamAnalytics.setUserId(null);
    expect(NativeModules.ClickstreamReactNative.setUserId).toHaveBeenCalledWith(
      null
    );
  });

  test('test set user attributes', () => {
    ClickstreamAnalytics.setUserAttributes({
      user_age: 21,
      user_name: 'carl',
    });
    expect(
      NativeModules.ClickstreamReactNative.setUserAttributes
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        user_age: 21,
        user_name: 'carl',
      })
    );
  });
  test('test set empty user attribute', () => {
    ClickstreamAnalytics.setUserAttributes({});
    expect(
      NativeModules.ClickstreamReactNative.setUserAttributes
    ).not.toHaveBeenCalled();
  });

  test('test set global attributes', () => {
    ClickstreamAnalytics.setGlobalAttributes({
      channel: 'Samsung',
      Class: 5,
      isTrue: true,
      Score: 24.32,
    });
    expect(
      NativeModules.ClickstreamReactNative.setGlobalAttributes
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: 'Samsung',
        Class: 5,
        isTrue: true,
        Score: 24.32,
      })
    );
  });

  test('test set traffic source in global attributes', () => {
    ClickstreamAnalytics.setGlobalAttributes({
      [Attr.TRAFFIC_SOURCE_SOURCE]: 'amazon',
      [Attr.TRAFFIC_SOURCE_MEDIUM]: 'cpc',
      [Attr.TRAFFIC_SOURCE_CAMPAIGN]: 'summer_promotion',
      [Attr.TRAFFIC_SOURCE_CAMPAIGN_ID]: 'summer_promotion_01',
      [Attr.TRAFFIC_SOURCE_TERM]: 'running_shoes',
      [Attr.TRAFFIC_SOURCE_CONTENT]: 'banner_ad_1',
      [Attr.TRAFFIC_SOURCE_CLID]: 'amazon_ad_123',
      [Attr.TRAFFIC_SOURCE_CLID_PLATFORM]: 'amazon_ads',
      [Attr.APP_INSTALL_CHANNEL]: 'amazon_store',
    });
    expect(
      NativeModules.ClickstreamReactNative.setGlobalAttributes
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        [Attr.TRAFFIC_SOURCE_SOURCE]: 'amazon',
        [Attr.TRAFFIC_SOURCE_MEDIUM]: 'cpc',
        [Attr.TRAFFIC_SOURCE_CAMPAIGN]: 'summer_promotion',
        [Attr.TRAFFIC_SOURCE_CAMPAIGN_ID]: 'summer_promotion_01',
        [Attr.TRAFFIC_SOURCE_TERM]: 'running_shoes',
        [Attr.TRAFFIC_SOURCE_CONTENT]: 'banner_ad_1',
        [Attr.TRAFFIC_SOURCE_CLID]: 'amazon_ad_123',
        [Attr.TRAFFIC_SOURCE_CLID_PLATFORM]: 'amazon_ads',
        [Attr.APP_INSTALL_CHANNEL]: 'amazon_store',
      })
    );
  });

  test('test set empty global attribute', () => {
    ClickstreamAnalytics.setGlobalAttributes({});
    expect(
      NativeModules.ClickstreamReactNative.setGlobalAttributes
    ).not.toHaveBeenCalled();
  });

  test('test delete global attributes', () => {
    ClickstreamAnalytics.deleteGlobalAttributes(['Class', 'isTrue', 'Score']);
    expect(
      NativeModules.ClickstreamReactNative.deleteGlobalAttributes
    ).toHaveBeenCalledWith(['Class', 'isTrue', 'Score']);
  });

  test('test delete empty global attribute', () => {
    ClickstreamAnalytics.deleteGlobalAttributes([]);
    expect(
      NativeModules.ClickstreamReactNative.deleteGlobalAttributes
    ).not.toHaveBeenCalled();
  });

  test('test update configure', () => {
    ClickstreamAnalytics.updateConfigure({
      appId: 'shopping',
      endpoint: 'https://example.com/collect',
      isLogEvents: true,
      isCompressEvents: false,
      isTrackUserEngagementEvents: false,
      isTrackAppExceptionEvents: false,
      authCookie: 'test cookie',
      isTrackScreenViewEvents: false,
    });
    expect(
      NativeModules.ClickstreamReactNative.updateConfigure
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        appId: 'shopping',
        endpoint: 'https://example.com/collect',
        isLogEvents: true,
        isCompressEvents: false,
        isTrackUserEngagementEvents: false,
        isTrackAppExceptionEvents: false,
        authCookie: 'test cookie',
        isTrackScreenViewEvents: false,
      })
    );
  });

  test('test update empty configure', () => {
    ClickstreamAnalytics.updateConfigure({});
    expect(
      NativeModules.ClickstreamReactNative.updateConfigure
    ).not.toHaveBeenCalled();
  });

  test('test flush events', () => {
    ClickstreamAnalytics.flushEvents();
    expect(NativeModules.ClickstreamReactNative.flushEvents).toHaveBeenCalled();
  });

  test('test enable SDK', () => {
    ClickstreamAnalytics.enable();
    expect(NativeModules.ClickstreamReactNative.enable).toHaveBeenCalled();
  });

  test('test disable SDK', () => {
    ClickstreamAnalytics.disable();
    expect(NativeModules.ClickstreamReactNative.disable).toHaveBeenCalled();
  });

  test('test isNotEmpty', async () => {
    expect(
      ClickstreamAnalytics.isNotEmpty({
        testKey: '123',
      })
    ).toBe(true);
    expect(ClickstreamAnalytics.isNotEmpty(undefined)).toBe(false);
    expect(ClickstreamAnalytics.isNotEmpty(null)).toBe(false);
    expect(ClickstreamAnalytics.isNotEmpty({})).toBe(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
