import React, { useCallback, useState } from "react";
import Picker from "@ouroboros/react-native-picker";
import {
  View,
  FlatList,
  Text,
  Platform,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { useIsFocused } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  loadProducto,
  loadConductor,
  loadTrasladoItem,
  loadBodega,
  updateTrasladoRecepcionAction,
} from "../../../../infrastructure/stores";
import { loadUser } from "../../../../infrastructure/stores";
import * as Globals from "../../../../application/common/Globals";
import APIHandler from "../../../../infrastructure/api/APIHandler";

import { IconButton } from "../../../components";
import { HorizontalCard } from "../../../components/Cards";
import Moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { COLORS, FONTS, SIZES, icons, images } from "../../../../application";
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
import { useNetInfo } from "@react-native-community/netinfo";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEADER_HEIGHT = 210;
const Traslados = ({ navigation, route }) => {
  const { sharedElementPrefix, action } = route?.params;
  const herramientas = useSelector((state) => state.productos.productos);

  const netInfo = useNetInfo();
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const flatListRef = React.useRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const initialList = [];
  const isFocused = useIsFocused();

  const [data, setData] = useState({
    id: 0,
    codInterno: 0,
    conductor: "",
    nomConductor: "",
    fecha: "",
    bodegaDestino: "",
    nomBodegaDestino: "",
    check_conductorChange: false,
    check_bodegaDestinoChange: false,
    secureTextEntry: true,
    isValidConductor: false,
    isValidBodegaDestino: false,
  });
  const [isSaved, setIsSaved] = useState(true);

  const [list, setList] = useState(initialList);
  const headerSharedValue = useSharedValue(80);

  function backHandler() {
    navigation.goBack();
  }

  function articulosHandler() {
    navigation.navigate("ArticulosEntrega", {
      listHerramientas: list,
      bodegaOrigen: user?.bodegaId,
      addItem: data?.id > 0 && data?.codInterno <= 0 ? true : false,
    });
  }

  function actualizarTraslado(fecha) {
    updateTrasladoRecepcionAction(data.id, user.username, fecha, list)
      .then((x) => {
        Alert.alert(
          "Exito!!!",
          "Registro actualizado exitosamente",
          [
            {
              text: "Ok",
              onPress: () => null,
            },
          ],
          { cancelable: false }
        );
      })
      .catch((c) => {
        Alert.alert(
          "Error!!!",
          "Registro no actualizado",
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
  function showMessageError(nombreHerramienta, campo, type) {
    if (type === "herramienta") {
      Alert.alert(
        "Error!!!",
        `Verique el campo [${campo}] de la herramienta [${nombreHerramienta}]`,
        [
          {
            text: "Ok",
            onPress: () => null,
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Error!!!",
        `Verique el campo [${campo}] del formulario`,
        [
          {
            text: "Ok",
            onPress: () => null,
          },
        ],
        { cancelable: false }
      );
    }
  }
  function validateDetalle() {
    if (!data.isValidConductor || !data.check_conductorChange) {
      showMessageError("Conductor", "Conductor", "");
      return false;
    }
    if (list.length <= 0) {
      showMessageError("Herramientas", "Herramientas", "");
      return false;
    }
    if (user?.bodegaId?.length <= 0 || user?.bodegaId <= 0) {
      showMessageError("Bodega", "Bodega", "");
      return false;
    }
    if (data?.bodegaDestino?.length <= 0 || user?.bodegaDestino <= 0) {
      showMessageError("Bodega", "Bodega", "");
      return false;
    }
    for (var i in list) {
      if (list[i].centroCosto?.length <= 0) {
        showMessageError(list[i]?.nombre, "CentroCosto", "herramienta");
        return false;
      }
      if (list[i].cantidad <= 0) {
        showMessageError(list[i]?.nombre, "Cantidad", "herramienta");
        return false;
      }
    }
    return true;
  }

  function ResponseDataMessage(response) {
    let message = "";
    response.forEach((element) => {
      if (element.status !== 200) {
        if (element?.message)
          message = message + `\n[Traslado] ` + element?.message;
        else message = message + `\n[Traslado] Error sincronizando`;
      }
      if (element.status === 200) {
        message = message + `\n[Traslado] Sincronizado con exito`;
      }
    });
    Alert.alert("Proceso terminado!!!", message);
  }

  const updateTrasladoHandler = () => {
    if (!validateDetalle()) {
      return;
    }

    let fecha = Moment().format("yyyy-MM-DD HH:mm:ss");
    actualizarTraslado(fecha);
    setIsSaved(true);
  };

  const loadDataCallback = useCallback(async (trasladoId) => {
    try {
      const trasladoStored = await loadTrasladoItem(trasladoId);
      console.log(trasladoStored);
      if (trasladoStored?.id > 0) {
        console.log(trasladoStored);
        setData({
          ...data,
          id: trasladoStored?.id,
          codInterno: trasladoStored?.codInterno,
          conductor: trasladoStored?.conductorId,
          nomConductor: trasladoStored?.nomConductor,
          bodegaDestino: trasladoStored?.bodegaDestino,
          nomBodegaDestino: trasladoStored?.nomBodegaDestino,
          nomBodegaOrigen: trasladoStored?.nomBodegaOrigen,
          fecha: Moment(trasladoStored?.fecha).format("yyyy-MM-DD"),
          isValidConductor: true,
          isValidBodegaDestino: true,
          check_conductorChange: true,
        });
        if (trasladoStored?.detalle?.length > 0) {
          setList(trasladoStored?.detalle);
          setIsSaved(true);
        } else {
          setList(initialList);
          setIsSaved(true);
        }
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    const { listHerramientas, code, traslado } = route?.params || {};

    if (isFocused) {
      dispatch(loadUser());
      dispatch(loadConductor());
      dispatch(loadBodega());
      if (herramientas.length <= 0) dispatch(loadProducto("", ""));

      if (listHerramientas) {
        setList(listHerramientas);
        setIsSaved(false);
      }

      if (traslado && !listHerramientas) {
        loadDataCallback(traslado?.id);
      }
    }
  }, [dispatch, route, isFocused, loadDataCallback]);

  const bodegaChange = (val) => {
    setData({
      ...data,
      bodegaDestino: val,
      check_bodegaDestinoChange: true,
      isValidBodegaDestino: true,
    });
    handleValidBodegaDestino(val);
  };
  const handleValidBodegaDestino = (val) => {
    if (val != null && val != undefined) {
      setData({
        ...data,
        bodegaDestino: val,
        isValidBodegaDestino: true,
        check_bodegaDestinoChange: true,
      });
    } else {
      setData({
        ...data,
        bodegaDestino: val,
        isValidBodegaDestino: false,
        check_bodegaDestinoChange: false,
      });
    }
  };

  const conductorChange = (val) => {
    setData({
      ...data,
      conductor: val,
      check_conductorChange: true,
      isValidConductor: true,
    });
    handleValidConductor(val);
  };
  const handleValidConductor = (val) => {
    if (val?.trim().length >= 0 && val?.trim().length <= 80) {
      setData({
        ...data,
        conductor: val,
        isValidConductor: true,
        check_conductorChange: true,
      });
    } else {
      setData({
        ...data,
        conductor: val,
        isValidConductor: false,
        check_conductorChange: false,
      });
    }
  };
  async function saveTrasladoAPI() {
    let dataSend = {
      id: data?.codInterno,
      usuarioRecibe: `${user.username}`,
      detalles: [],
    };

    list.forEach((element) => {
      const newDataList = {
        productoId: element.codigoInterno,
        cantidad: parseFloat(element.cantidadRecibida),
        fechaEntrega: data?.fecha,
      };
      dataSend.detalles.push(newDataList);
    });

    if (!netInfo.isConnected) {
      Alert.alert(
        "No internet connection!",
        "Esta accion no esta disponible sin conexion a internet.",
        [{ text: "Okay" }]
      );
    } else {
      const initialList = [];

      if (isSaved) {
        (async () => {
          const dataEnvio = await APIHandler.put(
            `${Globals.RecibirTraslado}`,
            dataSend
          )
            .toPromise()
            .then((response) => {
              console.log(response);
              initialList.push({
                status: 200,
                message: "Traslado sincronizado correctamente",
              });
            })
            .catch((error) => {
              console.log(error);
              if (error?.data) {
                initialList.push({
                  status: error?.status,
                  message: JSON.stringify(error?.data),
                });
              } else {
                initialList.push({
                  status: error?.status,
                  message: "Error enviando informacion al servidor",
                });
              }
              return { status: 500 };
            });
          ResponseDataMessage(initialList);
        })();
      } else {
        initialList.push({
          status: 500,
          message: "El traslado no esta almacenado localmente",
        });
        ResponseDataMessage(initialList);
      }
    }
    //.then(updateCodInterno(data?.id, data?.codInterno))
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
        {/* Background Image */}

        <SharedElement
          id={`${sharedElementPrefix}-AccessCard-Bg-Traslados-Header`}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: "#97B7D8",
              borderBottomLeftRadius: 60,
            },
          ]}
        ></SharedElement>
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 70,
              left: 30,
            },
            headerHideOnScrollAnimatedStyle,
          ]}
        >
          <SharedElement
            id={`${sharedElementPrefix}-AccessCard-Title-Traslados-Header`}
            style={[StyleSheet.absoluteFillObject]}
          >
            <Text
              style={{
                position: "absolute",
                color: COLORS.white,
                ...FONTS.h1,
              }}
            >
              Recepcion Herramientas
            </Text>
          </SharedElement>
        </Animated.View>

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
  function renderForm() {
    const [isLoading, setLoading] = useState(false);
    function sincronizar() {
      setLoading(true);
      saveTrasladoAPI()
        .then((x) => {
          setLoading(false);
        })
        .catch((c) => {
          setLoading(false);
        });
    }
    return (
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View
            style={{
              flexDirection: "column",
              paddingHorizontal: 20,
              paddingVertical: 100,
              marginTop: HEADER_HEIGHT,
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Animatable.View duration={500} delay={1050} style={{ flex: 1 }}>
            <Animatable.View
              style={{
                flexDirection: "column",
                paddingHorizontal: 20,
                paddingVertical: 30,
                marginTop: HEADER_HEIGHT,
                backgroundColor: COLORS.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Animatable.View
                animation="fadeInLeft"
                duration={200}
                delay={1050}
                style={{
                  borderRadius: 8,
                  backgroundColor: COLORS.gray10,
                  paddingBottom: 5,
                  paddingLeft: 8,
                  marginBottom: 5,
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
                    style={{ paddingTop: 3, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3t,
                      fontSize: 15,
                      color: COLORS.black,
                    }}
                  >
                    {data?.codInterno}
                  </Text>
                </View>
              </Animatable.View>

              <Animatable.View
                animation="fadeInLeft"
                duration={200}
                delay={1050}
                style={{
                  borderRadius: 8,
                  backgroundColor: COLORS.gray10,
                  paddingBottom: 5,
                  paddingLeft: 8,
                  marginBottom: 5,
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
                    Bodega Origen
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
                    name="institution"
                    color={COLORS.base}
                    size={15}
                    style={{ paddingTop: 3, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3t,
                      fontSize: 15,
                      color: COLORS.black,
                    }}
                  >
                    {data?.nomBodegaOrigen}
                  </Text>
                </View>
              </Animatable.View>

              <Animatable.View
                animation="fadeInRight"
                duration={200}
                delay={1050}
                style={{
                  borderRadius: 8,
                  backgroundColor: COLORS.gray10,
                  paddingBottom: 5,
                  paddingLeft: 8,
                  marginBottom: 5,
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
                    Conductor
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
                    name="bus"
                    color={COLORS.base}
                    size={15}
                    style={{ paddingTop: 3, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3t,
                      fontSize: 15,
                      color: COLORS.black,
                    }}
                  >
                    {data?.nomConductor}
                  </Text>
                </View>
              </Animatable.View>

              <Animatable.View
                animation="fadeInLeft"
                duration={200}
                delay={1050}
                style={{
                  borderRadius: 8,
                  backgroundColor: COLORS.gray10,
                  paddingBottom: 5,
                  paddingLeft: 8,
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
                    Bodega Destino
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
                    name="fort-awesome"
                    color={COLORS.base}
                    size={15}
                    style={{ paddingTop: 3, marginRight: 5 }}
                  />
                  <Text
                    style={{
                      ...FONTS.h3t,
                      fontSize: 15,
                      color: COLORS.black,
                    }}
                  >
                    {data?.nomBodegaDestino}
                  </Text>
                </View>
              </Animatable.View>
              <Animatable.View
                animation="fadeInRight"
                duration={200}
                delay={1050}
                style={{
                  borderRadius: 8,
                  paddingBottom: 5,
                  marginBottom: 5,
                }}
              >
                <HorizontalCard
                  productos={list?.length}
                  sharedElementPrefix={sharedElementPrefix}
                  containerStyle={{
                    marginVertical: SIZES.padding,
                    marginTop: 15,
                  }}
                  onPress={() => articulosHandler()}
                />
              </Animatable.View>
              {data?.id > 0 && data?.codInterno > 0 ? (
                <Animatable.View
                  animation="fadeInUpBig"
                  duration={200}
                  delay={1050}
                  style={{ flexDirection: "row" }}
                >
                  <TouchableOpacity
                    onPress={() => sincronizar()}
                    style={[
                      styles.signIn,
                      {
                        borderColor: COLORS.primary,
                        backgroundColor: COLORS.primary,
                        borderWidth: 1,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: COLORS.white,
                        },
                      ]}
                    >
                      Sincronizar{" "}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              ) : null}
              {data?.codInterno <= 0 ? null : (
                <Animatable.View
                  animation="fadeInUpBig"
                  duration={200}
                  delay={1050}
                  style={{ flexDirection: "row" }}
                >
                  <TouchableOpacity
                    onPress={() => updateTrasladoHandler()}
                    style={[
                      styles.signIn,
                      {
                        borderColor: COLORS.primary3,
                        borderWidth: 1,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: COLORS.primary3,
                        },
                      ]}
                    >
                      Actualizar
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </Animatable.View>
          </Animatable.View>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Content */}
      <Animated.ScrollView
        contentContainerStyle={{}}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      >
        {renderForm()}
      </Animated.ScrollView>
      {renderHeader()}
    </View>
  );
};

export default Traslados;

const styles = StyleSheet.create({
  containerSelect: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  container: {
    flex: 1,
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
  qrButton: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputAndroid: {
    color: "black",
    fontSize: 15,
    width: 350,
    //    backgroundColor: "red",
    borderRadius: 5,
  },
});
