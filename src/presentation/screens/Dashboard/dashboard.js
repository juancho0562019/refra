import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { COLORS, SIZES, FONTS, icons } from "../../../application";
import Moment from "moment";
import {
  IconButton,
  TextButton,
  DateRange,
  DateRangeWeek,
  DateRangeMonth,
  Tabs,
} from "../../components";
import * as Globals from "../../../application/common/Globals";
import APIHandler from "../../../infrastructure/api/APIHandler";
import {
  ProductoSyncInit,
  BodegaSyncInit,
  ConductorSyncInit,
  UnidadSyncInit,
  MarcaSyncInit,
  ColorSyncInit,
} from "../../../application/services";

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const maestros = [
    {
      id: "articulo",
      label: "Articulos",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllArticulos,
      //url: ""
    },
    {
      id: "bodega",
      label: "Bodegas",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllBodegas,
    },
    {
      id: "conductor",
      label: "Conductores",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllConductores,
    },
    {
      id: "unidad",
      label: "Unidades",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllUnidades,
    },
    {
      id: "color",
      label: "Colores",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllColores,
    },
    {
      id: "marca",
      label: "Marcas",
      icon: require("../../../../assets/icons/all.png"),
      url: Globals.GetAllMarcas,
    },
  ];

  const initialList = [];

  const [list, setList] = useState(initialList);

  function isSelectedMaster(value) {
    let filtered = list.filter((element) => element.id === value);

    if (filtered.length > 0) return true;

    if (!(filtered.length > 0)) return false;
  }

  function handleAdd(id, url) {
    if (isSelectedMaster(id)) {
      let filtered = list.filter((element) => element.id !== id);
      setList(filtered);
    } else {
      const newList = list.concat({
        id,
        url,
      });
      setList(newList);
    }
  }
  function setStatus(listStatus, status, type) {
    listStatus.push({
      type: type,
      status: status,
    });
  }
  function sincronizar() {
    if (list.length === 0) {
      Alert.alert("Debe seleccionar un item para sincronizar");
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      const valueResponse = await requestAll();

      if (
        valueResponse?.data?.status === undefined &&
        valueResponse?.length > 0
      ) {
        console.log("valueResponse");
        console.log(valueResponse);
        const initialList = [];
        for (const element of valueResponse) {
          if (!element.data) {
            setStatus(initialList, element.status, element.type);
            continue;
          }
          if (element.type === "articulo") {
            var estado = await ProductoSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
          if (element.type === "bodega") {
            var estado = await BodegaSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
          if (element.type === "conductor") {
            var estado = await ConductorSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
          if (element.type === "unidad") {
            var estado = await UnidadSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
          if (element.type === "color") {
            var estado = await ColorSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
          if (element.type === "marca") {
            var estado = await MarcaSyncInit(element.data.items);
            setStatus(initialList, estado, element?.type);
          }
        }
        setLoading(false);
        ResponseDataMessage(initialList);
      }
    })();
  }

  function ResponseDataMessage(response) {
    let message = "";
    response.forEach((element) => {
      console.log(element);
      if (element.status !== 200) {
        message = message + `\n[${element.type}] Error sincronizando`;
      }
      if (element.status === 200) {
        message = message + `\n[${element.type}] Sincronizado con exito`;
      }
    });
    Alert.alert("Proceso terminado!!!", message);
    setLoading(false);
  }
  async function GetAllData(url, type) {
    console.log(url);
    const data = await APIHandler.get(`${url}`).toPromise();
    console.log(data);
    const response = {
      data: data || {},
      type: type || "",
    };
    return response;
  }
  const requestAll = async () => {
    return await Promise.all(
      list.map(async (item) => {
        try {
          return await GetAllData(item.url, item.id);
        } catch (error) {
          console.log(error);
          return { type: item.id, status: error?.status };
        }
      })
    );
  };

  const ClassTypeOption = ({
    containerStyle,
    classType,
    isSelected,
    onPress,
  }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexBasis: "30%",
          height: 100,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: isSelected
            ? COLORS.primary3
            : COLORS.additionalColor11,
          margin: 5,
          ...containerStyle,
          ...styles.elevation,
        }}
        onPress={onPress}
      >
        <Image
          source={classType.icon}
          resizeMode="contain"
          style={{
            width: 40,
            height: 40,
            tintColor: isSelected ? COLORS.white : COLORS.primary3,
          }}
        />

        <Text
          style={{
            marginTop: SIZES.base,
            color: isSelected ? COLORS.white : COLORS.primary3,
            ...FONTS.h3,
            fontSize: 15,
          }}
        >
          {classType.label}
        </Text>
      </TouchableOpacity>
    );
  };
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
      >
        <TextButton
          label="Sincronizar"
          contentContainerStyle={{
            flex: 1,
            marginLeft: SIZES.radius,
            borderRadius: SIZES.radius,
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary,
          }}
          labelStyle={{
            color: COLORS.white,
            ...FONTS.h3,
          }}
          onPress={() => {
            sincronizar();
          }}
        />
      </View>
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
      {/* Content */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 150,
              paddingHorizontal: 6,
            }}
            showsHorizontalScrollIndicator={false}
          >
            <Section title="">
              <View
                style={{
                  marginTop: SIZES.radius,
                }}
              >
                <Text
                  style={{
                    ...FONTS.h1,
                    paddingHorizontal: 6,
                    color: COLORS.primary3,
                  }}
                >
                  Maestros
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: SIZES.radius,
                    flexWrap: "wrap",
                  }}
                >
                  {maestros.map((item, index) => {
                    return (
                      <ClassTypeOption
                        key={`ClassType-${index}`}
                        classType={item}
                        isSelected={isSelectedMaster(item?.id)}
                        containerStyle={[
                          styles.elevation,
                          {
                            marginLeft: 4,
                            marginBottom: 4,
                          },
                        ]}
                        onPress={() => {
                          handleAdd(item?.id, item?.url);
                        }}
                      />
                    );
                  })}
                  {/**<View
                    style={{
                      flexdirection: "column",
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: 400,
                    }}
                  >
                    <DateRange
                      containerStyle={{
                        flex: 1,
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: SIZES.radius,
                        marginTop: 5,
                        height: 50,
                      }}
                    />
                    <DateRangeWeek
                      containerStyle={{
                        flex: 1,
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: SIZES.radius,
                        marginTop: 5,
                        height: 50,
                      }}
                    />
                    <DateRangeMonth
                      containerStyle={{
                        flex: 1,
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: SIZES.radius,
                        marginTop: 5,
                        height: 50,
                      }}
                    />
                    <Tabs
                      containerStyle={{
                        flex: 1,
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: SIZES.radius,
                        marginTop: 5,
                        height: 50,
                      }}
                    />
                  </View>**/}
                </View>
                {renderFooter()}
              </View>
            </Section>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  elevation: {
    elevation: 20,
    shadowColor: "#5c627a",
  },
});
