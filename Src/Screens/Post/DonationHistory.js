import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";

import Headersub from "../../Components/Headersub";
import { FontAwesome, Ionicons, Entypo, Fontisto } from "@expo/vector-icons";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { DonationHistroy } from "../Dumydata/Data";
import { useFocusEffect } from "@react-navigation/native";
import Emtyfile from "../../Components/Emtyfile";
import axios from "axios";
import { Url } from "@env";
import Images from "../../Components/Image";
const MYDonationHistory = ({ navigation, route }) => {
  const { id } = route.params;
  const [loading, setloading] = useState(true);
  const [data, setdata] = useState([]);
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );
  const getData = async () => {
    setloading(true);
    await axios
      .get(`${Url}/getdonnorhistorybyid/${id}`)
      .then((res) => {
        setdata(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        Alert.alert("Network Error");
      })
      .finally(() => {
        setloading(false);
      });
  };
  const Navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Headersub
        tittle="Donation History"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {data.length != 0 ? (
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator
                size="large"
                animating={true}
                color="#EA4335"
              />
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
            <ScrollView style={{ ...styles.subview }}>
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
              {data.map((user) => (
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
                  <TouchableOpacity
                    style={styles.box1}
                    activeOpacity={1}
                    onPress={() => {
                      navigation.navigate("Userinformation", {
                        id: user.Reciever[0].id,
                      });
                    }}
                  >
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
            </ScrollView>
          )}
        </View>
      ) : (
        <Emtyfile Tittle="No Donation History" />
      )}
    </View>
  );
};

export default MYDonationHistory;
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
  imageview: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: "5%",
    borderWidth: 1,
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
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
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
  text5: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Typography.Text,
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
});
