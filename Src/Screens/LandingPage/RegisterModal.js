import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { ScrollView } from "react-native";
import LabelTextInput from "../../Components/LabelTextInput";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../Components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function RegisterModal({
  title,
  isVisible,
  onClose,
  style,
  show,
  show1,
  show2,
  children,
  value,
  onChangeText,
  value1,
  onChangeText1,
  next,
  Loading,
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
        <TouchableOpacity
          style={styles.cross}
          activeOpacity={1}
          onPress={onClose}
        ></TouchableOpacity>
        <KeyboardAwareScrollView style={styles.subcont}>
          <Text style={styles.title}>Create Account</Text>
          <LabelTextInput
            tittle="Email Address "
            placeholder="Enter your email "
            value={value}
            onChangeText={onChangeText}
          />
          <View>
            {show}
            {show2}
          </View>
          <LabelTextInput
            tittle="Password"
            placeholder="Enter your password "
            secureTextEntry={hide ? true : false}
            value={value1}
            onChangeText={onChangeText1}
            style={{ marginTop: "1%" }}
            show="flex"
            context={
              <Ionicons
                name={hide ? "ios-eye-outline" : "ios-eye-off-outline"}
                size={24}
                color="black"
              />
            }
            onPress={() => sethide(!hide)}
          />
          <View>{show1}</View>
          <Button
            tittle={
              Loading ? <ActivityIndicator color={Colors.white} /> : "Next"
            }
            style={{ marginTop: "10%", marginBottom: "5%" }}
            onPress={next}
            disabled={Loading}
          />

          {/* <View
            style={{
              marginTop: "10%",
              borderTopWidth: 1,
              borderColor: Colors.PrimeGray,
            }}
          ></View>
          <View
            style={{
              width: 25,
              height: 25,
              borderRadius: 20,
              backgroundColor: Colors.Pink,
              alignSelf: "center",
              marginTop: -13,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Typography.Bold,
                fontSize: 11,
                color: Colors.white,
              }}
            >
              OR
            </Text>
          </View>
          <View style={styles.buttomview}>
            <TouchableOpacity style={styles.Button1}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Typography.Tittle,
                  color: Colors.white,
                }}
              >
                GOOGLE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.Button1,
                marginLeft: "5%",
                backgroundColor: "#1976D2",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Typography.Tittle,
                  color: Colors.white,
                }}
              >
                FACEBOOK
              </Text>
            </TouchableOpacity>
          </View> */}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modelcontent: {
    flex: 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopEndRadius: 50,
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
    marginTop: "10%",
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
    marginBottom: "5%",
  },
  Button1: {
    width: 130,
    height: 45,

    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#EA4335",
  },
});
