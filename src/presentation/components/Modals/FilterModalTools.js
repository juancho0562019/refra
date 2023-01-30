import React, { useState } from "react";
import {
  Keyboard,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { TextButton } from "../../components";
import { COLORS, FONTS, SIZES } from "../../../application";

const FilterModalTools = ({
  FilterModalToolsSharedValueOne,
  FilterModalToolsSharedValueTwo,
  codeChange,
  handleValidCode,
  nameChange,
  handleValidName,
  data,
  handleFilter,
  resetFilter,
}) => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [selectedCreateWithin, setSelectedCreateWithin] = useState("");

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
  const FilterModalToolsContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalToolsSharedValueOne.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: FilterModalToolsSharedValueOne.value,
        },
      ],
    };
  });

  const FilterModalToolsBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalToolsSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
    };
  });

  const FilterModalToolsContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        FilterModalToolsSharedValueTwo.value,
        [SIZES.height, 0],
        [0, 1]
      ),
      transform: [
        {
          translateY: FilterModalToolsSharedValueTwo.value,
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
          onPress={() => {
            resetFilter();
          }}
        />

        {/* Apply */}
        <TextButton
          label="Buscar"
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
            handleFilter();
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
        FilterModalToolsContainerAnimatedStyle,
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
          FilterModalToolsBgAnimatedStyle,
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
            FilterModalToolsContentAnimatedStyle,
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
                FilterModalToolsSharedValueTwo.value = withTiming(
                  SIZES.height,
                  {
                    duration: 500,
                  }
                );

                FilterModalToolsSharedValueOne.value = withDelay(
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
            <Text
              style={{
                marginTop: SIZES.base,
                color: COLORS.gray80,
                ...FONTS.h3,
              }}
            >
              Codigo
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" size={20} />
              <TextInput
                placeholder=""
                placeholderTextColor="#666666"
                style={[styles.textInput]}
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={(val) => codeChange(val)}
                onEndEditing={(e) => handleValidCode(e.nativeEvent.text)}
                //onChangeText={(text)=> setInput(text)}
                value={data.code}
              />

              {data.check_codeChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>

            <Text
              style={{
                marginTop: SIZES.base,
                color: COLORS.gray80,
                ...FONTS.h3,
              }}
            >
              Nombres
            </Text>
            <View style={styles.action}>
              <FontAwesome name="id-badge" size={20} />
              <TextInput
                placeholder=""
                placeholderTextColor="#666666"
                style={[styles.textInput]}
                autoCapitalize="none"
                onChangeText={(val) => nameChange(val)}
                onEndEditing={(e) => handleValidName(e.nativeEvent.text)}
                //onChangeText={(text)=> setInput(text)}
                value={data.name}
              />
              {data.check_nameChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={20} />
                </Animatable.View>
              ) : null}
            </View>
          </ScrollView>

          {/* Footer */}
          {renderFooter()}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default FilterModalTools;

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
