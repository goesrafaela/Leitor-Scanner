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
  const handleBarcodeScan = async ({ data }: BarcodeData) => {
    if (!isScanning || !data) return;

    if (scanStep === "product") {
      setIsScanning(false);
      setBarcodeData(data);
      const recognitionType = scanType === "entrada" ? 1 : 2;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          setScanMessage("Processando leitura...");
          const response = await fetch(
            `https://demo-polymer.meusalt.com.br/api/barcode-labels/${data}/recognize`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: parseInt(route.params?.userUser || "1"),
                position_id: 1,
                recognition_type: recognitionType,
              }),
            }
          );

          const apiResponse = await response.json();

          if (response.ok && apiResponse.data?.barcode_label) {
            setEtiquetaData((prev) => ({
              ...prev,
              etiqueta: data,
              status: apiResponse.data.barcode_label.status || "1",
            }));
            setEtiquetaModalVisible(true);
            setScanMessage("Confirme a etiqueta lida");
            break;
          } else {
            let errorMessage = "Erro desconhecido ao processar a etiqueta.";

            if (response.status === 404) {
              errorMessage = "Etiqueta não encontrada no sistema.";
            } else if (response.status === 400) {
              errorMessage = "Formato de etiqueta inválido.";
            } else if (response.status === 401) {
              errorMessage =
                "Sessão expirada. Por favor, faça login novamente.";
              navigation.navigate("Login");
              return;
            } else if (apiResponse.message) {
              errorMessage = apiResponse.message;
            }

            if (retryCount === maxRetries - 1) {
              Alert.alert("Erro ao reconhecer etiqueta", errorMessage);
              setScanMessage("Erro ao reconhecer etiqueta. Tente novamente.");
              setBarcodeData(null);
              setTimeout(() => {
                setIsScanning(true);
                setScanMessage("Escaneie a etiqueta");
              }, 3000);
              break;
            }
            retryCount++;
          }
        } catch (error) {
          if (retryCount === maxRetries - 1) {
            Alert.alert(
              "Erro de conexão",
              "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
            );
            setScanMessage("Erro de conexão. Tente novamente.");
            setTimeout(() => {
              setIsScanning(true);
              setScanMessage("Escaneie a etiqueta");
            }, 3000);
            break;
          }
          retryCount++;
        }

        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } else {
      setShelfBarcode(data);
      setShelfModalVisible(true);
      setScanMessage("Confirme o código da prateleira");
    }
  };

  const handleEtiquetaConfirm = () => {
    const productBarcode = barcodeData || manualProductBarcode;
    if (!productBarcode) {
      Alert.alert("Erro", "É necessário ler a etiqueta.");
      return;
    }
    setEtiquetaModalVisible(false);
    setScanStep("shelf");
    setScanMessage("Escaneie o código da prateleira");
  };

  const handleShelfConfirm = () => {
    const productBarcode = barcodeData || manualProductBarcode;
    if (!productBarcode || !shelfBarcode) {
      Alert.alert("Erro", "É necessário ler ambos os códigos.");
      return;
    }
    setShelfModalVisible(false);
    const recognitionType = scanType === "entrada" ? 1 : 2;

    // Simular chamada da API
    const apiResponse = {
      message: "Etiqueta reconhecida com sucesso.",
      data: {
        barcode_label: {
          etiqueta: productBarcode,
          status: recognitionType === 1 ? "1" : Math.random() > 0.5 ? "1" : "2",
        },
      },
    };

    navigation.navigate("EtiquetaInfo", {
      etiquetaData: {
        ...etiquetaData,
        etiqueta: productBarcode,
        endereco: shelfBarcode,
        status: apiResponse.data.barcode_label.status,
      },
      userUser: route.params?.userUser,
    });

    setBarcodeData(null);
    setManualProductBarcode("");
    setShelfBarcode(null);
    setScanStep("product");
    setScanMessage("Escaneie a etiqueta");
  };

  const handleManualInput = () => {
    if (!manualProductBarcode || !manualShelfBarcode) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const etiquetaDataWithBarcodes = {
      ...etiquetaData,
      etiqueta: manualProductBarcode,
      endereco: manualShelfBarcode,
    };

    if (scanType === "entrada") {
      navigation.navigate("EtiquetaInfo", {
        etiquetaData: etiquetaDataWithBarcodes,
        userUser: route.params?.userUser,
      });
    } else {
      navigation.navigate("AprovacaoInfo", {
        etiquetaData: etiquetaDataWithBarcodes,
        userUser: route.params?.userUser,
      });
    }

    setManualInputModalVisible(false);
    setManualProductBarcode("");
    setManualShelfBarcode("");
  };

  // Função para voltar à tela inicial
  const goToHome = () => {
    navigation.navigate("Home", { userUser: route.params?.userUser }); // Navega para a tela "Home" mantendo o usuário
  };

  // Garante que o userUser seja passado em todas as navegações
  const navigateWithUser = (
    screen: keyof RootStackParamList,
    params: any = {}
  ) => {
    navigation.navigate(screen, {
      ...params,
      userUser: route.params?.userUser,
    });
  };

  return (
    <View style={styles.container}>
      {/* Status da leitura */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{scanMessage}</Text>
        <Text style={styles.stepIndicator}>Aguardando leitura da etiqueta</Text>
      </View>

      {/* Área da câmera */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={
            isEtiquetaModalVisible || isManualInputModalVisible || !isScanning
              ? undefined
              : handleBarcodeScan
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
                onPress={handleManualInput}
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
                onPress={handleEtiquetaConfirm}
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
                onPress={handleShelfConfirm}
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
