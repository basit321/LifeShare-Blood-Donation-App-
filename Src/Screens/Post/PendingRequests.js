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
import { UseNotifications } from "../../Components/useNotification";
import Emtyfile from "../../Components/Emtyfile";

const PendingRequests = ({ navigation, route }) => {
  const { id } = route.params;
  const Navigation = useNavigation();
  const { sendNotification } = UseNotifications();
  const [data, setdata] = useState();
  const [show, setshow] = useState(false);
  const [internetCheck, setInternetCheck] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setInternetCheck(internetCheck + 1);
      getuserdata();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      getuserdata();
    }, [internetCheck])
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
    setshow(false);
    console.log("id", id);
    axios
      .get(`${Url}/getpostapproved/${id}`)
      .then(async (res) => {
        console.log(res.data);

        await setdata(res.data);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
        console.log(err);
      })
      .finally(() => {
        setshow(true);
      });
  };
  const Addrecentdonnor = (datass) => {
    const Receved = {
      name: datass.name,
      bloodgroup: datass.bloodgroup,
      id: datass.id,
      pictrue: datass.pictrue,
      Accept: datass.Request,
      Bloodtype: datass.Bloodtype,
    };
    const datas = {
      Reciever: [Receved],
      Donnor: [datass.acceptedby[0].results],
    };
    console.log(datas);
    axios
      .post(`${Url}/Addrecentdonnor`, datas)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        Alert.alert("Something went wrong");
      });
  };
  const getremovepost = (id) => {
    axios
      .delete(`${Url}/deletepost/${id}`)
      .then((res) => {
        console.log(res.data);
        Alert.alert("Post Deleted");
        setInternetCheck(internetCheck + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getpostdelete = (item, id, userid, rank, life, bleed) => {
    setshow(false);
    Addrecentdonnor(item);
    axios
      .delete(`${Url}/deletepost/${id}`)
      .then((res) => {
        console.log(res.data);
        updatedata(userid, rank, life, bleed);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Something went wrong");
      });
  };

  const SendNotifications = (item, data) => {
    if (item.token == null) {
      Alert.alert("Something went wrong");
    } else {
      console.log(data.name);
      const title = "Donnation Accepted";

      const body = "Hey" + " " + data.name + " " + "Accepted your  donation";
      sendNotification(item.token, title, body)
        .then((res) => {
          Mobilenotifcation(item, data);
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("Network Error");
        });
    }
  };
  const Mobilenotifcation = async (item, data) => {
    const datas = {
      id: item._id,
      title: "Accpeted your donation",
      Pic: data.pictrue,
      userid: data.id,
      Name: data.name,
    };
    const adddata = {
      Notification: [datas],
    };
    console.log(adddata);
    axios
      .post(`${Url}/Addnotification`, adddata)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        Alert.alert("Network Error");
      });
  };

  const updatedata = (id, rank, life, bleed) => {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let date = day + "/" + month + "/" + year;
    const userdata = {
      Rank: rank + 1,
      lifesaved: life + 1,
      lastbleed: date,
    };
    axios
      .patch(`${Url}/Update/${id}`, userdata)
      .then((response) => {
        console.log(response.data);

        Alert.alert("Thanks for the response");

        setInternetCheck(internetCheck + 1);
      })
      .catch((e) => {
        console.log(e), Alert.alert("Something went wrong");
      })
      .finally(() => {
        setshow(true);
      });
  };
  const getpostdecline = (id) => {
    const uppdate = {
      accepted: false,
      acceptedby: [],
    };
    axios
      .patch(`${Url}/updatepost/${id}`, uppdate)
      .then((res) => {
        setInternetCheck(internetCheck + 1);
        console.log(res.data);
        Alert.alert("Request posted on the  timeline");
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
        tittle="Pending Requests"
        onBackbuttonpress={() => navigation.goBack()}
      />
      {show ? (
        <View style={styles.subview}>
          <Text style={styles.text2}>Active Blood Requests</Text>

          <FlatList
            data={data}
            ListEmptyComponent={
              <Emtyfile Tittle={"No Active Pending Request "} />
            }
            renderItem={({ item }) => (
              <View style={{ flex: 1, paddingBottom: "5%" }}>
                <TouchableOpacity style={styles.Box} activeOpacity={1}>
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
                        height: 80,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: "2%",
                        }}
                      >
                        <Image
                          style={styles.image2}
                          source={{ uri: item.acceptedby[0].results.pictrue }}
                        />
                        <Text style={styles.text5}>
                          Is {item.acceptedby[0].results.name} Donate{" "}
                          {item.Bloodtype} ?
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: "2%",
                        }}
                      >
                        <TouchableOpacity
                          style={{ position: "absolute", right: 30 }}
                          onPress={() => {
                            getpostdelete(
                              item,
                              item._id,
                              item.acceptedby[0].results._id,
                              item.acceptedby[0].results.Rank,
                              item.acceptedby[0].results.lifesaved,
                              item.acceptedby[0].results.lastbleed
                            );
                            SendNotifications(item.acceptedby[0].results, item);
                          }}
                        >
                          <AntDesign name="check" size={28} color="#90EE90" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              "Delete Post?",
                              "Your post will be delete if you confirm.",
                              [
                                {
                                  text: "get post on the timeline",
                                  onPress: () => getpostdecline(item._id, item),
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
                          <Entypo name="cross" size={28} color={Colors.Red} />
                        </TouchableOpacity>
                      </View>
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
      {/* <FloatingAction
        actions={actions}
        buttonSize={60}
        color={Colors.Pink}
        onPressItem={(name) => {
          navigation.navigate(name, {
            lat: latitude,
            long: longitude,
          });
        }}
      /> */}
    </View>
  );
};

export default PendingRequests;
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
  image2: {
    width: 50,
    height: 50,
    borderRadius: 70,
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
  text5: {
    fontSize: 17,
    color: "#908787",
    fontFamily: Typography.Text,
    marginLeft: "2%",
    width: "60%",
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
