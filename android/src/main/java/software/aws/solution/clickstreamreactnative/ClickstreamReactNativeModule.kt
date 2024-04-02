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
package software.aws.solution.clickstreamreactnative

import com.amazonaws.logging.Log
import com.amazonaws.logging.LogFactory
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import software.aws.solution.clickstream.ClickstreamAnalytics
import software.aws.solution.clickstream.ClickstreamAttribute
import software.aws.solution.clickstream.ClickstreamConfiguration
import software.aws.solution.clickstream.ClickstreamEvent
import software.aws.solution.clickstream.ClickstreamItem
import software.aws.solution.clickstream.ClickstreamUserAttribute
import java.util.concurrent.CountDownLatch
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

    @ReactMethod
    fun init(map: ReadableMap, promise: Promise) {
        if (isInitialized) {
            promise.resolve(false)
            return
        }
        val context = reactApplicationContext.applicationContext
        val initConfig = map.toHashMap()
        val sessionTimeoutDuration = (initConfig["sessionTimeoutDuration"] as Double).toLong()
        val sendEventsInterval = (initConfig["sendEventsInterval"] as Double).toLong()
        val configuration = ClickstreamConfiguration()
            .withAppId(initConfig["appId"] as String)
            .withEndpoint(initConfig["endpoint"] as String)
            .withLogEvents(initConfig["isLogEvents"] as Boolean)
            .withTrackScreenViewEvents(initConfig["isTrackScreenViewEvents"] as Boolean)
            .withTrackUserEngagementEvents(initConfig["isTrackUserEngagementEvents"] as Boolean)
            .withTrackAppExceptionEvents(initConfig["isTrackAppExceptionEvents"] as Boolean)
            .withSendEventsInterval(sendEventsInterval)
            .withSessionTimeoutDuration(sessionTimeoutDuration)
            .withCompressEvents(initConfig["isCompressEvents"] as Boolean)
            .withAuthCookie(initConfig["authCookie"] as String)

        (initConfig["globalAttributes"] as? HashMap<*, *>)?.takeIf { it.isNotEmpty() }
            ?.let { attributes ->
                val globalAttributes = ClickstreamAttribute.builder()
                for ((key, value) in attributes) {
                    when (value) {
                        is String -> globalAttributes.add(key.toString(), value)
                        is Double -> globalAttributes.add(key.toString(), value)
                        is Boolean -> globalAttributes.add(key.toString(), value)
                        is Int -> globalAttributes.add(key.toString(), value)
                        is Long -> globalAttributes.add(key.toString(), value)
                    }
                }
                configuration.withInitialGlobalAttributes(globalAttributes.build())
            }
        val latch = CountDownLatch(1);
        try {
            reactApplicationContext.runOnUiQueueThread {
                try {
                    ClickstreamAnalytics.init(context, configuration)
                    promise.resolve(true)
                    isInitialized = true
                } catch (exception: Exception) {
                    promise.resolve(false)
                    log.error("Clickstream SDK initialization failed with error: " + exception.message)
                } finally {
                    latch.countDown()
                }
            }
            latch.await()
        } catch (exception: Exception) {
            promise.resolve(false)
            log.error("Clickstream SDK initialization failed with error: " + exception.message)
        }
    }

    @ReactMethod
    private fun record(map: ReadableMap) {
        cachedThreadPool.execute {
            val event = map.toHashMap()
            val eventName = event["name"] as String
            val eventBuilder = ClickstreamEvent.builder().name(eventName)
            (event["items"] as? List<*>)?.takeIf { it.isNotEmpty() }?.let { items ->
                val clickstreamItems = arrayOfNulls<ClickstreamItem>(items.size)
                for (index in items.indices) {
                    val builder = ClickstreamItem.builder()
                    for ((key, value) in (items[index] as HashMap<*, *>)) {
                        when (value) {
                            is String -> builder.add(key.toString(), value)
                            is Double -> builder.add(key.toString(), value)
                            is Boolean -> builder.add(key.toString(), value)
                            is Int -> builder.add(key.toString(), value)
                            is Long -> builder.add(key.toString(), value)
                        }
                    }
                    clickstreamItems[index] = builder.build()
                }
                eventBuilder.setItems(clickstreamItems)
            }
            (event["attributes"] as? Map<*, *>)?.forEach { (key, value) ->
                when (value) {
                    is String -> eventBuilder.add(key.toString(), value)
                    is Double -> eventBuilder.add(key.toString(), value)
                    is Boolean -> eventBuilder.add(key.toString(), value)
                    is Int -> eventBuilder.add(key.toString(), value)
                    is Long -> eventBuilder.add(key.toString(), value)
                }
            }
            ClickstreamAnalytics.recordEvent(eventBuilder.build())
        }
    }

    @ReactMethod
    private fun setUserId(userId: String?) {
        ClickstreamAnalytics.setUserId(userId)
    }

    @ReactMethod
    private fun setUserAttributes(map: ReadableMap) {
        val attributes = map.toHashMap()
        val builder = ClickstreamUserAttribute.Builder()
        for ((key, value) in attributes) {
            when (value) {
                is String -> builder.add(key, value)
                is Double -> builder.add(key, value)
                is Boolean -> builder.add(key, value)
                is Int -> builder.add(key, value)
                is Long -> builder.add(key, value)
            }
        }
        builder.build().takeIf { it.userAttributes.size() > 0 }?.let { userAttributes ->
            ClickstreamAnalytics.addUserAttributes(userAttributes)
        }
    }

    @ReactMethod
    private fun setGlobalAttributes(map: ReadableMap) {
        val attributes = map.toHashMap()
        val builder = ClickstreamAttribute.Builder()
        attributes.forEach { (key, value) ->
            when (value) {
                is String -> builder.add(key, value)
                is Double -> builder.add(key, value)
                is Boolean -> builder.add(key, value)
                is Int -> builder.add(key, value)
                is Long -> builder.add(key, value)
            }
        }
        builder.build().takeIf { it.attributes.size() > 0 }?.let { globalAttributes ->
            ClickstreamAnalytics.addGlobalAttributes(globalAttributes)
        }
    }

    @ReactMethod
    private fun deleteGlobalAttributes(array: ReadableArray) {
        val stringList = array.toArrayList().filterIsInstance<String>()
        if (stringList.isNotEmpty()) {
            ClickstreamAnalytics.deleteGlobalAttributes(*stringList.toTypedArray())
        }
    }

    @ReactMethod
    private fun updateConfigure(map: ReadableMap?) {
        map?.toHashMap()?.takeIf { it.isNotEmpty() }?.also { arguments ->
            val configure = ClickstreamAnalytics.getClickStreamConfiguration()
            arguments["appId"]?.let {
                configure.withAppId(it as String)
            }
            arguments["endpoint"]?.let {
                configure.withEndpoint(it as String)
            }
            arguments["isLogEvents"]?.let {
                configure.withLogEvents(it as Boolean)
            }
            arguments["isTrackScreenViewEvents"]?.let {
                configure.withTrackScreenViewEvents(it as Boolean)
            }
            arguments["isTrackUserEngagementEvents"]?.let {
                configure.withTrackUserEngagementEvents(it as Boolean)
            }
            arguments["isTrackAppExceptionEvents"]?.let {
                configure.withTrackAppExceptionEvents(it as Boolean)
            }
            arguments["isCompressEvents"]?.let {
                configure.withCompressEvents(it as Boolean)
            }
            arguments["authCookie"]?.let {
                configure.withAuthCookie(it as String)
            }
        }
    }

    @ReactMethod
    private fun flushEvents() {
        ClickstreamAnalytics.flushEvents()
    }

    @ReactMethod
    private fun disable() {
        reactApplicationContext.runOnUiQueueThread {
            ClickstreamAnalytics.disable()
        }
    }

    @ReactMethod
    private fun enable() {
        reactApplicationContext.runOnUiQueueThread {
            ClickstreamAnalytics.enable()
        }
    }

    companion object {
        const val NAME = "ClickstreamReactNative"
    }
}
