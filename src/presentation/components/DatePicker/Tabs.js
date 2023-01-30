import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../../../application";
import { constants } from "../../../application/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Moment from "moment";
import "moment/locale/es";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function Tabs({ containerStyle, dateStart, dateEnd }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        borderRadius: SIZES.radius,
        paddingHorizontal: 10,
        ...containerStyle,
        ...styles.elevation,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: COLORS.white,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 8,
            backgroundColor: COLORS.primary3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.white }}>Diario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.primary3 }}>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.primary3 }}>Mensual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  elevation: {
    elevation: 20,
    shadowColor: "#5c627a",
  },
});
