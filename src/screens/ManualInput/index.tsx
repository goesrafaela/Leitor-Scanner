import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { ManualInputProps } from "../../interfaces/IManualInputProps";
import styles from "../../styles/styleManualInput";

const ManualInput = ({ route }: ManualInputProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [productCode, setProductCode] = useState("");
  const [shelfCode, setShelfCode] = useState("");

  const handleConfirm = async () => {
    if (!productCode || !shelfCode) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    const scanType = route.params?.scanType || "entrada";
    const recognitionType = scanType === "entrada" ? 1 : 2;

    try {
      const response = await fetch(
        `https://demo-polymer.meusalt.com.br/api/barcode-labels/${productCode}/recognize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(route.params?.userUser || "1"),
            position_id: parseInt(shelfCode),
            recognition_type: recognitionType,
          }),
        }
      );

      const apiResponse = await response.json();

      if (response.ok) {
        const etiquetaData = {
          endereco: shelfCode,
          deposito: "04",
          etiqueta: productCode,
          material: apiResponse.data?.barcode_label?.material || "STR3004376",
          operador: route.params?.userUser || "02",
          status: apiResponse.data?.barcode_label?.status || "1",
          data: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
          descricaoMaterial:
            apiResponse.data?.barcode_label?.descricao_material ||
            "HOLDER PORTA DIANTEIRA LE 9.0",
          descricaoDeposito: "Almoxarifado",
          descricaoEndereco: "CORREDOR [ A ] PRATE",
          origem: "11",
          depositoAtual: "09",
          op: apiResponse.data?.barcode_label?.op || "32487",
          qm: apiResponse.data?.barcode_label?.qm || "0",
          qtde: apiResponse.data?.barcode_label?.qtde || "100.0000",
          userUser: route.params?.userUser,
        };

        if (scanType === "entrada") {
          navigation.navigate("EtiquetaInfo", { etiquetaData });
        } else {
          navigation.navigate("AprovacaoInfo", { etiquetaData });
        }
      } else {
        Alert.alert(
          "Erro",
          apiResponse.message || "Erro ao reconhecer etiqueta"
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor");
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
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ManualInput;
