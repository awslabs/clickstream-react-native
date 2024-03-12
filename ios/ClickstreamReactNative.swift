//
// Copyright Amazon.com Inc. or its affiliates.
// All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0
//
import Amplify

@objc(ClickstreamReactNative)
class ClickstreamReactNative: NSObject {
    @objc(multiply::::)
    func multiply(a: Float, b: Float, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(a * b)
    }

    @objc(configure:::)
    func configure(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let plugins: [String: JSONValue] = [
                "awsClickstreamPlugin": [
                    "appId": JSONValue.string(arguments["appId"] as! String),
                    "endpoint": JSONValue.string(arguments["endpoint"] as! String),
                    "isCompressEvents": JSONValue.boolean(arguments["isCompressEvents"] as! Bool),
                    "autoFlushEventsInterval": JSONValue.number(arguments["sendEventsInterval"] as! Double),
                    "isTrackAppExceptionEvents": JSONValue.boolean(arguments["isTrackAppExceptionEvents"] as! Bool)
                ]
            ]
            let analyticsConfiguration = AnalyticsCategoryConfiguration(plugins: plugins)
            let config = AmplifyConfiguration(analytics: analyticsConfiguration)
            try Amplify.add(plugin: AWSClickstreamPlugin())
            try Amplify.configure(config)
            let configure = try ClickstreamAnalytics.getClickstreamConfiguration()
            configure.isLogEvents = arguments["isLogEvents"] as! Bool
            configure.isTrackScreenViewEvents = arguments["isTrackScreenViewEvents"] as! Bool
            configure.isTrackUserEngagementEvents = arguments["isTrackUserEngagementEvents"] as! Bool
            configure.sessionTimeoutDuration = arguments["sessionTimeoutDuration"] as! Int64
            configure.authCookie = arguments["authCookie"] as? String
            resolve(true)
        } catch {
            log.error("Fail to initialize ClickstreamAnalytics: \(error)")
            resolve(false)
        }
    }

    @objc(record:::)
    func record(arguments: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let eventName = arguments["name"] as! String
        let attributes = arguments["attributes"] as! [String: Any]
        let items = arguments["items"] as! [[String: Any]]
        if attributes.count > 0 {
            if items.count > 0 {
                var clickstreamItems: [ClickstreamAttribute] = []
                for itemObject in items {
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
