//
// Copyright Amazon.com Inc. or its affiliates.
// All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ClickstreamReactNative, NSObject)

RCT_EXTERN_METHOD(init:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(record:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setUserId:(NSString *)userId
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setUserAttributes:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setGlobalAttributes:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteGlobalAttributes:(NSArray *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateConfigure:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(flushEvents:(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disable:(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enable:(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
