import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import {
  handleBarcodeScan,
  handleEtiquetaConfirm,
  handleShelfConfirm,
  handleManualInput,
  goToHome,
} from "../../handlers/handlerScanner"; // Importação do handlerScanner

import styles from "../../styles/styleScanner";

const Scanner = ({
  route,
}: {
  route: { params?: { userUser?: string; scanType?: string } };
}) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isEtiquetaModalVisible, setEtiquetaModalVisible] = useState(false);
  const [isShelfModalVisible, setShelfModalVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [shelfBarcode, setShelfBarcode] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<"product" | "shelf">("product");

  const [permission, requestPermission] = useCameraPermissions();
  const [isManualInputModalVisible, setManualInputModalVisible] =
    useState(false);
  const [manualProductBarcode, setManualProductBarcode] = useState("");
  const [manualShelfBarcode, setManualShelfBarcode] = useState("");
  const [scanType, setScanType] = useState(route.params?.scanType || "entrada");
  const [scanMessage, setScanMessage] = useState("Escaneie a etiqueta");
  const [isScanning, setIsScanning] = useState(true);

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

  return (
    <View style={styles.container}>
      {/* Status da leitura */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{scanMessage}</Text>
        <Text style={styles.stepIndicator}>
          {scanStep === "product"
            ? "Aguardando leitura da etiqueta"
            : "Aguardando leitura da prateleira"}
        </Text>
      </View>

      {/* Área da câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={
            isEtiquetaModalVisible || isManualInputModalVisible || !isScanning
              ? undefined
              : (data) =>
                  handleBarcodeScan({
                    data,
                    isScanning,
                    scanStep,
                    scanType,
                    routeParams: route.params || {},
                    setIsScanning,
                    setBarcodeData,
                    setScanMessage,
                    setEtiquetaData,
                    setEtiquetaModalVisible,
                    setShelfBarcode,
                    setShelfModalVisible,
                    navigation,
                  })
          }
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
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => goToHome(navigation, route)}
        >
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
            <Text style={styles.modalTitle}>Entrada Manual de Etiquetas</Text>
            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              value={manualProductBarcode}
              onChangeText={setManualProductBarcode}
              placeholder="Digite o código da etiqueta do produto"
              keyboardType="default"
            />
            <TextInput
              style={styles.input}
              value={manualShelfBarcode}
              onChangeText={setManualShelfBarcode}
              placeholder="Digite o código da prateleira"
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
                onPress={() =>
                  handleManualInput({
                    manualProductBarcode,
                    manualShelfBarcode,
                    etiquetaData,
                    scanType,
                    navigation,
                    routeParams: route.params || {},
                    setManualInputModalVisible,
                    setManualProductBarcode,
                    setManualShelfBarcode,
                  })
                }
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação da etiqueta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEtiquetaModalVisible}
        onRequestClose={() => setEtiquetaModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmação de Leitura</Text>
            <Text style={styles.modalText}>
              Etiqueta: {barcodeData || manualProductBarcode}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() =>
                  handleEtiquetaConfirm({
                    barcodeData,
                    manualProductBarcode,
                    setEtiquetaModalVisible,
                    setScanStep,
                    setScanMessage,
                  })
                }
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEtiquetaModalVisible(false);
                  setBarcodeData(null);
                  setManualProductBarcode("");
                  setScanMessage("Escaneie a etiqueta");
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação da prateleira */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShelfModalVisible}
        onRequestClose={() => setShelfModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmação de Leitura</Text>
            <Text style={styles.modalText}>
              Código da Prateleira: {shelfBarcode}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() =>
                  handleShelfConfirm({
                    barcodeData,
                    manualProductBarcode,
                    shelfBarcode,
                    scanType,
                    etiquetaData,
                    navigation,
                    routeParams: route.params || {},
                    setShelfModalVisible,
                    setBarcodeData,
                    setManualProductBarcode,
                    setShelfBarcode,
                    setScanStep,
                    setScanMessage,
                  })
                }
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShelfModalVisible(false);
                  setShelfBarcode(null);
                  setScanMessage("Escaneie o código da prateleira");
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Scanner;
