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

interface ManualInputProps {
  route: {
    params?: {
      userUser?: string;
      scanType?: string;
    };
  };
}

const ManualInput = ({ route }: ManualInputProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [productCode, setProductCode] = useState("");
  const [shelfCode, setShelfCode] = useState("");

  const handleConfirm = () => {
    if (!productCode || !shelfCode) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    const etiquetaData = {
      endereco: shelfCode,
      deposito: "04",
      etiqueta: productCode,
      material: "STR3004376",
      operador: "02",
      status: "3",
      data: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      descricaoMaterial: "HOLDER PORTA DIANTEIRA LE 9.0",
      descricaoDeposito: "Almoxarifado",
      descricaoEndereco: "CORREDOR [ A ] PRATE",
      origem: "11",
      depositoAtual: "09",
      op: "32487",
      qm: "0",
      qtde: "100.0000",
      userUser: route.params?.userUser,
    };

    const scanType = route.params?.scanType || "entrada";
    if (scanType === "entrada") {
      navigation.navigate("EtiquetaInfo", { etiquetaData });
    } else {
      navigation.navigate("AprovacaoInfo", { etiquetaData });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: "#282abd",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c68b5",
  },
  confirmButton: {
    backgroundColor: "#282abd",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ManualInput;
