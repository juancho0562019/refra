import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { DateRange } from "../../../../../components/DatePicker";
import { IconButton, TextButton, Search } from "../../../../../components";
import { FONTS } from "../../../../../../application";
const Diario = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <DateRange
          containerStyle={{
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 8,
            marginTop: 5,
            height: 50,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Search
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
      </View>
    </View>
  );
};
export default Diario;
