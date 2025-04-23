import { StyleSheet } from "react-native";

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

  export default styles;