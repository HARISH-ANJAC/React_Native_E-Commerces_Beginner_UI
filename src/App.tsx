import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './Screens/LoginScreen';
import ProductListScreen from './Screens/ProductListScreen';
import CartListScreen from './Screens/CartListScreen';
import CheckOutScreen from './Screens/CheckOutScreen';
import NetInfo from '@react-native-community/netinfo';
import { Provider } from 'react-redux';
import Store from './Redux/Store';
import NoInternet from './Screens/NoInternet';

export type RootStackParamList = {
  Login: undefined;
  Products: undefined;
  Cart: undefined;
  Checkout: { total: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [networkStrength, setNetworkStrength] = useState('Unknown');
  const [isConnected, setIsConnected] = useState(true);

  // 🧠 Detect network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);

      if (state.type === 'wifi' && state.details?.strength) {
        const level = state.details.strength; // 0–100
        if (level > 75) setNetworkStrength('High');
        else if (level > 40) setNetworkStrength('Medium');
        else setNetworkStrength('Low');
      } else if (state.type === 'cellular' && state.details?.cellularGeneration) {
        switch (state.details.cellularGeneration) {
          case '5g':
          case '4g':
            setNetworkStrength('High');
            break;
          case '3g':
            setNetworkStrength('Medium');
            break;
          case '2g':
          default:
            setNetworkStrength('Low');
        }
      } else {
        setNetworkStrength('Unknown');
      }
    });

    return () => unsubscribe();
  }, []);

  // ⚠️ Show toast for weak connection
  useEffect(() => {
    if (networkStrength === 'Low') {
      ToastAndroid.show('⚠️ Internet connection is weak', ToastAndroid.LONG);
    }
  }, [networkStrength]);

  return (
    <Provider store={Store}>
      <NavigationContainer>
        {isConnected ? (
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}
            initialRouteName="Login"
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Products" component={ProductListScreen} />
            <Stack.Screen name="Cart" component={CartListScreen} />
            <Stack.Screen name="Checkout" component={CheckOutScreen} />
          </Stack.Navigator>
        ) : (
          <NoInternet
            onRetry={() =>
              NetInfo.fetch().then(s => setIsConnected(!!s.isConnected))
            }
          />
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// 🎨 Styles
const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noInternetText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
