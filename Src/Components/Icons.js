import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
} from "react-native";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";

const Icons = ({}) => {
  return (
    <Image
      style={{ width: 26, height: 26 }}
      source={require("..//Images/verified.png")}
    />
  );
};
export default Icons;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
  },

  Context: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
  },
  Text: {
    fontSize: 17,
    color: Colors.white,
    fontFamily: Typography.Bold,
  },
});
