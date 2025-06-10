import { StyleSheet } from "@react-pdf/renderer";

export const playerTableStyles = StyleSheet.create({
  table: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
  },
  cell: {
    fontSize: 10,
    flex: 1,
    textAlign: "center",
    color: "#000000",
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    color: "#ffffff",
  },
});
