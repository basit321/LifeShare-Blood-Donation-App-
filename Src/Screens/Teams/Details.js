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
import * as Location from "expo-location";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Headersub from "../../Components/Headersub";
import LabelDropDown from "../../Components/LabelDropDown";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import LabelTextInput from "../../Components/LabelTextInput";
import { useState, useEffect, useRef, useCallback } from "react";
import { Detrails } from "../Dumydata/Data";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Url } from "@env";
import { Image } from "@rneui/themed";
const Details = ({ route }) => {
  const [data, setdata] = useState([]);
  const Navigation = useNavigation();
  const [loading, setloading] = useState(false);
  const { id } = route.params;

  useFocusEffect(
    useCallback(() => {
      getdata();
    }, [])
  );
  const getdata = async () => {
    axios
      .get(`${Url}/teaminfo/${id}`)
      .then(async (res) => {
        console.log(res.data);
        setdata(res.data);
      })
      .catch((err) => {
        Alert.alert("Error", "Something went wrong");
      })
      .finally(() => {
        setloading(true);
      });
  };
  return (
    <View style={styles.container}>
      <Headersub
        tittle="Team Details"
        onBackbuttonpress={() => Navigation.goBack()}
      />
      {loading ? (
        <ScrollView style={styles.subview}>
          <View key={data._id} style={{ paddingBottom: "5%" }}>
            <Text style={styles.text2}>{data.title}</Text>
            <Image
              containerStyle={styles.imageview}
              source={{ uri: data.logo }}
              PlaceholderContent={
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <ActivityIndicator size="large" color={Colors.Pink} />
                </View>
              }
            />
            <Text style={styles.text}>Total volunteer : {data.Volunteer}</Text>
            <Text style={styles.text3}>Members Details : </Text>

            {data.Members.map((item) => (
              <View>
                <View style={styles.box1}>
                  <View style={styles.subview}>
                    <Text style={styles.tittle1}>{item.role}</Text>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.text5}>Name :</Text>
                      <Text style={{ ...styles.text5, color: Colors.black }}>
                        {" "}
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.text5}>Blood Type:</Text>
                      <Text style={{ ...styles.text5, color: Colors.black }}>
                        {" "}
                        {item.BloodGroup}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.text5}>Email :</Text>
                      <Text style={{ ...styles.text5, color: Colors.black }}>
                        {" "}
                        {item.email}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.text5}>Phone number:</Text>
                      <Text style={{ ...styles.text5, color: Colors.black }}>
                        {" "}
                        {item.phoneNumber}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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

export default Details;
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
    marginTop: "8%",
    alignSelf: "center",
    textAlign: "center",
  },
  text3: {
    fontSize: 20,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "5%",
  },
  tittle1: {
    fontSize: 20,
    color: Colors.black,

    fontFamily: Typography.Text,
    marginTop: "2%",
    textAlign: "center",
  },

  imageview: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: "2%",
  },
  box1: {
    width: "99%",

    borderRadius: 10,
    backgroundColor: Colors.LightGray,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "5%",
  },
  text: {
    fontSize: 20,
    color: Colors.black,
    fontFamily: Typography.Text,

    marginTop: "3%",
    alignSelf: "center",
  },
  input: {
    width: "100%",
  },
  text5: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: Typography.Text,
  },
});
