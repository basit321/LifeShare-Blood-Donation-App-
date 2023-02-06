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
import { MaterialIcons } from "@expo/vector-icons";
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
import Emtyfile from "../../Components/Emtyfile";

const MyRequests = ({ navigation, route }) => {
  const { id } = route.params;
  const Navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [show, setshow] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getuserdata();
    }, [])
  );
  const actions = [
    {
      text: "Pending Requests",
      icon: <MaterialIcons name="post-add" size={24} color={Colors.white} />,
      name: "PendingRequests",
      position: 1,
      backgroundColor: Colors.Pink,
    },
  ];
  const getuserdata = async () => {
    setshow(true);
    console.log("id", id);
    axios
      .get(`${Url}/getpostbyuserid/${id}`)
      .then(async (res) => {
        console.log(res.data);

        await setdata(res.data);
        setshow(false);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setshow(false);
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Headersub
        tittle="My Requests"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {!show ? (
        <View style={styles.subview}>
          <Text style={styles.text2}>Active Blood Requests</Text>

          <FlatList
            data={data}
            ListEmptyComponent={<Emtyfile Tittle={"No Active Blood Request"} />}
            renderItem={({ item }) => (
              <View style={{ flex: 1, paddingBottom: "5%" }}>
                <TouchableOpacity
                  style={styles.Box}
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate("PostDetails", {
                      id: item._id,
                    })
                  }
                >
                  <ScrollView style={{ flex: 1 }}>
                    <View style={styles.line}>
                      <View style={styles.subcont}>
                        <Image
                          style={styles.image}
                          source={{
                            uri: item.pictrue,
                          }}
                          resizeMode="contain"
                        />

                        <Text
                          style={{ ...styles.text, includeFontPadding: false }}
                        >
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
                          <Text style={{ ...styles.text4, fontWeight: "bold" }}>
                            {item.Bloodtype} blood donnor needed
                          </Text>
                        </View>
                      </View>
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
                          fontFamily: Typography.Text,
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
                          fontFamily: Typography.Text,
                          color: Colors.black,
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
      <FloatingAction
        actions={actions}
        buttonSize={60}
        color={Colors.Pink}
        onPressItem={(name) => {
          navigation.navigate(name, {
            id: id,
          });
        }}
      />
    </View>
  );
};

export default MyRequests;
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
    width: "90%",
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
    fontWeight: "Bold",
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
