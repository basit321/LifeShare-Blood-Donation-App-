import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Home/HomeStack";
import TeamStack from "./Teams/TeamStack";
import PostSrack from "./Post/PostSrack";
import RankedStack from "./Ranked/RankedStack";
import Colors from "../utils/Colors";
import { Entypo, FontAwesome5, FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const extra = 12;
export default TabNavigation = ({ route }) => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: Colors.Pink,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          paddingBottom: null,
        },
        tabBarItemStyle: {
          marginTop: "2%",
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "",
          tabBarIcon: ({ size, focused }) => (
            <Entypo
              name="home"
              size={30}
              color={focused ? "#fff" : "#858181"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PostSrack"
        component={PostSrack}
        options={{
          title: "",
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome
              name="heartbeat"
              size={30}
              color={focused ? "#fff" : "#858181"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TeamStack"
        component={TeamStack}
        options={{
          title: "",
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome5
              name="users"
              size={30}
              color={focused ? "#fff" : "#858181"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RankedStack"
        component={RankedStack}
        options={{
          title: "",
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome5
              name="medal"
              size={27}
              color={focused ? "#fff" : "#858181"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
