import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
  ActivityIndicator,
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
import { IconButton, LineDivider } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { HorizontalCardDescarga } from "../../../components/Cards";
import {
  countTraslados,
  countTrasladosLocalResult,
} from "../../../../infrastructure/stores";
import Moment from "moment";
import * as Globals from "../../../../application/common/Globals";
import APIHandler from "../../../../infrastructure/api/APIHandler";
import { COLORS, FONTS, SIZES, icons } from "../../../../application/constants";
import { FilterModalTools } from "../../../components/Modals";
import { useIsFocused } from "@react-navigation/native";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 120;
const EntregasDecargas = ({ navigation, route }) => {
  const { sharedElementPrefix } = route.params;
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (isFocused) {
      if (user) {
        console.log("paso1");
        setLoading(true);
        console.log("paso2");
        countTrasladosLocalResult(data?.nombre, data?.apellido, null).then(
          (x) => {
            let itemsEnvio = [];
            x.items.forEach(function (item) {
              itemsEnvio.push(`listId=${item.idInterno}`);
            });
            console.log(itemsEnvio);
            const idEnvio =
              itemsEnvio?.length > 0 ? `${itemsEnvio.join("&")}` : ``;
            console.log(
              `${Globals.GetTrasladosBodega}?bodega=${user?.username}&${idEnvio}`
            );
            APIHandler.get(
              `${Globals.GetTrasladosBodega}?bodega=${user?.username}&${idEnvio}`
            )
              .toPromise()
              .then((response) => {
                setData(response?.items);
              })
              //.then((r) => console.log(r))
              .catch((error) => {
                console.log(error);
                if (error.status === 404) {
                  Alert.alert(error?.data?.detail);
                  backHandler();
                }
                if (error.status === 500) {
                  Alert.alert("Error en el servidor");
                  backHandler();
                }
              })
              .finally(() => setLoading(false));
          }
        );
      }
    }
  }, [dispatch, isFocused]);

  function handleToolsDetail(item) {
    navigation.navigate("Entrega", {
      itemFecha: item,
      sharedElementPrefix: sharedElementPrefix,
      traslado: item,
    });
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
    //dispatch(countTraslados(data?.nombre, data?.apellido, null));
  }
  function resetFilter() {
    hideModal();
  }
  const flatListRef = React.useRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerSharedValue = useSharedValue(80);
  const FilterModalToolsSharedValueOne = useSharedValue(SIZES.height);
  const FilterModalToolsSharedValueTwo = useSharedValue(SIZES.height);

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
        data={data}
        keyExtractor={(item) => `Results-${item.fecha}${item?.codInterno}`}
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
              Registros: {data?.length}
            </Text>

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
        renderItem={({ item, index }) =>
          user ? (
            <HorizontalCardDescarga
              item={item}
              sharedElementPrefix={sharedElementPrefix}
              containerStyle={{}}
              onPress={() => handleToolsDetail(item)}
              userName={user?.username}
            />
          ) : null
        }
        ItemSeparatorComponent={() => null}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
      ) : data && data.length > 0 ? (
        renderResults()
      ) : (
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
          <Text>No hay registros para mostrar</Text>
        </View>
      )}
      {/* Header */}
      {renderHeader()}
    </View>
  );
};

export default EntregasDecargas;
