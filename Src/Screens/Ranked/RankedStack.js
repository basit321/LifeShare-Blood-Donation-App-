import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ranjked from "./Ranjked";
import Userinformation from "./Useriformation";
import MyRequests from "../Post/MYRequests";
import PendingRequests from "../Post/PendingRequests";
import MYDonationHistory from "../Post/DonationHistory";
import MyTeam from "../Post/Myteams";
import Details from "../Teams/Details";
const Stack = createNativeStackNavigator();

export default RankedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Ranjked"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Ranjked" component={Ranjked} />
      <Stack.Screen name="Userinformation" component={Userinformation} />
      <Stack.Screen name="MyRequests" component={MyRequests} />
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
      <Stack.Screen name="MYDonationHistory" component={MYDonationHistory} />
      <Stack.Screen name="MyTeam" component={MyTeam} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
};
