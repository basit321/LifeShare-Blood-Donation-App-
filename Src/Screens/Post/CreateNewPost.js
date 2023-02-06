import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import React from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import * as Location from "expo-location";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Headersub from "../../Components/Headersub";
import LabelDropDown from "../../Components/LabelDropDown";
import Button from "../../Components/Button";

import LabelTextInput from "../../Components/LabelTextInput";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { BloodData, SurgeryData } from "../Registration/Data";
import { UserRequest } from "../Dumydata/Data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Addpostvalidator } from "../../Validator/Register";
import * as Animatable from "react-native-animatable";
import RadioButtonRN from "radio-buttons-react-native";

const CreateNewPost = ({ route }) => {
  const { lat, long } = route.params;
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const [sugery, setsugery] = useState("");
  const [sugerytype, setsugerytype] = useState("");
  const [Qunatity, setQunatity] = useState("");
  const [Urgent, setUrgent] = useState(false);
  const [Specific, setSpecific] = useState("Not mentioned");
  const [accepted, setaccepted] = useState(false);

  const [Error, setError] = useState({});
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const Type = [
    {
      label: "Surgery",
    },
    {
      label: "Non-Surgery",
    },
  ];
  const SurgeryType = [
    {
      label: "general surgery",
    },
    {
      label: "specific surgery",
    },
  ];
  const Navigation = useNavigation();
  const getData = async () => {
    await AsyncStorage.getItem("@Storedata")
      .then(async (value) => {
        if (value !== null) {
          const jsonValue = JSON.parse(value);
          let info = await jsonValue;

          setdata(info);
          setloading(true);
          console.log(info);
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      })
      .finally((e) => {
        setloading(true);
      });

    // error reading value
  };

  const [Request, setRequest] = useState("");
  const [Description, setdescription] = useState("");
  const [inputsize, setinputsize] = useState(0);
  const [membersname, setmembersname] = useState([]);

  const [BloodGroup, setBloodGroup] = useState("");

  const ref = useRef();
  const Validate = async () => {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let date = day + "/" + month + "/" + year;

    if (sugery === "Surgery") {
      const userdata = {
        id: data.results._id,
        name: data.results.name,
        email: data.results.email,
        phone: data.results.phonenumber,
        pictrue: data.results.pictrue,
        bloodgroup: data.results.bloodgroup,
        city: data.results.city,
        country: data.results.country,
        gender: data.results.gender,
        phonenumber: data.results.phonenumber,
        lifesaved: data.results.lifesaved,
        Request: Request,
        Description: Description,
        Bloodtype: BloodGroup,
        Date: date,
        Qunatity: Qunatity,
        Urgent: true,
        SurgeryType: sugerytype,
        sugery: sugery,
        Specific: Specific,
        accepted: accepted,
      };
      console.log(userdata);
      const result = await Addpostvalidator(userdata);
      console.log(result);

      setError(result);

      if (Object.keys(result).length !== 0) {
        return;
      }
      Navigation.navigate("SelectLocation", {
        post: userdata,
        lat: lat,
        long: long,
      });
    } else {
      setSpecific("");
      setsugerytype("");
      const userdata = {
        id: data.results._id,
        name: data.results.name,
        email: data.results.email,
        phone: data.results.phonenumber,
        pictrue: data.results.pictrue,
        bloodgroup: data.results.bloodgroup,
        city: data.results.city,
        country: data.results.country,
        gender: data.results.gender,
        phonenumber: data.results.phonenumber,
        lifesaved: data.results.lifesaved,
        Request: Request,
        Description: Description,
        Bloodtype: BloodGroup,
        Date: date,
        Qunatity: Qunatity,
        Urgent: false,

        sugery: sugery,

        accepted: accepted,
      };
      console.log(userdata);
      const result = await Addpostvalidator(userdata);
      console.log(result);

      setError(result);

      if (Object.keys(result).length !== 0) {
        return;
      }

      Navigation.navigate("SelectLocation", {
        post: userdata,
        lat: lat,
        long: long,
      });
    }
  };

  return (
    <View style={styles.container} nestedScrollEnabled={true}>
      <Headersub
        tittle="Add A Post "
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {loading ? (
        <ScrollView style={styles.subview} nestedScrollEnabled={true}>
          <Text style={styles.text2}>Create A New Post</Text>

          <KeyboardAwareScrollView nestedScrollEnabled={true}>
            <LabelDropDown
              tittle="What you need"
              tittle1="Choose Your Request"
              textstyle={styles.text}
              onSelect={Request}
              setSelected={setRequest}
              data={UserRequest}
              Error={Error?.Request}
            />
            <LabelDropDown
              tittle="What blood group do you need"
              tittle1="Pick A Blood Group"
              textstyle={styles.text}
              onSelect={BloodGroup}
              setSelected={setBloodGroup}
              data={BloodData}
              style={{ marginTop: "5%" }}
              Error={Error?.Bloodtype}
            />
            <LabelTextInput
              tittle="Quantity"
              textstyle={styles.text}
              placeholder="How many bottles of blood you need"
              style={{ marginTop: "5%" }}
              value={Qunatity}
              onChangeText={setQunatity}
              keyboardType="numeric"
            />
            {Error?.Qunatity ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.Qunatity}
                </Animatable.Text>
              </View>
            ) : null}

            <Text style={{ ...styles.text, marginTop: "5%" }}>
              Required blood for
            </Text>
            <RadioButtonRN
              data={Type}
              selectedBtn={(e) => {
                setsugery(e.label), console.log(e.label);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              boxStyle={{ ...styles.box2 }}
              textStyle={styles.boxtext}
              activeColor={Colors.Pink}
              boxActiveBgColor={Colors.white}
            />
            {Error?.sugery ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.sugery}
                </Animatable.Text>
              </View>
            ) : null}
            {sugery === "Surgery" ? (
              <View>
                <Text style={{ ...styles.text, marginTop: "5%" }}>
                  Surgery type
                </Text>
                <RadioButtonRN
                  data={SurgeryType}
                  selectedBtn={(e) => {
                    setsugerytype(e.label), console.log(e.label);
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "82%",
                  }}
                  boxStyle={{ ...styles.box2, width: "60%" }}
                  textStyle={styles.boxtext}
                  activeColor={Colors.Pink}
                  boxActiveBgColor={Colors.white}
                />

                {sugerytype === "general surgery" ? (
                  <View nestedScrollEnabled={true}>
                    <LabelDropDown
                      tittle="Select surgery"
                      tittle1="Pick a surgery"
                      textstyle={styles.text}
                      onSelect={Specific}
                      setSelected={setSpecific}
                      data={SurgeryData}
                      style={{ marginTop: "5%" }}
                    />
                  </View>
                ) : null}
                {sugerytype === "specific surgery" ? (
                  <LabelTextInput
                    tittle="Optional"
                    textstyle={styles.text}
                    placeholder="Enter a specific surgery"
                    style={{ marginTop: "5%" }}
                    keyboardType="numeric"
                  />
                ) : null}
              </View>
            ) : null}

            <LabelTextInput
              tittle="Description"
              textstyle={styles.text}
              style={{ marginTop: "5%" }}
              numberOfLines={2}
              Inputstyle={styles.input}
              multiline={true}
              placeholder="Explain Why You Need Blood"
              value={Description}
              onChangeText={setdescription}
            />
            {Error?.Description ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  {Error.Description}
                </Animatable.Text>
              </View>
            ) : null}
            <Button
              tittle="Select Location"
              style={styles.Button}
              onPress={() => Validate()}
            />
          </KeyboardAwareScrollView>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.Pink} />
        </View>
      )}
    </View>
  );
};

export default CreateNewPost;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  subview: {
    flex: 1,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  text2: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginTop: "5%",
    alignSelf: "center",
    textAlign: "center",
  },
  text3: {
    fontSize: 20,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "4%",
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
    borderRadius: 100,
    backgroundColor: Colors.LightGray,
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageview: {
    width: 100,
    height: 100,
    borderRadius: 100,

    marginLeft: "5%",
    marginBottom: "5%",
  },
  box1: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
  },
  text: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  input: {
    width: "100%",
    height: 150,
    fontSize: 18,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  text5: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
    marginTop: "3%",
  },
  Button: {
    marginVertical: "10%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
  box2: {
    width: "50%",
    borderWidth: 0,
  },
  boxtext: {
    fontFamily: Typography.Text,
    fontSize: 15,
    marginLeft: "10%",
  },
});
