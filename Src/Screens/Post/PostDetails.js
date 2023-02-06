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

import { useFocusEffect } from "@react-navigation/native";
import Headersub from "../../Components/Headersub";
import {
  FontAwesome,
  Ionicons,
  Entypo,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../../Components/Button";
import MapView from "react-native-maps";

import { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserDetails } from "../Dumydata/Data";
import axios from "axios";
import { Url } from "@env";
import { Image } from "@rneui/themed";
const PostDetails = ({ route }) => {
  const [data, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const { id, userid } = route.params;

  const Navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      getuserdetails();
    }, [])
  );
  const getuserdetails = async () => {
    axios
      .get(`${Url}/postinfo/${id}`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
        setloading(true);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      });
  };

  return (
    <View style={styles.container}>
      <Headersub
        tittle="Description"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {loading ? (
        <ScrollView style={styles.subview}>
          <View style={{ flex: 1 }}>
            <View style={styles.box}>
              <View style={styles.subview}>
                <Image
                  containerStyle={styles.imageview}
                  source={{ uri: data.pictrue }}
                  resizeMode="contain"
                />
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <FontAwesome name="user" size={30} color="#fff" />
                    <Text style={styles.Text}>{data.name}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Ionicons name="heart" size={30} color="#fff" />
                    <View style={styles.box1}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#fff",
                          fontFamily: Typography.Bold,
                        }}
                      >
                        {data.lifesaved}
                      </Text>
                    </View>
                    <Text style={styles.Text}>Life Saved </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo name="home" size={25} color="#fff" />
                    <Text style={{ ...styles.Text }}>Lahore,Pakistan</Text>
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

                    <Text style={{ ...styles.Text }}>{data.gender}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flexDirection: "row" }}>
                    <Entypo name="phone" size={25} color="#fff" />
                    <Text style={styles.Text}>{data.phonenumber}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: "17%",
                    }}
                  >
                    <Fontisto name="blood-drop" size={30} color="#fff" />

                    <Text style={{ ...styles.Text, left: 3, top: 5 }}>
                      {data.bloodgroup}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                marginTop: "5%",
              }}
            >
              <Text style={{ ...styles.text }}>
                ➢ Qunatity of blood: {data.Qunatity} bottles
              </Text>
            </View>
            {data.Urgent == true ? (
              <View>
                <Text style={{ ...styles.text }}>
                  ➢ Surgery: {data.SurgeryType}
                </Text>
                <Text style={{ ...styles.text }}>
                  ➢ SurgeryType: {data.Specific}
                </Text>
              </View>
            ) : null}
            <Text style={{ ...styles.text, includeFontPadding: false }}>
              ➢ Required {data.Bloodtype} {data.Request} At
              {"\n"}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {"    "}
                {data.hospital}
                {" ,"} {data.city}
              </Text>
            </Text>
            <MapView
              style={{
                width: "100%",
                height: 250,
                borderRadius: 20,
              }}
              followUserLocation={true}
              region={{
                latitude: data.lat,
                longitude: data.long,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              provider={MapView.PROVIDER_GOOGLE}
            >
              <MapView.Marker
                coordinate={{ latitude: data.lat, longitude: data.long }}
                pinColor={"red"}
                title={data.hospital}
              />
            </MapView>
            {data.id == userid ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  tittle="Nearby Users"
                  style={styles.Button}
                  onPress={() =>
                    Navigation.navigate("NerbyUsers", {
                      lat: data.lat,
                      long: data.long,
                      bloodgroup: data.Bloodtype,
                      id: data.id,
                    })
                  }
                />
                <Button
                  tittle="Nearby Blood Banks"
                  style={styles.Button}
                  onPress={() =>
                    Navigation.navigate("NearbyBloodBanks", {
                      lat: data.lat,
                      long: data.long,
                    })
                  }
                />
              </View>
            ) : null}
          </View>
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

export default PostDetails;
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
    width: "40%",
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
  box1: {
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
  text: {
    fontSize: 20,
    color: "#908787",
    fontFamily: Typography.Text,
    marginLeft: "2%",
    width: "90%",
    lineHeight: 30,
  },
});
