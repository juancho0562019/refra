import React from "react";
import { Text, View } from "react-native";
import { DateRangeMonth } from "../../../../../components/DatePicker";
const Mensual = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <DateRangeMonth
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
export default Mensual;
