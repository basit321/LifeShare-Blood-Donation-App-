import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { Url } from "@env";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React from "react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { LoginValidation } from "../../Validator/Register";
import Button from "../../Components/Button";
import RegisterModal from "./RegisterModal";
import publicIP from "react-native-public-ip";
import { useFocusEffect } from "@react-navigation/native";
import { UseNotifications } from "../../Components/useNotification";

import LoginModal from "./LoginModal";
import ALertModal from "../../Components/Model";
import * as Animatable from "react-native-animatable";
import * as Location from "expo-location";
const LandingPage = ({ navigation }) => {
  const [ip, setip] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const { registerForPushNotificationsAsync } = UseNotifications();
  const getuserregion = async () => {
    const isAndroid = Platform.OS == "android";
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Access is Required");
      return;
    } else {
      console.log("Granted");

      const location = await Location.getCurrentPositionAsync({
        accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
      });

      console.log(location);
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
    }
  };

  useFocusEffect(
    useCallback(() => {
      publicIP()
        .then((IP) => {
          console.log(IP);
          // '47.122.71.234'
          setip(IP);
          getuserregion();
        })
        .catch((error) => {
          console.log(error);
          // 'Unable to get IP address.'
        });
    }, [])
  );
  const [ShowResgister, setShowRegister] = useState(false);
  const [Error, setError] = useState({});
  const [ShowLogin, setShowLogin] = useState(false);
  const [email, setemail] = useState("");
  const [emaillent, setemaillengeht] = useState(false);
  const [passwordlent, passwordengeht] = useState(false);
  const [emailformt, setemailformmat] = useState(false);
  const [password, setpassword] = useState("");
  const [Loginemail, setLoginemail] = useState("");
  const [Loginpassword, setLoginpassword] = useState("");
  const [userid, setuserid] = useState();
  const [RegisterAlert, setRegisterAlert] = useState(false);
  const [ErrorResponse, setErrorResponse] = useState(false);
  const [Respnse, setResponse] = useState("");
  const [loding, setloding] = useState(false);
  const [loding1, setloding1] = useState(false);

  const [loginEmailVallidation, setLoginEmailValidation] = useState(false);

  const Senddata = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (email.length == 0) {
      setemaillengeht(true);
      passwordengeht(true);
    } else if (password.length == 0) {
      setemaillengeht(false);
      passwordengeht(true);
    } else if (reg.test(email) === false) {
      setemailformmat(true);
      setemaillengeht(false);
      passwordengeht(false);
    } else {
      const registered = {
        email: email,
        password: password,
      };
      console.log(email, password);
      setemaillengeht(false);
      passwordengeht(false);
      setemailformmat(false);
      setloding(true);
      axios
        .post(`${Url}/Registration`, registered)
        .then(async (response) => {
          let information = await response.data;
          if (information.message == "UserAlreadyExist") {
            console.log("UserAlreadyExist");
            Alert.alert(
              "Alert!",
              "This user is already exist",
              [{ text: "Ok" }],
              { cancelable: false }
            );
          } else {
            setuserid(information.message._id);
            setemail("");
            setpassword("");
            setShowRegister(false);
            setloding(false);
            navigation.navigate("PersonalInfromation", {
              ip: ip,
              userid: information.message._id,
              token: expoPushToken,
            });
          }
        })
        .catch((e) => Alert.alert("Network Error"))
        .finally(() => {
          setloding(false);
        });
    }
  };
  const LoginUser = async () => {
    const data = {
      email: Loginemail,
      password: Loginpassword,
    };
    const error = LoginValidation(data);

    console.log(error);

    setError(error);

    if (Object.keys(error).length !== 0) {
      return;
    }
    setloding1(true);
    axios
      .post(`${Url}/SignIn`, data)
      .then(async (response) => {
        let userinfo = await response.data;
        console.log(userinfo);
        if (userinfo.success === false) {
          setErrorResponse(true);
          setResponse(userinfo.message);
          setloding1(false);
        } else if (userinfo.success === true) {
          let userdata = await userinfo.user;
          let userinormation = JSON.stringify({ userdata });
          await StoreData(userinormation);
          setloding1(false);
          navigation.replace("Dashboard");
          await AsyncStorage.setItem("islogin", JSON.stringify(true));
          setErrorResponse(false);
          setResponse("");
          setLoginemail("");
          setLoginpassword("");
          setShowLogin(false);
        }
      })

      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
        setloding1(false);
      });
  };
  const StoreData = async (data) => {
    try {
      await AsyncStorage.setItem("@lifeShare", data);

      console.log(data);
    } catch (e) {
      // saving error
      Alert.alert("Network Error");
    }
  };

  return (
    <View style={{ ...styles.container }}>
      <StatusBar style="dark" />
      <View style={{ marginTop: "25%", alignItems: "center" }}>
        <Image
          style={styles.Imageview}
          source={require("../../Images/icon.png")}
        />
        <Text style={styles.tittle}>LifeShare</Text>
      </View>
      <View style={styles.box}>
        <View style={styles.boxview}>
          <Text style={styles.subtittle}>
            Welcome{"\n"}
            <Text style={{ ...styles.subtittle, fontSize: 20 }}>
              Before enjoying Lifeshare services{"\n"}Please register first
            </Text>
          </Text>
          <View style={styles.buttomview}>
            <Button
              tittle="Create Account"
              onPress={() => setShowRegister(true)}
            />
            <Button
              tittle="Login"
              style={styles.button}
              Contextstyle={{ backgroundColor: Colors.white }}
              Textstyle={styles.text1}
              onPress={() => setShowLogin(true)}
            />
          </View>
        </View>
      </View>
      <RegisterModal
        isVisible={ShowResgister}
        onClose={() => {
          setShowRegister(false), setemaillengeht(false);
          passwordengeht(false);
          setemailformmat(false);
          setemail("");
          setpassword("");
        }}
        value={email}
        Loading={loding}
        onChangeText={setemail}
        value1={password}
        onChangeText1={setpassword}
        next={() => {
          Senddata();
        }}
        show={
          <View>
            {emaillent ? (
              <View style={{ marginTop: "2%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  Email is Required
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
        show1={
          <View>
            {passwordlent ? (
              <View style={{ marginTop: "2%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  Password is Required
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
        show2={
          <View>
            {emailformt ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  Inavlid email format
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
      />
      <LoginModal
        isVisible={ShowLogin}
        onClose={() => {
          setShowLogin(false),
            setError(null),
            setResponse(""),
            setErrorResponse(false);
          setLoginemail("");
          setLoginpassword("");
        }}
        value={Loginemail}
        Loading={loding1}
        onChangeText={setLoginemail}
        value1={Loginpassword}
        onChangeText1={setLoginpassword}
        Navigaytetopassword={() => {
          setShowLogin(false), navigation.navigate("ForgetPassword");
        }}
        next={() => LoginUser()}
        show={
          <View>
            {Error?.email ? (
              <View style={{ marginTop: "2%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.email}
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
        show3={
          <View>
            {Error?.password ? (
              <View style={{ marginTop: "2%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.password}
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
        show1={
          <View>
            {setErrorResponse ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={{ ...styles.error, textAlign: "center" }}
                >
                  {Respnse}
                </Animatable.Text>
              </View>
            ) : (
              <View style={{ marginTop: "2%" }}></View>
            )}
          </View>
        }
      />
      <ALertModal
        isVisible={RegisterAlert}
        onClose={() => setRegisterAlert(false)}
      />
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Pink,
    alignItems: "center",
    paddingBottom: "15%",
  },
  boxview: {
    flex: 1,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
    paddingBottom: "10%",
  },
  Imageview: {
    width: 157,
    height: 148,
  },
  tittle: {
    fontSize: 33,
    color: Colors.white,
    fontFamily: Typography.Tittle,
    marginTop: "2%",
  },
  subtittle: {
    fontSize: 30,
    color: Colors.black,
    fontFamily: Typography.Text,
    textAlign: "center",
  },
  box: {
    height: 372,
    width: "95%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginTop: "auto",
  },
  buttomview: {
    marginTop: "auto",
  },
  button: {
    padding: 1,
    marginTop: "5%",
  },
  text1: {
    color: Colors.Pink,
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
});
