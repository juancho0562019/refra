import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../../../application";
import { useIsFocused } from "@react-navigation/native";
import { IconButton, TextButton, Search } from "../../components";
import { ClassTypeOption } from "./components";
import Animated, {
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import { loadProducto } from "../../../infrastructure/stores";
const Articulos = ({ navigation, route }) => {
  const { listHerramientas } = route?.params;
  const FilterModalSharedValueOne = useSharedValue(SIZES.height);
  const FilterModalSharedValueTwo = useSharedValue(SIZES.height);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const herramientas = useSelector((state) => state.productos.productos);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const scrollY = useSharedValue(0);

  const initialList = [];

  const [list, setList] = React.useState(initialList);
  useEffect(() => {
    if (isFocused) {
      dispatch(loadProducto("", ""));
      setList(listHerramientas);
    }
  }, [dispatch, isFocused]);
  function backHandler() {
    navigation.navigate({
      name: "ArticulosSeleccionados",
      params: { listHerramientas: list },
      merge: true,
    });
  }
  function hideModal() {
    Keyboard.dismiss();
    FilterModalSharedValueOne.value = withTiming(SIZES.height, {
      duration: 500,
    });

    FilterModalSharedValueTwo.value = withDelay(
      500,
      withTiming(SIZES.height, { duration: 100 })
    );
  }

  function isSelectedMaster(value) {
    let filtered = list.filter((element) => element.codigoInterno === value);

    if (filtered.length > 0) return true;

    if (!(filtered.length > 0)) return false;
  }

  function handleAdd(item) {
    if (isSelectedMaster(item?.codigoInterno)) {
      let filtered = list.filter(
        (element) => element.codigoInterno !== item?.codigoInterno
      );
      setList(filtered);
    } else {
      let primerCentro = "";
      if (list.length > 0) {
        primerCentro = list[0].centroCosto;
      }
      const newList = list.concat({
        codigo: item?.codigo,
        codigoInterno: item?.codigoInterno,
        centroCosto: item?.centroCosto,
        cantidadRecibida: 0,
        color: item?.color,
        createdAt: item?.createdAt,
        marca: item?.marca,
        nombre: item?.nombre,
        serie: item?.serie,
        tipo: item?.tipo,
        unidad: item?.unidad,
        nombreUnidad: item?.nombreUnidad,
        cantidad: 1,
        centroCosto: primerCentro,
      });
      setList(newList);
    }
  }

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 50,
          marginBottom: 30,
          marginTop: 30,
          paddingHorizontal: SIZES.padding,
        }}
      ></View>
    );
  }
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
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
      <View
        style={{
          flexDirection: "column",
          paddingTop: 50,
          alignItems: "center",
        }}
      >
        <Text style={{ ...FONTS.h1 }}>Herramientas</Text>
        <Search
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          clicked={clicked}
          setClicked={setClicked}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 6,
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
              <Text>{herramientas.length}</Text>
              {herramientas?.map((item, index) => {
                return (
                  <ClassTypeOption
                    key={`ClassType-${index}`}
                    classType={item}
                    isSelected={isSelectedMaster(item?.codigoInterno)}
                    containerStyle={{
                      marginTop: index == 0 ? SIZES.radius : SIZES.padding,
                    }}
                    onPress={() => {
                      handleAdd(item);
                    }}
                  />
                );
              })}
            </View>
          </View>
        </Section>
      </ScrollView>
      {renderFooter()}
    </View>
  );
};

export default Articulos;

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
});
