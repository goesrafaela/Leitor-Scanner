import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";



const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
    } else {
      /*Requisição para o servidor com os dados do usuário*/
      
      navigation.navigate('Home');
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text style={styles.txtHome}>Bem vindo</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        keyboardType="numeric"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={{textAlign:"center", color:'white'}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
  },
  button:{
    padding: 8,
    width:'80%',
    textAlign:"center", 
    backgroundColor: "#EF4219", 
    marginTop: 12,
    borderRadius:8
  },
  txtHome:{
    fontSize: 20 , 
    marginBottom:25,
    color:'#EFB719'
  }
});

export default Login;
