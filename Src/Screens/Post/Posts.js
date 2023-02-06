import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Textt,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header";
import DrawerModal from "../../Components/Drawer";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { Requests } from "../Dumydata/Data";
import { FloatingAction } from "react-native-floating-action";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Emtyfile from "../../Components/Emtyfile";
import Noitificationbar from "../../Components/Notificationbar";

import { Url } from "@env";
import { Image } from "@rneui/themed";

const Posts = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [longitude, setlongtitude] = useState();
  const [latitude, setlatitude] = useState();
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState([]);
  const [internetCheck, setInternetCheck] = useState(0);
  const [id, setid] = useState("");

  const [Shownotificationbar, setShownotificationbar] = useState(false);

  const [box, setbox] = useState({
    id: "",
  });

  const [drawershow, setdrawershow] = useState(false);
  const actions = [
    {
      text: "Make A New Request",
      icon: (
        <Ionicons name="analytics-outline" size={24} color={Colors.white} />
      ),
      name: "CreateNewPost",
      position: 1,
      backgroundColor: Colors.Pink,
    },
  ];
  useFocusEffect(
    useCallback(() => {
      setInternetCheck(internetCheck + 1);
      getuserregion();
    }, [])
  );

  const getuserregion = async () => {
    setloading(false);
    const isAndroid = Platform.OS == "android";

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
      }).then({});

      console.log(location);
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
      setlongtitude(long);
      setlatitude(lat);
      console.log(lat);
      getuserdata();
    }
  };
  const getuserdata = async () => {
    await AsyncStorage.getItem("@Storedata")
      .then(async (value) => {
        if (value !== null) {
          const jsonValue = JSON.parse(value);
          let info = await jsonValue;

          setid(info.results._id), console.log(info.results._id);
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      });

    await axios
      .get(`${Url}/getposts`)
      .then(async (res) => {
        // console.log(res.data);
        const sorting = res.data.sort((a, b) => {
          console.log(a.Date, b.Date);
          const dateA = new Date(a.Date);
          const d = dateA.getDate();
          console.log(d);
          const dateB = new Date(b.Date);
          const currentDate = new Date().getDate();

          return currentDate - b.date - (currentDate - a.date);
        });

        console.log(sorting);

        setdata(res.data);
        setloading(true);
      })
      .catch((err) => {
        // Alert.alert("Something went wrong");
        console.log(err);
        setloading(true);
      });
  };
  const Handleonpresss = (id) => {
    setbox({ id: id });
    console.log(box);
  };
  const getremovepost = (id) => {
    setloading(false);
    axios
      .delete(`${Url}/deletepost/${id}`)
      .then((res) => {
        console.log(res.data);
        Alert.alert("Post Deleted");
        setInternetCheck(internetCheck + 1);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setloading(true);
      });
  };
  useEffect(() => {
    getuserregion();
  }, [internetCheck]);
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        tittle="Posts"
        Drawer={() => setdrawershow(true)}
        Notifications={() => setShownotificationbar(true)}
      />
      {loading ? (
        <View style={styles.subview}>
          <Text style={styles.text2}>Active Blood Requests</Text>

          <FlatList
            data={data}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: "25%" }}
            ListEmptyComponent={<Emtyfile Tittle={"No Posts Available"} />}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.Box}
                  activeOpacity={1}
                  onPress={() => {
                    setbox({ id: "" });
                  }}
                >
                  <ScrollView style={{ flex: 1 }}>
                    <View style={styles.line}>
                      <View style={styles.subcont}>
                        <Image
                          containerStyle={styles.image}
                          source={{
                            uri: item.pictrue,
                          }}
                          PlaceholderContent={
                            <View
                              style={{
                                ...styles.image,
                                justifyContent: "center",
                                backgroundColor: Colors.white,
                              }}
                            >
                              <ActivityIndicator
                                size="large"
                                color={Colors.Pink}
                              />
                            </View>
                          }
                          resizeMode="contain"
                        />

                        <Text style={{ ...styles.text, flexWrap: "wrap" }}>
                          {item.name} Required {item.Bloodtype} {item.Request}{" "}
                          At
                          {"\n"}
                          <Text
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {item.hospital}
                            {" ,"} {item.city}
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        ...styles.text,
                        color: Colors.black,
                        width: "95%",
                      }}
                    >
                      {item.Description}
                    </Text>
                    <MapView
                      style={{
                        width: "100%",
                        height: 150,
                      }}
                      region={{
                        latitude: item.lat,
                        longitude: item.long,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      provider={MapView.PROVIDER_GOOGLE}
                    >
                      <MapView.Marker
                        coordinate={{
                          latitude: item.lat,
                          longitude: item.long,
                        }}
                        pinColor={"red"}
                        title={item.hospital}
                      />
                    </MapView>
                    <View
                      style={{
                        height: 60,
                        borderBottomWidth: 1,
                        borderColor: Colors.LightGray,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          width: "95%",
                          marginLeft: "auto",
                          marginRight: "auto",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={styles.text3}>{item.Bloodtype}</Text>
                          <Image
                            style={{ height: "100%", marginLeft: "2%" }}
                            source={require("../../Images/line.png")}
                          />
                          {item.Urgent === false ? (
                            <Text
                              style={{
                                ...styles.text4,
                                ...Platform.select({
                                  android: {
                                    fontWeight: "bold",
                                  },
                                }),
                              }}
                            >
                              {item.Bloodtype} blood donnor needed
                            </Text>
                          ) : (
                            <Text
                              style={{
                                ...styles.text4,
                                ...Platform.select({
                                  android: {
                                    fontWeight: "bold",
                                    fontSize: 13,
                                  },
                                }),
                              }}
                            >
                              {item.Bloodtype} blood Urgently needed
                            </Text>
                          )}
                        </View>
                        {item.id == id ? (
                          <View></View>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("Directions", {
                                lat: latitude,
                                long: longitude,
                                postid: item._id,
                              })
                            }
                          >
                            <Text style={styles.text6}>Accept Request</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTopWidth: 1,
                        borderColor: Colors.LightGray,
                        borderBottomWidth: 1,
                        height: 40,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: "1%",
                        }}
                      >
                        <Entypo name="location-pin" size={24} color="black" />
                        <Text
                          style={{
                            fontSize: 17,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            fontStyle: "italic",
                          }}
                        >
                          {item.city}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("PostDetails", {
                            id: item._id,
                            userid: id,
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#A41616",
                            fontFamily: Typography.Text,
                            marginRight: "3%",
                            textDecorationLine: "underline",
                          }}
                        >
                          Click here to find the details
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.text7,
                          fontSize: 17,
                          marginLeft: "3%",
                          fontStyle: "italic",
                          color: "#858181",
                        }}
                      >
                        This post is created on
                      </Text>
                      <Text
                        style={{
                          ...styles.text7,
                          fontSize: 15,

                          fontStyle: "italic",
                          marginRight: "3%",
                        }}
                      >
                        {item.Date}
                      </Text>
                    </View>
                  </ScrollView>
                </TouchableOpacity>
                {item.id == id ? (
                  <View
                    style={{
                      right: 0,
                      marginRight: "2%",
                      top: 30,
                      position: "absolute",
                    }}
                  >
                    <TouchableOpacity
                      onPressIn={() => Handleonpresss(item._id)}
                    >
                      <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                    {box.id == item._id ? (
                      <TouchableOpacity
                        style={{
                          width: 150,
                          height: 100,
                          borderRadius: 10,
                          backgroundColor: "rgba(184,181,181,0.7)",
                          position: "absolute",
                          right: 20,
                          top: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        activeOpacity={1}
                        onPress={() => setbox({ id: "" })}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setbox({ id: "" });
                            navigation.navigate("EditPost", {
                              data: item,
                            });
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: Typography.Text,
                              color: "green",
                              textDecorationLine: "underline",
                            }}
                          >
                            Edit Post
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setbox({ id: "" });
                            Alert.alert(
                              "Delete Post?",
                              "Your post will be delete if you confirm.",
                              [
                                {
                                  text: "keep post on the timeline",
                                  onPress: () => {},
                                },
                                {
                                  text: "Yes, delete post",
                                  onPress: () => getremovepost(item._id),
                                  style: "cancel",
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: Typography.Text,
                              color: Colors.Red,
                              textDecorationLine: "underline",
                              marginTop: "2%",
                            }}
                          >
                            Delete Post
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
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

      <DrawerModal
        Show={drawershow}
        onClose={() => setdrawershow(false)}
        MyTeams={() => {
          setdrawershow(false), navigation.navigate("MyTeam");
        }}
        MYDonationHistory={() => {
          setdrawershow(false), navigation.navigate("MYDonationHistory");
        }}
        OnnextClose={setdrawershow}
        navigation={navigation}
      />
      <Noitificationbar
        Show={Shownotificationbar}
        onClose={() => setShownotificationbar(false)}
        navigation={navigation}
        OnnextClose={setShownotificationbar}
      />

      <FloatingAction
        actions={actions}
        buttonSize={60}
        color={Colors.Pink}
        onPressItem={(name) => {
          navigation.navigate(name, {
            lat: latitude,
            long: longitude,
          });
        }}
      />
    </View>
  );
};

export default Posts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  subview: {
    flex: 1,
  },
  text2: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginTop: "5%",
    alignSelf: "center",
    textAlign: "center",
  },
  text7: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  Box: {
    width: "95%",

    shadowColor: "#000",
    marginTop: "5%",
    borderRadius: 15,
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    alignSelf: "center",
  },
  line: {
    width: "100%",
    height: 80,
    borderBottomWidth: 1,
    justifyContent: "center",
    borderColor: Colors.LightGray,
  },
  subcont: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 70,

    borderWidth: 2,
    borderColor: "#858181",
    alignSelf: "center",
  },
  text: {
    fontSize: 15,
    color: "#908787",
    fontFamily: Typography.Text,
    marginLeft: "2%",
    width: "75%",
    lineHeight: 19,
    marginTop: "3%",
  },
  text3: {
    fontSize: 30,
    color: "#D14242",
    fontFamily: Typography.Text,
  },
  text4: {
    fontSize: 15,
    color: "#908787",
    fontFamily: Typography.Text,
    marginLeft: "5%",
    marginTop: "auto",
    marginBottom: "auto",
    fontWeight: "bold",
  },
  text6: {
    fontSize: 15,
    color: "#267E06",
    fontFamily: Typography.Text,

    fontWeight: "bold",
    marginTop: "auto",
    marginBottom: "auto",
    textDecorationLine: "underline",
  },
});
