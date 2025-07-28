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
      userName?: string;
      userEmail?: string;
    };
  };
}

const ManualInput = ({ route }: ManualInputProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [productCode, setProductCode] = useState("");
  const [shelfCode, setShelfCode] = useState("");

  const handleConfirm = async () => {
    const scanType = route.params?.scanType || "entrada";
    const isEntrada = scanType === "entrada";

    if (isEntrada && (!productCode || !shelfCode)) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    } else if (!isEntrada && !productCode) {
      Alert.alert("Atenção", "Por favor, preencha o código do produto.");
      return;
    }

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
            position_id: isEntrada ? parseInt(shelfCode) : 1,
            recognition_type: recognitionType,
          }),
        }
      );

      const apiResponse = await response.json();

      if (response.ok) {
        const etiquetaData = {
          endereco: isEntrada ? shelfCode : "N/A",
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
          descricaoEndereco: apiResponse.data?.barcode_label?.descricaoEndereco || "CORREDOR [ A ] PRATE",
          origem: "11",
          depositoAtual: "09",
          op: apiResponse.data?.barcode_label?.op || "32487",
          qm: apiResponse.data?.barcode_label?.qm || "0",
          qtde: apiResponse.data?.barcode_label?.qtde || "100.0000",
          positionId: apiResponse.data?.barcode_label?.positionId || (isEntrada ? shelfCode : "1"),
          userUser: route.params?.userUser,
        };

        if (scanType === "entrada") {
          navigation.navigate("EtiquetaInfo", { 
            etiquetaData,
            userUser: route.params?.userUser,
            userName: route.params?.userName,
            userEmail: route.params?.userEmail
          });
        } else {
          navigation.navigate("AprovacaoInfo", { 
            etiquetaData,
            userUser: route.params?.userUser,
            userName: route.params?.userName,
            userEmail: route.params?.userEmail
          });
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

  const scanType = route.params?.scanType || "entrada";

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

        {scanType === "entrada" && (
          <TextInput
            style={styles.input}
            value={shelfCode}
            onChangeText={setShelfCode}
            placeholder="Digite o código da prateleira"
            keyboardType="default"
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.navigate("Scanner", {
              userUser: route.params?.userUser,
              userName: route.params?.userName,
              userEmail: route.params?.userEmail,
              scanType: route.params?.scanType
            })}
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
