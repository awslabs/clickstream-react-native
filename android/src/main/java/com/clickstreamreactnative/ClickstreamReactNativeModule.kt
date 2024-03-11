package com.clickstreamreactnative

import com.amazonaws.logging.LogFactory
import com.amazonaws.logging.Log
import com.amplifyframework.AmplifyException
import com.amplifyframework.core.AmplifyConfiguration
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.amplifyframework.core.Amplify
import org.json.JSONObject
import software.aws.solution.clickstream.AWSClickstreamPlugin
import software.aws.solution.clickstream.ClickstreamAnalytics
import software.aws.solution.clickstream.ClickstreamEvent
import software.aws.solution.clickstream.ClickstreamItem
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


class ClickstreamReactNativeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var isInitialized = false
    private val cachedThreadPool: ExecutorService by lazy { Executors.newCachedThreadPool() }
    private val log: Log = LogFactory.getLog(
        ClickstreamReactNativeModule::class.java
    )

    override fun getName(): String {
        return NAME
    }

    // Example method
    @ReactMethod
    fun multiply(a: Double, b: Double, promise: Promise) {
        promise.resolve(a * b)
    }

    @ReactMethod
    fun init(map: ReadableMap, promise: Promise) {
        if (isInitialized) {
            promise.resolve(false)
        }
//        if (ThreadUtil.notInMainThread()) {
//            log.error("Clickstream SDK initialization failed, please initialize in the main thread")
//            promise.resolve(false)
//        }
        val context = reactApplicationContext
        val initConfig = map.toHashMap()
        val amplifyObject = JSONObject()
        val analyticsObject = JSONObject()
        val pluginsObject = JSONObject()
        val awsClickstreamPluginObject = JSONObject()
        awsClickstreamPluginObject.put("appId", initConfig["appId"])
        awsClickstreamPluginObject.put("endpoint", initConfig["endpoint"])
        pluginsObject.put("awsClickstreamPlugin", awsClickstreamPluginObject)
        analyticsObject.put("plugins", pluginsObject)
        amplifyObject.put("analytics", analyticsObject)
        val configure = AmplifyConfiguration.fromJson(amplifyObject)
        try {
            Amplify.addPlugin<AWSClickstreamPlugin>(AWSClickstreamPlugin(context))
            Amplify.configure(configure, context)
        } catch (exception: AmplifyException) {
            log.error("Clickstream SDK initialization failed with error: " + exception.message)
            promise.resolve(false)
        }
        val sessionTimeoutDuration = (initConfig["sessionTimeoutDuration"] as Double).toLong()
        val sendEventsInterval = (initConfig["sendEventsInterval"] as Double).toLong()
        ClickstreamAnalytics.getClickStreamConfiguration()
            .withLogEvents(initConfig["isLogEvents"] as Boolean)
            .withTrackScreenViewEvents(initConfig["isTrackScreenViewEvents"] as Boolean)
            .withTrackUserEngagementEvents(initConfig["isTrackUserEngagementEvents"] as Boolean)
            .withTrackAppExceptionEvents(initConfig["isTrackAppExceptionEvents"] as Boolean)
            .withSendEventsInterval(sendEventsInterval)
            .withSessionTimeoutDuration(sessionTimeoutDuration)
            .withCompressEvents(initConfig["isCompressEvents"] as Boolean)
            .withAuthCookie(initConfig["authCookie"] as String)
        promise.resolve(true)
        isInitialized = true
    }

    @ReactMethod
    private fun record(map: ReadableMap) {
        cachedThreadPool.execute {
            val event = map.toHashMap()
            val eventName = event["name"] as String
            val eventBuilder = ClickstreamEvent.builder().name(eventName)
            if (event["items"] != null) {
                val items = event["items"] as ArrayList<*>
                if (items.size > 0) {
                    val clickstreamItems = arrayOfNulls<ClickstreamItem>(items.size)
                    for (index in 0 until items.size) {
                        val builder = ClickstreamItem.builder()
                        for ((key, value) in (items[index] as HashMap<*, *>)) {
                            if (value is String) {
                                builder.add(key.toString(), value)
                            } else if (value is Double) {
                                builder.add(key.toString(), value)
                            } else if (value is Boolean) {
                                builder.add(key.toString(), value)
                            } else if (value is Int) {
                                builder.add(key.toString(), value)
                            } else if (value is Long) {
                                builder.add(key.toString(), value)
                            }
                        }
                        clickstreamItems[index] = builder.build()
                    }
                    eventBuilder.setItems(clickstreamItems)
                }
            }
            if (event["attributes"] != null) {
                val attributes = event["attributes"] as HashMap<*, *>
                for ((key, value) in attributes) {
                    if (value is String) {
                        eventBuilder.add(key.toString(), value)
                    } else if (value is Double) {
                        eventBuilder.add(key.toString(), value)
                    } else if (value is Boolean) {
                        eventBuilder.add(key.toString(), value)
                    } else if (value is Int) {
                        eventBuilder.add(key.toString(), value)
                    } else if (value is Long) {
                        eventBuilder.add(key.toString(), value)
                    }
                }
            }
            ClickstreamAnalytics.recordEvent(eventBuilder.build())
        }
    }

    companion object {
        const val NAME = "ClickstreamReactNative"
    }
}
