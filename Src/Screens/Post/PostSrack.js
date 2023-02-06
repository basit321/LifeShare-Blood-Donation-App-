import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Posts from "./Posts";
import SelectLocation from "./SelectLocation";
import CreateNewPost from "./CreateNewPost";
import Details from "../Teams/Details";
import MyTeam from "./Myteams";
import MyRequests from "./MYRequests";
import PostDetails from "./PostDetails";
import MYDonationHistory from "./DonationHistory";
import Directions from "./Directions";
import PendingRequests from "./PendingRequests";
import NerbyUsers from "./NearbyUsers";
import NearbyBloodBanks from "./NearbyBloodBanks";
import BloodBanks from "../Teams/BloodBanks";
import Userinformation from "../Ranked/Useriformation";
import EditPost from "./EditPost";
import EditLocation from "./EditLocation";
const Stack = createNativeStackNavigator();

export default PostStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Posts" component={Posts} />
      <Stack.Screen name="CreateNewPost" component={CreateNewPost} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="PostDetails" component={PostDetails} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="MyTeam" component={MyTeam} />
      <Stack.Screen name="MyRequests" component={MyRequests} />
      <Stack.Screen name="MYDonationHistory" component={MYDonationHistory} />
      <Stack.Screen name="Directions" component={Directions} />
      <Stack.Screen name="PendingRequests" component={PendingRequests} />
      <Stack.Screen name="NerbyUsers" component={NerbyUsers} />
      <Stack.Screen name="NearbyBloodBanks" component={NearbyBloodBanks} />
      <Stack.Screen name="BloodBanks" component={BloodBanks} />
      <Stack.Screen name="Userinformation" component={Userinformation} />
      <Stack.Screen name="EditPost" component={EditPost} />
      <Stack.Screen name="EditLocation" component={EditLocation} />
    </Stack.Navigator>
  );
};
