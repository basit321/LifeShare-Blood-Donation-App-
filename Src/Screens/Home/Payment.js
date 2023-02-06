import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import Colors from "../../utils/Colors";
import Typography from "../../utils/Typography";
import LabelTextInput from "../../Components/LabelTextInput";
import Button from "../../Components/Button";
import { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import Headersub from "../../Components/Headersub";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PaymentValidation } from "../../Validator/Register";
import * as Animatable from "react-native-animatable";
import { Url } from "@env";
const Payment = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const [error, setError] = useState({});
  const [carderror, setcarderror] = useState(false);

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${Url}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  const handlePayPress = async () => {
    const data = {
      email: email,
    };
    const error = PaymentValidation(data);

    console.log(error);

    setError(error);

    if (Object.keys(error).length !== 0) {
      return;
    }
    if (!cardDetails?.complete) {
      setcarderror(true);
      return;
    }
    const billingDetails = {
      email: email,
    };

    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
          console.log(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          Alert.alert(
            "Payment successful",
            "Please check your account balance",
            [
              {
                text: "Ok",
                onPress: () => {
                  navigation.navigate("Home");
                },
              },
            ]
          );
          console.log("Payment successful ", paymentIntent);
          setEmail("");
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <StripeProvider publishableKey="pk_test_51MOhmzFyQh9AGEPseVSjxznvWZBVdLRk1xt6jyd62PbiAHMIY2Rgj8POjQ0zXDtjIHwHT5FQdQmHoQqYydffBa1g00SiGIhBOW">
      <Headersub
        tittle="Payment"
        onBackbuttonpress={() => navigation.goBack()}
      />
      {loading ? (
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
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={styles.subview}>
            <Image
              source={require("../..//Images/Card.png")}
              style={{ width: 150, height: 150, alignSelf: "center" }}
            />
            <LabelTextInput
              tittle="Email"
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              error={error.email}
              style={{ marginTop: "10%" }}
            />
            <Text style={styles.text}>Card Details</Text>
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.card}
              style={styles.cardContainer}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            />
            {carderror ? (
              <View style={{ marginTop: "1%" }}>
                <Animatable.Text
                  animation="bounceInLeft"
                  duration={3000}
                  style={styles.error}
                >
                  Please enter Complete card details
                </Animatable.Text>
              </View>
            ) : null}
            <Button
              tittle="Pay"
              style={styles.button}
              onPress={() => {
                handlePayPress();
              }}
            />
          </KeyboardAwareScrollView>
        </View>
      )}
    </StripeProvider>
  );
};

export default Payment;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  subview: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flex: 1,
    marginTop: "10%",
  },
  text: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: Typography.Text,
    marginLeft: "1%",
    marginTop: "5%",
  },
  card: {
    backgroundColor: Colors.LightGray,
  },
  cardContainer: {
    width: "100%",
    height: 45,
    borderRadius: 10,

    color: Colors.black,
    fontSize: 17,
    paddingHorizontal: 10,
    fontFamily: Typography.Text,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: "2%",
  },
  button: {
    marginTop: "10%",
  },
  error: {
    fontSize: 15,
    fontFamily: Typography.Bold,
    color: Colors.Red,
  },
});
