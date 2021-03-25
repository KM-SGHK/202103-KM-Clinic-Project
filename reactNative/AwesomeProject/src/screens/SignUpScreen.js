import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import NavLink from "../components/NavLink";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Text, Button } from "react-native-elements";
import config from "../../config";
import { TextInput } from "react-native-gesture-handler";

export default function App() {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [clinicName, setClinicName] = useState("");
  var [phoneNo, setPhoneNo] = useState("");
  var [address, setAddress] = useState("");
  var [errMsg, setErrMsg] = useState(false);
  var [successMsg, setSuccessMsg] = useState(false);
  var [errReason, setErrReason] = useState("");
  var [disableButton, setDisableButton] = useState(false);
  var [msgRefillInfo, setMsgRefillInfo] = useState(false)
  useEffect(() => {
    setDisableButton(false)
    setMsgRefillInfo(false)
  }, [email, address, password, clinicName, phoneNo]);

  const onChange = async () => {
    try {
      if (
        email === "" ||
        password === "" ||
        clinicName === "" ||
        phoneNo === "" ||
        address === ""
      ) {
        setDisableButton(true);
        setMsgRefillInfo(true)
      } else {
        console.log("testing onChange, ", email);
        const res = await fetch("http://localhost:8080/signUp/mySQL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            clinicName,
            phoneNo,
            address,
          }),
        });
        if (res.status === 200) {
          console.log("nice job"); // follow-up
          setEmail("");
          setPassword("");
          setClinicName("");
          setPhoneNo("");
          setAddress("");
          setSuccessMsg(!successMsg);
          setTimeout(function () {
            setSuccessMsg(!successMsg);
          }, 2000);
        }
      }
    } catch (err) {
      setErrReason(err);
      setErrMsg(!errMsg);
      setInterval(() => setSuccessMsg(!errMsg), 4000);
      console.log("testing 3");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/medical-563427_1920.jpg")}
        style={styles.backgroundImage}
      />
      <Text h1 style={styles.title}>
        Health is Priceless
      </Text>
      <Text style={styles.subtitle}>Create your account</Text>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Please enter your Email."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "envelope" }}
      />
      <Input
        label="Password"
        value={password}
        InputComponent={TextInput}
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholder="Please enter your password."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "key" }}
      />
      <Input
        label="Clinic Name"
        value={clinicName}
        onChangeText={setClinicName}
        placeholder="Please Enter your Clinic Name."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "user" }}
      />
      <Input
        label="Phone Number"
        value={phoneNo}
        onChangeText={setPhoneNo}
        placeholder="Please enter your phone number."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "phone-square" }}
      />
      <Input
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Please enter your Address."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "address-book-o" }}
      />
      <Button
        title="Submit"
        type="solid"
        buttonStyle={styles.button}
        onPress={onChange}
        disabled={disableButton}
      />
      {successMsg ? (
        <Text style={styles.additionalText}>
          Your registration is successful, welcome! Please proceed to log-in and
          enjoy our service.
        </Text>
      ) : null}
      {errMsg ? (
        <Text style={styles.additionalText}>
          Your registration is failed. This is the reason: {errReason}. Please
          try again. Thank you.
        </Text>
      ) : null}
      {msgRefillInfo ? (
        <Text style={styles.additionalText}>
          Please fill up all the fields.
        </Text>
      ) : null}
      <NavLink
        routeName="SignIn"
        text="Already have an account? Sign in instead!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
    paddingLeft: 25,
    paddingRight: 25,
    flexDirection: "column",
  },
  title: {
    marginBottom: 15,
    marginTop: 25,
    fontSize: 20
  },
  subtitle: {
    marginBottom: 35,
    fontSize: 16,
  },
  inputText: {
    marginLeft: 20,
  },
  button: {
    width: 400,
    marginTop: 40,
  },
  additionalText: {
    fontSize: 20,
    paddingLeft: 25,
    marginTop: 25,
    marginBottom: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
