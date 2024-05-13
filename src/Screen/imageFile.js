import React from "react";
import { Text, StyleSheet, Image, ScrollView } from "react-native";

const ImageFile = () => {
  return (
    <ScrollView contentContainerStyle={styles.picimagewala}>
      <Text>Hello My name is Sardar Hussain</Text>
      <Image
        style={styles.pic}
        source={require("../../assets/test1.jpg")}
      ></Image>
      <Image
        style={styles.pic}
        source={require("../../assets/test1.jpg")}
      ></Image>
      <Image
        style={styles.pic}
        source={require("../../assets/test1.jpg")}
      ></Image>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pic: {
    // flex: 1,
    margin: 10,
    borderRadius: 20,
    height: 400,
    width: "100%",
    // resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  picimagewala: {
    // flex: 1,
    height: 1200,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageFile;
