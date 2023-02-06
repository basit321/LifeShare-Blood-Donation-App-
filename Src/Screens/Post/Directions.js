import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import MapView, { Circle, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import * as Location from "expo-location";
import Headersub from "../../Components/Headersub";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import Typography from "../../utils/Typography";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../Components/Button";
import TravelModal from "./Traveldetails";
import MapViewDirections from "react-native-maps-directions";
import { useFocusEffect } from "@react-navigation/native";
import { Url } from "@env";
import { UseNotifications } from "../../Components/useNotification";

import axios from "axios";
const Directions = ({ route, navigation }) => {
  const { lat, long, postid } = route.params;
  const { sendNotification } = UseNotifications();
  const Navigation = useNavigation();
  const mapRef = React.createRef();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [travelmodel, settravelmodel] = useState(false);
  const [receverdata, setreceverdata] = useState({});
  const [donordata, setdonordata] = useState({});

  const [data, setdata] = useState();
  const [show, setshow] = useState(true);
  const [region, setregion] = useState({
    longtitude: long,
    latitude: lat,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
    name: "Your Current Location",
  });
  const origin = { latitude: lat, longitude: long };

  const destination = {
    latitude: receverdata.lat,
    longitude: receverdata.long,
  };
  const getreadys = async (result) => {
    let datas = await result;
    setdata(datas);
    console.log(data);
    settravelmodel(true);
  };

  const mapping = [
    {
      id: "1",
      long: origin.longitude,
      lat: origin.latitude,
      color: "red",
      name: "Your Current location",
    },
    {
      id: "2",
      long: destination.longitude,
      lat: destination.latitude,
      color: "green",
      name: "Your Destination location",
    },
  ];
  let apiKey = "AIzaSyDke-VqfVjNOppylUpwX96YzOFWsIJ115Y";
  useFocusEffect(
    useCallback(() => {
      getuserdetails();
    }, [])
  );
  const getuserdetails = async () => {
    axios
      .get(`${Url}/postinfo/${postid}`)
      .then((res) => {
        console.log(res.data);
        setreceverdata(res.data);
        getdonordata();
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      });
  };
  const getdonordata = async () => {
    await AsyncStorage.getItem("@Storedata")
      .then(async (value) => {
        if (value !== null) {
          const jsonValue = JSON.parse(value);
          let info = await jsonValue;

          setdonordata(info);

          console.log(info);
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      })
      .finally((e) => {
        setshow(false);
      });
  };

  const onMapLoad = () => {
    mapRef.current.animateToRegion(
      {
        longtitude: region.location,
        latitude: region.latitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      1000
    );
  };
  const notification = (token) => {
    settravelmodel(false);
    if (token == null) {
      Alert.alert("Something went wrong");
      setshow(false);
    } else {
      const title = "Request Accepted";

      const body =
        "Hey" +
        " " +
        donordata.results.name +
        " " +
        "Accepted your request for blood donation";
      sendNotification(token, title, body)
        .then((res) => {
          Alert.alert("Process Completed", "Your are ready to donate blood", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Network Error");
          setshow(false);
        });
    }
  };

  const getdata = async (id) => {
    setshow(true);
    axios
      .get(`${Url}/Userinfo/${id}`)
      .then((res) => {
        Mobilenotifcation(id);
        notification(res.data.results.token);
      })
      .catch((e) => {
        Alert.alert("Network Error");
        setshow(false);
      });
  };
  const Mobilenotifcation = async (id) => {
    const data = {
      id: id,
      title: "Accpeted your request for blood donation",
      Pic: donordata.results.pictrue,
      userid: donordata.results._id,
    };
    const adddata = {
      Notification: [data],
    };
    axios
      .post(`${Url}/Addnotification`, adddata)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        Alert.alert("Network Error");
        setshow(false);
      });
  };
  const donate = () => {
    settravelmodel(false);
    const data = {
      accepted: true,
      acceptedby: [donordata],
    };
    axios
      .patch(`${Url}/updatepost/${postid}`, data)
      .then((res) => {
        getdata(receverdata.id);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
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
        <ActivityIndicator size="large" animating={true} color="#EA4335" />
      ) : (
        <View style={{ flex: 1 }}>
          <Headersub
            tittle="Location"
            onBackbuttonpress={() => Navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <MapView
              style={styles.container}
              ref={mapRef}
              region={{
                latitude: region.latitude,
                longitude: region.longtitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
              provider={MapView.PROVIDER_GOOGLE}
            >
              {mapping.map((item) => (
                <Marker
                  key={item.id}
                  coordinate={{
                    latitude: item.lat,
                    longitude: item.long,
                  }}
                  title={item.name}
                  pinColor={item.color}
                />
              ))}
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={apiKey}
                strokeWidth={3}
                strokeColor="hotpink"
                onStart={(params) => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`
                  );
                }}
                onReady={(result) => {
                  getreadys(result);
                  console.log(result.fares);
                }}
              />
            </MapView>
            <Button
              style={styles.Button}
              tittle="Ready To Donate"
              onPress={() => donate()}
            />
          </View>
        </View>
      )}
      {travelmodel ? (
        <TravelModal
          isVisible={travelmodel}
          onClose={() => settravelmodel(false)}
          onChangeText={data.distance}
          onChangeText1={data.duration}
        />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Directions;
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
    width: "50%",
    height: 40,
  },
});
