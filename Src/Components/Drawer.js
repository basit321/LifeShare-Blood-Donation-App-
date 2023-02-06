import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Images from "./Image";
import {
  FontAwesome,
  Ionicons,
  Entypo,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Modal from "react-native-modal";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { Alert } from "react-native";

const DrawerModal = ({
  navigation,
  Show,
  onClose,

  OnnextClose,

  setShow,
}) => {
  const [data, setdata] = useState({});

  const [loading, setloading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    await AsyncStorage.getItem("@lifeShare")
      .then(async (value) => {
        if (value !== null) {
          const jsonValue = JSON.parse(value);
          let info = await jsonValue;

          setdata(info);
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
  const Logout = async () => {
    await AsyncStorage.removeItem("@lifeShare")

      .then((e) => {})
      .catch((e) => {
        console.log(e);
      });
    await AsyncStorage.setItem("islogin", "");

    OnnextClose(false);

    navigation.navigate("Landingpage");
  };
  const MyRequests = () => {
    OnnextClose(false);
    navigation.navigate("MyRequests", {
      id: data.userdata._id,
    });
  };
  const MyTeams = () => {
    OnnextClose(false);
    navigation.navigate("MyTeam", {
      email: data.userdata.email,
    });
  };
  const MYDonationHistory = () => {
    OnnextClose(false);

    navigation.navigate("MYDonationHistory", {
      id: data.userdata._id,
    });
  };
  return (
    <Modal
      isVisible={Show}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      animationOutTiming={500}
      statusBarTranslucent={true}
      style={{ flex: 1, margin: 0 }}
    >
      <View style={{ ...styles.modalContent }}>
        {loading ? (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <ScrollView style={styles.subiew}>
                <Images
                  style={styles.image}
                  source={{
                    uri: data.userdata.pictrue,
                  }}
                  resizeMode="contain"
                />
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: "2%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <FontAwesome name="user" size={30} color="#fff" />
                    <Text style={styles.Text}>{data.userdata.name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons name="heart" size={30} color="#fff" />
                    <View style={styles.box}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#fff",
                          fontFamily: Typography.Bold,
                        }}
                      >
                        {data.userdata.lifesaved}
                      </Text>
                    </View>
                    <Text style={styles.Text}>Life Saved </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: "2%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Entypo name="home" size={25} color="#fff" />
                    <Text style={{ ...styles.Text }}>
                      {data.userdata.city},{data.userdata.country}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: "12%",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="gender-male-female"
                      size={30}
                      color={Colors.white}
                    />

                    <Text style={{ ...styles.Text }}>
                      {data.userdata.gender}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginTop: "2%",
                  }}
                >
                  <Entypo name="phone" size={25} color="#fff" />
                  <Text style={{ ...styles.Text, marginLeft: "2%" }}>
                    {data.userdata.phonenumber}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginTop: "2%",
                  }}
                >
                  <Fontisto name="blood-drop" size={30} color="#fff" />
                  <Text style={{ ...styles.Text, marginLeft: "2%" }}>
                    {data.userdata.bloodgroup}
                  </Text>
                </View>
              </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.postview}
                onPress={() => MyTeams()}
                activeOpacity={1}
              >
                <Text style={styles.heading}>My Teams</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postview}
                activeOpacity={1}
                onPress={() => MyRequests()}
              >
                <Text style={styles.heading}>My Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postview}
                activeOpacity={1}
                onPress={() => MYDonationHistory()}
              >
                <Text style={styles.heading}>Donation History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.postview,
                  marginTop: "auto",
                  marginBottom: "10%",
                  borderBottomWidth: 0,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={1}
                onPress={() => Logout()}
              >
                <MaterialIcons
                  name="logout"
                  size={30}
                  color="black"
                  style={{ marginLeft: "5%" }}
                />
                <Text style={{ ...styles.heading, marginLeft: "2%" }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.Pink} />
            <Text style={styles.text1}>Please Wait ......</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default DrawerModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    width: "80%",
  },
  header: {
    flex: 0.6,
    backgroundColor: Colors.Pink,
  },
  subiew: {
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 70,
    marginTop: "20%",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#858181",
  },
  Text: {
    fontSize: 15,
    fontFamily: Typography.Text,
    color: "#fff",
    marginLeft: "5%",
  },
  box: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 30,
    position: "absolute",
    top: 3,
    left: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  postview: {
    borderBottomWidth: 1,
    borderColor: Colors.LightGray,
    marginTop: "5%",
    paddingBottom: "2%",
  },
  heading: {
    fontSize: 25,
    fontFamily: Typography.Text,
    color: Colors.black,
    marginLeft: "5%",
  },
  text1: {
    fontSize: 19,
    fontFamily: Typography.Text,
    color: Colors.black,
    textAlign: "center",
    marginTop: "5%",
  },
});
