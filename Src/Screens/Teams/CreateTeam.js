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
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import LabelTextInput from "../../Components/LabelTextInput";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import { Addteamvalidator } from "../../Validator/Register";
import Button from "../../Components/Button";
import * as Animatable from "react-native-animatable";
import PhoneInput from "react-native-phone-number-input";

import { BloodData, Role } from "../Registration/Data";
import { Url } from "@env";

const CreateTeam = ({ route }) => {
  const Navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [picture, setpicture] = useState("");
  const [Error, setError] = useState({});
  const [name, setname] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [Tittle, setTitle] = useState("");
  const [City, setcity] = useState("");
  const [inputsize, setinputsize] = useState(0);
  const [membersname, setmembersname] = useState([]);

  const [BloodGroup, setBloodGroup] = useState("");
  const [member, setMember] = useState([
    {
      name: "",
      email: "",
      BloodGroup: "",
      role: "",
      phoneNumber: "",
    },
  ]);

  const ref = useRef();
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
        Alert.alert("Image size too large");
      }
    }
  };
  const date = new Date().getFullYear();
  console.log(date);
  const SendData = async () => {
    const data = {
      title: Tittle,
      city: City,
      logo: picture,
      Volunteer: inputsize,
      Date: date,
      Members: member,
    };
    if (member.length <= 1) {
      Alert.alert("Team Member Should be more than 1");
    } else {
      console.log(data);

      const error = Addteamvalidator(data);

      console.log(error);

      setError(error);

      if (Object.keys(error).length !== 0) {
        return;
      }
      setLoading(true);
      axios
        .post(`${Url}/addteam`, data)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Team Name Already Exist") {
            setLoading(false);
            Alert.alert("Team Name Already Exist");
          } else {
            Alert.alert("Team Created Successfully");
            setLoading(false);

            Navigation.navigate("Team");
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const handleInput = (e) => {
    const value = e;
    setinputsize(e);

    if (value > 0) {
      let d = [
        {
          name: "",
          email: "",
          BloodGroup: "",
          role: "",
          phoneNumber: "",
        },
      ];

      for (let i = 1; i <= value - 1; i++) {
        d.push({
          name: "",
          email: "",
          BloodGroup: "",
          role: "",
          phoneNumber: "",
        });
      }
      setMember(d);
    }
  };

  const handleChange = (index, value, field) => {
    if (value == "") {
      setname(true);
    }

    let temp = [...member];
    temp[index][field] = value;
    setMember(temp);
    setname(false);
  };

  return (
    <View style={styles.container}>
      <Headersub
        tittle="Add A Team "
        onBackbuttonpress={() => Navigation.goBack()}
      />
      <View style={styles.subview}>
        <Text style={styles.text2}>Create A New Team</Text>

        <KeyboardAwareScrollView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: "5%",
              alignItems: "center",
            }}
          >
            <View>
              <TouchableOpacity style={styles.box} onPress={() => pickImage()}>
                <Feather name="plus" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.tittle1}>Upload Logo</Text>
            </View>
            {image && (
              <Image source={{ uri: image }} style={styles.imageview} />
            )}
          </View>
          {Error?.logo ? (
            <View style={{ marginTop: "1%", alignSelf: "center" }}>
              <Animatable.Text
                animation="bounceInLeft"
                duration={3000}
                style={styles.error}
              >
                {Error.logo}
              </Animatable.Text>
            </View>
          ) : null}
          <LabelTextInput
            tittle="Tittle"
            style={{ marginTop: "2%" }}
            placeholder="Enter tittle of the team"
            value={Tittle}
            onChangeText={setTitle}
            error={Error?.title}
          />
          <LabelTextInput
            tittle="City"
            style={{ marginTop: "2%" }}
            placeholder="Enter City"
            value={City}
            onChangeText={setcity}
            error={Error?.city}
          />
          <LabelTextInput
            tittle="Total Members"
            style={{ marginTop: "2%" }}
            placeholder="Enter Total Number of Members "
            value={inputsize}
            onChangeText={(e) => handleInput(e)}
            keyboardType="decimal-pad"
            error={Error?.Volunteer}
          />
          {/* <View>{renderInputs(inputsize)}</View> */}
          {member.map((item, index) => (
            <View key={index}>
              {member.length > 1 ? (
                <View>
                  <LabelTextInput
                    tittle="Name"
                    style={{ marginTop: "2%" }}
                    placeholder={`Enter Name of Member ${index + 1}`}
                    value={item.name}
                    onChangeText={(e) => handleChange(index, e, "name")}
                  />
                  {!item.name.length >= 1 ? (
                    <View style={{ marginTop: "1%" }}>
                      <Animatable.Text
                        animation="bounceInLeft"
                        duration={3000}
                        style={styles.error}
                      >
                        Name is required
                      </Animatable.Text>
                    </View>
                  ) : null}
                  <LabelTextInput
                    tittle="Email"
                    style={{ marginTop: "2%" }}
                    placeholder={`Enter Email of Member ${index + 1}`}
                    value={item.email}
                    onChangeText={(e) => handleChange(index, e, "email")}
                  />
                  {!item.email.length >= 1 ? (
                    <View style={{ marginTop: "1%" }}>
                      <Animatable.Text
                        animation="bounceInLeft"
                        duration={3000}
                        style={styles.error}
                      >
                        Email is required
                      </Animatable.Text>
                    </View>
                  ) : null}
                  <Text style={styles.text}>Phone Number</Text>

                  <PhoneInput
                    defaultValue={item.phoneNumber}
                    placeholder={`Phone number of member ${index + 1}`}
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
                    textInputStyle={{ fontSize: 14, top: 2 }}
                    codeTextStyle={{ fontSize: 15 }}
                    defaultCode="PK"
                    layout="first"
                    onChangeText={(text) => {
                      handleChange(index, text, "phoneNumber");
                    }}
                    onChangeFormattedText={(text) => {
                      handleChange(index, text, "phoneNumber");
                    }}
                    countryPickerProps={{ withAlphaFilter: true }}
                  />
                  {!item.phoneNumber.length >= 1 ? (
                    <View style={{ marginTop: "2%" }}>
                      <Animatable.Text
                        animation="bounceInLeft"
                        duration={3000}
                        style={styles.error}
                      >
                        Phone number is required
                      </Animatable.Text>
                    </View>
                  ) : null}
                  <LabelDropDown
                    tittle="Blood Group"
                    setSelected={(e) => handleChange(index, e, "BloodGroup")}
                    onSelect={item.BloodGroup}
                    tittle1={`Select Blood Group of member ${index + 1}`}
                    data={BloodData}
                  />
                  {!item.BloodGroup.length >= 1 ? (
                    <View style={{ marginTop: "2%" }}>
                      <Animatable.Text
                        animation="bounceInLeft"
                        duration={3000}
                        style={styles.error}
                      >
                        Blood group is required
                      </Animatable.Text>
                    </View>
                  ) : null}
                  <LabelDropDown
                    tittle="Role"
                    setSelected={(e) => handleChange(index, e, "role")}
                    onSelect={item.role}
                    tittle1={`Select Role of member ${index + 1}`}
                    data={Role}
                  />
                  {!item.role.length >= 1 ? (
                    <View style={{ marginTop: "2%" }}>
                      <Animatable.Text
                        animation="bounceInLeft"
                        duration={3000}
                        style={styles.error}
                      >
                        User role is required
                      </Animatable.Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          ))}
          <Button
            tittle="Create"
            style={{ marginBottom: "5%", width: "70%", marginTop: "5%" }}
            onPress={() => {
              SendData();
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default CreateTeam;
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
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
    marginTop: "3%",
  },
  input: {
    width: "100%",
  },
  text5: {
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
});
