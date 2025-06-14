import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "Righteous",
  src: "https://github.com/google/fonts/raw/main/ofl/righteous/Righteous-Regular.ttf",
});

export const PDFstyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  header: {
    fontFamily: "Righteous",
    fontSize: 22,
    marginBottom: 20,
    color: "#111827",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#000000",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
