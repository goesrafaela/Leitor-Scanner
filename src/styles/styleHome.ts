import {  StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 50,
  },
  txtHome: {
    fontSize: 24,
    marginBottom: 25,
    color: "#282abd",
    fontWeight: "bold",
  },
  button: {
    width: "50%",
    padding: 8,
    backgroundColor: "#282abd",
    marginTop: 12,
    borderRadius: 8,
  },
  txtButton: {
    textAlign: "center",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#87857d",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 8,
    backgroundColor: "#EF4219",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
});

export default styles;