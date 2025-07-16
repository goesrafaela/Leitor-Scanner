import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import {
  getLocation,
  recognizeBarcode,
  RecognizeRequest,
} from "../../services/api";

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
  positionId?: string;
}

const EtiquetaInfo = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute();
  const [etiquetaData, setEtiquetaData] = useState(
    route.params?.etiquetaData as EtiquetaData
  );
  const userUser = route.params?.userUser;
  const userName = route.params?.userName;
  const userEmail = route.params?.userEmail;
  const [isEditing, setIsEditing] = useState(false);
  const [editedEtiqueta, setEditedEtiqueta] = useState(etiquetaData.etiqueta);
  const [editedEndereco, setEditedEndereco] = useState(etiquetaData.endereco);
  const [searchBarcode, setSearchBarcode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchBarcode) {
      Alert.alert("Atenção", "Por favor, insira o código do produto.");
      return;
    }

    setIsLoading(true);
    try {
      const locationData = await getLocation(searchBarcode);

      if (locationData) {
        setEtiquetaData({
          ...etiquetaData,
          etiqueta: searchBarcode,
          positionId: locationData.positionId,
          endereco: locationData.positionId,
          status: locationData.status,
          qtde: locationData.quantity,
          descricaoEndereco: locationData.location,
        });
      } else {
        Alert.alert("Erro", "Produto não encontrado");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Preparar os dados para a requisição
      const requestData: RecognizeRequest = {
        user_id: parseInt(userUser || "1"),
        position_id: parseInt(editedEndereco),
        recognition_type: 3, // Movimentação de estoque
      };

      // Chamar a API para reconhecer o código de barras
      const apiResponse = await recognizeBarcode(editedEtiqueta, requestData);

      if (apiResponse.data?.barcode_label) {
        Alert.alert(
          "Sucesso",
          apiResponse.message || "Etiqueta reconhecida com sucesso"
        );
        setEtiquetaData((prev) => ({
          ...prev,
          etiqueta: editedEtiqueta,
          endereco: editedEndereco,
          status: apiResponse.data.barcode_label.status || etiquetaData.status,
          material:
            apiResponse.data.barcode_label.material || etiquetaData.material,
          descricaoMaterial:
            apiResponse.data.barcode_label.descricaoMaterial ||
            etiquetaData.descricaoMaterial,
          op: apiResponse.data.barcode_label.op || etiquetaData.op,
          qm: apiResponse.data.barcode_label.qm || etiquetaData.qm,
          qtde: apiResponse.data.barcode_label.qtde || etiquetaData.qtde,
        }));
        setIsEditing(false);
      } else {
        // Tratar erros da API
        let errorMessage = apiResponse.message || "Erro ao salvar";

        if (apiResponse.errors) {
          // Formatar mensagens de erro se houver
          const errorMessages = Object.values(apiResponse.errors)
            .flat()
            .join("\n");
          errorMessage = errorMessages || errorMessage;
        }

        Alert.alert("Erro", errorMessage);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o código do produto"
            value={searchBarcode}
            onChangeText={setSearchBarcode}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Position ID:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.positionId || "-"}</Text>
            </View>
          </View>
        </View>

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
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() =>
                  navigation.navigate("Scanner", { 
                    userUser: userUser,
                    userName: userName,
                    userEmail: userEmail
                  })
                }
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Enviar</Text>
                )}
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
    backgroundColor: "white",
  },
  searchButton: {
    backgroundColor: "#282abd",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
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
