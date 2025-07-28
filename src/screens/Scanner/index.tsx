import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { recognizeBarcode, RecognizeRequest } from "../../services/api";

const Scanner = ({
  route,
}: {
  route: { params?: { userUser?: string; scanType?: string; userName?: string; userEmail?: string } };
}) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isEtiquetaModalVisible, setEtiquetaModalVisible] = useState(false);
  const [isShelfModalVisible, setShelfModalVisible] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [shelfBarcode, setShelfBarcode] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<"product" | "shelf">("product");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [failedShelfAttempts, setFailedShelfAttempts] = useState(0);
  const [scanType, setScanType] = useState(route.params?.scanType || "entrada");
  const [scanMessage, setScanMessage] = useState("Escaneie a etiqueta");
  const [isScanning, setIsScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isManualInputModalVisible, setManualInputModalVisible] =
    useState(false);
  const [manualProductBarcode, setManualProductBarcode] = useState("");
  const [manualShelfBarcode, setManualShelfBarcode] = useState("");

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
      const isEntrada = scanType === "entrada";
      
      try {
        setScanMessage("Processando leitura...");
        
        // Preparar os dados para a requisição
        const requestData: RecognizeRequest = {
          user_id: parseInt(route.params?.userUser || "1"),
          position_id: 1, // Valor padrão, será atualizado na tela de confirmação
          recognition_type: recognitionType as 1 | 2 | 3,
        };
        
        // Chamar a API para reconhecer o código de barras
        const apiResponse = await recognizeBarcode(data, requestData);
        

        
        if (apiResponse.data?.barcode_label) {
          // Atualizar os dados da etiqueta com a resposta da API
          const updatedEtiquetaData = {
            ...etiquetaData,
            etiqueta: data,
            status: apiResponse.data.barcode_label.status || "1",
            material: apiResponse.data.barcode_label.material || etiquetaData.material,
            descricaoMaterial: apiResponse.data.barcode_label.descricaoMaterial || etiquetaData.descricaoMaterial,
            op: apiResponse.data.barcode_label.op || etiquetaData.op,
            qm: apiResponse.data.barcode_label.qm || etiquetaData.qm,
            qtde: apiResponse.data.barcode_label.qtde || etiquetaData.qtde,
            // Usar informações da API de reconhecimento
            positionId: apiResponse.data.barcode_label.positionId,
            endereco: apiResponse.data.barcode_label.endereco,
            descricaoEndereco: apiResponse.data.barcode_label.descricaoEndereco,
          };
          
          setEtiquetaData(updatedEtiquetaData);
          
          if (isEntrada) {
            // Para entrada, mostrar modal de confirmação
            setEtiquetaModalVisible(true);
            setScanMessage("Confirme a etiqueta lida");
          } else {
            // Para saída, navegar para a tela de aprovação
            navigation.navigate("AprovacaoInfo", {
              etiquetaData: updatedEtiquetaData,
              userUser: route.params?.userUser,
              userName: route.params?.userName,
              userEmail: route.params?.userEmail,
            });
          }
          return;
        } else {
          // Tratar erros da API
          let errorMessage = apiResponse.message || "Erro desconhecido ao processar a etiqueta.";
          
          if (apiResponse.errors) {
            // Formatar mensagens de erro se houver
            const errorMessages = Object.values(apiResponse.errors)
              .flat()
              .join("\n");
            errorMessage = errorMessages || errorMessage;
          }
          
          // Verificar se devemos ir para entrada manual
          const shouldGoToManualInput = errorMessage.includes("não encontrada") || 
                                       errorMessage.includes("not found");
          
          if (shouldGoToManualInput) {
            navigation.navigate("ManualInput", {
              scanType: scanType,
              userUser: route.params?.userUser,
            });
            return;
          }
          
          Alert.alert("Erro ao reconhecer etiqueta", errorMessage);
          setScanMessage("Erro ao reconhecer etiqueta. Tente novamente.");
          setBarcodeData(null);
          setTimeout(() => {
            setIsScanning(true);
            setScanMessage("Escaneie a etiqueta");
          }, 3000);
          return;
        }
      } catch (error) {
        console.error("Erro ao processar código de barras:", error);
        Alert.alert(
          "Erro de conexão",
          "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
        );
        setScanMessage("Erro de conexão. Tente novamente.");
        setTimeout(() => {
          setIsScanning(true);
          setScanMessage("Escaneie a etiqueta");
        }, 3000);
        return;
      }
    }
    
    if (scanStep === "shelf") {
      // Escaneamento da prateleira
      setIsScanning(false);
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
    if (scanType === "entrada") {
      setScanStep("shelf");
      setScanMessage("Escaneie o código da prateleira");
      setIsScanning(true);
      // Limpar o código da prateleira para a nova leitura
      setShelfBarcode(null);
    }
  };

  const handleShelfConfirm = async () => {
    const productBarcode = barcodeData || manualProductBarcode;
    if (!productBarcode || !shelfBarcode) {
      Alert.alert("Erro", "É necessário ler ambos os códigos.");
      return;
    }
    setShelfModalVisible(false);
    setScanMessage("Processando...");
    
    try {
      // Preparar os dados para a requisição
      const recognitionType = scanType === "entrada" ? 1 : 2;
      const requestData: RecognizeRequest = {
        user_id: parseInt(route.params?.userUser || "1"),
        position_id: parseInt(shelfBarcode),
        recognition_type: recognitionType as 1 | 2 | 3,
      };
      
      // Chamar a API para reconhecer o código de barras com a posição
      const apiResponse = await recognizeBarcode(productBarcode, requestData);



    if (apiResponse.data?.barcode_label) {
      // Atualizar os dados da etiqueta com a resposta da API
      const updatedEtiquetaData = {
        ...etiquetaData,
        etiqueta: productBarcode,
        endereco: shelfBarcode,
        status: apiResponse.data.barcode_label.status || "1",
        material: apiResponse.data.barcode_label.material || etiquetaData.material,
        descricaoMaterial: apiResponse.data.barcode_label.descricaoMaterial || etiquetaData.descricaoMaterial,
        op: apiResponse.data.barcode_label.op || etiquetaData.op,
        qm: apiResponse.data.barcode_label.qm || etiquetaData.qm,
        qtde: apiResponse.data.barcode_label.qtde || etiquetaData.qtde,
        positionId: apiResponse.data.barcode_label.positionId || shelfBarcode,
        descricaoEndereco: apiResponse.data.barcode_label.descricaoEndereco,
      };
      
      // Navegar para a tela de informações da etiqueta
      navigation.navigate("EtiquetaInfo", {
        etiquetaData: updatedEtiquetaData,
        userUser: route.params?.userUser,
        userName: route.params?.userName,
        userEmail: route.params?.userEmail,
      });

      setBarcodeData(null);
      setManualProductBarcode("");
      setShelfBarcode(null);
      setScanStep("product");
      setScanMessage("Escaneie a etiqueta");
    } else {
      // Tratar erros da API
      let errorMessage = apiResponse.message || "Erro desconhecido ao processar a etiqueta.";
      
      if (apiResponse.errors) {
        // Formatar mensagens de erro se houver
        const errorMessages = Object.values(apiResponse.errors)
          .flat()
          .join("\n");
        errorMessage = errorMessages || errorMessage;
      }
      
      Alert.alert("Erro ao reconhecer etiqueta", errorMessage);
      setScanMessage("Erro ao reconhecer etiqueta. Tente novamente.");
      setBarcodeData(null);
      setShelfBarcode(null);
      setTimeout(() => {
        setIsScanning(true);
        setScanMessage("Escaneie a etiqueta");
      }, 3000);
    }
  } catch (error) {
    console.error("Erro ao processar código de barras com prateleira:", error);
    Alert.alert(
      "Erro de conexão",
      "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
    );
    setScanMessage("Erro de conexão. Tente novamente.");
    setBarcodeData(null);
    setShelfBarcode(null);
    setTimeout(() => {
      setIsScanning(true);
      setScanMessage("Escaneie a etiqueta");
    }, 3000);
  }
  };

  const handleManualInput = async () => {
    if (
      !manualProductBarcode ||
      (scanType === "entrada" && !manualShelfBarcode)
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos necessários.");
      return;
    }

    setManualInputModalVisible(false);
    setScanMessage("Processando...");

    try {
      // Preparar os dados para a requisição
      const recognitionType = scanType === "entrada" ? 1 : 2;
      const requestData: RecognizeRequest = {
        user_id: parseInt(route.params?.userUser || "1"),
        position_id: scanType === "entrada" ? parseInt(manualShelfBarcode) : 1,
        recognition_type: recognitionType as 1 | 2 | 3,
      };
      
      // Chamar a API para reconhecer o código de barras
      const apiResponse = await recognizeBarcode(manualProductBarcode, requestData);
      

      
      if (apiResponse.data?.barcode_label) {
        // Atualizar os dados da etiqueta com a resposta da API
        const updatedEtiquetaData = {
          ...etiquetaData,
          etiqueta: manualProductBarcode,
          endereco: manualShelfBarcode,
          status: apiResponse.data.barcode_label.status || "1",
          material: apiResponse.data.barcode_label.material || etiquetaData.material,
          descricaoMaterial: apiResponse.data.barcode_label.descricaoMaterial || etiquetaData.descricaoMaterial,
          op: apiResponse.data.barcode_label.op || etiquetaData.op,
          qm: apiResponse.data.barcode_label.qm || etiquetaData.qm,
          qtde: apiResponse.data.barcode_label.qtde || etiquetaData.qtde,
          positionId: apiResponse.data.barcode_label.positionId || manualShelfBarcode,
          descricaoEndereco: apiResponse.data.barcode_label.descricaoEndereco,
        };
        
        if (scanType === "entrada") {
          navigation.navigate("EtiquetaInfo", {
            etiquetaData: updatedEtiquetaData,
            userUser: route.params?.userUser,
            userName: route.params?.userName,
            userEmail: route.params?.userEmail,
          });
        } else {
          navigation.navigate("AprovacaoInfo", {
            etiquetaData: updatedEtiquetaData,
            userUser: route.params?.userUser,
            userName: route.params?.userName,
            userEmail: route.params?.userEmail,
          });
        }
      } else {
        // Tratar erros da API
        let errorMessage = apiResponse.message || "Erro desconhecido ao processar a etiqueta.";
        
        if (apiResponse.errors) {
          // Formatar mensagens de erro se houver
          const errorMessages = Object.values(apiResponse.errors)
            .flat()
            .join("\n");
          errorMessage = errorMessages || errorMessage;
        }
        
        Alert.alert("Erro ao reconhecer etiqueta", errorMessage);
        setScanMessage("Erro ao reconhecer etiqueta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao processar código de barras manual:", error);
      Alert.alert(
        "Erro de conexão",
        "Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
      );
      setScanMessage("Erro de conexão. Tente novamente.");
    }
    
    setManualProductBarcode("");
    setManualShelfBarcode("");
  };

  // Função para voltar à tela inicial
  const goToHome = () => {
    // Navega para a tela "Home" mantendo todos os dados do usuário
    navigation.navigate("Home", { 
      userUser: route.params?.userUser,
      userName: route.params?.userName,
      userEmail: route.params?.userEmail
    });
  };

  // Garante que todos os dados do usuário sejam passados em todas as navegações
  const navigateWithUser = (
    screen: keyof RootStackParamList,
    params: any = {}
  ) => {
    navigation.navigate(screen, {
      ...params,
      userUser: route.params?.userUser,
      userName: route.params?.userName,
      userEmail: route.params?.userEmail,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{scanMessage}</Text>
        <Text style={styles.stepIndicator}>
          {scanStep === "product" ? "Passo 1/2" : "Passo 2/2"}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barCodeTypes: ["qr", "ean13", "code128"],
          }}
          onBarcodeScanned={isScanning ? handleBarcodeScan : undefined}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("ManualInput", {
              scanType: scanType,
              userUser: route.params?.userUser,
            })
          }
        >
          <Text style={styles.buttonText}>Entrada Manual</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={goToHome}>
          <Text style={styles.buttonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>

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
      {/* Manual Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isManualInputModalVisible}
        onRequestClose={() => setManualInputModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {scanStep === "product"
                ? "Digite o código da etiqueta"
                : "Digite o código da prateleira"}
            </Text>
            <TextInput
              style={styles.input}
              value={
                scanStep === "product"
                  ? manualProductBarcode
                  : manualShelfBarcode
              }
              onChangeText={(text) =>
                scanStep === "product"
                  ? setManualProductBarcode(text)
                  : setManualShelfBarcode(text)
              }
              placeholder="Digite o código"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setManualInputModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  if (scanStep === "product") {
                    handleEtiquetaConfirm();
                  } else {
                    handleShelfConfirm();
                  }
                  setManualInputModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusContainer: {
    padding: 35,
    backgroundColor: "#282abd",
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  stepIndicator: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  actionButton: {
    backgroundColor: "#282abd",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#282abd",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#282abd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c68b5",
  },
  confirmButton: {
    backgroundColor: "#282abd",
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Scanner;
