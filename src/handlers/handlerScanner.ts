import { Alert } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { recognizeBarcode, RecognizeRequest } from "../services/api";

interface BarcodeData {
  data: string;
}

// Função para voltar à tela inicial
export const goToHome = (navigation: NavigationProp<any>, route: any) => {
  navigation.navigate("Home", { userUser: route.params?.userUser }); // Navega para a tela "Home" mantendo o usuário
};

// Garante que o userUser seja passado em todas as navegações
export const navigateWithUser = (
  navigation: NavigationProp<any>,
  route: any,
  screen: keyof RootStackParamList,
  params: any = {}
) => {
  navigation.navigate(screen, {
    ...params,
    userUser: route.params?.userUser,
  });
};

interface HandleBarcodeScanParams {
  data: BarcodeData;
  isScanning: boolean;
  scanStep: "product" | "shelf";
  scanType: string;
  routeParams: { userUser?: string };
  setIsScanning: (value: boolean) => void;
  setBarcodeData: (value: string | null) => void;
  setScanMessage: (value: string) => void;
  setEtiquetaData: (value: any) => void;
  setEtiquetaModalVisible: (value: boolean) => void;
  setShelfBarcode: (value: string | null) => void;
  setShelfModalVisible: (value: boolean) => void;
  navigation: NavigationProp<any>;
}

export const handleBarcodeScan = async ({
  data,
  isScanning,
  scanStep,
  scanType,
  routeParams,
  setIsScanning,
  setBarcodeData,
  setScanMessage,
  setEtiquetaData,
  setEtiquetaModalVisible,
  setShelfBarcode,
  setShelfModalVisible,
  navigation,
}: HandleBarcodeScanParams) => {
  if (!isScanning || !data.data) return;

  try {
    if (scanStep === "product") {
      setIsScanning(false);
      setBarcodeData(data.data);
      const recognitionType = scanType === "entrada" ? 1 : 2;

      const requestData: RecognizeRequest = {
        user_id: parseInt(routeParams?.userUser || "1", 10),
        position_id: 1, // Default position ID
        recognition_type: recognitionType,
      };

      setScanMessage("Processando leitura...");

      const response = await recognizeBarcode(data.data, requestData);

      if (response.data?.barcode_label) {
        setEtiquetaData((prev: any) => ({
          ...prev,
          etiqueta: data.data,
          status: response.data.barcode_label.status || "1",
        }));
        setEtiquetaModalVisible(true);
        setScanMessage("Confirme a etiqueta lida");
      } else {
        Alert.alert(
          "Erro",
          response.message || "Erro ao reconhecer etiqueta."
        );
        setScanMessage("Erro ao reconhecer etiqueta. Tente novamente.");
        setBarcodeData(null);
        setTimeout(() => {
          setIsScanning(true);
          setScanMessage("Escaneie a etiqueta");
        }, 3000);
      }
    } else {
      setShelfBarcode(data.data);
      setShelfModalVisible(true);
      setScanMessage("Confirme o código da prateleira");
    }
  } catch (error) {
    Alert.alert("Erro", "Erro ao conectar com o servidor.");
    setScanMessage("Erro ao conectar com o servidor. Tente novamente.");
    setTimeout(() => {
      setIsScanning(true);
      setScanMessage("Escaneie a etiqueta");
    }, 3000);
  }
};

export const handleApiError = (
  response: Response,
  apiResponse: any,
  retryCount: number,
  maxRetries: number,
  {
    setScanMessage,
    setBarcodeData,
    setIsScanning,
    navigation,
  }: {
    setScanMessage: (value: string) => void;
    setBarcodeData: (value: string | null) => void;
    setIsScanning: (value: boolean) => void;
    navigation: NavigationProp<any>;
  }
) => {
  let errorMessage = "Erro desconhecido ao processar a etiqueta.";

  if (response.status === 404) {
    errorMessage = "Etiqueta não encontrada no sistema.";
  } else if (response.status === 400) {
    errorMessage = "Formato de etiqueta inválido.";
  } else if (response.status === 401) {
    errorMessage = "Sessão expirada. Por favor, faça login novamente.";
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
  }
};

export const handleConnectionError = (
  retryCount: number,
  maxRetries: number,
  {
    setScanMessage,
    setIsScanning,
  }: {
    setScanMessage: (value: string) => void;
    setIsScanning: (value: boolean) => void;
  }
) => {
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
  }
};

export const handleEtiquetaConfirm = ({
  barcodeData,
  manualProductBarcode,
  setEtiquetaModalVisible,
  setScanStep,
  setScanMessage,
}: {
  barcodeData: string | null;
  manualProductBarcode: string;
  setEtiquetaModalVisible: (value: boolean) => void;
  setScanStep: (value: "product" | "shelf") => void;
  setScanMessage: (value: string) => void;
}) => {
  const productBarcode = barcodeData || manualProductBarcode;
  if (!productBarcode) {
    Alert.alert("Erro", "É necessário ler a etiqueta.");
    return;
  }
  setEtiquetaModalVisible(false);
  setScanStep("shelf");
  setScanMessage("Escaneie o código da prateleira");
};

export const handleShelfConfirm = ({
  barcodeData,
  manualProductBarcode,
  shelfBarcode,
  scanType,
  etiquetaData,
  navigation,
  routeParams,
  setShelfModalVisible,
  setBarcodeData,
  setManualProductBarcode,
  setShelfBarcode,
  setScanStep,
  setScanMessage,
}: {
  barcodeData: string | null;
  manualProductBarcode: string;
  shelfBarcode: string | null;
  scanType: string;
  etiquetaData: any;
  navigation: NavigationProp<any>;
  routeParams: { userUser?: string };
  setShelfModalVisible: (value: boolean) => void;
  setBarcodeData: (value: string | null) => void;
  setManualProductBarcode: (value: string) => void;
  setShelfBarcode: (value: string | null) => void;
  setScanStep: (value: "product" | "shelf") => void;
  setScanMessage: (value: string) => void;
}) => {
  const productBarcode = barcodeData || manualProductBarcode;
  if (!productBarcode || !shelfBarcode) {
    Alert.alert("Erro", "É necessário ler ambos os códigos.");
    return;
  }
  setShelfModalVisible(false);
  const recognitionType = scanType === "entrada" ? 1 : 2;

  navigation.navigate("EtiquetaInfo", {
    etiquetaData: {
      ...etiquetaData,
      etiqueta: productBarcode,
      endereco: shelfBarcode,
      status: recognitionType === 1 ? "1" : "2",
    },
    userUser: routeParams?.userUser,
  });

  setBarcodeData(null);
  setManualProductBarcode("");
  setShelfBarcode(null);
  setScanStep("product");
  setScanMessage("Escaneie a etiqueta");
};

export const handleManualInput = ({
  manualProductBarcode,
  manualShelfBarcode,
  etiquetaData,
  scanType,
  navigation,
  routeParams,
  setManualInputModalVisible,
  setManualProductBarcode,
  setManualShelfBarcode,
}: {
  manualProductBarcode: string;
  manualShelfBarcode: string;
  etiquetaData: any;
  scanType: string;
  navigation: NavigationProp<any>;
  routeParams: { userUser?: string };
  setManualInputModalVisible: (value: boolean) => void;
  setManualProductBarcode: (value: string) => void;
  setManualShelfBarcode: (value: string) => void;
}) => {
  if (!manualProductBarcode || !manualShelfBarcode) {
    Alert.alert("Erro", "Por favor, preencha todos os campos.");
    return;
  }

  const etiquetaDataWithBarcodes = {
    ...etiquetaData,
    etiqueta: manualProductBarcode,
    endereco: manualShelfBarcode,
  };

  const targetScreen = scanType === "entrada" ? "EtiquetaInfo" : "AprovacaoInfo";

  navigation.navigate(targetScreen, {
    etiquetaData: etiquetaDataWithBarcodes,
    userUser: routeParams?.userUser,
  });

  setManualInputModalVisible(false);
  setManualProductBarcode("");
  setManualShelfBarcode("");
};
