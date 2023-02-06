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
import * as Animatable from "react-native-animatable";
const LabelTextInput = ({
  style,
  textstyle,
  tittle,
  contextstyle,
  show,
  Inputstyle,
  context,
  value,
  numberOfLines,
  onChangeText,
  keyboardType,
  secureTextEntry,
  multiline,
  placeholder,
  placeholderTextColor,
  maxLength,
  editable,
  onPress,
  show1,
  autoFocus = false,
  defaultValue,
  error,
  onBlur,
  autoCapitalize,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textstyle]}>{tittle}</Text>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          style={[styles.Input, Inputstyle]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor={Colors.black}
          maxLength={maxLength}
          editable={editable}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
        />

        <TouchableOpacity
          onPress={onPress}
          style={[{ ...styles.content, display: show }, contextstyle]}
        >
          {context}
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={{ marginTop: "2%" }}>
          <Animatable.Text
            animation="bounceInLeft"
            duration={3000}
            style={styles.error}
          >
            {error}
          </Animatable.Text>
        </View>
      ) : null}
    </View>
  );
};

export default LabelTextInput;
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
    fontSize: 17,
    paddingHorizontal: 10,
    fontFamily: Typography.Text,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: "2%",
  },
  text: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
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
