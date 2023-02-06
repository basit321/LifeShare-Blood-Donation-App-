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
import { Image } from "@rneui/themed";
const Images = ({
  style,
  onPress,
  Context,
  Contextstyle,
  Textstyle,
  tittle,
  disabled,
  source,
}) => {
  return (
    <Image
      containerStyle={[styles.container, style]}
      source={source}
      PlaceholderContent={
        <View style={{ backgroundColor: null, flex: 1 }}>
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      }
    />
  );
};
export default Images;

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
