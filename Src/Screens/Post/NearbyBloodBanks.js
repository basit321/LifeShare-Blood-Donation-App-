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
import Emtyfile from "../../Components/Emtyfile";

const NearbyBloodBanks = ({ navigation, route }) => {
  const { lat, long } = route.params;
  const Navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [longitude, setlongtitude] = useState("");
  const [latitude, setlatitude] = useState("");

  const [show, setshow] = useState(true);
  const [km, setkm] = useState(3000);
  let apiKey = "AIzaSyCnYuwV3yzOQepVIMM1ilJN-l7sTPBoKSo";
  const getbloodbanks = async () => {
    // let location = await Location.getCurrentPositionAsync({});
    // setLocation(location);
    // console.log(location);
    // let lat = location.coords.latitude;
    // let long = location.coords.longitude;
    setlongtitude(long);
    setlatitude(lat);

    // const timer = setTimeout(() => {
    //   console.log("This will run after 2 second!");

    const url =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
      "location=" +
      lat +
      "," +
      long +
      "&radius=2000&type=hospital&key=AIzaSyDke-VqfVjNOppylUpwX96YzOFWsIJ115Y";
    fetch(url)
      .then((response) => response.json())
      .then(async (JsonResponse) => {
        const fetchedBloodbanks = await JsonResponse;
        // const fetchdetails = {
        //   lattitude: fetchedBloodbanks.results[0].geometry.location.lat,
        //   longitude: fetchedBloodbanks.results[0].geometry.location.lat,
        // };
        // console.log(fetchedBloodbanks);
        // console.log(fetchdetails);
        setdata(fetchedBloodbanks);
        setshow(false);
        console.log(fetchedBloodbanks);
      })
      .catch((error) => {
        console.log(error);
      });

    // }, 2000);
    // return () => clearTimeout(timer);
  };

  useFocusEffect(
    useCallback(() => {
      getbloodbanks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Headersub
        tittle="Nearby Blood Banks"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {!show ? (
        <ScrollView style={{ ...styles.subview, paddingBottom: "10%" }}>
          <Text style={styles.text2}> Nearby Blood Banks </Text>
          {!data.results.length == 0 ? (
            <View>
              {data.results.map((item) => (
                <View style={styles.box1}>
                  <View style={styles.subview}>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        borderRadius: 50,
                        marginTop: "2%",
                      }}
                      source={{ uri: item.icon }}
                      resizeMode="contain"
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "5%",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.text5}>Name :</Text>
                      <Text
                        style={{
                          ...styles.text5,
                          color: Colors.black,
                          width: "80%",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Emtyfile Tittle={"No Blood Banks Found"} />
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
      <Button
        tittle="Check Location of  Blood Banks"
        onPress={() =>
          Navigation.navigate("BloodBanks", { lat: lat, long: long })
        }
        style={{ ...styles.button }}
      />
    </View>
  );
};

export default NearbyBloodBanks;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  button: {},
});
