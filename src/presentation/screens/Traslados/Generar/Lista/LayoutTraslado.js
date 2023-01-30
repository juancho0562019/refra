import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  COLORS,
  SIZES,
  constants,
  FONTS,
} from "../../../../../application/constants";
import { connect } from "react-redux";
import { Diario, Semanal, Mensual } from "./Forms";
import { Shadow } from "react-native-shadow-2";
const bottom_tabs = constants.tabsTraslados.map((bottom_tab) => ({
  ...bottom_tab,
  ref: React.createRef(),
}));

const TabIndicator = ({ measureLayout, scrollX }) => {
  const inputRange = bottom_tabs.map((_, i) => i * SIZES.width);

  const tabIndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map((measure) => measure.width),
  });

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map((measure) => measure.x),
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        height: "100%",
        width: tabIndicatorWidth,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary3,
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  );
};

const Tabs = ({ scrollX, onBottomTabPress }) => {
  const containerRef = React.useRef();
  const [measureLayout, setMeasureLayout] = useState([]);
  const [pressed, setPressed] = useState(0);
  useEffect(() => {
    let ml = [];

    bottom_tabs.forEach((bottom_tab) => {
      bottom_tab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          ml.push({
            x,
            y,
            width,
            height,
          });

          if (ml.length === bottom_tabs.length) {
            setMeasureLayout(ml);
          }
        }
      );
    });
  });

  return (
    <View
      ref={containerRef}
      style={[
        styles.elevation,
        {
          flex: 1,
          flexDirection: "row",
        },
      ]}
    >
      {/* Tab Indicator */}
      {measureLayout.length > 0 && (
        <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />
      )}

      {/* Tabs */}
      {bottom_tabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`BottomTab-${index}`}
            ref={item.ref}
            style={[
              styles.elevation,
              {
                flex: 1,
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
            onPress={() => {
              onBottomTabPress(index);
              setPressed(index);
            }}
          >
            <Text
              style={{
                marginTop: 3,
                color: pressed === index ? COLORS.white : COLORS.primary3,
                ...FONTS.h3,
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const LayoutTraslado = ({ navigation }) => {
  const flatListRef = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const onBottomTabPress = useCallback((bottomTabIndex) => {
    flatListRef?.current?.scrollToOffset({
      offset: bottomTabIndex * SIZES.width,
    });
  });

  function renderBottomTab() {
    return (
      <View
        style={[
          {
            marginTop: 50,
            paddingHorizontal: SIZES.padding,
            paddingVertical: SIZES.radius,
            backgroundColor: COLORS.white,
          },
        ]}
      >
        <Shadow size={[SIZES.width - SIZES.padding * 2, 50]}>
          <View
            style={{
              flex: 1,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white,
            }}
          >
            <Tabs scrollX={scrollX} onBottomTabPress={onBottomTabPress} />
          </View>
        </Shadow>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderBottomTab()}
      <Animated.FlatList
        ref={flatListRef}
        pagingEnabled
        horizontal
        scrollEnabled={false}
        snapToAlignment="center"
        snapToInterval={SIZES.width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        data={constants.tabsTraslados}
        keyExtractor={(item) => `Main-${item.id}`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                height: SIZES.height,
                width: SIZES.width,
              }}
            >
              {item.label == constants.screensTraslado.diario && (
                <Diario navigation={navigation} />
              )}
              {item.label == constants.screensTraslado.semanal && (
                <Semanal navigation={navigation} />
              )}
              {item.label == constants.screensTraslado.mensual && (
                <Mensual navigation={navigation} />
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

LayoutTraslado.sharedElement = (route, otherRoute, showing) => {
  if (otherRoute.name === "Dashboard") {
    const { sharedElementPrefix } = route.params;
    return [
      {
        id: `${sharedElementPrefix}-TrasladoLista-Bg`,
      },
      {
        id: `${sharedElementPrefix}-TrasladoLista-Title`,
      },
    ];
  }
};

export default LayoutTraslado;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  elevation: {
    elevation: 50,
    shadowColor: "#5c627a",
  },
});
