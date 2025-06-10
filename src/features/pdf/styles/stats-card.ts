import { StyleSheet } from "@react-pdf/renderer";

export const statCardStyles = StyleSheet.create({
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    width: "48%", // fits two per row in PDF; adjust for more/less
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  title: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 2,
  },
});
