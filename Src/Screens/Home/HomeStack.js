import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Donors from "./Donnors";
import Userinformation from "../Ranked/Useriformation";
import MyRequests from "../Post/MYRequests";
import PendingRequests from "../Post/PendingRequests";
import MYDonationHistory from "../Post/DonationHistory";
import Posts from "../Post/Posts";
import MyTeam from "../Post/Myteams";
import Payment from "./Payment";
import Details from "../Teams/Details";

const Stack = createNativeStackNavigator();

export default HomeStack = ({ route }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Donors" component={Donors} />
      <Stack.Screen name="Userinformation" component={Userinformation} />
      <Stack.Screen name="MyRequests" component={MyRequests} />
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
      <Stack.Screen name="MYDonationHistory" component={MYDonationHistory} />
      <Stack.Screen name="MyTeam" component={MyTeam} />
      <Stack.Screen name="Posts" component={Posts} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
};
