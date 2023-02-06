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

const Button = ({
  style,
  onPress,
  Context,
  Contextstyle,
  Textstyle,
  tittle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[Contextstyle, styles.Context]}>
        {Context}
        <Text style={[styles.Text, Textstyle]}>{tittle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "75%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: Colors.Pink,
  },

  Context: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "100%",
    borderRadius: 10,
  },
  Text: {
    fontSize: 17,
    color: Colors.white,
    fontFamily: Typography.Bold,
  },
});
