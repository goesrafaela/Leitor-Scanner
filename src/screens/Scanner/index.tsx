import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";

const Scanner = ({ route }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isEtiquetaModalVisible, setEtiquetaModalVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isManualInputModalVisible, setManualInputModalVisible] =
    useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBarcode, setEditedBarcode] = useState("");

  // Função que simula a obtenção automática da localização
  const getAutomaticLocation = () => {
    return {
      endereco: "A001",
      descricaoEndereco: "CORREDOR [ A ] PRATE",
    };
  };

  // Dados fictícios para simular a API
  const [etiquetaData, setEtiquetaData] = useState({
    endereco: "A001",
    deposito: "04",
    etiqueta: "R00253",
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
  });

  // Verifica se as permissões foram concedidas
  if (!permission) {
    return <View />; // Ainda carregando as permissões
  }

  if (!permission.granted) {
    // Permissões não concedidas
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para acessar a câmera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Função chamada quando um código de barras é escaneado
  interface BarcodeData {
    data: string;
  }
  const handleBarcodeScan = ({ data }: BarcodeData) => {
    if (data) {
      setBarcodeData(data);
      setEtiquetaModalVisible(true);
    }
  };

  const handleManualInput = () => {
    if (manualBarcode.trim() === "") {
      Alert.alert("Erro", "Por favor, digite um código de barras válido.");
      return;
    }
    setBarcodeData(manualBarcode);
    setManualInputModalVisible(false);
    setEtiquetaModalVisible(true);
  };

  const handleEtiquetaConfirm = () => {
    const barcode = barcodeData || manualBarcode;
    if (!barcode) {
      Alert.alert("Erro", "Nenhum código de barras foi lido ou digitado.");
      return;
    }
    const automaticLocation = getAutomaticLocation();
    setEtiquetaModalVisible(false);
    navigation.navigate("EtiquetaInfo", {
      etiquetaData: {
        ...etiquetaData,
        etiqueta: barcode,
        endereco: automaticLocation.endereco,
        descricaoEndereco: automaticLocation.descricaoEndereco,
      },
      userUser: route.params?.userName,
    });
    setBarcodeData(null);
    setManualBarcode("");
  };

  // Função para voltar à tela inicial
  const goToHome = () => {
    navigation.navigate("Home", { userUser: route.params?.userName }); // Navega para a tela "Home" mantendo o usuário
  };

  // Garante que o userUser seja passado em todas as navegações
  const navigateWithUser = (
    screen: keyof RootStackParamList,
    params: any = {}
  ) => {
    navigation.navigate(screen, {
      ...params,
      userUser: route.params?.userName,
    });
  };

  return (
    <View style={styles.container}>
      {/* Área da câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back" // Define a câmera traseira como padrão
          onBarcodeScanned={
            isEtiquetaModalVisible || isManualInputModalVisible
              ? undefined
              : handleBarcodeScan
          } // Escaneia o código de barras
        />
      </View>

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setManualInputModalVisible(true)}
        >
          <Text style={styles.buttonText}>Entrada Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={goToHome}>
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de entrada manual */}
      <Modal
        visible={isManualInputModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setManualInputModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrada Manual de Etiqueta</Text>
            <TextInput
              style={styles.input}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              placeholder="Digite o código de barras"
              keyboardType="default"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setManualInputModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleManualInput}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Etiqueta */}
      <Modal
        visible={isEtiquetaModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEtiquetaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Etiqueta</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedBarcode}
                onChangeText={setEditedBarcode}
                placeholder="Digite o código de barras"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.modalText}>
                Código lido: {barcodeData || manualBarcode}
              </Text>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setEtiquetaModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              {isEditing ? (
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={() => {
                    setBarcodeData(editedBarcode);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => {
                      setEditedBarcode(barcodeData || manualBarcode);
                      setIsEditing(true);
                    }}
                  >
                    <Text style={styles.buttonText}>Editar código</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleEtiquetaConfirm}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.approvalButton]}
                    onPress={() => {
                      setEtiquetaModalVisible(false);
                      navigation.navigate("AprovacaoInfo", {
                        etiquetaData: {
                          ...etiquetaData,
                          etiqueta: barcodeData || manualBarcode,
                        },
                        userUser: route.params?.userName,
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>Verificar Aprovação</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  actionButton: {
    backgroundColor: "#4169E1",
    padding: 15,
    borderRadius: 8,
    width: "45%",
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#282abd",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "white",
    color: "#000",
  },
  modalButtons: {
    gap: 5,
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    marginBottom: 16,

    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c68b5",
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#4169E1",
    marginBottom: 16,
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#282abd",
    marginTop: 8, // Adicionando margem superior para separaçã
    marginBottom: 16,
  },
  approvalButton: {
    backgroundColor: "#282abd",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  txtHome: {
    fontSize: 20,
    marginBottom: 25,
    color: "#EFB719",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  cameraContainer: {
    width: "80%",
    height: 300,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  button: {
    padding: 10,
    backgroundColor: "#282abd",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  homeButton: {
    padding: 10,
    backgroundColor: "#282abd",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#6495ED",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "90%",
    marginVertical: 20,
    elevation: 5,
  },
  modalRow: {
    flexDirection: "column",
    marginBottom: 15,
    width: "100%",
  },
  modalField: {
    width: "100%",
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 18,
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  modalValueDesc: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  modalInputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    padding: 12,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#4169E1",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#4169E1",
    marginBottom: 16,
    width: "100%",
  },
  modalText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
});

export default Scanner;
