import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { ClickstreamAnalytics } from 'clickstream-react-native';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  // const [initResult, setInitResult] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    ClickstreamAnalytics.multiply(3, 7).then(setResult);
    // ClickstreamAnalytics.configure({
    //   appId: '123',
    //   endpoint: 'https://example.com/collect',
    //   isLogEvents: true,
    // }).then(setInitResult);

    // ClickstreamAnalytics.record({
    //   name: 'button_click',
    //   attributes: {
    //     testKey: 'testValue',
    //   },
    // });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      {/*<Text>Init SDK Result: {initResult ? 'success' : 'false'}</Text>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
