import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Keyboard,
  TextInput,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import NumericInput from "react-native-numeric-input";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { IconButton, LineDivider } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import Moment from "moment";
import { COLORS, FONTS, SIZES, icons } from "../../../../application/constants";
import { FilterModalTools } from "../../../components/Modals";
import { useIsFocused } from "@react-navigation/native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 120;
const ArticulosEntrega = ({ navigation, route }) => {
  const { listHerramientas, sharedElementPrefix, addItem } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const initialList = [];
  const [list, setList] = React.useState(initialList);
  const [itemSeleccionado, setItemSeleccionado] = React.useState({});

  useEffect(() => {
    if (isFocused) {
      if (listHerramientas.length > 0) {
        setList(listHerramientas);
      }
    }
  }, [dispatch, isFocused]);

  function hideModal() {
    Keyboard.dismiss();
    FilterModalToolsSharedValueTwo.value = withTiming(SIZES.height, {
      duration: 500,
    });

    FilterModalToolsSharedValueOne.value = withDelay(
      500,
      withTiming(SIZES.height, { duration: 100 })
    );
  }
  function handleFilter() {
    hideModal();
  }

  function resetFilter() {
    hideModal();
    setData({
      code: "",
      nombre: "",
      apellido: "",
      isValidCode: true,
      isValidNombre: true,
      isValidApellido: true,
      check_codeChange: false,
      check_nombreChange: false,
      check_apellidoChange,
    });
  }
  function resetFilter() {
    hideModal();
    setData({
      code: "",
      nombre: "",
      apellido: "",
      isValidCode: true,
      isValidNombre: true,
      isValidApellido: true,
      check_codeChange: false,
      check_nombreChange: false,
      check_apellidoChange,
    });
  }
  const flatListRef = React.useRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerSharedValue = useSharedValue(80);
  const FilterModalToolsSharedValueOne = useSharedValue(SIZES.height);
  const FilterModalToolsSharedValueTwo = useSharedValue(SIZES.height);

  const [data, setData] = React.useState({
    code: "",
    name: "",
    check_codeChange: false,
    check_nameChange: false,
    secureTextEntry: true,
    isValidCode: true,
    isValidName: true,
  });

  const codeChange = (val) => {
    setData({
      ...data,
      code: val,
      check_codeChange: true,
      isValidCode: true,
    });
    handleValidCode(val);
  };

  const nameChange = (val) => {
    setData({
      ...data,
      name: val,
      check_nameChange: true,
      isValidName: true,
    });
    handleValidName(val);
  };

  const handleValidName = (val) => {
    if (val.trim().length >= 4 && val.trim().length <= 80) {
      setData({
        ...data,
        name: val,
        isValidName: true,
        check_nameChange: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        isValidName: false,
        check_nameChange: false,
      });
    }
  };

  const handleValidCode = (val) => {
    let num = val.replace(".", "");
    if (val.trim().length >= 4 && !isNaN(num)) {
      setData({
        ...data,
        code: num,
        isValidCode: true,
        check_codeChange: true,
      });
    } else {
      setData({
        ...data,
        code: num,
        isValidCode: false,
        check_codeChange: false,
      });
    }
  };

  function backHandler() {
    navigation.navigate({
      name: "Entrega",
      params: { listHerramientas: list },
      merge: true,
    });
  }

  //Render
  function renderHeader() {
    const inputRange = [0, HEADER_HEIGHT - 50];

    headerSharedValue.value = withDelay(
      500,
      withTiming(0, {
        duration: 500,
      })
    );

    const headerFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(headerSharedValue.value, [80, 0], [0, 1]),
      };
    });

    const headerTranslateAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: headerSharedValue.value,
          },
        ],
      };
    });

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(
          scrollY.value,
          inputRange,
          [HEADER_HEIGHT, 120],
          Extrapolate.CLAMP
        ),
      };
    });

    const headerHideOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [0, 1], Extrapolate.CLAMP),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              inputRange,
              [0, 200],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    });

    const headerShowOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [1, 0], Extrapolate.CLAMP),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              inputRange,
              [50, 130],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    });

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 250,
            overflow: "hidden",
          },
          headerHeightAnimatedStyle,
        ]}
      >
        {/* Back */}
        <View>
          <IconButton
            icon={icons.back}
            iconStyle={{
              tintColor: COLORS.white,
            }}
            containerStyle={{
              position: "absolute",
              top: 40,
              left: 20,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 25,
              backgroundColor: COLORS.primary3,
            }}
            //onPress={() => { backHandler() }}
            onPress={() => {
              if (scrollY.value > 0 && scrollY.value <= 200) {
                flatListRef.current?.scrollToOffset({
                  offset: 0,
                  animated: true,
                });
                setTimeout(() => {
                  headerSharedValue.value = withTiming(
                    80,
                    {
                      duration: 500,
                    },
                    () => {
                      runOnJS(backHandler)();
                    }
                  );
                }, 100);
              } else {
                backHandler();
              }
            }}
          />
        </View>
      </Animated.View>
    );
  }
  const ArticuloEntregaDetalle = ({ item }) => {
    const [cantidad, setCantidad] = useState(item?.cantidadRecibida);
    const [alter, setAlter] = useState(false);
    function updateCantidad(value, desc) {
      setCantidad(desc);

      for (var i in list) {
        if (list[i].codigoInterno == value) {
          list[i].cantidadRecibida = desc;
          break;
        }
      }
    }
    return (
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.elevation,
          styles.card,
          {
            backgroundColor: "white",
            flexDirection: "column",
            marginBottom: SIZES.base,
            borderRadius: 15,
            paddingVertical: 28,
            paddingHorizontal: 25,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            position: "absolute",
            top: 0,
            right: 5,
          }}
        >
          {alter ? (
            <IconButton
              icon={icons.close}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 38,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: COLORS.primary,
                marginTop: 5,
                elevation: 20,
                shadowColor: "#5c627a",
              }}
              onPress={() => {
                setAlter(!alter);
              }}
            />
          ) : (
            <IconButton
              icon={icons.alter}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 38,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: COLORS.primary3,
                marginTop: 5,
                elevation: 20,
                shadowColor: "#5c627a",
              }}
              onPress={() => {
                setAlter(!alter);
              }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...FONTS.h3, fontSize: 15, color: COLORS.gray80 }}>
            {item?.nombre}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 0,
          }}
        >
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              flex: 1,
              flexDirection: "column",
              borderRadius: 8,
              backgroundColor: COLORS.gray10,
              paddingBottom: 5,
              paddingLeft: 8,
              marginBottom: 5,
              marginRight: 2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.gray80,
                  ...FONTS.h3,
                  paddingTop: 5,
                }}
              >
                Codigo Interno
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              <FontAwesome
                name="slack"
                color={COLORS.base}
                size={14}
                style={{ paddingTop: 5, marginRight: 5 }}
              />
              <Text
                style={{
                  ...FONTS.h3t,
                  fontSize: 15,
                  color: COLORS.black,
                }}
              >
                {item?.codigoInterno}
              </Text>
            </View>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUpBig"
            style={{
              flex: 1,
              flexDirection: "column",
              borderRadius: 8,
              backgroundColor: COLORS.gray10,
              paddingBottom: 5,
              paddingLeft: 8,
              marginBottom: 5,
              marginLeft: 2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.gray80,
                  ...FONTS.h3,
                  paddingTop: 5,
                }}
              >
                Tipo Unidad
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 5,
              }}
            >
              <FontAwesome
                name="slack"
                color={COLORS.base}
                size={15}
                style={{ paddingTop: 3, marginRight: 5 }}
              />
              <Text
                style={{
                  ...FONTS.h3t,
                  fontSize: 14,
                  color: COLORS.black,
                  paddingRight: 12,
                }}
                numberOfLines={1}
              >
                {item?.nombreUnidad}
              </Text>
            </View>
          </Animatable.View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 0,
          }}
        >
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              flex: 1,
              flexDirection: "column",
              borderRadius: 8,
              backgroundColor: COLORS.gray10,
              paddingBottom: 5,
              paddingLeft: 8,
              marginBottom: 5,
              marginRight: 2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.gray80,
                  ...FONTS.h3,
                  paddingTop: 5,
                }}
              >
                Centro Costo
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingRight: 2,
                overflow: "hidden",
              }}
            >
              <FontAwesome
                name="id-badge"
                size={20}
                style={{ paddingTop: 3, marginRight: 5 }}
              />
              <Text
                style={{
                  ...FONTS.h3t,
                  fontSize: 14,
                  color: COLORS.black,
                  paddingRight: 12,
                }}
                numberOfLines={1}
              >
                {item?.centroCosto}
              </Text>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              flex: 1,
              flexDirection: "column",
              borderRadius: 8,
              backgroundColor: COLORS.gray10,
              paddingBottom: 5,
              paddingLeft: 8,
              marginBottom: 5,
              marginLeft: 2,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.gray80,
                  ...FONTS.h3,
                  paddingTop: 5,
                }}
              >
                Cantidad
              </Text>
            </View>
            {alter ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <NumericInput
                  value={cantidad}
                  onChange={(value) =>
                    updateCantidad(item?.codigoInterno, value)
                  }
                  onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                  minValue={0}
                  maxValue={999}
                  totalHeight={50}
                  inputStyle={{ backgroundColor: "white" }}
                  totalWidth={140}
                  step={1}
                  valueType="integer"
                  rounded
                  textColor={COLORS.gray20}
                  iconStyle={{ color: COLORS.white }}
                  rightButtonBackgroundColor={COLORS.gray80}
                  leftButtonBackgroundColor={COLORS.gray80}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <FontAwesome
                  name="slack"
                  color={COLORS.base}
                  size={15}
                  style={{ paddingTop: 5, marginRight: 5 }}
                />
                <Text
                  style={{
                    ...FONTS.h3t,
                    fontSize: 14,
                    color: COLORS.black,
                  }}
                >
                  {item?.cantidadRecibida}/{item?.cantidad}
                </Text>
              </View>
            )}
          </Animatable.View>
        </View>
      </Animatable.View>
    );
  };
  function renderResults() {
    return (
      <AnimatedFlatList
        ref={flatListRef}
        data={list}
        keyExtractor={(item) => `Results-${item.codigoInterno}`}
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
        }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        onScroll={onScroll}
        ListHeaderComponent={(item) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 100,
              marginBottom: SIZES.base,
            }}
          >
            {/* Results */}
            <Text style={{ flex: 1, ...FONTS.body3 }}>
              Registros: {list.length}
            </Text>

            {addItem ? (
              <IconButton
                icon={icons.qr}
                iconStyle={{ width: 20, height: 20 }}
                containerStyle={{
                  width: 40,
                  height: 40,

                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  backgroundColor: COLORS.black,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={() => {
                  navigation.navigate("QrHerramienta");
                }}
              />
            ) : null}
            {addItem ? (
              <IconButton
                icon={icons.tools}
                iconStyle={{ width: 20, height: 20 }}
                containerStyle={{
                  width: 40,
                  height: 40,

                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  backgroundColor: COLORS.primary3,
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={() => {
                  navigation.navigate("Articulos", {
                    listHerramientas: list,
                  });
                }}
              />
            ) : null}
            {/* Filter Button */}
            <IconButton
              icon={icons.filter}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: COLORS.primary3,
              }}
              onPress={() => {
                FilterModalToolsSharedValueOne.value = withTiming(0, {
                  duration: 100,
                });
                FilterModalToolsSharedValueTwo.value = withDelay(
                  100,
                  withTiming(0, {
                    duration: 500,
                  })
                );
              }}
            />
          </View>
        )}
        renderItem={({ item, index }) => (
          <ArticuloEntregaDetalle
            key={`ClassType-${index}-${item?.codInterno}`}
            item={item}
            onPress={() => {
              //handleAdd(item);
            }}
          />
        )}
        ItemSeparatorComponent={() => null}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Results */}
      {renderResults()}

      {/* Header */}
      {renderHeader()}
      {/* FilterModalTools */}
      <FilterModalTools
        FilterModalToolsSharedValueOne={FilterModalToolsSharedValueOne}
        FilterModalToolsSharedValueTwo={FilterModalToolsSharedValueTwo}
        codeChange={codeChange}
        handleValidCode={handleValidCode}
        nameChange={nameChange}
        handleValidName={handleValidName}
        data={data}
        handleFilter={handleFilter}
        resetFilter={resetFilter}
      />
    </View>
  );
};

ArticulosEntrega.sharedElement = (route, otherRoute, showing) => {
  if (otherRoute.name === "Dashboard") {
    const { sharedElementPrefix } = route.params;
    return [
      {
        id: `${sharedElementPrefix}-ToolsCard-Bg-${item?.codInterno}`,
      },
      {
        id: `${sharedElementPrefix}-ToolsCard-Title-${item?.codInterno}`,
      },
    ];
  }
};

export default ArticulosEntrega;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 5,
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
    marginTop: Platform.OS === "ios" ? 0 : -4,
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
  inputAndroid: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  card: {
    paddingVertical: 28,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  elevation: {
    elevation: 20,
    shadowColor: "#5c627a",
  },
});
