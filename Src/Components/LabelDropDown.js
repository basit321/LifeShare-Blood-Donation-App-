import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  View,
} from "react-native";
import Colors from "../utils/Colors";
import Typography from "../utils/Typography";
import SelectList from "react-native-dropdown-select-list";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const LabelDropDown = ({
  style,
  textstyle,
  tittle,
  contextstyle,
  show,
  Inputstyle,
  context,
  setSelected,
  onSelect,
  containerStyle,
  onselect,
  placeholder,
  tittle1,
  textstyle1,
  data,
  Error,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textstyle]}>{tittle}</Text>
      <SelectList
        onSelect={() => console.log(onSelect)}
        setSelected={setSelected}
        placeholder={tittle1}
        inputStyles={{
          fontSize: 17,
          color: Colors.black,
          fontFamily: Typography.Text,
          marginTop: "-1%",
        }}
        dropdownTextStyles={{
          fontSize: 17,
          color: Colors.black,
          fontFamily: Typography.Text,
          marginLeft: "-2%",
        }}
        arrowicon={
          <AntDesign
            style={{ alignSelf: "center", top: 2 }}
            name="down"
            size={20}
            color={Colors.black}
          />
        }
        search={false}
        data={data}
        boxStyles={[styles.Input, containerStyle]}
        searchPlaceholder="Search"
      />
      {Error ? (
        <View style={{ marginTop: "2%" }}>
          <Animatable.Text
            animation="bounceInLeft"
            duration={3000}
            style={styles.error}
          >
            {Error}
          </Animatable.Text>
        </View>
      ) : null}
    </View>
  );
};

export default LabelDropDown;
const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
  },
  Input: {
    width: "100%",
    height: 45,
    borderRadius: 10,
    backgroundColor: Colors.LightGray,
    color: Colors.black,
    alignItems: "center",
    paddingHorizontal: 12,
    fontFamily: Typography.Text,
    borderWidth: 0,

    marginTop: "2%",
  },
  text: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
  },
  text1: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: Typography.Text,
    top: -13,
    position: "absolute",
  },
  content: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: "2%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
});
