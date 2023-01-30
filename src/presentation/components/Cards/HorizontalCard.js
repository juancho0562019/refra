import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Moment from "moment";
import "moment/locale/es";
import { icons } from "../../../application";
import { SIZES, COLORS, FONTS } from "../../../application";
const HorizontalCard = ({ containerStyle, productos, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        height: 90,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLORS.gray50,
        ...containerStyle,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 90,
        }}
      >
        <View style={{ flex: 10 }}>
          {/* Title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <Text style={{ ...FONTS.h3t, fontSize: 16, color: COLORS.black }}>
              {/*item?.fecha?Moment(item.fecha).format("dddd DD MMMM YYYY"): "Fecha indefinida"*/}
              Seleccionar herramientas
            </Text>
            <Text
              style={[
                {
                  marginTop: SIZES.base,
                  marginLeft: 5,
                  color: "#FF0000",
                  fontSize: 14,
                },
              ]}
            >
              *
            </Text>
          </View>
          {productos > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <Text
                style={{ ...FONTS.body5, fontSize: 16, color: COLORS.gray20 }}
              >
                {productos} {}
              </Text>
              <Text
                style={{ ...FONTS.body5, fontSize: 16, color: COLORS.gray20 }}
              >
                referencias seleccionadas
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <Text
                style={{ ...FONTS.body5, fontSize: 12, color: COLORS.gray20 }}
              >
                Agrega herramientas de tu inventario
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
          }}
        >
          <Image
            source={icons.right_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,
              margin: 0,
              padding: 0,
            }}
          />
          <Image
            source={icons.right_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,
              margin: 0,
              padding: 0,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalCard;
