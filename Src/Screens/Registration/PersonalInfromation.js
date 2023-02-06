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
import axios from "axios";
import { Url } from "@env";

import { useState, useEffect, useRef } from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import LabelTextInput from "../../Components/LabelTextInput";
import PhoneInput from "react-native-phone-number-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Select, NativeBaseProvider, CheckIcon } from "native-base";
import SelectList from "react-native-dropdown-select-list";
import SuccessModal from "./SuccessModal";
import LabelDropDown from "../../Components/LabelDropDown";
import * as Location from "expo-location";
import { RadioButton } from "react-native-paper";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import { BloodData, DiseaseData } from "./Data";
import { RegisterValidator } from "../../Validator/Register";
import RadioButtonRN from "radio-buttons-react-native";
import ALertModal from "../../Components/Model";

const PersonalInfromation = ({ route, navigation }) => {
  const { ip, userid, token } = route.params;

  const [usercity, setusercity] = useState("Lahore");
  const data = [
    {
      label: "Male",
    },
    {
      label: "Female",
    },
    {
      label: "Other",
    },
  ];
  const [image, setImage] = useState(null);
  const [picture, setpicture] = useState("");
  const [usercountry, setusercountry] = useState("Pakistan");
  const [isLoading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [name, setname] = useState("");
  const [age, setage] = useState("");
  const [longitude, setlongtitude] = useState();
  const [latitude, setlatitude] = useState();
  const [gender, setgender] = React.useState("");
  const [BloodGroup, setBloodGroup] = useState("");
  const [ShowDisease, setShowDisease] = useState(false);
  const [Disease, setDisease] = useState("");
  const [verificationId, setVerificationId] = useState();
  const [Success, setSucess] = useState(false);
  const recaptchaVerifier = useRef(null);
  const [Error, setError] = useState({});
  const [Alerti, SetAlert] = useState();
  const [Rank, setRank] = useState(0);
  const [lifesaved, setlisaved] = useState(0);
  const [userinfo, setuserinfo] = useState({});
  const [lastbleed, setlastbleed] = useState("None");
  const [errormessage, setErrorMsg] = useState();
  const [Status, setStatus] = useState("NotVerified");
  const getlocation = async () => {
    await fetch(`https://ipapi.co/${ip}/json/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var city = data.city;
        var country = data.country_name;
        setusercity(city);
        setusercountry(country);
        console.log(usercity);
        getuserregion();
      })

      .catch((e) => console.log(e));
  };
  const getuserregion = async () => {
    const isAndroid = Platform.OS == "android";

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
      }).then({});

      console.log(location);
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
      setlongtitude(long);
      setlatitude(lat);
      console.log(lat);
      setLoading(false);
    }
  };

  useEffect(() => {
    getlocation();
  }, [1]);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      console.log(result.uri);
      const formdata = new FormData();
      formdata.append("profile", {
        name: new Date() + "_profile",
        uri: result.uri,
        type: "image/png",
      });
      try {
        const response = await axios.post(`${Url}/UploadImage`, formdata, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
        let imagepath = await response.data;
        console.log(imagepath.url);
        setpicture(imagepath.url);
      } catch (error) {
        Alert.alert("File too large ", "Try upload a smaller file"),
          console.log(error.message);
      }
    }
  };

  const sendVerification = async () => {
    if (!Disease == "") {
      SetAlert(true);
    } else {
      const data = {
        pictrue: picture,
        name,
        age,
        gender,
        city: usercity,
        country: usercountry,
        bloodgroup: BloodGroup,
        phonenumber: formattedValue,
        long: longitude,
        lat: latitude,
        Status,
        lifesaved,
        Rank,
        lastbleed,
        token,
      };
      console.log(data);
      let userdata = await data;
      setuserinfo(userdata);

      const error = RegisterValidator(data);

      console.log(error);

      setError(error);

      if (Object.keys(error).length !== 0) {
        return;
      }

      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      console.log(formattedValue);
      phoneProvider
        .verifyPhoneNumber(formattedValue, recaptchaVerifier.current)
        .then((data) => {
          let id = data;
          setVerificationId(id);
          setSucess(true);
          console.log(id);
        })
        .catch((e) => {
          Alert.alert("Error:", "Invalid phone number");
        });
    }
  };
  const detele = async () => {
    await axios
      .delete(`${Url}/deleteteam/${userid}`)
      .then((res) => {
        console.log(res.data);
        navigation.navigate("Landingpage");
      })
      .catch((e) => {
        Alert.alert("Error", "Something went wrong");
      });
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View>
          <ActivityIndicator size="large" animating={true} color="#EA4335" />
          <Text style={{ ...styles.tittle, fontSize: 20, marginTop: "2%" }}>
            Fetching User Details
          </Text>
        </View>
      ) : (
        <View style={styles.subcont}>
          <TouchableOpacity onPress={() => detele()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.tittle}>Personal Information</Text>
          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <TouchableOpacity
                  style={styles.box}
                  onPress={() => pickImage()}
                >
                  <Feather name="plus" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.tittle1}>Upload Image</Text>
              </View>
              {image && (
                <Image source={{ uri: image }} style={styles.imageview} />
              )}
            </View>
            {Error?.pictrue ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.pictrue}
                </Animatable.Text>
              </View>
            ) : null}
            <LabelTextInput
              tittle="Name"
              style={{ marginTop: "2%" }}
              placeholder="Enter your name"
              value={name}
              onChangeText={setname}
              error={Error?.name}
            />
            <LabelTextInput
              tittle="Age"
              style={{ marginTop: "2%" }}
              placeholder="Enter your Age"
              keyboardType="number-pad"
              value={age}
              onChangeText={setage}
              error={Error?.age}
            />
            <Text style={styles.text}>Gender</Text>

            <RadioButtonRN
              data={data}
              selectedBtn={(e) => {
                setgender(e.label), console.log(gender);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                top: -5,
              }}
              boxStyle={{ ...styles.box2 }}
              textStyle={styles.boxtext}
              activeColor={Colors.Pink}
              boxActiveBgColor={Colors.white}
            />
            {Error?.gender ? (
              <View style={{ marginTop: "-3%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.gender}
                </Animatable.Text>
              </View>
            ) : null}

            <LabelTextInput
              tittle="Country"
              style={{ marginTop: "2%" }}
              defaultValue={usercountry}
              value={usercountry}
              onChangeText={setusercountry}
              error={Error?.country}
            />
            <LabelTextInput
              tittle="City"
              style={{ marginTop: "2%" }}
              value={usercity}
              onChangeText={setusercity}
              defaultValue={usercity}
              error={Error?.city}
            />

            <Text style={styles.text}>Phone Number</Text>

            <PhoneInput
              defaultValue={value}
              containerStyle={{
                backgroundColor: Colors.LightGray,
                width: "100%",
                borderRadius: 10,
                marginTop: "2%",
              }}
              textContainerStyle={{
                backgroundColor: Colors.LightGray,

                borderRadius: 10,
                height: 50,
              }}
              textInputStyle={{ fontSize: 13 }}
              codeTextStyle={{ fontSize: 13 }}
              defaultCode="PK"
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              countryPickerProps={{ withAlphaFilter: true }}
            />
            {Error?.phonenumber ? (
              <View style={{ marginTop: "2%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.phonenumber}
                </Animatable.Text>
              </View>
            ) : null}

            <LabelDropDown
              tittle="Blood Group"
              setSelected={setBloodGroup}
              onSelect={BloodGroup}
              tittle1="Select Blood Group"
              data={BloodData}
              Error={Error?.bloodgroup}
            />
            <Text style={{ ...styles.text, fontSize: 20 }}>Optional</Text>
            <View style={{}}>
              <LabelDropDown
                tittle="Current Disease"
                setSelected={setDisease}
                onSelect={Disease}
                tittle1="Select Disease"
                data={DiseaseData}
              />
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: Colors.PrimeGray,
                  borderRadius: 30,
                  position: "absolute",
                  left: 110,
                  top: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setShowDisease(true)}
              >
                <AntDesign name="question" size={15} color="#fff" />
              </TouchableOpacity>
              {ShowDisease ? (
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 10,
                    backgroundColor: "rgba(184,181,181,0.9)",
                    position: "absolute",
                    top: -100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={1}
                  onPress={() => setShowDisease(false)}
                >
                  <Text
                    style={{
                      ...styles.text,
                      fontSize: 20,
                      textAlign: "center",
                    }}
                  >
                    Current Disease{"\n"}
                    <Text
                      style={{
                        ...styles.text,
                        fontSize: 15,
                        textAlign: "center",
                      }}
                    >
                      If Your are Facing any of the Disease which is Listed
                      Below Please Mention
                    </Text>
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Button
              tittle="Verify OTP"
              style={{ marginTop: "15%", marginBottom: "10%" }}
              onPress={() => sendVerification()}
            />
          </KeyboardAwareScrollView>
        </View>
      )}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />
      <SuccessModal
        isVisible={Success}
        onClose={() => setSucess(false)}
        next={() => {
          setSucess(false),
            navigation.navigate("VerifyOtp", {
              verificationId,
              userid,
              userinfo,
            });
        }}
      />
      <ALertModal
        isVisible={Alerti}
        onClose={() => {
          SetAlert(false), detele();
        }}
      />
    </View>
  );
};

export default PersonalInfromation;
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
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
  box2: {
    width: "30%",
    borderWidth: 0,
  },
  boxtext: {
    fontFamily: Typography.Text,
    fontSize: 15,
    marginLeft: "10%",
  },
});
