import React from "react";
import { Shadow } from "react-native-shadow-2";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  saveTrasladoEntregaLocal,
  getTrasladoByIdAction,
  updateTrasladoActionLocal,
} from "../../../infrastructure/stores";
import Moment from "moment";
import "moment/locale/es";
import { IconLabel, IconButton } from "..";
import { SIZES, COLORS, FONTS, icons } from "../../../application";
const HorizontalCardDescarga = ({ item, onPress, userName }) => {
  const replaceTraslado = (id, item, detalles) => {
    const replace = Alert.alert(
      "Cuidado!!!",
      "Este traslado ya existe en el dispositivo, desea reemplazarlo?",
      [
        {
          text: "Si",
          onPress: () => {
            updateTrasladoActionLocal(
              id,
              item.codInterno,
              item.usuarioEnviaId,
              item.conductorId,
              item.fecha,
              detalles,
              item.bodegaDestinoId,
              item.bodegaOrigenId,
              userName
            )
              .then((c) => {
                Alert.alert(
                  "Exito!!!",
                  "Registro actualizado exitosamente",
                  [
                    {
                      text: "Ok",
                      onPress: () => null,
                    },
                  ],
                  { cancelable: false }
                );
              })
              .catch((err) => {
                console.log(err);
                Alert.alert(
                  "Error!!!",
                  "Hubo un error al actualizar el traslado",
                  [
                    {
                      text: "Ok",
                      onPress: () => null,
                    },
                  ],
                  { cancelable: false }
                );
              });
          },
        },
        {
          text: "No",
          onPress: () => {
            return false;
          },
        },
      ],
      { cancelable: false }
    );
  };
  function saveTrasladoLocal() {
    let detalles = [];

    item.detalles.forEach(function (result) {
      var item = {
        cantidad: result.cantidad,
        cantidadRecibida: result.cantidadRecibida ? result.cantidadRecibida : 0,
        centroCosto: result.centroCosto,
        codigoInterno: result.productoId,
        trasladoId: result.trasladoId,
        unidad: result.unidadId,
      };
      detalles.push(item);
    });

    getTrasladoByIdAction(item?.codInterno, userName, "LOCAL")
      .then((x) => {
        if (x.item && x.item.id > 0) {
          replaceTraslado(x.item.id, item, detalles);
        } else {
          saveTrasladoEntregaLocal(
            item.codInterno,
            item.usuarioEnviaId,
            item.conductorId,
            item.fecha,
            detalles,
            item?.bodegaOrigenId,
            item?.bodegaDestinoId,
            userName,
            "LOCAL",
            item?.placa
          )
            .then((x) => {
              Alert.alert(
                "Exito!!!",
                "Registro almacenado exitosamente",
                [
                  {
                    text: "Ok",
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
              );
            })
            .catch((err) => {
              Alert.alert(
                "Error!!!",
                "Hubo un error al registrar el traslado",
                [
                  {
                    text: "Ok",
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
              );
            });
        }
      })
      .catch((err) => console.log(JSON.stringify(err)));
  }
  return (
    <View style={[styles.card, styles.elevation]} onPress={onPress}>
      <View
        style={{
          flex: 1,
          marginLeft: SIZES.base,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base,
            marginBottom: 0,
          }}
        >
          <Text
            style={[
              FONTS.h2,
              { fontSize: 18, color: COLORS.gray60, lineHeight: 18 },
            ]}
          >
            Codigo Interno
          </Text>
          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 18,
              color: COLORS.gray40,
              width: 150,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {" "}
            {item?.codInterno}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base,
            marginBottom: 0,
          }}
        >
          <Text
            style={[
              FONTS.h2,
              { fontSize: 14, color: COLORS.gray60, lineHeight: 18 },
            ]}
          >
            Bodega Origen
          </Text>
          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 14,
              color: COLORS.gray40,
              width: 150,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {" "}
            {item?.nomBodegaOrigen}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              fontSize: 14,
              color: COLORS.gray60,
              lineHeight: 18,
            }}
          >
            Bodega Destino
          </Text>
          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 14,
              color: COLORS.gray40,
              width: 150,
              lineHeight: 18,
            }}
            numberOfLines={1}
          >
            {" "}
            {item?.nomBodegaDestino}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              fontSize: 14,
              color: COLORS.gray60,
              lineHeight: 18,
            }}
          >
            {"Conductor "}
          </Text>

          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 14,
              color: COLORS.gray40,
              lineHeight: 18,
            }}
          >
            {item?.nombreConductor}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              fontSize: 14,
              color: COLORS.gray60,
              lineHeight: 18,
            }}
          >
            {"Cantidad Herramientas "}
          </Text>

          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 14,
              color: COLORS.gray40,
              lineHeight: 18,
            }}
          >
            {item?.detalles?.length}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              fontSize: 14,
              color: COLORS.gray60,
              lineHeight: 15,
            }}
          >
            {/*item?.fecha?Moment(item.fecha).format("dddd DD MMMM YYYY"): "Fecha indefinida"*/}
            Estado
          </Text>
          <IconLabel
            icon={icons.oksync}
            containerStyle={{
              marginLeft: SIZES.base,
              color: COLORS.black,
              marginTop: 0,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor:
                item?.codInterno > 0 ? COLORS.primary : COLORS.secondary,
            }}
            labelStyle={{ marginLeft: 5, color: COLORS.black, ...FONTS.h3 }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: SIZES.base,
          minWidth: 70,
          maxWidth: 70,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <IconButton
            icon={icons.download}
            iconStyle={{ width: 20, height: 20 }}
            containerStyle={{
              width: 60,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: COLORS.primary3,
              marginTop: 5,
              elevation: 20,
              shadowColor: "#5c627a",
            }}
            onPress={() => {
              saveTrasladoLocal();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HorizontalCardDescarga;

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 13,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 28,
    paddingHorizontal: 25,
    width: "100%",
    marginVertical: 10,
  },
  elevation: {
    elevation: 20,
    shadowColor: "#5c627a",
  },
});
