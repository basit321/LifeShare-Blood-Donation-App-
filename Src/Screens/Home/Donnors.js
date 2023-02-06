import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Textt,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import Header from "../../Components/Header";
import DrawerModal from "../../Components/Drawer";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { Requests } from "../Dumydata/Data";
import { FloatingAction } from "react-native-floating-action";
import MapView from "react-native-maps";
import Headersub from "../../Components/Headersub";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { Url } from "@env";
import { getDistance, getPreciseDistance } from "geolib";
import RadioButtonRN from "radio-buttons-react-native";
import Button from "../../Components/Button";
import * as Animatable from "react-native-animatable";
import { UseNotifications } from "../../Components/useNotification";
import Icons from "../../Components/Icons";
import Emtyfile from "../../Components/Emtyfile";

const Donors = ({ navigation, route }) => {
  const { lat, long, id } = route.params;

  const Navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [datas, setdatas] = useState([]);
  const [show, setshow] = useState(true);
  const [km, setkm] = useState(3000);
  const [call, setcall] = useState();
  const { sendNotification } = UseNotifications();
  const [internetCheck, setInternetCheck] = useState(0);

  let date;
  let datecheck;
  const Type = [
    {
      label: "10Km",
      km: 10000,
    },
    {
      label: "20Km",
      km: 20000,
    },
    {
      label: "30Km",
      km: 30000,
    },
  ];
  useFocusEffect(
    useCallback(() => {
      getuserdata();
    }, [internetCheck, 1])
  );

  const getuserdata = async () => {
    axios
      .get(`${Url}/getusers`)
      .then(async (res) => {
        await setdata(res.data);
        const closest = data.map((station) => {
          return {
            ...station,
            dist: getDistance(
              { latitude: lat, longitude: long },
              { latitude: station.lat, longitude: station.long }
            ),
          };
        });

        const Check = closest.map((item) => {
          let recomended;

          if (item.lastbleed == "None") {
            recomended = "Recomended";
          } else {
            const d = new Date(item.lastbleed);
            const month = d.getMonth();
            const nextmonth = month + 3;
            if (month == nextmonth) {
              recomended = "Recomended";
            } else {
              recomended = "Not recomended";
            }
          }

          return {
            ...item,
            recomended: recomended,
          };
        });

        setdatas(Check);
        setInternetCheck(internetCheck + 1);

        setshow(false);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Headersub
        tittle="Nearby Donors"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {datas.length >= 1 ? (
        <ScrollView style={styles.subview}>
          <Text style={styles.text2}>Nearby Donors</Text>

          <RadioButtonRN
            data={Type}
            selectedBtn={(e) => {
              console.log(e.label);
              setkm(e.km);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            boxStyle={{ width: "30%" }}
            textStyle={{ ...styles.text9 }}
          />

          {datas.filter((item) => item.dist < km && item._id != id).length >=
          1 ? (
            datas
              .filter((item) => item.dist < km && item._id != id)
              .map((item) => (
                <View style={{ flex: 1 }}>
                  <View style={styles.box1}>
                    <View style={styles.subview}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: item.pictrue,
                        }}
                        resizeMode="contain"
                      />
                      {item.Status == "Verified" ? (
                        <View
                          style={{
                            position: "absolute",
                            marginLeft: "55%",
                            marginTop: "20%",
                          }}
                        >
                          <Icons />
                        </View>
                      ) : null}

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Name :</Text>
                        <Text style={{ ...styles.text5, color: Colors.black }}>
                          {" "}
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Blood Type:</Text>
                        <Text style={{ ...styles.text5, color: Colors.black }}>
                          {" "}
                          {item.bloodgroup}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Email :</Text>
                        <Text style={{ ...styles.text5, color: Colors.black }}>
                          {" "}
                          {item.email}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Phone number:</Text>
                        <Text style={{ ...styles.text5, color: Colors.black }}>
                          {" "}
                          {item.phonenumber}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.text5}>Last bleed:</Text>
                        <Text style={{ ...styles.text5, color: Colors.black }}>
                          {" "}
                          {item.lastbleed}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: "2%", marginLeft: "6%" }}>
                    <Animatable.Text
                      animation="bounceInLeft"
                      duration={3000}
                      style={styles.error}
                    >
                      {item.recomended}
                    </Animatable.Text>
                  </View>
                </View>
              ))
          ) : (
            <View>
              <Emtyfile Tittle={"No user found"} />
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

export default Donors;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: "2%",
  },
  subview: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  text2: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginTop: "5%",
    alignSelf: "center",
    textAlign: "center",
  },

  subcont: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
  },
  text3: {
    fontSize: 20,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "5%",
  },
  tittle1: {
    fontSize: 20,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "2%",
    textAlign: "center",
  },

  imageview: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: "2%",
  },
  box1: {
    width: "90%",

    borderRadius: 10,
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
    marginTop: "5%",
    paddingBottom: "2%",
  },
  text: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Typography.Text,

    marginTop: "3%",
    alignSelf: "center",
  },
  input: {
    width: "100%",
  },
  text5: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  text9: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "20%",
  },
  button: {
    position: "absolute",
    bottom: 0,
    marginBottom: "1%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 70,

    borderWidth: 2,
    borderColor: "#858181",
    alignSelf: "center",
    marginTop: "5%",
  },
});
