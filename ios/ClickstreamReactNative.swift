//
// Copyright Amazon.com Inc. or its affiliates.
// All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
import Amplify

@objc(ClickstreamReactNative)
class ClickstreamReactNative: NSObject {
    var isInitialized = false

    @objc(init:::)
    func `init`(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if isInitialized {
            resolve(false)
            return
        }
        do {
            let configuration = ClickstreamConfiguration()
                .withAppId(arguments["appId"] as! String)
                .withEndpoint(arguments["endpoint"] as! String)
                .withLogEvents(arguments["isLogEvents"] as! Bool)
                .withTrackScreenViewEvents(arguments["isTrackScreenViewEvents"] as! Bool)
                .withTrackUserEngagementEvents(arguments["isTrackUserEngagementEvents"] as! Bool)
                .withTrackAppExceptionEvents(arguments["isTrackAppExceptionEvents"] as! Bool)
                .withSendEventInterval(arguments["sendEventsInterval"] as! Int)
                .withSessionTimeoutDuration(arguments["sessionTimeoutDuration"] as! Int64)
                .withCompressEvents(arguments["isCompressEvents"] as! Bool)
                .withAuthCookie(arguments["authCookie"] as! String)
            if arguments["globalAttributes"] != nil {
                let attributes = arguments["globalAttributes"] as! [String: Any]
                if attributes.count > 0 {
                    let globalAttributes = getClickstreamAttributes(attributes)
                    _ = configuration.withInitialGlobalAttributes(globalAttributes)
                }
            }
            try ClickstreamAnalytics.initSDK(configuration)
            isInitialized = true
            resolve(true)
        } catch {
            log.error("Fail to initialize ClickstreamAnalytics: \(error)")
            resolve(false)
        }
    }

    @objc(record:::)
    func record(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let eventName = arguments["name"] as! String
        let attributes = arguments["attributes"] as? [String: Any] ?? [:]
        let items = arguments["items"] as? [[String: Any]]
        if attributes.count > 0 {
            if items != nil, items!.count > 0 {
                var clickstreamItems: [ClickstreamAttribute] = []
                for itemObject in items! {
                    clickstreamItems.append(getClickstreamAttributes(itemObject))
                }
                ClickstreamAnalytics.recordEvent(eventName, getClickstreamAttributes(attributes), clickstreamItems)
            } else {
                ClickstreamAnalytics.recordEvent(eventName, getClickstreamAttributes(attributes))
            }
        } else {
            ClickstreamAnalytics.recordEvent(eventName)
        }
    }

    @objc(setUserId:::)
    func setUserId(userId: String?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        ClickstreamAnalytics.setUserId(userId)
    }

    @objc(setUserAttributes:::)
    func setUserAttributes(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let userAttributes = getClickstreamAttributes(arguments)
        if userAttributes.count > 0 {
            ClickstreamAnalytics.addUserAttributes(getClickstreamAttributes(arguments))
        }
    }

    @objc(setGlobalAttributes:::)
    func setGlobalAttributes(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let globalAttributes = getClickstreamAttributes(arguments)
        if globalAttributes.count > 0 {
            ClickstreamAnalytics.addGlobalAttributes(getClickstreamAttributes(arguments))
        }
    }

    @objc(deleteGlobalAttributes:::)
    func deleteGlobalAttributes(arguments: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        for attribute in arguments {
            ClickstreamAnalytics.deleteGlobalAttributes(attribute)
        }
    }

    @objc(updateConfigure:::)
    func updateConfigure(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let configuration = try ClickstreamAnalytics.getClickstreamConfiguration()
            if let appId = arguments["appId"] as? String {
                configuration.appId = appId
            }
            if let endpoint = arguments["endpoint"] as? String {
                configuration.endpoint = endpoint
            }
            if let isLogEvents = arguments["isLogEvents"] as? Bool {
                configuration.isLogEvents = isLogEvents
            }
            if let isTrackScreenViewEvents = arguments["isTrackScreenViewEvents"] as? Bool {
                configuration.isTrackScreenViewEvents = isTrackScreenViewEvents
            }
            if let isTrackUserEngagementEvents = arguments["isTrackUserEngagementEvents"] as? Bool {
                configuration.isTrackUserEngagementEvents = isTrackUserEngagementEvents
            }
            if let isTrackAppExceptionEvents = arguments["isTrackAppExceptionEvents"] as? Bool {
                configuration.isTrackAppExceptionEvents = isTrackAppExceptionEvents
            }
            if let isCompressEvents = arguments["isCompressEvents"] as? Bool {
                configuration.isCompressEvents = isCompressEvents
            }
            if let authCookie = arguments["authCookie"] as? String {
                configuration.authCookie = authCookie
            }
        } catch {
            log.error("Failed to config ClickstreamAnalytics: \(error)")
        }
    }

    @objc(flushEvents::)
    func flushEvents(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        ClickstreamAnalytics.flushEvents()
    }

    @objc(disable::)
    func disable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        ClickstreamAnalytics.disable()
    }

    @objc(enable::)
    func enable(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        ClickstreamAnalytics.enable()
    }

    func getClickstreamAttributes(_ attrs: [String: Any]) -> ClickstreamAttribute {
        var attributes: ClickstreamAttribute = [:]
        for (key, value) in attrs {
            if value is String {
                attributes[key] = value as! String
            } else if value is NSNumber {
                let value = value as! NSNumber
                let objCType = String(cString: value.objCType)
                if objCType == "c" {
                    attributes[key] = value.boolValue
                } else if objCType == "d" {
                    attributes[key] = value.doubleValue
                } else if objCType == "i" {
                    attributes[key] = value.intValue
                } else if objCType == "q" {
                    attributes[key] = value.int64Value
                }
            }
        }
        return attributes
    }
}

extension ClickstreamReactNative: DefaultLogger {}
