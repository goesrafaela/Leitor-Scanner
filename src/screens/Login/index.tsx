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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#282abd",
    padding: 10,
    borderRadius: 5,
    width: "60%",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#000000",
  },
  button: {
    padding: 8,
    width: "50%",
    textAlign: "center",
    backgroundColor: "#282abd",
    marginTop: 12,
    borderRadius: 8,
  },
  txtHome: {
    fontSize: 24,
    marginBottom: 25,
    color: "#282abd",
    fontWeight: "bold",
  },
});

export default Login;
