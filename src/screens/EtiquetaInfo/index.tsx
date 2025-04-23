import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { EtiquetaData } from "../../interfaces/IEtiquetaData";
import styles from "../../styles/styleEtiquetaInfo";

const EtiquetaInfo = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute();
  const [etiquetaData, setEtiquetaData] = useState(
    route.params?.etiquetaData as EtiquetaData
  );
  const userUser = route.params?.userUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedEtiqueta, setEditedEtiqueta] = useState(etiquetaData.etiqueta);
  const [editedEndereco, setEditedEndereco] = useState(etiquetaData.endereco);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `/barcode-labels/${editedEtiqueta}/recognize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userUser,
            position_id: editedEndereco,
            recognition_type: 3, // Movimentação de estoque
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", data.message);
        setEtiquetaData((prev) => ({
          ...prev,
          etiqueta: editedEtiqueta,
          endereco: editedEndereco,
        }));
        setIsEditing(false);
      } else {
        Alert.alert("Erro", data.message || "Erro ao atualizar etiqueta");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Endereço:</Text>
            <View style={styles.inputContainer}>
              {isEditing ? (
                <TextInput
                  style={[styles.value, styles.input]}
                  value={editedEndereco}
                  onChangeText={setEditedEndereco}
                />
              ) : (
                <Text style={styles.value}>{etiquetaData.endereco}</Text>
              )}
              <Text style={styles.valueDesc}>
                {etiquetaData.descricaoEndereco}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Etiqueta:</Text>
            <View style={styles.inputContainer}>
              {isEditing ? (
                <TextInput
                  style={[styles.value, styles.input]}
                  value={editedEtiqueta}
                  onChangeText={setEditedEtiqueta}
                />
              ) : (
                <Text style={styles.value}>{etiquetaData.etiqueta}</Text>
              )}
              <Text style={styles.valueDesc}>
                OP: {etiquetaData.op} QM: {etiquetaData.qm} Qtde(Pç/Kg):{" "}
                {etiquetaData.qtde}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>
                {etiquetaData.status === "3"
                  ? "PROCESSANDO"
                  : etiquetaData.status === "1"
                  ? "APROVADO"
                  : "PENDENTE"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Origem:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.origem}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Depósito Atual:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.depositoAtual}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Localização:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.descricaoDeposito}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Material:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.material}</Text>
              <Text style={styles.valueDesc}>
                {etiquetaData.descricaoMaterial}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Operador:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.operador}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Data:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.data}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Hora:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.hora}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() =>
                  navigation.navigate("Scanner", { userName: userUser })
                }
              >
                <Text style={styles.buttonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default EtiquetaInfo;
