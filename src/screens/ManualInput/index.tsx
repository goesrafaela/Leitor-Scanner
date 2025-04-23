import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { ManualInputProps } from "../../interfaces/IManualInputProps";
import styles from "../../styles/styleManualInput";
import { handleConfirm } from "../../handlers/handlerManualInput"; // Importação do handler

const ManualInput = ({ route }: ManualInputProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [productCode, setProductCode] = useState("");
  const [shelfCode, setShelfCode] = useState("");

  const handleConfirmPress = async () => {
    try {
      await handleConfirm({ productCode, shelfCode, route, navigation });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar a entrada manual. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Entrada Manual de Etiqueta</Text>

        <TextInput
          style={styles.input}
          value={productCode}
          onChangeText={setProductCode}
          placeholder="Digite o código do produto"
          keyboardType="default"
        />

        <TextInput
          style={styles.input}
          value={shelfCode}
          onChangeText={setShelfCode}
          placeholder="Digite o código da prateleira"
          keyboardType="default"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate("Scanner")}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirmPress}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ManualInput;