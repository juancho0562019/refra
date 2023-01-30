import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../../../../application";
const ClassTypeOption = ({
  containerStyle,
  classType,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 100,
        justifyContent: "center",
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        backgroundColor: isSelected ? COLORS.primary3 : COLORS.additionalColor9,
        color: isSelected ? COLORS.white : COLORS.black,
        ...containerStyle,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <Text
          style={{
            ...FONTS.h3t,
            fontSize: 18,
            color: isSelected ? COLORS.white : COLORS.black,
          }}
        >
          {/*item?.fecha?Moment(item.fecha).format("dddd DD MMMM YYYY"): "Fecha indefinida"*/}
          {classType?.nombre}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
        }}
      >
        <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.gray20 }}>
          Codigo Interno:
        </Text>
        <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.gray20 }}>
          {classType?.codigoInterno}
        </Text>
      </View>

      {classType?.bodega != "undefined" &&
      classType?.bodega != undefined &&
      classType?.bodega != "" &&
      classType?.bodega != null ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.white }}>
            Bodega Destino:
          </Text>
          <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.white }}>
            {classType?.bodega}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default ClassTypeOption;
