import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import iconImage from "../../img/img5.png";
import styles from "../../styles/styleLogin";

const Login = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (user === "" || password === "") {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    } else {
      /*Requisição para o servidor com os dados do usuário*/

      navigation.navigate("Home", { userUser: user });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={iconImage} style={styles.icon} resizeMode="contain" />
        <Text style={styles.txtHome}>Bem vindo</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu usuário"
          value={user}
          onChangeText={setUser}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          keyboardType="numeric"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
