import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
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
import { SharedElement } from "react-navigation-shared-element";
import { IconButton, LineDivider } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { HorizontalToolDateCard } from "../../components/Cards";
import {
  countTraslados,
  removeTrasladoActionLocal,
} from "../../../infrastructure/stores";
import Moment from "moment";
import * as Globals from "../../../application/common/Globals";
import APIHandler from "../../../infrastructure/api/APIHandler";
import { COLORS, FONTS, SIZES, icons } from "../../../application/constants";
import { FilterModalTools } from "../../components/Modals";
import { useIsFocused } from "@react-navigation/native";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 120;
const TrasladosDia = ({ navigation, route }) => {
  const { itemFecha, sharedElementPrefix } = route.params;
  const traslados = useSelector((state) => state.traslados.trasladosDia);
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const Today = Moment().format("YYYY-MM-DD");
  function handleToolsDetail(item) {
    navigation.navigate("Traslados", {
      itemFecha: item,
      sharedElementPrefix: sharedElementPrefix,
      traslado: item,
    });
  }
  function removeItem(item) {
    const replace = Alert.alert(
      "Cuidado!!!",
      "Realmente deseas eliminar el traslado de este dispositivo?",
      [
        {
          text: "Si",
          onPress: () => {
            removeTrasladoActionLocal(item?.id)
              .then((x) => {
                dispatch(
                  countTraslados(
                    data?.nombre,
                    data?.apellido,
                    itemFecha?.fecha,
                    user.username
                  )
                );
                Alert.alert("Exito!!!", "Item eliminado correctamente");
              })
              .catch((x) =>
                Alert.alert("Error!!!", "Error al eliminar el item indicado")
              );
          },
        },
        {
          text: "No",
          onPress: () => {
            return false;
          },
        },
      ],
      { cancelable: false }
    );
  }
  useEffect(() => {
    if (isFocused) {
      dispatch(
        countTraslados(
          data?.nombre,
          data?.apellido,
          itemFecha?.fecha,
          user.username
        )
      );
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
    dispatch(
      countTraslados(
        data?.nombre,
        data?.apellido,
        itemFecha?.fecha,
        user.username
      )
    );
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

    dispatch(countTraslados("", "", itemFecha?.fecha, user.username));
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
    navigation.goBack();
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

  function renderResults() {
    return (
      <AnimatedFlatList
        ref={flatListRef}
        data={traslados}
        keyExtractor={(item) => `Results-${item.fecha}${item?.id}`}
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
              Registros: {traslados?.length}
            </Text>

            {itemFecha?.fecha === Today ? (
              <IconButton
                icon={icons.add}
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
                  navigation.navigate("Traslados", {
                    itemFecha: itemFecha,
                    sharedElementPrefix: sharedElementPrefix,
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
          <HorizontalToolDateCard
            item={item}
            sharedElementPrefix={sharedElementPrefix}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index == 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() => handleToolsDetail(item)}
            onPressDelete={() => removeItem(item)}
          />
        )}
        ItemSeparatorComponent={() => (
          <LineDivider
            lineStyle={{
              backgroundColor: COLORS.gray20,
            }}
          />
        )}
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

TrasladosDia.sharedElement = (route, otherRoute, showing) => {
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

export default TrasladosDia;
