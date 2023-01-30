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
import { IconLabel } from "../../components";
import { SIZES, COLORS, FONTS, icons } from "../../../application";
import { SharedElement } from "react-navigation-shared-element";
const HorizontalToolsCard = ({
  sharedElementPrefix,
  containerStyle,
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        styles.elevation,
        { flexDirection: "row", ...containerStyle },
      ]}
      onPress={onPress}
    >
      {/* Details */}

      <View
        style={{
          flex: 1,
          marginLeft: SIZES.base,
        }}
      >
        {/* Title */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base,
          }}
        >
          <Text
            style={{
              ...FONTS.h3t,
              fontSize: 18,
              textTransform: "uppercase",
              color: COLORS.gray60,
            }}
          >
            {item?.fecha
              ? Moment(item.fecha).format("dddd DD MMMM YYYY")
              : "Fecha indefinida"}
          </Text>
          <IconLabel
            icon={icons.oksync}
            containerStyle={{ marginLeft: SIZES.base, color: COLORS.black }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor:
                item?.state >= item?.traslados
                  ? COLORS.primary
                  : COLORS.secondary,
            }}
            labelStyle={{ marginLeft: 5, color: COLORS.black, ...FONTS.h3 }}
          />
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
              color: COLORS.primary3,
              fontSize: 18,
              color: COLORS.gray60,
            }}
          >
            {"Total traslados "}
          </Text>

          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.primary3,
              fontSize: 18,
              color: COLORS.gray60,
            }}
          >
            {item?.traslados}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalToolsCard;

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
