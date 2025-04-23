import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";
import { AprovacaoData } from "../../interfaces/IAprovacaoData";
import styles from "../../styles/styleAprovacaoInfo";

const AprovacaoInfo = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute();
  const etiquetaData = route.params?.etiquetaData as AprovacaoData;
  const userUser = route.params?.userUser;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Etiqueta:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>{etiquetaData.etiqueta}</Text>
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
              <Text style={[styles.value, styles.approvedStatus]}>
                APROVADO
              </Text>
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
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() =>
              navigation.navigate("Scanner", { userName: userUser })
            }
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AprovacaoInfo;
