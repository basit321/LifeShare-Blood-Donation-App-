import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import MapView, { Circle, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import * as Location from "expo-location";
import Headersub from "../../Components/Headersub";

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Button from "../../Components/Button";

const BloodBanks = ({ route }) => {
  const Navigation = useNavigation();
  const { lat, long } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [datas, setdata] = useState(null);
  const [show, setshow] = useState(true);
  const [longitude, setlongtitude] = useState("");
  const [latitude, setlatitude] = useState("");
  let apiKey = "AIzaSyCnYuwV3yzOQepVIMM1ilJN-l7sTPBoKSo";
  console.log(lat, long);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

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
    })();
  }, []);

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "center",
      }}
    >
      {show ? (
        <ActivityIndicator size="large" animating={true} color="#EA4335" />
      ) : (
        <View style={{ flex: 1 }}>
          <Headersub
            tittle="BloodBanks"
            onBackbuttonpress={() => Navigation.goBack()}
          />
          <MapView
            style={styles.container}
            followUserLocation={true}
            showsUserLocation
            showsTraffic={true}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            provider={MapView.PROVIDER_GOOGLE}
          >
            {datas.results.map((marker) => (
              <MapView.Marker
                coordinate={{
                  latitude: marker.geometry.location.lat,
                  longitude: marker.geometry.location.lng,
                }}
                pinColor={"red"}
                title={marker.name}
              ></MapView.Marker>
            ))}
          </MapView>
          <Button
            tittle="Procced to Post"
            onPress={() => Navigation.navigate("Posts")}
            style={{ ...styles.button }}
          />
        </View>
      )}
    </View>
  );
};

export default BloodBanks;
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
  button: {
    position: "absolute",
    bottom: 0,
    bottom: 10,
  },
});
