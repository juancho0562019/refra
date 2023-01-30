import React, { useState } from "react";
import {
  Keyboard,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { TextButton } from "../../components";
import { COLORS, FONTS, SIZES, icons, constants } from "../../../application";
import DateTimePicker from "@react-native-community/datetimepicker";

const FilterModalDateTools = ({
  FilterModalDateToolsSharedValueOne,
  FilterModalDateToolsSharedValueTwo,
  selectedCreateWithin,
  setSelectedCreateWithin,
  handleFilter,
  setDateFilter,
}) => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    setDateFilter(tempDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const FilterModalDateToolsContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalDateToolsSharedValueOne.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: FilterModalDateToolsSharedValueOne.value,
        },
      ],
    };
  });

  const FilterModalDateToolsBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalDateToolsSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
    };
  });

  const FilterModalDateToolsContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalDateToolsSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: FilterModalDateToolsSharedValueTwo.value,
        },
      ],
    };
  });

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginBottom: 30,
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/* Reset */}
        <TextButton
          label="Limpiar"
          contentContainerStyle={{
            flex: 1,
            borderRadius: SIZES.radius,
            borderWidth: 1,
            backgroundColor: null,
          }}
          labelStyle={{ color: COLORS.black, ...FONTS.h3b }}
        />

        {/* Apply */}
        <TextButton
          label="Filtrar"
          contentContainerStyle={{
            flex: 1,
            marginLeft: SIZES.radius,
            borderRadius: SIZES.radius,
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary3,
          }}
          labelStyle={{ color: COLORS.white, ...FONTS.h3b }}
          onPress={() => {
            handleFilter(selectedCreateWithin);
          }}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          height: SIZES.height,
          width: SIZES.width,
        },
        FilterModalDateToolsContainerAnimatedStyle,
      ]}
    >
      {/* Background Container  */}
      <Animated.View
        style={[
          {
            flex: 1,
            height: SIZES.height,
            width: SIZES.width,
            backgroundColor: COLORS.transparentBlack7,
          },
          FilterModalDateToolsBgAnimatedStyle,
        ]}
      >
        {/* Content Container */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              height: keyboardStatus ? SIZES.height * 0.6 : SIZES.height * 0.8,
              width: SIZES.width,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: COLORS.white,
            },
            FilterModalDateToolsContentAnimatedStyle,
          ]}
        >
          {/* Header */}
          <View
            style={{
              marginTop: SIZES.padding,
              flexDirection: "row",
              paddingHorizontal: SIZES.padding,
            }}
          >
            <View style={{ width: 60 }} />
            <Text style={{ flex: 1, textAlign: "center", ...FONTS.h1 }}>
              Filter
            </Text>

            <TextButton
              label="Cancelar"
              contentContainerStyle={{ width: 80, backgroundColor: null }}
              labelStyle={{ color: COLORS.black, ...FONTS.body3 }}
              onPress={() => {
                FilterModalDateToolsSharedValueTwo.value = withTiming(
                  SIZES.height,
                  {
                    duration: 500,
                  }
                );

                FilterModalDateToolsSharedValueOne.value = withDelay(
                  500,
                  withTiming(SIZES.height, { duration: 100 })
                );
              }}
            />
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: SIZES.padding,
              paddingBottom: 50,
            }}
          >
            {/* Created Within */}
            <View style={{ marginTop: SIZES.radius }}>
              <Text style={{ ...FONTS.h3b }}>Rango de ingreso</Text>
              <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                {constants.created_within.map((item, index) => {
                  return (
                    <TextButton
                      key={`CreatedWithin-${index}`}
                      label={item?.label}
                      contentContainerStyle={{
                        height: 45,
                        paddingHorizontal: SIZES.radius,
                        marginLeft: index % 3 == 0 ? 0 : SIZES.radius,
                        marginTop: SIZES.radius,
                        borderWidth: 1,
                        borderRadius: SIZES.radius,
                        borderColor: COLORS.gray20,
                        backgroundColor:
                          item?.id == selectedCreateWithin
                            ? COLORS.primary3
                            : null,
                      }}
                      labelStyle={{
                        color:
                          item?.id == selectedCreateWithin
                            ? COLORS.white
                            : COLORS.black,
                        ...FONTS.body3,
                      }}
                      onPress={() => {
                        setSelectedCreateWithin(item.id);
                      }}
                    />
                  );
                })}

                <TextButton
                  label={"Fecha"}
                  contentContainerStyle={{
                    height: 45,
                    paddingHorizontal: SIZES.radius,
                    marginLeft: 0,
                    marginTop: SIZES.radius,
                    borderWidth: 1,
                    borderRadius: SIZES.radius,
                    borderColor: COLORS.gray20,
                    backgroundColor:
                      3 == selectedCreateWithin ? COLORS.primary3 : null,
                  }}
                  labelStyle={{
                    color:
                      3 == selectedCreateWithin ? COLORS.white : COLORS.black,
                    ...FONTS.body3,
                  }}
                  onPress={() => {
                    setSelectedCreateWithin(3);
                    showMode("date");
                  }}
                />
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display={"default"}
                    onChange={onChange}
                  />
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          {renderFooter()}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default FilterModalDateTools;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
