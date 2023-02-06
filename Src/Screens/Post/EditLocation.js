import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import MapView, { Circle, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Url } from "@env";

import * as Location from "expo-location";
import Headersub from "../../Components/Headersub";

import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../utils/Typography";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../Components/Button";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const EditLocation = ({ route }) => {
  const { id, post, lat, long, names } = route.params;

  useFocusEffect(
    useCallback(() => {
      getuserlocation();
    }, [])
  );
  const Navigation = useNavigation();
  const mapRef = React.createRef();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [name, setname] = useState(names);

  const [data, setdata] = useState("");
  const [show, setshow] = useState(true);
  const [region, setregion] = useState({
    longtitude: long,
    latitude: lat,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
    tittle: "Your Current Location",
  });
  let apiKey = "AIzaSyDke-VqfVjNOppylUpwX96YzOFWsIJ115Y";

  const getuserlocation = async () => {
    const isAndroid = Platform.OS == "android";
    let { status } = await Location.requestForegroundPermissionsAsync({
      accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
    });
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    Alert.alert(
      "ChangeLocation!",
      "Do you want to change your location?",
      [
        {
          text: "Yes, change location",
          onPress: async () => {
            setshow(true);
            let location = await Location.getCurrentPositionAsync({});
            setregion({
              latitude: location.coords.latitude,
              longtitude: location.coords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
              tittle: "Your Current Location",
            });
            setname("Your Current Location");
            setshow(false);
          },
        },
        {
          text: "No, keep current location",
          onPress: () => {
            CreatePost();
          },
          style: "cancel",
        },
      ],
      { cancelable: false }
    );

    console.log(region);
    setshow(false);
  };

  // const onMapLoad = () => {
  //   mapRef.current.animateToRegion(
  //     {
  //       longtitude: region.location,
  //       latitude: region.latitude,
  //       latitudeDelta: 0.015,
  //       longitudeDelta: 0.015,
  //     },
  //     1000
  //   );
  // };

  const CreatePost = () => {
    setshow(true);
    const data = {
      ...post,
      hospital: name,
      lat: region.latitude,
      long: region.longtitude,
    };
    axios
      .patch(`${Url}/updatepost/${id}`, data)
      .then((res) => {
        console.log(res.data);
        Alert.alert("Post Updated");
        Navigation.navigate("Posts");
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setshow(false);
      });
    console.log(data);
  };

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "center",
      }}
    >
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
          <Headersub
            tittle="Location"
            onBackbuttonpress={() => Navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
              placeholder=" 🔍 Search Location"
              fetchDetails={true}
              GooglePlacesSearchQuery={{
                rankby: "distance",
              }}
              textInputProps={{
                placeholderTextColor: "black",
              }}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                // console.log(details);
                mapRef.current.animateToRegion(
                  {
                    longtitude: details.geometry.location.lng,
                    latitude: details.geometry.location.lat,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  },
                  100000
                );
                setregion({
                  longtitude: details.geometry.location.lng,
                  latitude: details.geometry.location.lat,
                });
                setname(details.name);
              }}
              query={{
                key: apiKey,
                language: "en",
                types: "establishment",
                radius: 8000,
                location: `${region.latitude},${region.longtitude}`,
              }}
              styles={{
                container: {
                  flex: 0,
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                },
                textInput: {
                  fontSize: 15,
                  color: Colors.black,
                  fontFamily: Typography.Text,
                },
              }}
            />
            <MapView
              style={styles.container}
              ref={mapRef}
              region={{
                latitude: region.latitude,
                longitude: region.longtitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              // onMapReady={onMapLoad}
              provider={MapView.PROVIDER_GOOGLE}
            >
              <Marker
                draggable={true}
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longtitude,
                }}
                onDragStart={(e) => {
                  console.log("drag new location", e.nativeEvent.coordinate);
                }}
                onDragEnd={(e) => {
                  setregion({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longtitude: e.nativeEvent.coordinate.longitude,
                  }),
                    console.log(region);
                }}
                // title={region.tittle}
              >
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: Colors.white,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#A41616",
                        fontFamily: Typography.Bold,
                      }}
                    >
                      {name}
                    </Text>
                  </View>
                  <Ionicons
                    name="ios-location-sharp"
                    size={30}
                    color="#A41616"
                  />
                </View>
              </Marker>
            </MapView>
            <Button
              tittle="Select location"
              style={styles.Button}
              Textstyle={{ fontSize: 20 }}
              onPress={() => CreatePost()}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default EditLocation;
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
  Button: {
    position: "absolute",
    bottom: 0,
    marginBottom: "5%",
    width: "70%",
  },
});
