import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const SignIn = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const Submit = () => {
    if (email.indexOf("@") !== -1) {
      if (password.length !== 0) {
        if (password.length >= 8 && password.length <= 16) {
          console.log("object", email, "test");
          signInWithEmailAndPassword(auth, email, password)
            .then((res) => {
              console.log("successfully sign in : ", res);
              ToastAndroid.show("successfully sign in", 2000);
              navigation.navigate("Home");
              setEmail("");
              setPassword("");
              setError("");
            })
            .catch((e) => {
              if (
                e.code === "auth/invalid-email" ||
                e.code === "auth/invalid-credential"
              ) {
                setError("Your Email or Password is invalid. Please try again");
              } else {
                setError("No Internet");
              }
              ToastAndroid.show("Error ", 2000);
              console.log("error : ", e.code);
            });
        } else {
          setError(
            `Sorry password length should be between 8 and 16 characters.`
          );
        }
      } else {
        setError(`Please enter your password.`);
      }
    } else {
      setError(`Please enter a valid Email id.`);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Signln Form</Text>

      <Text style={styles.description}>
        If you want to get our service than please enter the User-name &
        Password
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(actualdata) => setEmail(actualdata.trim())}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Password</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(actualdata) => setPassword(actualdata)}
        />
      </View>
      <Text style={styles.Texterror}>{error}</Text>
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          {
            backgroundColor:
              email.length !== 0 && password.length !== 0 ? "#4630EB" : "grey",
          },
        ]}
        disabled={email.length == 0 && password.length == 0}
        onPress={() => Submit()}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TouchableOpacity
        style={{ width: 300, height: 40, marginBottom: 30 }}
        onPress={() => navigation.navigate("Rigister")}
      >
        <Text style={styles.signup}>Create Account/SignUp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "lightblue",
    paddingBottom: 0,
  },
  inputContainer: {
    marginTop: 20,
  },
  mainHeader: {
    fontSize: 25,
    color: "blue",
    fontWeight: "700",
    paddingTop: 20,
    paddingBottom: 15,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 15,
    color: "#7d7d7d",
    paddingBottom: 20,
    lineHeight: 20,
  },
  labels: {
    fontSize: 18,
    color: "black",
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 1,
    fontSize: 18,
    backgroundColor: "lightgray",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  wrapperText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#7d7d7d",
  },
  buttonStyle: {
    marginTop: 30,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  or: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 10,
    alignSelf: "center",
  },
  signup: {
    alignSelf: "center",
    color: "blue",
    marginVertical: 8,
  },
  welcome: {
    alignSelf: "center",
    marginVertical: 5,
    color: "green",
    fontSize: 20,
    fontWeight: "900",
  },
  Texterror: {
    marginTop: 12,
    marginLeft: 10,
    fontSize: 16,
    color: "red",
  },
});

//name

export default SignIn;
