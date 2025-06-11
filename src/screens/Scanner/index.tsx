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
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        setFailedAttempts(0);
        setScanStep("product");
        setIsScanning(true);
        setScanMessage("Escaneie a etiqueta novamente");
        return;
      }

      if (!isEntrada) {
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
            navigation.navigate("AprovacaoInfo", {
              etiquetaData: {
                ...etiquetaData,
                etiqueta: data,
                status: apiResponse.data.barcode_label.status,
              },
              userUser: route.params?.userUser,
            });
            return;
          } else {
            let errorMessage = "Erro desconhecido ao processar a etiqueta.";

            if (response.status === 404) {
              navigation.navigate("ManualInput", {
                scanType: scanType,
                userUser: route.params?.userUser,
              });
              return;
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
      if (isEntrada) {
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
            if (isEntrada) {
              setEtiquetaModalVisible(true);
              setScanMessage("Confirme a etiqueta lida");
            } else {
              navigation.navigate("AprovacaoInfo", {
                etiquetaData: {
                  ...etiquetaData,
                  etiqueta: data,
                  status: apiResponse.data.barcode_label.status,
                },
                userUser: route.params?.userUser,
              });
            }
            return;
          } else {
            let errorMessage = "Erro desconhecido ao processar a etiqueta.";

            if (response.status === 404) {
              navigation.navigate("ManualInput", {
                scanType: scanType,
                userUser: route.params?.userUser,
              });
              return;
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
            return;
          }
          retryCount++;
        }

        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } else {
      setShelfBarcode(data);
      const newFailedShelfAttempts = failedShelfAttempts + 1;
      setFailedShelfAttempts(newFailedShelfAttempts);

      if (newFailedShelfAttempts >= 3) {
        navigation.navigate("ManualInput", {
          scanType: scanType,
          userUser: route.params?.userUser,
        });
        setFailedShelfAttempts(0);
      } else {
        setShelfModalVisible(true);
        setScanMessage("Confirme o código da prateleira");
      }
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
    }
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
    if (
      !manualProductBarcode ||
      (scanType === "entrada" && !manualShelfBarcode)
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos necessários.");
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
