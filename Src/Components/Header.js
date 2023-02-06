import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const Header = ({
  style,
  Drawer,
  Contextstyle,
  Textstyle,
  tittle,
  Notifications,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[Contextstyle, styles.Context]}>
        <TouchableOpacity onPress={Drawer}>
          <Entypo name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.Text, Textstyle]}>{tittle}</Text>
        <TouchableOpacity onPress={Notifications}>
          <MaterialCommunityIcons name="bell" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: Colors.Pink,
  },

  Context: {
    width: "90%",
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
  },
  Text: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: Typography.Text,
  },
});
