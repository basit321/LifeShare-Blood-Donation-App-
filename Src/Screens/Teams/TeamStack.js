import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Team from "./Team";
import BloodBanks from "./BloodBanks";
import CreateTeam from "./CreateTeam";
import NerbyUSers from "./NerbyUSers";
import Details from "./Details";
import MYDonationHistory from "../Post/DonationHistory";
import MyTeam from "../Post/Myteams";
import MyRequests from "../Post/MYRequests";
import Userinformation from "../Ranked/Useriformation";
import PendingRequests from "../Post/PendingRequests";
const Stack = createNativeStackNavigator();

export default TeamStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Team" component={Team} />
      <Stack.Screen name="BloodBanks" component={BloodBanks} />
      <Stack.Screen name="CreateTeam" component={CreateTeam} />
      <Stack.Screen name="NerbyUSers" component={NerbyUSers} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="MyRequests" component={MyRequests} />
      <Stack.Screen name="MYDonationHistory" component={MYDonationHistory} />
      <Stack.Screen name="MyTeam" component={MyTeam} />
      <Stack.Screen name="Userinformation" component={Userinformation} />
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
    </Stack.Navigator>
  );
};
