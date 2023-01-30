import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../../../application";
import { constants } from "../../../application/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Moment from "moment";
import "moment/locale/es";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function Button({ containerStyle, dateStart, dateEnd }) {
  const [dateNow, setDateNow] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [dateOfStart, dateOfCenter, dateOfEnd] = getListDate(dateNow);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateNow;
    setShow(Platform.OS === "ios");
    setDateNow(currentDate);
  };
  const datePlusChange = (val) => {
    if (val <= 0) return;

    const newDate = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() + val
    );
    setDateNow(newDate);
  };
  const dateMinusChange = (val) => {
    if (val <= 0) return;

    const newDate = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() - val
    );
    setDateNow(newDate);
  };
  function getListDate(date = new Date()) {
    let dateRangeStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dateRangeStart.setDate(dateRangeStart.getDate() - 1);

    let dateOfStart = dateRangeStart.getDate();
    let dateOfCenter = date.getDate();
    let dateRangeEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dateRangeEnd.setDate(dateRangeEnd.getDate() + 1);
    let dateOfEnd = dateRangeEnd.getDate();
    dateStart = new Date(date);
    dateEnd = new Date(date);
    return [dateOfStart, dateOfCenter, dateOfEnd];
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        ...containerStyle,
        ...styles.elevation,
      }}
    >
      <View style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 8 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: COLORS.white,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "flex-start",
            marginLeft: 10,
          }}
          onPress={() => {
            showMode("date");
          }}
        >
          <FontAwesome name="calendar" color={COLORS.primary3} size={20} />
          <Text style={{ marginLeft: 15, fontSize: 14, fontWeight: "bold" }}>
            {Moment(dateNow).format("DD MMM YYYY")}
          </Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateNow}
              mode={mode}
              is24Hour={true}
              display={"default"}
              onChange={onChange}
              style={{
                shadowColor: "#fff",
                shadowRadius: 0,
                shadowOpacity: 1,
                shadowOffset: { height: 0, width: 0 },
              }}
            />
          )}
        </TouchableOpacity>
        <View></View>
      </View>
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
            backgroundColor: COLORS.white,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onPress={() => dateMinusChange(1)}
        >
          <Image
            source={icons.left_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,
              marginRight: 8,
              padding: 0,
            }}
          />
          <Text style={{ fontSize: 14, color: COLORS.gray40 }}>
            {dateOfStart}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 8,
            backgroundColor: COLORS.primary3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.white }}>
            {dateOfCenter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",

            borderRadius: 8,
            backgroundColor: COLORS.white,
          }}
          onPress={() => datePlusChange(1)}
        >
          <Text style={{ fontSize: 14, color: COLORS.gray40 }}>
            {dateOfEnd}
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,
              marginLeft: 8,
              padding: 0,
            }}
          />
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
