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
import { Alert } from "react-native";
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
import { getProducto } from "../../../application/services";
import { SharedElement } from "react-navigation-shared-element";
import { IconButton, LineDivider } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { HorizontalToolDateCard } from "../../components/Cards";
import { countTraslados } from "../../../infrastructure/stores";
import Moment from "moment";
import * as Globals from "../../../application/common/Globals";
import APIHandler from "../../../infrastructure/api/APIHandler";
import { COLORS, FONTS, SIZES, icons } from "../../../application/constants";
import { FilterModalTools } from "../../components/Modals";
import { useIsFocused } from "@react-navigation/native";
import { loadProducto } from "../../../infrastructure/stores";
import { RFC_2822 } from "moment";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 120;
const ArticulosSeleccionados = ({ navigation, route }) => {
  const { listHerramientas, sharedElementPrefix, addItem } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const Today = Moment().format("YYYY-MM-DD");
  const herramientas = useSelector((state) => state.productos.productos);
  const initialList = [];
  const [list, setList] = React.useState(initialList);
  useEffect(() => {
    const { code } = route?.params || {};
    if (isFocused) {
      if (herramientas.length <= 0) {
        dispatch(loadProducto("", ""));
      }

      //if (listHerramientas.length > 0) {
      setList(listHerramientas);
      //}

      if (code) {
        setValueQr(code);
      }
    }
  }, [dispatch, isFocused]);
  function isSelected(value) {
    let filtered = list.filter((element) => element.codigo === value);

    if (filtered.length > 0) return true;

    if (!(filtered.length > 0)) return false;
  }

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
    //dispatch(countTraslados(data?.nombre, data?.apellido, itemFecha?.fecha));
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

    //dispatch(countTraslados("", "", itemFecha?.fecha));
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

  const setValueQr = (valQr) => {
    if (valQr !== undefined && valQr !== "undefined") {
      const res = valQr.split("|");
      if (res.length >= 1) {
        getProducto(res[0])
          .then((herramienta) => {
            console.log(herramienta);
            if (
              herramienta === null ||
              herramienta === undefined ||
              herramienta === "undefined"
            ) {
              Alert.alert(
                "Error!!!",
                `Verifique que la herramienta de codigo ${res[0]} este creada`,
                [
                  {
                    text: "Ok",
                    onPress: () => null,
                  },
                ],
                { cancelable: false }
              );
            } else {
              if (!isSelected(herramienta?.codigo)) {
                let primerCentro = "";
                if (list.length > 0) {
                  primerCentro = list[0].centroCosto;
                }
                const newList = list.concat({
                  codigo: herramienta?.codigo,
                  codigoInterno: herramienta?.codigoInterno,
                  centroCosto: primerCentro,
                  color: herramienta?.color,
                  createdAt: herramienta?.createdAt,
                  marca: herramienta?.marca,
                  nombre: herramienta?.nombre,
                  serie: herramienta?.serie,
                  tipo: herramienta?.tipo,
                  unidad: herramienta?.unidad,
                  nombreUnidad: herramienta?.nombreUnidad,
                  cantidad: 1,
                  cantidadRecibida: 0,
                });
                setList(newList);
              }
            }
          })
          .catch((err) => {
            Alert.alert(
              "Error!!!",
              `Verifique que la herramienta de codigo ${res[0]} este creada`,
              [
                {
                  text: "Ok",
                  onPress: () => null,
                },
              ],
              { cancelable: false }
            );
          });
      }
    }
  };
  function backHandler() {
    navigation.navigate({
      name: "Traslados",
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
  const ArticuloSeleccion = ({ classType, remove }) => {
    const [cantidad, setCantidad] = useState(classType?.cantidad);
    const [centro, setCentro] = useState(classType?.centroCosto);
    const [data, setData] = React.useState({
      centro: classType?.centroCosto,
      check_centroChange: false,
      secureTextEntry: true,
      isValidCentro: true,
    });
    function updateCantidad(value, desc) {
      setCantidad(desc);
      for (var i in list) {
        if (list[i].codigo == value) {
          list[i].cantidad = desc;
          break;
        }
      }
    }

    function updateCentroCosto(value, desc) {
      setCentro(value);
      for (var i in list) {
        if (list[i].codigo == value) {
          list[i].centroCosto = desc;
          break;
        }
      }
    }
    const centroChange = (val) => {
      setData({
        ...data,
        centro: val,
        check_centroChange: true,
        isValidCentro: true,
      });
      handleValidCentro(val);
    };
    const validateCentro = (value) => {
      var re = /^(S|R|P)([0-9]{2,3})\-([0-9]{4,4})$/;
      return re.test(value);
    };
    const handleValidCentro = (val) => {
      if (
        val.trim().length >= 4 &&
        val.trim().length <= 80 &&
        validateCentro(val)
      ) {
        setData({
          ...data,
          centro: val,
          isValidCentro: true,
          check_centroChange: true,
        });
        updateCentroCosto(classType?.codigo, val);
      } else {
        setData({
          ...data,
          centro: val,
          isValidCentro: false,
          check_centroChange: false,
        });
      }
    };
    function removeItem(codigo) {
      let filtered = list.filter((element) => element.codigoInterno !== codigo);
      setList(filtered);
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
        {remove === true ? (
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
            <IconButton
              icon={icons.remove}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 38,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: "red",
                marginTop: 5,
                elevation: 20,
                shadowColor: "#5c627a",
              }}
              onPress={() => {
                removeItem(classType?.codigoInterno);
              }}
            />
          </View>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...FONTS.h3, fontSize: 15, color: COLORS.gray80 }}>
            {classType?.nombre}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
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
                marginTop: 5,
                paddingBottom: 5,
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
                  fontSize: 15,
                  color: COLORS.black,
                }}
              >
                {classType?.codigoInterno}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
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
                marginTop: 5,
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
                  fontSize: 15,
                  color: COLORS.black,
                  paddingRight: 12,
                }}
                numberOfLines={1}
              >
                {classType?.nombreUnidad}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
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
              <Text
                style={[
                  styles.errorMsg,
                  { marginTop: SIZES.base, marginLeft: 5 },
                ]}
              >
                *
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                paddingBottom: 5,
                paddingRight: 2,
                borderBottomWidth: 1,
                borderBottomColor: "#f2f2f2",
              }}
            >
              <FontAwesome
                name="id-badge"
                size={20}
                style={{ paddingTop: 3, marginRight: 5 }}
              />
              <TextInput
                placeholder=""
                placeholderTextColor="#666666"
                style={{
                  flex: 1,
                  ...FONTS.h3t,
                  fontSize: 15,
                  color: COLORS.black,
                  paddingRight: 12,
                }}
                autoCapitalize="none"
                onChangeText={(val) => centroChange(val)}
                onEndEditing={(e) => handleValidCentro(e.nativeEvent.text)}
                //onChangeText={(text)=> setInput(text)}
                value={data.centro}
              />
              {data.check_centroChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidCentro ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Centro de costo incorrecto</Text>
              </Animatable.View>
            )}
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
            <View style={{ flex: 1, flexDirection: "row" }}>
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
              <Text
                style={[
                  styles.errorMsg,
                  { marginTop: SIZES.base, marginLeft: 5 },
                ]}
              >
                *
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <NumericInput
                value={cantidad}
                onChange={(value) => updateCantidad(classType?.codigo, value)}
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
          <ArticuloSeleccion
            key={`ClassType-${index}-${item?.codInterno}`}
            classType={item}
            remove={addItem}
            containerStyle={{
              marginTop: index == 0,
            }}
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

ArticulosSeleccionados.sharedElement = (route, otherRoute, showing) => {
  if (otherRoute.name === "Dashboard") {
    const { itemFecha, sharedElementPrefix } = route.params;
    return [
      {
        id: `${sharedElementPrefix}-ToolsCard-Bg-${itemFecha?.fecha}`,
      },
      {
        id: `${sharedElementPrefix}-ToolsCard-Title-${itemFecha?.fecha}`,
      },
    ];
  }
};

export default ArticulosSeleccionados;

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
