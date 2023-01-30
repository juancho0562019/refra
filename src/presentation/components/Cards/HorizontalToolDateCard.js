import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Moment from "moment";
import "moment/locale/es";
import { IconLabel, IconButton } from "..";
import { SIZES, COLORS, FONTS, icons } from "../../../application";
import { SharedElement } from "react-navigation-shared-element";
const HorizontalToolDateCard = ({
  sharedElementPrefix,
  containerStyle,
  item,
  onPress,
  onPressDelete,
}) => {
  return (
    <View style={[styles.card, styles.elevation, ,]}>
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
            {item?.idInterno > 0 ? item?.idInterno : "No sincronizado"}
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
            {item?.nombre}
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
            {item?.articulos}
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
          minWidth: 130,
          maxWidth: 130,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            icon={icons.eye}
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
            onPress={() => onPress()}
          />
          <IconButton
            icon={icons.remove}
            iconStyle={{ width: 20, height: 20 }}
            containerStyle={{
              width: 60,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: "red",
              marginTop: 5,
              elevation: 20,
              shadowColor: "#5c627a",
            }}
            onPress={() => onPressDelete()}
          />
        </View>
      </View>
    </View>
  );
};

export default HorizontalToolDateCard;

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
