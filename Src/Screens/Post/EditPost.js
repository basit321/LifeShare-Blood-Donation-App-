import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
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
import { Url } from "@env";
import axios from "axios";

const EditPost = ({ route }) => {
  const { data } = route.params;
  const [datas, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const [sugery, setsugery] = useState("");
  const [sugerytype, setsugerytype] = useState(data.SurgeryType);
  const [Qunatity, setQunatity] = useState(data.Qunatity);
  const [Urgent, setUrgent] = useState(data.Urgent);
  const [Specific, setSpecific] = useState(Specific);
  const [accepted, setaccepted] = useState(data.accepted);

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
    axios
      .get(`${Url}/postinfo/${data._id}`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      })
      .finally(() => {
        setloading(true);
      });
  };

  const [Request, setRequest] = useState(data.Request);
  const [Description, setdescription] = useState(data.Description);
  const [inputsize, setinputsize] = useState(0);
  const [membersname, setmembersname] = useState([]);

  const [BloodGroup, setBloodGroup] = useState(data.Bloodtype);

  const ref = useRef();
  const Validate = async () => {
    let day = new Date().getDate();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let date = day + "/" + month + "/" + year;
    if (sugery === "Surgery") {
      const userdata = {
        Request: Request,
        Description: Description,
        Bloodtype: BloodGroup,
        Date: data.Date,
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
      Navigation.navigate("EditLocation", {
        post: userdata,
        lat: data.lat,
        long: data.long,
        id: data._id,
      });
    } else {
      setSpecific("");
      setsugerytype("");
      const userdata = {
        Request: Request,
        Description: Description,
        Bloodtype: BloodGroup,
        Date: data.Date,
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

      Navigation.navigate("EditLocation", {
        post: userdata,
        lat: data.lat,
        long: data.long,
        id: data._id,
        names: data.hospital,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Headersub
        tittle="Edit A Post "
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {loading ? (
        <ScrollView style={styles.subview}>
          <Text style={styles.text2}>Create A New Post</Text>

          <KeyboardAwareScrollView>
            <LabelDropDown
              tittle="What you need"
              tittle1={Request}
              textstyle={styles.text}
              onSelect={Request}
              setSelected={setRequest}
              data={UserRequest}
              Error={Error?.Request}
              value={data.Request}
            />
            <LabelDropDown
              tittle="What blood group do you need"
              tittle1={BloodGroup}
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
                  <View>
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

export default EditPost;
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
