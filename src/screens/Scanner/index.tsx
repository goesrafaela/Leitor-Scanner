import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native"; // Importação do useNavigation

const Scanner = () => {
  const navigation = useNavigation(); // Hook para navegação
  const [isModalVisible, setModalVisible] = useState(false); // Visibilidade do modal
  const [barcodeData, setBarcodeData] = useState(null); // Dados do código de barras
  const [permission, requestPermission] = useCameraPermissions(); // Permissões da câmera
  const [isManualInputModalVisible, setManualInputModalVisible] =
    useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  const handleBarcodeScan = ({ data }) => {
    setBarcodeData(data);
    setModalVisible(true); // Exibe o modal
  };

  const handleManualInput = () => {
    setManualInputModalVisible(false);
    setBarcodeData(manualBarcode);
    setShowSuccessModal(true);

    // Auto close success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setManualBarcode("");
    }, 2000);
  };

  // Função para voltar à tela inicial
  const goToHome = () => {
    navigation.navigate("Home"); // Navega para a tela "Home"
  };

  return (
    <View style={styles.container}>
      {/* Área da câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back" // Define a câmera traseira como padrão
          onBarcodeScanned={isModalVisible ? undefined : handleBarcodeScan} // Escaneia o código de barras
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

      {/* Modal para exibir as informações do código de barras */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Código de Barras: {barcodeData}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para entrada manual */}
      <Modal
        visible={isManualInputModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setManualInputModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Digite o código de barras</Text>
            <TextInput
              style={styles.input}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              placeholder="Digite o código de barras"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setManualInputModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleManualInput}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de sucesso */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalText}>
              Código de barras: {manualBarcode}
            </Text>
            <Text style={styles.modalText}>Cadastrado com sucesso!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#282abd",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#282abd",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#6c68b5",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#282abd",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Scanner;
