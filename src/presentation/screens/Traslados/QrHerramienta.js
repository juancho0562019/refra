import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  Dimensions,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
function QrHerramienta({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    //navigation.navigate('Ingreso',{code:data})
    navigation.navigate({
      name: "ArticulosSeleccionados",
      params: { code: data },
      merge: true,
    });
  };

  if (hasPermission === null) {
    return <Text>Solicitando acceso para la camara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a una camara</Text>;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.container]}
      >
        <Text style={styles.description}>Escanea tu codigo QR </Text>
        <Text
          onPress={() => navigation.navigate("Traslados")}
          style={styles.cancel}
        >
          Atras
        </Text>
      </BarCodeScanner>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </SafeAreaView>
  );
}
export default QrHerramienta;

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  description: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginTop: "30%",
    textAlign: "center",
    width: "70%",
  },
  cancel: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    padding: 4,
    textAlign: "center",
    width: "30%",
    opacity: 0.6,
  },
});
