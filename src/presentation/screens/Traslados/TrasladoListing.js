import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import Moment from "moment";
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
import { HorizontalToolsCard } from "../../components/Cards";
import { FilterModalDateTools } from "../../components/Modals";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  constants,
} from "../../../application/constants";
import { useIsFocused } from "@react-navigation/native";
import { loadTrasladosCount } from "../../../infrastructure/stores";
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HEADER_HEIGHT = 120;
const TrasladoListing = ({ navigation, route }) => {
  const [selectedCreateWithin, setSelectedCreateWithin] = useState("");
  const isFocused = useIsFocused();
  const { sharedElementPrefix } = route.params;
  const traslados = useSelector((state) => state.traslados.countTraslados);
  const user = useSelector((state) => state.userReducer.user);
  const [dateFilter, setDateFilter] = useState(new Date());
  const dispatch = useDispatch();

  function handleToolsDetail(item) {
    navigation.navigate("TrasladosDia", {
      itemFecha: item,
      sharedElementPrefix: sharedElementPrefix,
    });
  }
  useEffect(() => {
    if (isFocused) {
      handleFilter(2);
    }
  }, [dispatch, isFocused]);

  const flatListRef = React.useRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerSharedValue = useSharedValue(80);
  const FilterModalDateToolsSharedValueOne = useSharedValue(SIZES.height);
  const FilterModalDateToolsSharedValueTwo = useSharedValue(SIZES.height);
  function backHandler() {
    navigation.goBack();
  }

  function handleFilter(value) {
    hideModal();
    let dateOfStart = "";
    let dateOfEnd = "";
    switch (value) {
      case 1:
        [dateOfStart, dateOfEnd] = constants.getWeek();
        break;
      case 2:
        [dateOfStart, dateOfEnd] = constants.getMonth();
        break;
      case 3:
        dateOfStart = Moment(dateFilter).format("YYYY-MM-DD");
        dateOfEnd = Moment(dateFilter).format("YYYY-MM-DD");
        break;
      default:
        [dateOfStart, dateOfEnd] = constants.getToday();
        break;
    }
    let dateOfStart_formatted = Moment(dateOfStart).format("YYYY-MM-DD");
    let dateOfEnd_formatted = Moment(dateOfEnd).format("YYYY-MM-DD");
    dispatch(
      loadTrasladosCount(
        dateOfStart_formatted,
        dateOfEnd_formatted,
        user.username
      )
    );
  }
  function hideModal() {
    Keyboard.dismiss();
    FilterModalDateToolsSharedValueOne.value = withTiming(SIZES.height, {
      duration: 500,
    });

    FilterModalDateToolsSharedValueTwo.value = withDelay(
      500,
      withTiming(SIZES.height, { duration: 100 })
    );
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

        {/* Title */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -80,
              left: 0,
              right: 0,
            },
            headerShowOnScrollAnimatedStyle,
          ]}
        >
          <Text
            style={{
              textAlign: "center",
              color: COLORS.white,
              ...FONTS.h2,
            }}
          >
            Traslados
          </Text>
        </Animated.View>
      </Animated.View>
    );
  }

  function renderResults() {
    return (
      <AnimatedFlatList
        ref={flatListRef}
        data={traslados}
        keyExtractor={(item) => `Results-${item.fecha}`}
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
                FilterModalDateToolsSharedValueOne.value = withTiming(0, {
                  duration: 100,
                });
                FilterModalDateToolsSharedValueTwo.value = withDelay(
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
          <HorizontalToolsCard
            item={item}
            sharedElementPrefix={sharedElementPrefix}
            containerStyle={{
              marginVertical: 15,
              marginTop: 0,
            }}
            onPress={() => handleToolsDetail(item)}
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
      {/* FilterModalDateTools */}
      <FilterModalDateTools
        FilterModalDateToolsSharedValueOne={FilterModalDateToolsSharedValueOne}
        FilterModalDateToolsSharedValueTwo={FilterModalDateToolsSharedValueTwo}
        selectedCreateWithin={selectedCreateWithin}
        setSelectedCreateWithin={setSelectedCreateWithin}
        handleFilter={handleFilter}
        setDateFilter={setDateFilter}
      />
    </View>
  );
};

TrasladoListing.sharedElement = (route, otherRoute, showing) => {
  if (otherRoute.name === "Dashboard") {
    const { sharedElementPrefix } = route.params;
    return [
      {
        id: `${sharedElementPrefix}-ToolsCard-Bg-${1123}`,
      },
      {
        id: `${sharedElementPrefix}-ToolsCard-Title-${1123}`,
      },
    ];
  }
};

export default TrasladoListing;
