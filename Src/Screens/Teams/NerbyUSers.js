import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import MapView, { Circle, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Users } from "../Dumydata/Data";
import axios from "axios";

import * as Location from "expo-location";
import Headersub from "../../Components/Headersub";

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../utils/Typography";

const NerbyUSers = ({ route }) => {
  const { lat, log } = route.params;
  const Navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setdata] = useState();
  const [show, setshow] = useState(true);
  const [longitude, setlongtitude] = useState("");
  const [latitude, setlatitude] = useState("");
  let apiKey = "AIzaSyCnYuwV3yzOQepVIMM1ilJN-l7sTPBoKSo";
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      setlongtitude(log);
      setlatitude(lat);

      getalldata();
      Alert.alert("Press the location tab to see the details");
    })();
  }, []);
  const getalldata = async () => {
    axios
      .get("https://life-share-backend.vercel.app/getusers")
      .then(async (res) => {
        let userdata = await res.data;
        setdata(userdata);
        console.log(userdata);
        setshow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "center",
      }}
    >
      <Headersub
        tittle="NerbyUsers"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {show ? (
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
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            style={styles.container}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            provider={MapView.PROVIDER_GOOGLE}
          >
            {data.map((item, index) => (
              <Marker
                coordinate={{ latitude: item.lat, longitude: item.long }}
                title={item.name}
                pinColor={"red"}
              >
                <MapView.Callout>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontFamily: Typography.Text,
                    }}
                  >
                    {item.name}
                    {"\n"}
                    {item.bloodgroup}
                    {"\n"}
                    {item.phonenumber}
                  </Text>
                </MapView.Callout>
              </Marker>
            ))}
          </MapView>
        </View>
      )}
    </View>
  );
};

export default NerbyUSers;
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
});
