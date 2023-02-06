import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import Header from "../../Components/Header";
import DrawerModal from "../../Components/Drawer";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import { Rankings } from "../Dumydata/Data";
import { FloatingAction } from "react-native-floating-action";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Url } from "@env";
import Emtyfile from "../../Components/Emtyfile";
import Noitificationbar from "../../Components/Notificationbar";

const Ranjked = ({ navigation }) => {
  const [drawershow, setdrawershow] = useState(false);
  const [data, setdata] = useState([]);
  const [datas, setdatas] = useState([]);
  const [Shownotificationbar, setShownotificationbar] = useState(false);

  const [loading, setloading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      getuserdata();
    }, [])
  );

  const getuserdata = async () => {
    setloading(true);
    await axios
      .get(`${Url}/getusers`)
      .then(async (res) => {
        const closest = res.data.sort((a, b) => {
          return b.lifesaved - a.lifesaved;
        });
        console.log(closest);
        setdata(closest);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setloading(false);
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header
        tittle="Rankings"
        Drawer={() => setdrawershow(true)}
        Notifications={() => setShownotificationbar(true)}
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.Pink} />
          <Text style={styles.text4}>Please Wait ......</Text>
        </View>
      ) : (
        <View style={styles.subview}>
          <Text style={styles.text2}>Users Ranking</Text>
          <View style={styles.column}>
            <Text style={{ ...styles.text1, position: "absolute" }}>Rank</Text>
            <Text
              style={{
                ...styles.text1,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Name
            </Text>
            <Text style={{ ...styles.text1, position: "absolute", right: 0 }}>
              Donation
            </Text>
          </View>
          <FlatList
            data={data}
            ListEmptyComponent={<Emtyfile Tittle="No Data Found" />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.column1}
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate("Userinformation", {
                    id: item._id,
                  })
                }
              >
                <Text
                  style={{ ...styles.text3, position: "absolute", left: 10 }}
                >
                  {index + 1}
                </Text>
                <Text
                  style={{
                    ...styles.text3,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{ ...styles.text3, position: "absolute", right: 0 }}
                >
                  {item.lifesaved} times
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
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
    </View>
  );
};

export default Ranjked;
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
  text2: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginTop: "5%",
  },
  column: {
    flexDirection: "row",

    marginTop: "2%",
  },
  column1: {
    flexDirection: "row",

    marginTop: "2%",
    borderBottomWidth: 1,
    paddingBottom: "3%",
    borderColor: Colors.LightGray,
  },
  text1: {
    fontSize: 22,
    color: "#A69B9B",
    fontFamily: Typography.Text,
  },
  text3: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
  text4: {
    fontSize: 19,
    fontFamily: Typography.Text,
    color: Colors.black,
    textAlign: "center",
    marginTop: "5%",
  },
});
