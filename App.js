import React from "react";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppLoading from "expo-app-loading";
import Tab from "./Src/Screens/Tab";

import { useEffect, useState, useCallback } from "react";
import "react-native-gesture-handler";
import {
  View,
  Text,
  LogBox,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Landingpage from "./Src/Screens/LandingPage/Landingpage";
import PersonalInfromation from "./Src/Screens/Registration/PersonalInfromation";
import VerifyOtp from "./Src/Screens/Registration/VerifyOtp";
import ForgetPassword from "./Src/Screens/LandingPage/ForgetPassword";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Verifyemail from "./Src/Screens/LandingPage/VerifyEmail";
import CreateNewPassword from "./Src/Screens/LandingPage/CreateNewPassword";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "native-base";
const Stack = createStackNavigator();
LogBox.ignoreAllLogs();

const fetchFonts = async () => {
  try {
    await SplashScreen.preventAutoHideAsync();
    await SplashScreen.hideAsync();
    await Font.loadAsync({
      Bold: require("./Src/fonts/Bold.ttf"),
      Text: require("./Src/fonts/Text.ttf"),
      Tittle: require("./Src/fonts/Tittle.ttf"),
    });
    await SplashScreen.hideAsync();
  } catch (e) {
    console.warn(e);
  }
};
const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [Show, setshow] = useState(true);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("islogin");
      console.log(value);
      setshow(value);
    } catch (e) {
      console.log(e);
    }
  };
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {Show ? <Islogin /> : <Islogout />}
    </NavigationContainer>
  );
};

export default App;
const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: "#fff",
    flex: 1,
  },
  Text1: {
    fontSize: 18,
    color: "#fff",
  },
});

const Islogout = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Landingpage"
    >
      <Stack.Screen name="Landingpage" component={Landingpage} />
      <Stack.Screen
        name="PersonalInfromation"
        component={PersonalInfromation}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={horizontalAnimation}
      />
      <Stack.Screen name="Verifyemail" component={Verifyemail} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
      <Stack.Screen name="Dashboard" component={Tab} />
    </Stack.Navigator>
  );
};
const Islogin = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
    >
      <Stack.Screen name="Landingpage" component={Landingpage} />
      <Stack.Screen
        name="PersonalInfromation"
        component={PersonalInfromation}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOtp}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={horizontalAnimation}
      />
      <Stack.Screen name="Verifyemail" component={Verifyemail} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
      <Stack.Screen name="Dashboard" component={Tab} />
    </Stack.Navigator>
  );
};
