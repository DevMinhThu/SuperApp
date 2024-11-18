import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import AppInfo from './app.json';

const {ConnectNativeModule} = NativeModules;

export default function App(props: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat App</Text>
      <Text style={styles.content}>
        Here props from Super App: {JSON.stringify(props)}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (AppInfo?.name) {
            ConnectNativeModule?.closeApp(AppInfo?.name);
          }
        }}>
        <Text style={styles.contentButton}>Back To Supper App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    color: 'grey',
  },
  contentButton: {
    fontSize: 16,
    color: 'white',
  },
  button: {
    margin: 20,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
