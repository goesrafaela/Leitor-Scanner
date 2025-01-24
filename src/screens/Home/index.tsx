import React from "react";
import { Camera, useCameraPermissions, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View
      style={styles.container}
    >
      <Text style={{ fontSize: 20 }}>Tela de home</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Scanner")}
      >
        <Text style={styles.txtButton}>Scanner</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.txtButton}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  button:{
    width:"80%",
    padding: 8,
    backgroundColor: "#EF4219",
    marginTop: 12,
    borderRadius: 8,
  },
  txtButton:{
  textAlign:"center", 
  color:'white'
  }
});

export default Home;
