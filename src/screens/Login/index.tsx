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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import iconImage from "../../img/img5.png";

const Login = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  const handleLogin = () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, digite seu nome.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, digite seu email.");
      return;
    }
    
    // Navega para a Home com os dados digitados
    navigation.navigate("Home", { 
      userUser: "manual", 
      userName: name,
      userEmail: email 
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Image source={iconImage} style={styles.icon} resizeMode="contain" />
          <Text style={styles.txtHome}>Bem vindo</Text>

          <Text style={styles.selectUserText}>Digite seus dados:</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
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
  selectUserText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    padding: 12,
    width: "60%",
    backgroundColor: "#282abd",
    marginTop: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  txtHome: {
    fontSize: 24,
    marginBottom: 25,
    color: "#282abd",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default Login;
