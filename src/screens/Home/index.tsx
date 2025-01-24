import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text,TouchableOpacity } from "react-native";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text style={{ fontSize: 20 }}>Tela de home</Text>

      
            <TouchableOpacity
              style={{ padding: 8, backgroundColor: "#8d8d8d", marginTop: 12,borderRadius:8 }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text>Sair</Text>
            </TouchableOpacity>
    </View>
  );
};

export default Home;
