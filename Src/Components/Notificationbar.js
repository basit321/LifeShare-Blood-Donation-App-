import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  FontAwesome,
  Ionicons,
  Entypo,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Modal from "react-native-modal";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Url } from "@env";
import Images from "./Image";

import { Alert } from "react-native";

const Noitificationbar = ({
  navigation,
  Show,
  onClose,

  OnnextClose,

  setShow,
}) => {
  const [data, setdata] = useState([]);
  const [userinfo, setuserinfo] = useState({});

  const [loading, setloading] = useState(false);
  const [internetCheck, setInternetCheck] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setloading(false);
      getData();
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      setloading(false);
      getData();
    }, [internetCheck])
  );

  const getData = async () => {
    setloading(false);
    await AsyncStorage.getItem("@lifeShare")
      .then(async (value) => {
        if (value !== null) {
          const jsonValue = JSON.parse(value);
          let info = await jsonValue;
          setuserinfo(info);
          Getnotications(info.userdata._id);
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
        setloading(true);
      });

    // error reading value
  };
  const Getnotications = async (id) => {
    axios
      .get(`${Url}/getnotificationbyid/${id}`)
      .then((res) => {
        console.log(res.data);
        setdata(res.data);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Network Error");
      })
      .finally(() => {
        setloading(true);
      });
  };

  const Next = (id) => {
    OnnextClose(false);

    navigation.navigate("Userinformation", {
      id: id,
    });
  };
  const Detail = () => {
    OnnextClose(false);

    navigation.navigate("PendingRequests", {
      id: userinfo.userdata._id,
    });
  };
  const deleteNotification = async (id) => {
    setloading(false);
    axios
      .delete(`${Url}/deletenotification/${id}`)
      .then((res) => {
        console.log(res.data);
        setInternetCheck(internetCheck + 1);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setloading(true);
      });
  };
  return (
    <Modal
      isVisible={Show}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationOutTiming={500}
      statusBarTranslucent={true}
      style={{ flex: 1, margin: 0 }}
    >
      <View style={{ ...styles.modalContent }}>
        {loading ? (
          <ScrollView style={{ flex: 1 }}>
            <Text style={styles.heading}>Notifications</Text>
            {!data.length == 0 ? (
              <View>
                {data.map((item) => (
                  <View style={styles.box}>
                    <TouchableOpacity
                      style={{ marginLeft: "auto", marginRight: "5%" }}
                      onPress={() => deleteNotification(item._id)}
                    >
                      <Entypo name="cross" size={22} color="#808080" />
                    </TouchableOpacity>
                    <View style={styles.subiew}>
                      <Images
                        style={styles.image}
                        source={{ uri: item.Notification[0].Pic }}
                      />
                      <TouchableOpacity
                        style={{ marginLeft: "3%" }}
                        activeOpacity={1}
                        onPress={() => Next(item.Notification[0].userid)}
                      >
                        <Text style={styles.Text}>
                          {item.Notification[0].Name}{" "}
                          {item.Notification[0].title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {item.Notification[0].title ===
                    "Accpeted your request for blood donation" ? (
                      <TouchableOpacity
                        style={{ marginLeft: "auto", marginRight: "5%" }}
                        onPress={() => Detail()}
                      >
                        <Text
                          style={{
                            ...styles.Text,
                            color: Colors.Red,
                            textDecorationLine: "underline",
                          }}
                        >
                          See Details
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : (
              <View
                style={{
                  marginLeft: "5%",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: "100%",
                }}
              >
                <Image
                  source={require("../Images/loupe.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={{ ...styles.Text, fontSize: 20 }}>
                  No New Notifications
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.Pink} />
            <Text style={styles.text1}>Please Wait ......</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Noitificationbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    width: "80%",
    marginLeft: "auto",
  },

  subiew: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 70,

    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#858181",
  },

  box: {
    marginTop: "5%",
    borderBottomWidth: 2,
    borderColor: Colors.LightGray,
    paddingBottom: "5%",
  },
  postview: {
    borderBottomWidth: 1,
    borderColor: Colors.LightGray,
    marginTop: "5%",
    paddingBottom: "2%",
  },
  heading: {
    fontSize: 25,
    fontFamily: Typography.Text,
    color: Colors.black,
    textAlign: "center",
    marginTop: "15%",
  },
  text1: {
    fontSize: 19,
    fontFamily: Typography.Text,
    color: Colors.black,
    textAlign: "center",
    marginTop: "5%",
  },
  Text: {
    fontSize: 15,
    fontFamily: Typography.Text,
    color: Colors.black,
    flexWrap: "wrap",
    width: "70%",
  },
});
