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
import { PaymentValidation } from "../../Validator/Register";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import Modal from "react-native-modal";

const ForgetPassword = ({ route, navigation }) => {
  const [Email, SetEmail] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [Get, setGet] = useState(false);

  const Submit = () => {
    setLoading(true);
    const data = {
      email: Email,
    };
    const error = PaymentValidation(data);

    console.log(error);

    setError(error);

    if (Object.keys(error).length !== 0) {
      return;
    }
    axios
      .get(`${Url}//getuserbyemailid/${Email}`)
      .then((res) => {
        if (res.data.length === 0) {
          setGet(true);
          setLoading(false);
        } else {
          const id = res.data[0]._id;
          console.log(id);
          GetverifyEmail(id);
        }
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
        setLoading(false);
      });
  };
  const GetverifyEmail = (id) => {
    axios
      .post(`${Url}/verifyemail/${Email}`)
      .then((res) => {
        console.log(res.data);
        navigation.navigate("Verifyemail", { Id: id });
        SetEmail("");
        setGet(false);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
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
          <Text style={styles.tittle}>ForgetPassword</Text>
          <LabelTextInput
            tittle="Email Address"
            style={{ marginTop: "5%" }}
            placeholder="Enter Email Address"
            value={Email}
            onChangeText={SetEmail}
            error={error.email}
          />
          {Get ? (
            <View style={{ marginTop: "2%" }}>
              <Animatable.Text
                animation="bounceInLeft"
                duration={3000}
                style={styles.error}
              >
                Email is not registered
              </Animatable.Text>
            </View>
          ) : null}
        </View>
      )}
      <Button tittle="Verify" style={styles.Button} onPress={() => Submit()} />
    </View>
  );
};

export default ForgetPassword;
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
