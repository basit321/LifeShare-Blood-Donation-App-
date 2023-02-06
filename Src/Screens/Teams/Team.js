import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  DevSettings,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Header from "../../Components/Header";
import DrawerModal from "../../Components/Drawer";
import { StatusBar } from "expo-status-bar";
import {
  Ionicons,
  Entypo,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { Teams } from "../Dumydata/Data";
import { FloatingAction } from "react-native-floating-action";
import { useFocusEffect } from "@react-navigation/native";
import { Url } from "@env";
import { Image } from "@rneui/themed";
import Emtyfile from "../../Components/Emtyfile";
import Noitificationbar from "../../Components/Notificationbar";

import * as Location from "expo-location";
import axios from "axios";

const Team = ({ navigation }) => {
  const [longitude, setlongtitude] = useState("");
  const [latitude, setlatitude] = useState("");
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [Shownotificationbar, setShownotificationbar] = useState(false);
  useFocusEffect(
    useCallback(() => {
      getuserregion();
    }, [])
  );
  const getuserregion = async () => {
    setloading(false);
    // const isAndroid = Platform.OS == "android";
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") {
    //   Alert.alert("Location Access is Required");
    //   return;
    // } else {
    //   console.log("Granted");
    //   await Location.getCurrentPositionAsync({
    //     accuracy: isAndroid ? Location.Accuracy.Low : Location.Accuracy.Lowest,
    //   })
    //     .then((location) => {
    //       console.log(location);
    //       let lat = location.coords.latitude;
    //       let long = location.coords.longitude;
    //       console.log(lat, long);
    //       setlongtitude(long);
    //       setlatitude(lat);
    //       getallteams();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    getallteams();
  };
  const getallteams = async () => {
    axios
      .get(`${Url}/getteams`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((e) => {
        setloading(true);
      });
  };
  const [drawershow, setdrawershow] = useState(false);
  const actions = [
    {
      text: "Create A Team ",
      icon: <Feather name="users" size={24} color={Colors.white} />,
      name: "CreateTeam",
      position: 1,
      backgroundColor: Colors.Pink,
    },
  ];
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        tittle="Teams"
        Drawer={() => setdrawershow(true)}
        Notifications={() => setShownotificationbar(true)}
      />
      {loading ? (
        <View style={styles.subview}>
          <Text style={styles.text2}>Available Blood Donor{"\n"}Teams</Text>

          <FlatList
            data={data}
            ListEmptyComponent={
              <View>
                <Emtyfile Tittle={"No Active Teams Available"} />
              </View>
            }
            renderItem={({ item }) => (
              <View style={{ flex: 1, paddingBottom: "5%" }}>
                <View style={styles.Box}>
                  <View
                    style={{
                      width: "100%",
                      height: 70,
                      borderBottomWidth: 1,
                      justifyContent: "center",
                      borderColor: Colors.LightGray,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: "5%",
                      }}
                    >
                      <Image
                        containerStyle={{
                          width: 50,
                          height: 50,
                          backgroundColor: "white",
                        }}
                        source={{ uri: item.logo }}
                        PlaceholderContent={
                          <View
                            style={{
                              width: 50,
                              height: 50,
                              backgroundColor: "white",
                              justifyContent: "center",
                            }}
                          >
                            <ActivityIndicator
                              size="large"
                              color={Colors.Pink}
                            />
                          </View>
                        }
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            marginLeft: "5%",
                          }}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 100,
                      borderBottomWidth: 1,
                      alignItems: "center",
                      borderColor: Colors.LightGray,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",

                        flexDirection: "row",
                        width: "90%",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            textAlign: "center",
                          }}
                        >
                          Total Volunteer
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            textAlign: "center",
                            marginTop: -10,
                          }}
                        >
                          {item.Volunteer}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 20,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            textAlign: "center",
                          }}
                        >
                          Member
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            textAlign: "center",
                            marginTop: -10,
                          }}
                        >
                          Since : {item.Date}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,

                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",

                        flexDirection: "row",
                        width: "90%",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Entypo name="location-pin" size={24} color="black" />
                        <Text
                          style={{
                            fontSize: 15,
                            color: Colors.black,
                            fontFamily: Typography.Text,
                            textAlign: "center",
                          }}
                        >
                          {item.city}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Details", {
                            id: item._id,
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#A41616",
                            fontFamily: Typography.Text,
                            fontStyle: "italic",
                          }}
                        >
                          Click here to find the details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
            // onRefresh={() => {
            //   <RefreshControl refreshing={loading} onRefresh={data} />;
            // }}
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
            log: longitude,
          });
        }}
      />
    </View>
  );
};

export default Team;
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
  Box: {
    width: "95%",
    height: 222,
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
});
