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

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>
                {etiquetaData.status === "3"
                  ? "PROCESSANDO"
                  : etiquetaData.status === "1"
                  ? "APROVADO"
                  : "PENDENTE"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Origem:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.origem}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Depósito Atual:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.depositoAtual}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Localização:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.descricaoDeposito}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Material:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.material}</Text>
              <Text style={styles.valueDesc}>
                {etiquetaData.descricaoMaterial}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Operador:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.operador}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Data:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.data}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Hora:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.hora}</Text>
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
            <>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() =>
                  navigation.navigate("Scanner", { userName: userUser })
                }
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  row: {
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  field: {
    marginVertical: 2,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  inputContainer: {
    marginTop: 1,
  },
  value: {
    fontSize: 14,
    color: "#282abd",
    fontWeight: "bold",
  },
  valueDesc: {
    fontSize: 12,
    color: "#333",
    marginTop: 1,
  },
  button: {
    backgroundColor: "#282abd",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 4,
    padding: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  editButton: {
    backgroundColor: "#4169E1",
    flex: 1,
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#32CD32",
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    flex: 1,
    marginLeft: 5,
  },
  backButton: {
    backgroundColor: "#282abd",
    flex: 1,
  },
});

export default EtiquetaInfo;
