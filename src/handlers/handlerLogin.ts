import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import api from "../services/api";

export const handleLogin = async (
  user: string,
  password: string,
  navigation: NavigationProp<RootStackParamList>
) => {
  if (!user || !password) {
    Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await api.post("/login", {
      username: user,
      password,
    });

    if (response.data.success) {
      navigation.navigate("Home", { userUser: user });
    } else {
      Alert.alert("Erro", response.data.message || "Falha ao realizar login.");
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      Alert.alert("Erro", error.response.data.message || "Falha ao realizar login.");
    } else {
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Tente novamente.");
    }
  }
};