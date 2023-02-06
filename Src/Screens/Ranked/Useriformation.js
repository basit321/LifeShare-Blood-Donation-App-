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
import Images from "../../Components/Image";

import Headersub from "../../Components/Headersub";
import {
  FontAwesome,
  Ionicons,
  Entypo,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserDetails, DonationHistroy } from "../Dumydata/Data";
import { useFocusEffect } from "@react-navigation/native";
import { Url } from "@env";
import axios from "axios";
import Emtyfile from "../../Components/Emtyfile";
const Userinformation = ({ navigation, route }) => {
  const Navigation = useNavigation();
  const { id } = route.params;
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState([]);
  const [donation, setdonation] = useState([]);
  const getData = async () => {
    axios
      .get(`${Url}/Userinfo/${id}`)
      .then(async (response) => {
        // console.log(response.data);
        let userinormation = await response.data;
        console.log(userinormation);

        setdata(userinormation);
        getrecntdonation();
      })

      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      });

    const getrecntdonation = async () => {
      axios
        .get(`${Url}/getdonnorhistorybyid/${id}`)
        .then((res) => {
          setdonation(res.data);
          console.log(res.data);
        })
        .catch((e) => {
          Alert.alert("Network Error");
        })
        .finally(() => {
          setloading(true);
        });
    };
  };
  return (
    <View style={styles.container}>
      <Headersub
        tittle="Personal Information"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {loading ? (
        <ScrollView style={{ ...styles.subview }}>
          <View style={{ flex: 1 }}>
            <View style={styles.box}>
              <View style={styles.subview}>
                <Images
                  style={styles.imageview}
                  source={{ uri: data.results.pictrue }}
                  resizeMode="contain"
                />
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome name="user" size={30} color="#fff" />
                    <Text style={styles.Text}>{data.results.name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons name="heart" size={30} color="#fff" />
                    <View style={styles.box3}>
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
                    <Text style={styles.Text}>Life Saved </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo name="home" size={25} color="#fff" />
                    <Text style={{ ...styles.Text }}>
                      {data.results.city}
                      {","}
                      {data.results.country}
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
                      {data.results.gender}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo name="phone" size={25} color="#fff" />
                    <Text style={styles.Text}>{data.results.phonenumber}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: "15%",
                    }}
                  >
                    <Fontisto name="blood-drop" size={30} color="#fff" />

                    <Text style={{ ...styles.Text, left: 3, top: 5 }}>
                      {data.results.bloodgroup}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 25,
              fontFamily: Typography.Text,
              color: Colors.black,
              marginTop: "10%",
              fontWeight: "bold",
            }}
          >
            Recent Donations
          </Text>
          {donation.length != 0 ? (
            <View>
              {donation.map((user) => (
                <View
                  style={{
                    flex: 1,
                    paddingBottom: "5%",
                    alignItems: "center",
                    marginTop: "3%",

                    borderBottomWidth: 2,
                    borderColor: Colors.LightGray,
                  }}
                  key={user._id}
                >
                  <Text style={styles.Text2}>
                    Donate{" "}
                    <Text style={{ color: "#A41616" }}>
                      {user.Reciever[0].Bloodtype} {user.Reciever[0].Accept}
                    </Text>{" "}
                    to
                  </Text>
                  <TouchableOpacity style={styles.box1} activeOpacity={1}>
                    <View
                      style={{
                        ...styles.subview,
                        alignItems: "center",
                        marginTop: "5%",
                      }}
                    >
                      <Images
                        source={{ uri: user.Reciever[0].pictrue }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 100,
                          borderWidth: 1,
                          borderColor: Colors.LightGray,
                        }}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: "2%",
                          flexWrap: "wrap",
                        }}
                      >
                        <Text style={styles.text5}>Name :</Text>
                        <Text
                          style={{
                            ...styles.text5,
                            color: Colors.Red,
                          }}
                        >
                          {" "}
                          {user.Reciever[0].name}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Blood Type:</Text>
                        <Text style={{ ...styles.text5, color: Colors.Red }}>
                          {" "}
                          {user.Reciever[0].bloodgroup}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={{}}>
              <Emtyfile
                Tittle={"No Donation History"}
                style={{ marginTop: "20%" }}
              />
            </View>
          )}
        </ScrollView>
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

export default Userinformation;
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

  box: {
    width: "100%",
    height: 250,
    marginTop: "10%",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    backgroundColor: Colors.Pink,
  },
  box3: {
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
  imageview: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: "5%",
    borderWidth: 3,
    borderColor: "#858181",
  },

  Button: {
    marginVertical: "10%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
  },
  Text: {
    fontSize: 15,
    fontFamily: Typography.Text,
    color: "#fff",
    marginLeft: "3%",
    top: 3,
  },
  Text2: {
    fontSize: 18,
    fontFamily: Typography.Text,
    color: Colors.black,
    flexWrap: "wrap",
  },
  box1: {
    width: "90%",

    borderRadius: 15,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: "1%",
    marginTop: "5%",
  },
  text: {
    fontSize: 20,
    color: "#908787",
    fontFamily: Typography.Text,
    marginLeft: "2%",
    width: "90%",
    lineHeight: 30,
    marginTop: "5%",
  },
});
