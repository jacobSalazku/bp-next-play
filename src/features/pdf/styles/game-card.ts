import { StyleSheet } from "@react-pdf/renderer";

export const gamesStyles = StyleSheet.create({
  gameCard: {
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    break: "avoid",
  },
  gameHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 10,
    color: "#6b7280",
    flex: 1,
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
    color: "#374151",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    width: "30%",
    textAlign: "right",
    paddingRight: 8,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    width: "20%",
    textAlign: "center",
  },
  dash: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    width: "10%",
    textAlign: "center",
  },
  opponentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    width: "30%",
    textAlign: "left",
    paddingLeft: 8,
  },
  boxScoreHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#9ca3af",
    paddingBottom: 4,
    marginTop: 6,
  },
  boxScoreRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#d1d5db",
    paddingVertical: 2,
  },
  cell: {
    fontSize: 9,
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  playerName: {
    textAlign: "left",
    paddingLeft: 4,
  },
});
