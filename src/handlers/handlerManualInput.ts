import { Alert } from "react-native";
import { recognizeBarcode, RecognizeRequest } from "../services/api";
import { HandleConfirmParams } from "./interfaces/IHandleConfirmParams";

export const handleConfirm = async ({
  productCode,
  shelfCode,
  route,
  navigation,
}: HandleConfirmParams) => {
  if (!productCode || !shelfCode) {
    Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    return;
  }

  const scanType = route.params?.scanType || "entrada";
  const recognitionType = scanType === "entrada" ? 1 : 2;

  try {
    const requestData: RecognizeRequest = {
      user_id: parseInt(route.params?.userUser || "1", 10),
      position_id: parseInt(shelfCode, 10),
      recognition_type: recognitionType,
    };

    const response = await recognizeBarcode(productCode, requestData);

    if (response.data?.barcode_label) {

      const etiquetaData = {
        endereco: shelfCode,
        deposito: "04",
        etiqueta: productCode,
        material: response.data.barcode_label.material || "STR3004376",
        operador: route.params?.userUser || "02",
        status: response.data.barcode_label.status || "1",
        data: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        descricaoMaterial:
          response.data.barcode_label.descricao_material ||
          "HOLDER PORTA DIANTEIRA LE 9.0",
        descricaoDeposito: "Almoxarifado",
        descricaoEndereco: "CORREDOR [ A ] PRATE",
        origem: "11",
        depositoAtual: "09",
        op: response.data.barcode_label.op || "32487",
        qm: response.data.barcode_label.qm || "0",
        qtde: response.data.barcode_label.qtde || "100.0000",
        userUser: route.params?.userUser,
      };

      if (scanType === "entrada") {
        navigation.navigate("EtiquetaInfo", { etiquetaData });
      } else {
        navigation.navigate("AprovacaoInfo", { etiquetaData });
      }
    } else {
      Alert.alert(
        "Erro",
        response.message || "Erro ao reconhecer etiqueta."
      );
    }
  } catch (error) {
    Alert.alert("Erro", "Erro ao conectar com o servidor.");
  }

};