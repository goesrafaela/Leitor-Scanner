import { Alert } from "react-native";
import { recognizeBarcode, RecognizeRequest } from "../services/api";

interface HandleSaveParams {
  editedEtiqueta: string;
  editedEndereco: string;
  userUser: string;
  setEtiquetaData: React.Dispatch<React.SetStateAction<any>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleSave = async ({
  editedEtiqueta,
  editedEndereco,
  userUser,
  setEtiquetaData,
  setIsEditing,
}: HandleSaveParams) => {
  if (!editedEtiqueta || !editedEndereco) {
    Alert.alert("Atenção", "Por favor, preencha todos os campos.");
    return;
  }

  try {
    
    const requestData: RecognizeRequest = {
      user_id: parseInt(userUser, 10),
      position_id: parseInt(editedEndereco, 10),
      recognition_type: 3, // Movimentação de estoque
    };

    const response = await recognizeBarcode(editedEtiqueta, requestData);

    if (response.errors) {
      Alert.alert("Erro", response.errors[0] || "Erro ao atualizar etiqueta.");
    } else {
      Alert.alert("Sucesso", response.message || "Etiqueta atualizada com sucesso.");
      setEtiquetaData((prev) => ({
        ...prev,
        etiqueta: editedEtiqueta,
        endereco: editedEndereco,
      }));
      setIsEditing(false);
    }
  } catch (error) {
    Alert.alert("Erro", "Não foi possível conectar ao servidor. Tente novamente.");
  }
};