import { StyleSheet } from "react-native";

export const DialogStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  centered: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  modal: {
    width: "85%",
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,

    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
});
