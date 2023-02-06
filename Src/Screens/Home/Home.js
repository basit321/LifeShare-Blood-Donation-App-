import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header";
import DrawerModal from "../../Components/Drawer";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Url } from "@env";
import { Image } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Noitificationbar from "../../Components/Notificationbar";

import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import Icons from "../../Components/Icons";

const Home = ({ navigation }) => {
  // const navigation = useNavigation()
  const [drawershow, setdrawershow] = useState(false);
  const [Shownotificationbar, setShownotificationbar] = useState(false);

  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState(null);
  const [picture, setpicture] = useState("");
  const StoreData = async (data) => {
    try {
      await AsyncStorage.setItem("@Storedata", data);
      // console.log(data);
    } catch (e) {
      // saving error
      Alert.alert("Network Error");
    }
  };

  const getuserdata = async (info) => {
    setdata([]);
    const userid = info.userdata._id;

    axios
      .get(`${Url}/Userinfo/${userid}`)
      .then(async (response) => {
        console.log(response.data);

        if (response.data.results == null) {
          await AsyncStorage.setItem("islogin", "");
          navigation.navigate("Landingpage");
        } else {
          let userinormation = await response.data;

          let savedata = JSON.stringify(response.data);
          StoreData(savedata);
          setloading(true);

          setdata(userinormation);
        }
      })

      .catch((e) => {
        console.log(e);
        Alert.alert(e.message);
      })
      .finally((e) => {
        setloading(true);
      });
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@lifeShare");
      const islogin = await AsyncStorage.getItem("islogin");
      console.log(islogin);

      if (value !== null) {
        const jsonValue = JSON.parse(value);
        let info = await jsonValue;
        getuserdata(info);
      } else {
        navigation.navigate("Landingpage");
      }
    } catch (e) {
      // error reading value
      Alert.alert("Network Error");
    }
  };
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  const pickImage = async () => {
    setloading(false);
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
        Addrequest(imagepath.url);
      } catch (error) {
        Alert.alert("File too large ", "Try upload a smaller file"),
          console.log(error.message);
        setloading(true);
      }
    } else {
      setloading(true);
    }
  };
  const Addrequest = async (imagepath) => {
    const addrequest = {
      name: data.results.name,
      email: data.results.email,
      id: data.results._id,
      pictrue: data.results.pictrue,
      bloodgroup: data.results.bloodgroup,
      Status: data.results.Status,
      Report: imagepath,
    };
    axios
      .post(`${Url}/Addpendingrequest`, addrequest)
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "UserAlreadyExist") {
          Alert.alert("Request Exist", "Your Request is already in process", [
            {
              text: "OK",
            },
          ]);
        } else {
          Alert.alert("Request Sent", "Soon you will be notified !", [
            {
              text: "OK",
            },
          ]);
        }
      })

      .catch((e) => {
        Alert.alert("Network Error");
      })
      .finally((e) => {
        setloading(true);
      });
  };
  const Come = () => {
    AsyncStorage.setItem("islogin", "");
    navigation.navigate("Landingpage");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        tittle="Home"
        Drawer={() => setdrawershow(true)}
        Notifications={() => setShownotificationbar(true)}
      />

      <View style={{ flex: 1 }}>
        {data.length != 0 && loading ? (
          <ScrollView
            style={{
              flex: 1,
              width: "95%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <View key={data.results._id}>
              <View style={styles.box1}>
                <View style={styles.subview}>
                  <Image
                    containerStyle={styles.image}
                    source={{
                      uri: data.results.pictrue,
                    }}
                    resizeMode="contain"
                    PlaceholderContent={
                      <View
                        style={{
                          ...styles.image,
                          backgroundColor: "white",
                          justifyContent: "center",
                        }}
                      >
                        <ActivityIndicator size="large" color={Colors.Pink} />
                      </View>
                    }
                  />
                  {data.results.Status === "Verified" ? (
                    <View
                      style={{
                        position: "absolute",
                        marginLeft: "53%",
                        marginTop: "19%",
                      }}
                    >
                      <Icons />
                    </View>
                  ) : null}

                  <Text style={styles.text}>
                    {data.results.name}
                    {"\n"}
                    {data.results.city},{data.results.country}
                  </Text>
                  <View
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "2%",
                      flexDirection: "row",
                      width: "60%",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="heart" size={35} color="#fff" />
                      <View style={styles.box}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#fff",
                            fontFamily: Typography.Bold,
                          }}
                        >
                          {data.results.lifesaved}
                        </Text>
                      </View>
                      <Text
                        style={{
                          ...styles.text,
                          marginTop: null,
                          marginLeft: "2%",
                        }}
                      >
                        Life Saved
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="gender-male-female"
                        size={30}
                        color={Colors.white}
                      />

                      <Text
                        style={{
                          ...styles.text,
                          marginTop: "5%",
                          marginLeft: "2%",
                        }}
                      >
                        {data.results.gender}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {data.results.Status === "Verified" ? null : (
                <View style={{ ...styles.box1, height: 150 }}>
                  <View style={{ ...styles.subview, width: "90%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: "5%",
                      }}
                    >
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={require("../../Images/docs.png")}
                      />
                      <Text
                        style={{
                          fontSize: 17,
                          color: "black",
                          fontFamily: Typography.Text,
                          marginLeft: "2%",
                        }}
                      >
                        Get Yourself Verified
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "black",
                        fontFamily: Typography.Text,
                        marginLeft: "2%",
                        marginTop: "2%",
                      }}
                    >
                      Upload Your Medical Report To get Verified Your Self
                    </Text>
                    <TouchableOpacity onPress={() => pickImage()}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "red",
                          fontFamily: Typography.Text,
                          marginLeft: "2%",
                          textDecorationLine: "underline",
                          marginLeft: "auto",
                        }}
                      >
                        Upload Your Report
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={{ ...styles.box1, height: 150 }}>
                <View style={{ ...styles.subview, width: "90%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "5%",
                    }}
                  >
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={require("../../Images/Blood.png")}
                    />
                    <Text
                      style={{
                        fontSize: 17,
                        color: "black",
                        fontFamily: Typography.Text,
                        marginLeft: "2%",
                      }}
                    >
                      Find Blood Donors
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      fontFamily: Typography.Text,
                      marginLeft: "2%",
                      marginTop: "2%",
                    }}
                  >
                    Find Blood Donors Near Your Location
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "red",
                        fontFamily: Typography.Text,
                        textDecorationLine: "underline",
                        marginLeft: "auto",
                      }}
                      onPress={() =>
                        navigation.navigate("Donors", {
                          lat: data.results.lat,
                          long: data.results.long,
                          id: data.results._id,
                        })
                      }
                    >
                      Find Donor
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ ...styles.box1, height: 150, marginBottom: "5%" }}>
                <View style={{ ...styles.subview, width: "90%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "5%",
                    }}
                  >
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={require("../../Images/donate.png")}
                    />
                    <Text
                      style={{
                        fontSize: 17,
                        color: "black",
                        fontFamily: Typography.Text,
                        marginLeft: "2%",
                      }}
                    >
                      Donate Funds
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "black",
                      fontFamily: Typography.Text,
                      marginLeft: "2%",
                      marginTop: "2%",
                    }}
                  >
                    Donate Funds To Help The Needy Ones In your Area
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Payment")}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "red",
                        fontFamily: Typography.Text,
                        marginLeft: "2%",
                        textDecorationLine: "underline",
                        marginLeft: "auto",
                      }}
                    >
                      Donate Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.Pink} />
            <Text style={styles.text1}>Please Wait ......</Text>
          </View>
        )}
      </View>

      <DrawerModal
        Show={drawershow}
        onClose={() => setdrawershow(false)}
        OnnextClose={setdrawershow}
        navigation={navigation}
      />
      <Noitificationbar
        Show={Shownotificationbar}
        onClose={() => setShownotificationbar(false)}
        navigation={navigation}
        OnnextClose={setShownotificationbar}
      />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  box1: {
    width: "100%",

    backgroundColor: Colors.PrimeGray,

    borderRadius: 10,
    paddingBottom: "5%",

    marginTop: "10%",
  },
  subview: {
    flex: 1,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 70,
    marginTop: "5%",

    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#858181",
  },
  text: {
    textAlign: "center",
    marginTop: "2%",
    fontSize: 17,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  box: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 30,
    position: "absolute",
    top: 5,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    fontSize: 19,
    fontFamily: Typography.Text,
    color: Colors.black,
    textAlign: "center",
    marginTop: "5%",
  },
  image1: {
    width: 40,
    height: 40,
  },
});
