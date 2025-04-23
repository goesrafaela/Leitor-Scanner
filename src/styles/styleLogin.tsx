import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#282abd",
    padding: 10,
    borderRadius: 5,
    width: "60%",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#000000",
  },
  button: {
    padding: 8,
    width: "50%",
    textAlign: "center",
    backgroundColor: "#282abd",
    marginTop: 12,
    borderRadius: 8,
  },
  txtHome: {
    fontSize: 24,
    marginBottom: 25,
    color: "#282abd",
    fontWeight: "bold",
  },
});

  export default styles;