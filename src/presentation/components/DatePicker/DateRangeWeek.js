import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../../../application";
import { constants } from "../../../application/constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Moment from "moment";
import "moment/locale/es";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function DateRangeWeek(props) {
  const { onPress, title = "Save", isSelected, containerStyle } = props;
  const [dateNow, setDateNow] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  let [
    dateOfStartStart,
    dateOfStartEnd,
    dateOfCenterStart,
    dateOfCenterEnd,
    dateOfEndStart,
    dateOfEndEnd,
  ] = getListDate(dateNow);

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
    let monday = getMonday(newDate);
    //let dateNew = new Date(newDate.setDate(monday));
    setDateNow(monday);
  };
  const dateMinusChange = (val) => {
    if (val <= 0) return;

    const newDate = new Date(
      dateNow.getFullYear(),
      dateNow.getMonth(),
      dateNow.getDate() - val
    );
    let monday = getMonday(newDate);
    //let dateNew = new Date(newDate.setDate(monday));
    setDateNow(monday);
  };
  const getMonday = (date = new Date()) => {
    const dayIndex = date.getDay();
    const diffToLastMonday = dayIndex !== 0 ? dayIndex - 1 : 6;
    const dateOfStart = new Date(
      date.setDate(date.getDate() - diffToLastMonday)
    );
    return dateOfStart;
  };
  function getListDate(date = new Date()) {
    let [dateRangeStartCenter, dateRangeEndCenter] = getRangeDate(date);
    let dateStart = new Date(
      dateRangeStartCenter.getFullYear(),
      dateRangeStartCenter.getMonth(),
      dateRangeStartCenter.getDate() - 6
    );

    let [dateRangeStartStart, dateRangeStartEnd] = getRangeDate(dateStart);
    let dateOfStartStart = dateRangeStartStart.getDate();
    let dateOfStartEnd = dateRangeStartEnd.getDate();

    let dateOfCenterStart = dateRangeStartCenter.getDate();
    let dateOfCenterEnd = dateRangeEndCenter.getDate();

    let dateEnd = new Date(
      dateRangeEndCenter.getFullYear(),
      dateRangeEndCenter.getMonth(),
      dateRangeEndCenter.getDate() + 1
    );

    let [dateRangeEndStart, dateRangeEndEnd] = getRangeDate(dateEnd);
    let dateOfEndStart = dateRangeEndStart.getDate();
    let dateOfEndEnd = dateRangeEndEnd.getDate();

    return [
      dateOfStartStart,
      dateOfStartEnd,
      dateOfCenterStart,
      dateOfCenterEnd,
      dateOfEndStart,
      dateOfEndEnd,
    ];
  }

  function getRangeDate(date = new Date()) {
    let dayIndex = date.getDay();
    let diffToLastMonday = dayIndex !== 0 ? dayIndex - 1 : 6;

    let dateRangeStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dateRangeStart.setDate(date.getDate() - diffToLastMonday);
    let dateRangeEnd = new Date(
      dateRangeStart.getFullYear(),
      dateRangeStart.getMonth(),
      dateRangeStart.getDate()
    );

    dateRangeEnd.setDate(dateRangeStart.getDate() + 6);

    return [dateRangeStart, dateRangeEnd];
  }

  function getRangeDate1(date = new Date()) {
    let dayIndex = date.getDay();
    let diffToLastMonday = dayIndex !== 0 ? dayIndex - 1 : 6;

    let dateRangeStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    dateRangeStart.setDate(date.getDate() - diffToLastMonday);
    let dateRangeEnd = new Date(
      dateRangeStart.getFullYear(),
      dateRangeStart.getMonth(),
      dateRangeStart.getDate()
    );
    dateRangeEnd.setDate(dateRangeStart.getDate() + 6);

    return [dateRangeStart, dateRangeEnd];
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
            justifyContent: "center",
          }}
          onPress={() => dateMinusChange(1)}
        >
          <Image
            source={icons.left_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,

              padding: 0,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              color: COLORS.gray40,
              textAlign: "center",
              width: 45,
            }}
          >
            {dateOfStartStart}|{dateOfStartEnd}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 8,
            backgroundColor: COLORS.primary3,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.white }}>
            {dateOfCenterStart}|{dateOfCenterEnd}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            backgroundColor: COLORS.white,
          }}
          onPress={() => datePlusChange(7)}
        >
          <Text
            style={{
              fontSize: 14,
              color: COLORS.gray40,
              textAlign: "center",
              width: 45,
            }}
          >
            {dateOfEndStart}|{dateOfEndEnd}
          </Text>
          <Image
            source={icons.right_arrow}
            style={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary3,
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
