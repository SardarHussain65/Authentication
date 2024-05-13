import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, storage } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const SignUp = ({ navigation }) => {
  const [agreed, setAgreed] = useState(false);

  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");

  const [email, setEmail] = useState("");

  const [picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);

  const [error, setError] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem("name", firstName);
      console.log(firstName);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("Get", image, true);
        xhr.send(null);
      });
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "images/" + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setPicture(downloadURL);
          });
        }
      );
    };

    if (image != null) {
      uploadImage();
      setImage(null);
    }
  }, [image]);

  const uploadCategory = async () => {
    console.log("i am cicekd");
    if (picture && firstName) {
      console.log("inside if bloc : ", firstName, picture);
      addDoc(collection(db, "categories"), {
        FirstName: firstName,
        Picture: picture,
      })
        .then((res) => {
          console.log(res);
          navigation.navigate("Home");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("this is your fault");
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const name = await AsyncStorage.getItem("name");
      console.log("name :", name);
      if (name !== null) {
        // navigation.navigate("Home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Submit = () => {
    if (firstName.length !== 0) {
      if (secondName.length !== 0) {
        if (password.length !== 0) {
          if (cPassword.length !== 0) {
            if (password.length >= 8 && password.length <= 16) {
              if (cPassword.length >= 8 && cPassword.length <= 16) {
                if (password === cPassword) {
                  if (email.length !== 0) {
                    if (email.indexOf("@") !== -1) {
                      if (image !== null) {
                        setError(
                          `Thank you ${firstName} ${secondName} for joining us`
                        );
                        createUserWithEmailAndPassword(auth, email, password)
                          .then((res) => {
                            console.log("successfully saved : ", res);
                            ToastAndroid.show("Saved Successfully", 2000);
                            navigation.navigate("Home");
                            setAgreed("");
                            setPassword("");
                            setCPassword("");
                            setFirstName("");
                            setSecondName("");
                            setEmail("");
                            setError("");
                            storeData();
                          })
                          .catch((e) => {
                            ToastAndroid.show("Error ", 2000);
                            console.log("error : ", e);
                            if (e.code === "auth/email-already-in-use") {
                              setError("Your Email is already use");
                            }
                          });
                      } else {
                        setError(`Please selecct an image.`);
                      }
                    } else {
                      setError(`Please enter a valid Email id.`);
                    }
                  } else {
                    setError(
                      `Sorry ${firstName} ${secondName}. Please enter your email id.`
                    );
                  }
                } else {
                  setError(
                    `Sorry ${firstName} ${secondName}. Passwords do not match. Please try again.`
                  );
                }
              } else {
                setError(
                  `Sorry ${firstName} ${secondName}. Confirm password length should be 8 to 16.`
                );
              }
            } else {
              setError(
                `Sorry ${firstName} ${secondName}. Password length should be 8 to 16.`
              );
            }
          } else {
            setError(`Enter your confirm password please.`);
          }
        } else {
          setError(`Enter your password please.`);
        }
      } else {
        setError(`Enter your last name please.`);
      }
    } else {
      setError(`Enter your first name please.`);
    }
  };
  return (
    <ScrollView style={styles.mainContainer}>
      <Text style={styles.mainHeader}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your First Name</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={firstName}
          onChangeText={(actualdata) => setFirstName(actualdata.trim())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your Last Name</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={secondName}
          onChangeText={(actualdata) => setSecondName(actualdata.trim())}
        />
      </View>

      <View style={styles.password}>
        <View>
          <Text style={styles.pContent}>Enter Password</Text>
          <TextInput
            style={styles.pInput}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(actualdata) => setPassword(actualdata)}
          />
        </View>

        <View>
          <Text style={styles.pContent}>conform Password</Text>
          <TextInput
            style={styles.pInput}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={cPassword}
            onChangeText={(actualdata) => setCPassword(actualdata)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.labels}>Enter Your email</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(actualdata) => setEmail(actualdata.trim())}
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          height: 45,
          margin: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={pickImage} // Moved inside curly braces
      >
        <Text style={{ color: "white" }}>Choose an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          height: 45,
          margin: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={uploadCategory} // Moved inside curly braces
      >
        <Text style={{ color: "white" }}>Upload Category</Text>
      </TouchableOpacity>

      <View style={styles.wrapper}>
        <CheckBox
          value={agreed}
          onValueChange={() => setAgreed(!agreed)}
          color={agreed ? "#4630EB" : undefined}
        />
        <Text style={styles.wrapperText}>
          I have read and agreed with the Terms and Conditions
        </Text>
      </View>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={[
          styles.buttonStyle,
          {
            backgroundColor: agreed ? "#4630EB" : "grey",
          },
        ]}
        disabled={!agreed}
        onPress={() => Submit()}
      >
        <Text style={styles.buttonText}>Sumit</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Sign In")}>
        <Text style={styles.signup}>Go back to Sign In page</Text>
      </TouchableOpacity>

      <View>
        <Text></Text>
      </View>
      <View>
        <Text></Text>
      </View>
      <View>
        <Text></Text>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: "lightblue",
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

  pContent: {
    fontSize: 15,
    color: "black",
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
  },

  pInput: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 1,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 15,
    width: 130,
    backgroundColor: "lightgray",
  },

  password: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
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
    marginVertical: 6,
  },
  welcome: {
    alignSelf: "center",
    marginVertical: 5,
    color: "green",
    fontSize: 20,
    fontWeight: "900",
  },
  errorText: {
    marginTop: 12,
    marginLeft: 10,
    fontSize: 16,
    color: "red",
  },
});

export default SignUp;
