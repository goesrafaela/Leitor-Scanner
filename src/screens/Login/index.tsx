import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import iconImage from "../../img/img5.png";
import styles from "../../styles/styleLogin";
import { handleLogin } from "../../handlers/handlerLogin"; // Corrigida a importação do handler

const Login = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = async () => {
    try {
      await handleLogin(user, password, navigation);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o login. Tente novamente.");
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
          keyboardType="default"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;