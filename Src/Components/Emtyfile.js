import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Typography from "../utils/Typography";
import Colors from "../utils/Colors";

const Emtyfile = ({ Tittle, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("../Images/nodata.png")}
        style={{ width: 150, height: 150, alignSelf: "center" }}
      />
      <Text style={styles.text}>{Tittle}</Text>
    </View>
  );
};

export default Emtyfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "50%",
  },
  Input: {
    width: "100%",
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
    color: Colors.black,
    fontSize: 17,
    paddingHorizontal: 10,
    fontFamily: Typography.Text,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: "2%",
  },
  text: {
    fontSize: 25,
    color: Colors.black,
    fontFamily: Typography.Text,
    textAlign: "center",
  },
  content: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: "2%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
});
