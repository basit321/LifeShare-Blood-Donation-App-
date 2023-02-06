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

import CountDown from "react-native-countdown-component";

import { useState, useEffect, useRef } from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";

import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";

import * as Animatable from "react-native-animatable";
import { Url } from "@env";

const Verifyemail = ({ route, navigation }) => {
  const { Id } = route.params;
  const [CountDowns, setcountdowns] = useState(true);
  const [Code, setCode] = useState("");
  const [show, setshow] = useState(false);

  const [Field, setField] = useState(false);

  const [loading, setloading] = useState(true);

  const confirmCode = () => {
    setloading(false);
    if (Code.length < 4) {
      setField(true);
      setloading(true);
    }
    axios
      .get(`${Url}/Verifycode/${Code}`)
      .then((response) => {
        console.log(response.data), setCode("");
        setField(false);
        navigation.navigate("CreateNewPassword", { Id: Id });
      })
      .catch((e) => {
        Alert.alert("Invalid Code");
        setloading(true);
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1 }}>
          <View style={styles.subcont}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.tittle}>Verify Otp</Text>
            <Text
              style={{
                fontSize: 22,
                marginTop: "5%",
                color: Colors.black,
                fontFamily: Typography.Text,
              }}
            >
              Enter The Code
            </Text>
            <Text
              style={{
                fontSize: 17,
                marginTop: "5%",
                color: "#A69B9B",
                fontFamily: Typography.Text,
                textAlign: "center",
                width: "50%",
                alignSelf: "center",
              }}
            >
              Enter the code we sent to your email
            </Text>

            <OTPInputView
              style={styles.InputView}
              pinCount={4}
              code={Code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={setCode}
              codeInputFieldStyle={styles.Input}
              autoFocusOnLoad={false}
              // codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            />
            {Field ? (
              <Animatable.Text
                animation="bounceInLeft"
                duration={3000}
                style={styles.error}
              >
                OTP is Required !
              </Animatable.Text>
            ) : null}
            <View style={{ marginTop: "5%" }}>
              <CountDown
                until={180}
                onFinish={() => setshow(true)}
                running={CountDowns}
                digitStyle={{
                  backgroundColor: "#ffff",
                  borderWidth: null,
                  borderColor: null,
                  fontFamily: Typography.Text,
                }}
                digitTxtStyle={{
                  color: Colors.black,
                  fontSize: 17,
                  fontFamily: Typography.Text,
                  fontWeight: "normal",
                }}
                timeLabelStyle={{
                  color: "red",
                  fontFamily: Typography.Text,
                  fontWeight: "normal",
                }}
                separatorStyle={{ color: Colors.black }}
                timeToShow={["M", "S"]}
                timeLabels={{ m: null, s: null }}
                showSeparator
              />
            </View>
          </View>
          <View style={styles.buttomview}>
            <Button
              tittle="Verify OTP"
              style={styles.Button}
              onPress={() => confirmCode()}
            />
          </View>
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default Verifyemail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
  },
  subcont: {
    flex: 1,
    backgroundColor: Colors.white,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
    paddingBottom: "10%",
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
    fontSize: 20,
    color: "red",
    fontFamily: Typography.Text,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  InputView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "5%",
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
  },
  Input: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.PrimeGray,
    borderRadius: 10,
    marginTop: "10%",
    color: Colors.black,
    textAlign: "center",
    fontSize: 15,
    fontFamily: Typography.Text,
  },
  buttomview: {
    marginBottom: "10%",
  },
  Button: {
    marginTop: "5%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
    marginTop: "5%",
    marginLeft: "auto",
  },
});
