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
import { Ionicons } from "@expo/vector-icons";

const Headersub = ({
  style,
  onBackbuttonpress,
  Contextstyle,
  Textstyle,
  tittle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[Contextstyle, styles.Context]}>
        <TouchableOpacity
          onPress={onBackbuttonpress}
          style={{ position: "absolute" }}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.Text, Textstyle]}>{tittle}</Text>
      </View>
    </View>
  );
};

export default Headersub;
const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: Colors.Pink,
  },

  Context: {
    width: "90%",

    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
  },
  Text: {
    fontSize: 25,
    color: Colors.white,
    fontFamily: Typography.Text,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
