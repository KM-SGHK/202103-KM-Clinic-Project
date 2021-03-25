import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import NavLink from "../components/NavLink";
import { Input, Text, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../context/AuthContext";
import { TextInput } from "react-native-gesture-handler";

export default function App() {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [err, setErr] = useState(false)
  const { state, signin } = useContext(Context);
  useEffect(() => {
    console.log("testing state from Context, ", state);
    if (state.errorMessage != "") {
      setErr(true)
    }
  }, [state]);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/human-skeleton-163715_1280.jpg")}
        style={styles.backgroundImage}
      />
      <Text h1 style={styles.title}>
        Welcome Back
      </Text>
      <Text style={styles.subtitle}>Please Log-in</Text>
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
        InputComponent={TextInput}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Please enter your password."
        inputStyle={styles.inputText}
        leftIcon={{ type: "font-awesome", name: "key" }}
      />
      <Button
        title="Submit"
        type="solid"
        buttonStyle={styles.button}
        onPress={() => signin(email, password)}
      />
       {err ? (
        <Text style={styles.additionalText}>
          {state.errorMessage}
        </Text>
      ) : null }
      <NavLink
        text="Dont have an account? Sign up instead"
        routeName="SignUp"
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
  },
  title: {
    marginBottom: 15,
    marginTop: 50,
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
    height: 50
  },
});
