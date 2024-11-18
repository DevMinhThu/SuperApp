import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  NativeModules,
  Platform,
  Linking,
} from 'react-native';

const {ConnectNativeModule} = NativeModules;

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const [input, setInput] = useState('');

  const LIST_APPS = [
    {
      appName: 'ChatApp', // Chú ý ăn theo appName của dự án
      bundleId: `index.${Platform.OS}-1.bundle`,
    },
    {
      appName: 'ShoppingApp',
      bundleId: `index.${Platform.OS}-2.bundle`,
    },
  ];

  const openMiniApp = (item: any, passData: any) => {
    const {appName, bundleId} = item || {};
    ConnectNativeModule?.openApp(
      appName,
      bundleId,
      {...passData}, // Data pass to mini app
      false,
      () => {},
    );
  };

  const goToNextApp = useCallback(
    async (item: any) => {
      openMiniApp(item, {text: input});

      const result = await ConnectNativeModule?.getBundleNames();
      return result;
    },
    [input],
  );

  // ====== HANDLE DEEP-LINK ======
  const handleDeepLink = (event: any) => {
    const {url} = event;

    if (url) {
      const queryString = url.split('?')[1];
      const queryParams = {} as any;
      if (queryString) {
        queryString.split('&').forEach((param: any) => {
          const [key, value] = param.split('=');
          queryParams[key] = decodeURIComponent(value);
        });
      }
      const {userId, messageId} = queryParams;

      if (url?.includes('chatapp')) {
        console.log('Navigate to ChatApp');
        openMiniApp(
          {
            appName: 'ChatApp',
            bundleId: `index.${Platform.OS}-1.bundle`,
          },
          {userId, messageId},
        );
        return;
      }
      if (url?.includes('shoppingapp')) {
        openMiniApp(
          {
            appName: 'ShoppingApp',
            bundleId: `index.${Platform.OS}-2.bundle`,
          },
          {text: 'Data from DeepLink'},
        );
        return;
      }
    }
  };

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => handleDeepLink({url}))
      .catch(console.error);

    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Value send to Mini App</Text>
          <TextInput
            value={input}
            style={styles.input}
            onChangeText={text => setInput(text)}
            placeholder="Value to send to mini app"
          />
        </View>
        {LIST_APPS.map(app => (
          <TouchableOpacity
            key={app?.bundleId}
            style={styles.buttonApp}
            onPress={() => goToNextApp(app)}>
            <Text style={styles.appName}>{app?.appName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  const linking = {
    prefixes: ['supperapp://path'],
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  title: {
    marginBottom: 10,
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 18,
    color: '#fff',
  },
  buttonApp: {
    width: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    color: 'black',
    borderColor: 'black',
  },
});
