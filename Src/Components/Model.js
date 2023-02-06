import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";

import { Ionicons } from "@expo/vector-icons";
import Button from "./Button";

export default function ALertModal({
  title,
  isVisible,
  onClose,
  style,
  modalContentStyle,
  children,
  value,
  onChangeText,
  value1,
  onChangeText1,
  next,
}) {
  const [hide, sethide] = useState(true);
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      // avoidKeyboard={true}
      style={[styles.container, style]}
    >
      <View style={styles.modelcontent}>
        <Text style={styles.title}>Dear User ! </Text>
        <Text style={{ ...styles.title, fontSize: 18, textAlign: "center" }}>
          Sorry you are not eligible for registeration
        </Text>
        <Button tittle="Ok" style={styles.Button1} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modelcontent: {
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cross: {
    marginTop: "5%",
    alignSelf: "center",
    width: 75,
    height: 7,
    backgroundColor: Colors.PrimeGray,
    borderRadius: 20,
  },
  subcont: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "90%",
    marginTop: "2%",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontFamily: Typography.Text,
    color: Colors.black,
  },
  buttomview: {
    marginTop: "7%",
    flexDirection: "row",
    alignSelf: "center",
  },
  Button1: {
    width: "50%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
});
