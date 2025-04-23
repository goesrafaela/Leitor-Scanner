import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
} from "react-native";
import iconImage from "../../img/img5.png";
import styles from "../../styles/styleHome";

const Home = ({ route }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const userName = route.params?.userUser;

  return (
    <View style={styles.container}>
      <Image source={iconImage} style={styles.icon} resizeMode="contain" />
      <Text style={styles.txtHome}>Bem vindo, {userName}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Scanner", {
            userUser: userName,
            scanType: "entrada",
          })
        }
      >
        <Text style={styles.txtButton}>Entrada</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Scanner", {
            userUser: userName,
            scanType: "saida",
          })
        }
      >
        <Text style={styles.txtButton}>Saída</Text>
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

export default Home;
