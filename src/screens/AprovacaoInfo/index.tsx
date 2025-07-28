import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../types/navigation";

interface AprovacaoData {
  etiqueta: string;
  material: string;
  descricaoMaterial: string;
  op: string;
  qm: string;
  qtde: string;
  status: string;
  data: string;
  hora: string;
  operador: string;
  endereco?: string;
  positionId?: string;
  descricaoEndereco?: string;
  location?: string;
}

const AprovacaoInfo = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute();
  const etiquetaData = route.params?.etiquetaData as AprovacaoData;
  const userUser = route.params?.userUser;
  const userName = route.params?.userName;
  const userEmail = route.params?.userEmail;

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
            <Text style={styles.label}>Localização:</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.value}>
                {etiquetaData.endereco || etiquetaData.positionId || "Não disponível"}
              </Text>
              <Text style={styles.valueDesc}>
                {etiquetaData.descricaoEndereco || etiquetaData.location || ""}
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
              navigation.navigate("Scanner", { 
                userUser: userUser,
                userName: userName,
                userEmail: userEmail
              })
            }
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  row: {
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  field: {
    marginVertical: 2,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  inputContainer: {
    marginTop: 1,
  },
  value: {
    fontSize: 14,
    color: "#282abd",
    fontWeight: "bold",
  },
  valueDesc: {
    fontSize: 12,
    color: "#333",
    marginTop: 1,
  },
  approvedStatus: {
    color: "#32CD32",
  },
  button: {
    backgroundColor: "#282abd",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  backButton: {
    backgroundColor: "#282abd",
    flex: 1,
  },
});

export default AprovacaoInfo;
