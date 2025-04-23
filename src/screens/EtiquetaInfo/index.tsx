import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { EtiquetaData } from "../../interfaces/IEtiquetaData";
import styles from "../../styles/styleEtiquetaInfo";
import { handleSave } from "../../handlers/handlerEtiquetaInfo"; // Importação do handler corrigida

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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEtiqueta(etiquetaData.etiqueta);
    setEditedEndereco(etiquetaData.endereco);
  };

  const handleSaveChanges = async () => {
    try {
      await handleSave({
        editedEtiqueta,
        editedEndereco,
        userUser,
        setEtiquetaData,
        setIsEditing,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Etiqueta:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedEtiqueta}
              onChangeText={setEditedEtiqueta}
            />
          ) : (
            <Text style={styles.value}>{etiquetaData.etiqueta}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Endereço:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedEndereco}
              onChangeText={setEditedEndereco}
            />
          ) : (
            <Text style={styles.value}>{etiquetaData.endereco}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveChanges}
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
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default EtiquetaInfo;