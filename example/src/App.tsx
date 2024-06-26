import * as React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ClickstreamAnalytics,
  Item,
  Attr,
  Event,
} from '@aws/clickstream-react-native';

export default function App() {
  const initSDK = async () => {
    const res = await ClickstreamAnalytics.init({
      appId: 'shopping',
      endpoint: 'https://example.com/collect',
      isLogEvents: true,
      sendEventsInterval: 10000,
      isTrackScreenViewEvents: true,
      isCompressEvents: false,
      sessionTimeoutDuration: 30000,
      globalAttributes: {
        [Attr.TRAFFIC_SOURCE_SOURCE]: 'amazon',
        [Attr.TRAFFIC_SOURCE_MEDIUM]: 'cpc',
        [Attr.TRAFFIC_SOURCE_CAMPAIGN]: 'summer_promotion',
        [Attr.TRAFFIC_SOURCE_CAMPAIGN_ID]: 'summer_promotion_01',
        [Attr.TRAFFIC_SOURCE_TERM]: 'running_shoes',
        [Attr.TRAFFIC_SOURCE_CONTENT]: 'banner_ad_1',
        [Attr.TRAFFIC_SOURCE_CLID]: 'amazon_ad_123',
        [Attr.TRAFFIC_SOURCE_CLID_PLATFORM]: 'amazon_ads',
        [Attr.APP_INSTALL_CHANNEL]: 'amazon_store',
        Class: 5,
        isTrue: true,
        Score: 24.32,
      },
    });
    console.log('init result is:' + res);
  };
  const recordEventWithName = () => {
    ClickstreamAnalytics.record({
      name: 'testEventWithName',
    });
  };
  const recordEventWithAttributes = () => {
    ClickstreamAnalytics.record({
      name: 'testEventWithAttributes',
      attributes: {
        category: 'shoes',
        intValue: 13,
        boolValue: true,
        value: 279.9,
      },
    });
  };

  const recordCustomScreenViewEvents = () => {
    ClickstreamAnalytics.record({
      name: Event.SCREEN_VIEW,
      attributes: {
        [Attr.SCREEN_NAME]: 'HomeComponent',
        [Attr.SCREEN_UNIQUE_ID]: '123adf',
      },
    });
  };

  const recordEventWithItems = () => {
    const item_shoes: Item = {
      id: '1',
      name: 'boy shoes',
      brand: 'Nike',
      currency: 'CNY',
      category: 'shoes',
      locationId: '1',
    };
    ClickstreamAnalytics.record({
      name: 'product_view',
      attributes: {
        category: 'shoes',
        [Attr.CURRENCY]: 'CNY',
        [Attr.VALUE]: 279.9,
      },
      items: [item_shoes],
    });
  };
  const setUserId = () => {
    ClickstreamAnalytics.setUserId('123');
  };

  const setUserIdNull = () => {
    ClickstreamAnalytics.setUserId(null);
  };

  const setUserAttributes = () => {
    ClickstreamAnalytics.setUserAttributes({
      category: 'shoes',
      currency: 'CNY',
      value: 279.9,
    });
    ClickstreamAnalytics.setUserAttributes({});
  };
  const setGlobalAttributes = () => {
    ClickstreamAnalytics.setGlobalAttributes({});
    ClickstreamAnalytics.setGlobalAttributes({
      [Attr.APP_INSTALL_CHANNEL]: 'amazon_store',
      Class: 5,
      isTrue: true,
      Score: 24.32,
    });
  };

  const deleteGlobalAttributes = () => {
    ClickstreamAnalytics.deleteGlobalAttributes(['Class', 'isTrue', 'Score']);
    ClickstreamAnalytics.deleteGlobalAttributes(['']);
  };
  const updateConfigure = () => {
    ClickstreamAnalytics.updateConfigure({
      appId: 'shopping1',
      endpoint: 'https://example.com/collect',
      isLogEvents: true,
      isCompressEvents: false,
      isTrackUserEngagementEvents: false,
      isTrackAppExceptionEvents: false,
      authCookie: 'test cookie',
      isTrackScreenViewEvents: false,
    });
  };

  const flushEvents = () => {
    ClickstreamAnalytics.flushEvents();
  };

  const disable = () => {
    ClickstreamAnalytics.disable();
  };

  const enable = () => {
    ClickstreamAnalytics.enable();
  };

  React.useEffect(() => {
    initSDK().then(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ListItem title="initSDK" onPress={initSDK} />
        <ListItem title="recordEventWithName" onPress={recordEventWithName} />
        <ListItem
          title="recordEventWithAttributes"
          onPress={recordEventWithAttributes}
        />
        <ListItem title="recordEventWithItems" onPress={recordEventWithItems} />
        <ListItem
          title="recordCustomScreenViewEvents"
          onPress={recordCustomScreenViewEvents}
        />
        <ListItem title="setUserId" onPress={setUserId} />
        <ListItem title="setUserIdNull" onPress={setUserIdNull} />
        <ListItem title="setUserAttributes" onPress={setUserAttributes} />
        <ListItem title="setGlobalAttributes" onPress={setGlobalAttributes} />
        <ListItem
          title="deleteGlobalAttributes"
          onPress={deleteGlobalAttributes}
        />
        <ListItem title="updateConfigure" onPress={updateConfigure} />
        <ListItem title="flushEvents" onPress={flushEvents} />
        <ListItem title="disable" onPress={disable} />
        <ListItem title="enable" onPress={enable} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface ListItemProps {
  title: string;
  onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
  },
});
