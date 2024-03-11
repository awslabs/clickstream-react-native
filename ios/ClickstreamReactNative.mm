#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ClickstreamReactNative, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a:(float)b
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(configure:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(record:(NSDictionary *)arguments
                 :(RCTPromiseResolveBlock)resolve
                 :(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
