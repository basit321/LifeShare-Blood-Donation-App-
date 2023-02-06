import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import Button from "../../Components/Button";
import firebase from "../Firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Url } from "@env";
import { useState, useEffect, useRef } from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";

import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import LabelTextInput from "../../Components/LabelTextInput";
import { PaswordValidation } from "../../Validator/Register";
import * as Animatable from "react-native-animatable";
import axios from "axios";

const CreateNewPassword = ({ route, navigation }) => {
  const { Id } = route.params;
  const [Password, Setpassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [Get, setGet] = useState(false);
  const [hide, setHide] = useState(true);
  const [hide1, setHide1] = useState(true);

  const Submit = async () => {
    const data = {
      password: Password,
    };
    const error = PaswordValidation(data);

    console.log(error);

    setError(error);

    if (Object.keys(error).length !== 0) {
      return;
    }
    if (Password !== ConfirmPassword) {
      setGet(true);

      return;
    }
    setLoading(true);
    setGet(false);
    axios
      .patch(`${Url}/Newpassword/${Id}/${Password}`)
      .then((res) => {
        console.log(res.data);

        Alert.alert(
          "Password Changed",
          "Your password has been changed successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Landingpage"),
            },
          ]
        );
        // navigation.navigate("Landingpage");
      })
      .catch((err) => {
        Alert.alert("Error", "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" animating={true} color="#EA4335" />
          <Text
            style={{
              fontSize: 18,
              fontFamily: Typography.Text,
              color: Colors.black,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View style={styles.subcont}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.tittle}>Set new Password</Text>
          <LabelTextInput
            tittle="Password"
            placeholder="Enter your new password "
            secureTextEntry={hide ? true : false}
            value={Password}
            onChangeText={Setpassword}
            style={{ marginTop: "5%" }}
            error={error.password}
            context={
              <Ionicons
                name={hide ? "ios-eye-outline" : "ios-eye-off-outline"}
                size={24}
                color="black"
              />
            }
            onPress={() => setHide(!hide)}
          />
          <LabelTextInput
            tittle="Confirm Password"
            placeholder="Enter  password "
            secureTextEntry={hide1 ? true : false}
            value={ConfirmPassword}
            onChangeText={SetConfirmPassword}
            style={{ marginTop: "5%" }}
            context={
              <Ionicons
                name={hide1 ? "ios-eye-outline" : "ios-eye-off-outline"}
                size={24}
                color="black"
              />
            }
            onPress={() => setHide1(!hide1)}
          />
          {Get ? (
            <View style={{ marginTop: "2%" }}>
              <Animatable.Text
                animation="bounceInLeft"
                duration={3000}
                style={styles.error}
              >
                Password does not match
              </Animatable.Text>
            </View>
          ) : null}
        </View>
      )}
      <Button tittle="Verify" style={styles.Button} onPress={() => Submit()} />
    </View>
  );
};

export default CreateNewPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
  },
  subcont: {
    flex: 1,
    backgroundColor: Colors.white,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
  },
  tittle: {
    fontSize: 25,
    color: Colors.black,

    textAlign: "center",
    fontFamily: Typography.Text,
  },
  tittle1: {
    fontSize: 15,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "2%",
    textAlign: "center",
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: "1%",
    marginLeft: "10%",
  },
  box1: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
  },
  text: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
    marginTop: "3%",
  },
  Button: {
    marginBottom: "10%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
});
