import React, { useState } from "react";
import {
  Keyboard,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { TextButton } from "../../../components";
import { COLORS, FONTS, SIZES } from "../../../../application";
import NumericInput from "react-native-numeric-input";

const FilterModal = ({
  filterModalSharedValueOne,
  filterModalSharedValueTwo,
  list,
  bodegas,
}) => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [selectedCreateWithin, setSelectedCreateWithin] = useState("");

  const [data, setData] = React.useState({
    bodega: "",
    check_bodegaChange: false,
    secureTextEntry: true,
    isValidBodega: false,
  });
  const bodegaChange = (val, codigoArticulo) => {
    setData({
      ...data,
      bodega: val,
      check_bodegaChange: true,
      isValidBodega: true,
    });
    handleValidBodega(val);
  };

  function updateBodega(value, desc) {
    for (var i in list) {
      if (list[i].codigo == value) {
        list[i].bodega = desc;
        break;
      }
    }
  }

  const handleValidBodega = (val) => {
    if (val === null || val === undefined) {
      setData({
        ...data,
        bodega: val,
        isValidBodega: false,
        check_bodegaChange: false,
      });
    } else {
      if (val.trim().length > 0) {
        setData({
          ...data,
          bodega: val,
          isValidBodega: true,
          check_bodegaChange: true,
        });
      } else {
        setData({
          ...data,
          bodega: val,
          isValidBodega: false,
          check_bodegaChange: false,
        });
      }
    }
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

  function hideModal() {
    Keyboard.dismiss();
    filterModalSharedValueOne.value = withTiming(SIZES.height, {
      duration: 500,
    });

    filterModalSharedValueTwo.value = withDelay(
      500,
      withTiming(SIZES.height, { duration: 100 })
    );
  }

  const filterModalContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        filterModalSharedValueOne.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: filterModalSharedValueOne.value,
        },
      ],
    };
  });

  const filterModalBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        filterModalSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
    };
  });

  const filterModalContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        filterModalSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: filterModalSharedValueTwo.value,
        },
      ],
    };
  });
  const Section = ({ containerStyle, title, onPress, children }) => {
    return (
      <View style={{ ...containerStyle }}>
        <View
          style={{ flexDirection: "row", paddingHorizontal: SIZES.padding }}
        >
          <Text style={{ flex: 1, ...FONTS.h2 }}>{title}</Text>
        </View>

        {children}
      </View>
    );
  };

  const ClassTypeOption = ({
    containerStyle,
    classType,
    isSelected,
    onPress,
    bodegas,
  }) => {
    const [cantidad, setCantidad] = useState(1);

    function updateCantidad(value, desc) {
      setCantidad(value);
      for (var i in list) {
        if (list[i].codigo == value) {
          list[i].cantidad = desc;
          break;
        }
      }
    }

    return (
      <Animatable.View
        animation="fadeInUpBig"
        style={{
          flexDirection: "column",
          marginBottom: SIZES.base,
          borderRadius: 15,
          paddingHorizontal: 20,
          paddingVertical: 30,
          borderWidth: 1,
          borderColor: COLORS.gray30,
        }}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.black }}>
            Bodega Destino
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <View style={styles.containerSelect}>
            <RNPickerSelect
              onValueChange={(value) => updateBodega(classType?.codigo, value)}
              placeholder={{ label: "Seleccione una bodega", value: null }}
              items={bodegas?.map((bodega, index) => ({
                label: bodega?.nombre,
                value: bodega?.codigo,
              }))}
              value={classType?.bodega}
            ></RNPickerSelect>
            {/* data.isValidWorkplaceStart ? null : 
                        <Animatable.View animation="fadeInLeft" duration={500}>
                          <Text style={styles.errorMsg}>Seleccione un origen</Text>
                        </Animatable.View>
                    */}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Text style={{ ...FONTS.body5, fontSize: 18, color: COLORS.black }}>
            Cantidad
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          <NumericInput
            value={cantidad}
            onChange={(value) => updateCantidad(classType?.codigo, value)}
            onLimitReached={(isMax, msg) => console.log(isMax, msg)}
            minValue={0}
            maxValue={999}
            totalWidth={240}
            totalHeight={50}
            iconSize={25}
            step={1}
            valueType="integer"
            rounded
            textColor={COLORS.gray20}
            iconStyle={{ color: COLORS.white }}
            rightButtonBackgroundColor={COLORS.primary}
            leftButtonBackgroundColor={COLORS.primary}
          />
        </View>

        <Text
          style={{
            marginTop: SIZES.base,
            color: COLORS.gray80,
            ...FONTS.h3,
          }}
        >
          Centro costo
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder=""
            placeholderTextColor="#666666"
            style={[styles.textInput]}
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={(val) => null}
            // onEndEditing={(e)=>handleValidCode(e.nativeEvent.text)}
            //onChangeText={(text)=> setInput(text)}
            value={""}
          />
        </View>
      </Animatable.View>
    );
  };

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginBottom: 30,
          paddingTop: 10,
          paddingHorizontal: SIZES.padding,
        }}
      >
        {/* Apply */}
        <TextButton
          label="Aceptar"
          contentContainerStyle={{
            flex: 1,
            marginLeft: SIZES.radius,
            paddingTop: SIZES.radius,
            borderRadius: SIZES.radius,
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary,
          }}
          labelStyle={{ color: COLORS.white, ...FONTS.h3b }}
          onPress={() => {
            hideModal();
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
        filterModalContainerAnimatedStyle,
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
          filterModalBgAnimatedStyle,
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
            filterModalContentAnimatedStyle,
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
              Destino
            </Text>
            <TextButton
              label="Cancelar"
              contentContainerStyle={{ width: 80, backgroundColor: null }}
              labelStyle={{ color: COLORS.black, ...FONTS.body3 }}
              onPress={() => {
                filterModalSharedValueTwo.value = withTiming(SIZES.height, {
                  duration: 500,
                });

                filterModalSharedValueOne.value = withDelay(
                  500,
                  withTiming(SIZES.height, { duration: 100 })
                );
              }}
            />
          </View>
          <KeyboardAvoidingView
            behavior={"padding"}
            style={styles.safeAreaView}
          >
            {/* Content */}
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: SIZES.padding,
              }}
              showsHorizontalScrollIndicator={false}
            >
              <Section title="">
                <View
                  style={{
                    marginTop: 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    {list?.map((item, index) => {
                      return (
                        <ClassTypeOption
                          key={`ClassType-${index}`}
                          classType={item}
                          isSelected={false}
                          containerStyle={{
                            marginTop:
                              index == 0 ? SIZES.radius : SIZES.padding,
                          }}
                          bodegas={bodegas}
                          onPress={() => {
                            //handleAdd(item);
                          }}
                        />
                      );
                    })}
                  </View>
                </View>
              </Section>
            </ScrollView>
          </KeyboardAvoidingView>

          {renderFooter()}
        </Animated.View>
        {/* Footer */}
      </Animated.View>
    </Animated.View>
  );
};

export default FilterModal;

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
  containerSelect: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
});
