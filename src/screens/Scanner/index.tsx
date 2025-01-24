import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native"; // Importação do useNavigation

const Scanner = () => {
  const navigation = useNavigation(); // Hook para navegação
  const [isModalVisible, setModalVisible] = useState(false); // Visibilidade do modal
  const [barcodeData, setBarcodeData] = useState(null); // Dados do código de barras
  const [permission, requestPermission] = useCameraPermissions(); // Permissões da câmera

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

  // Função para voltar à tela inicial
  const goToHome = () => {
    navigation.navigate("Home"); // Navega para a tela "Home"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtHome}>Scanner</Text>

      {/* Área da câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back" // Define a câmera traseira como padrão
          onBarcodeScanned={isModalVisible ? undefined : handleBarcodeScan} // Escaneia o código de barras
        />
      </View>

      {/* Botão para voltar à tela inicial */}
      <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
        <Text style={styles.homeButtonText}>Voltar para Home</Text>
      </TouchableOpacity>

      {/* Modal para exibir as informações do código de barras */}
      <Modal
        visible={isModalVisible} // Controla a visibilidade do modal
        animationType="slide" // Animação de entrada/saída
        transparent={true} // Fundo transparente
        onRequestClose={() => setModalVisible(false)} // Fecha o modal ao pressionar o botão de voltar (Android)
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Código de Barras: {barcodeData}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#EF4219",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  homeButton: {
    padding: 10,
    backgroundColor: "#EF4219",
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
    backgroundColor: "#EF4219",
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Scanner;