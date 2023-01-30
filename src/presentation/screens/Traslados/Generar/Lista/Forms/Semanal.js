import React from "react";
import { Text, View } from "react-native";
import { DateRangeWeek } from "../../../../../components/DatePicker";
const Semanal = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <DateRangeWeek
        containerStyle={{
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 8,
          marginTop: 5,
          height: 50,
        }}
      />
    </View>
  );
};
export default Semanal;
