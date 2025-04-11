import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";

interface EtiquetaData {
  endereco: string;
  deposito: string;
  etiqueta: string;
  material: string;
  operador: string;
  status: string;
  data: string;
  hora: string;
  descricaoMaterial: string;
  descricaoDeposito: string;
  descricaoEndereco: string;
  origem: string;
  depositoAtual: string;
  op: string;
  qm: string;
  qtde: string;
}

const EtiquetaInfo = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute();
  const [etiquetaData, setEtiquetaData] = useState(
    route.params?.etiquetaData as EtiquetaData
  );
  const userUser = route.params?.userUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedEtiqueta, setEditedEtiqueta] = useState(etiquetaData.etiqueta);
  const [editedEndereco, setEditedEndereco] = useState(etiquetaData.endereco);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/barcode-labels/${editedEtiqueta}/recognize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userUser,
            position_id: editedEndereco,
            recognition_type: 3, // Movimentação de estoque
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.message);
        setEtiquetaData((prev) => ({
          ...prev,
          etiqueta: editedEtiqueta,
          endereco: editedEndereco,
        }));
        setIsEditing(false);
      } else {
        Alert.alert("Erro", data.message || "Erro ao atualizar etiqueta");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Endereço:</Text>
            <View style={styles.inputContainer}>
              {isEditing ? (
                <TextInput
                  style={[styles.value, styles.input]}
                  value={editedEndereco}
                  onChangeText={setEditedEndereco}
                />
              ) : (
                <Text style={styles.value}>{etiquetaData.endereco}</Text>
              )}
              <Text style={styles.valueDesc}>
                {etiquetaData.descricaoEndereco}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Etiqueta:</Text>
            <View style={styles.inputContainer}>
              {isEditing ? (
                <TextInput
                  style={[styles.value, styles.input]}
                  value={editedEtiqueta}
                  onChangeText={setEditedEtiqueta}
                />
              ) : (
                <Text style={styles.value}>{etiquetaData.etiqueta}</Text>
              )}
              <Text style={styles.valueDesc}>
                OP: {etiquetaData.op} QM: {etiquetaData.qm} Qtde(Pç/Kg):{" "}
                {etiquetaData.qtde}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() =>
              navigation.navigate("Scanner", { userName: userUser })
            }
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  row: {
    marginBottom: 15,
  },
  field: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 2,
  },
  value: {
    fontSize: 16,
    color: "#282abd",
    fontWeight: "bold",
  },
  valueDesc: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#282abd",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 4,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4169E1",
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#32CD32",
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    backgroundColor: "#282abd",
    flex: 1,
  },
});

export default EtiquetaInfo;
