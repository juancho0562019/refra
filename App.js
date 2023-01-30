import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import * as Font from "expo-font";
import { Easing, Linking } from "react-native";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { List } from "./src/infrastructure/api/api";
import thunk from "redux-thunk";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import {
  themeReducer,
  userReducer,
  trasladosReducer,
  productoReducer,
  bodegaReducer,
  conductorReducer,
} from "./src/infrastructure/stores";
import { QrHerramienta } from "./src/presentation/screens/Traslados";
import { saveUser, getUser, removeUser } from "./src/application/services";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { DatabaseInit } from "./src/application";
import { DatabaseConnection } from "./src/application/services";
import { AuthContext } from "./src/presentation/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dashboard } from "./src/presentation/screens/Dashboard";
import {
  TrasladoListing,
  TrasladosDia,
  Traslados,
  Articulos,
  ArticulosSeleccionados,
} from "./src/presentation/screens/Traslados";
import { LayoutTraslado } from "./src/presentation/screens/Traslados/Generar";
import {
  EntregasDescargas,
  Entrega,
  EntregasLocal,
  ArticulosEntrega,
} from "./src/presentation/screens/Traslados/Entregas";
import Moment from "moment";
import "moment/locale/es";
import { MainLayout } from "./src/presentation/screens/Layouts";
import { RootStackScreen } from "./src/presentation/screens/Root";
import { navigationRef } from "./RootNavigation";
import * as RootNavigation from "./RootNavigation";
const Stack = createSharedElementStackNavigator();
const options = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: 400, easing: Easing.inOut(Easing.ease) },
    },
    close: {
      animation: "timing",
      config: { duration: 400, easing: Easing.inOut(Easing.ease) },
    },
  },
  cardStyleInterpolator: ({ current: { progress } }) => {
    return {
      cardStyle: {
        opacity: progress,
      },
    };
  },
};

const loginReducer = (prevState, action) => {
  switch (action.type) {
    case "RETRIEVE_TOKEN":
      return {
        ...prevState,
        token: action.token,
        isLoading: false,
      };
    case "LOGIN":
      return {
        ...prevState,
        userName: action.id,
        token: action.token,
        refreshToken: action.refreshToken,
        isLoading: false,
        nombres: action.nombres,
        apellidos: action.apellidos,
        bodegaId: action.bodegaId,
        bodegaNombre: action.bodegaNombre,
      };
    case "LOGOUT":
      return {
        ...prevState,
        userName: null,
        token: null,
        isLoading: false,
        nombres: null,
        apellidos: null,
        refreshToken: null,
        bodegaId: null,
        bodegaNombre: null,
      };
  }
};

const rootReducer = combineReducers({
  themeReducer: themeReducer,
  userReducer: userReducer,
  traslados: trasladosReducer,
  productos: productoReducer,
  bodegas: bodegaReducer,
  conductores: conductorReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default function App() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const db = DatabaseConnection.getConnection();
  const [appIsReady, setAppIsReady] = useState(false);
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    nombres: null,
    apellidos: null,
    refreshToken: null,
    bodegaId: null,
    bodegaNombre: null,
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.type &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER &&
      lastNotificationResponse.notification.request.content.data.type ==
        "Entregas"
    ) {
      console.log("notification");
      RootNavigation.navigate("Entregas", { sharedElementPrefix: "Profile" });
    }
  }, [lastNotificationResponse]);
  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        //userToken = await AsyncStorage.getItem('token');

        userToken = await getUser(db);
      } catch (e) {
        console.log(e);
      }

      dispatch({
        type: "RETRIEVE_TOKEN",
        token: userToken?.rows._array[0]?.token,
      });
    }, 1000);
    async function prepare() {
      try {
        await DatabaseInit();
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
          "Roboto-Italic": require("./assets/fonts/Roboto-Italic.ttf"),
          "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
          "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
        });
        //getListData
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // setUserToken('fgkj');
        // setIsLoading(false);
        const userToken = String(foundUser.token);
        const refreshToken = String(foundUser.token);
        const userName = foundUser.username;
        const nombres = foundUser.nombres;
        const apellidos = foundUser.apellidos;
        const fecha = Moment().format("MMMM Do YYYY, h:mm:ss a");
        const bodegaId = foundUser.bodegaId;
        const bodegaNombre = foundUser.nombreBodega;
        await saveUser(
          db,
          userName,
          nombres,
          apellidos,
          userToken,
          refreshToken,
          fecha,
          bodegaId,
          bodegaNombre
        );

        dispatch({
          type: "LOGIN",
          id: userName,
          token: userToken,
          refreshToken: refreshToken,
          nombres: nombres,
          apellidos: apellidos,
          bodegaId: bodegaId,
          bodegaNombre: bodegaNombre,
        });
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        try {
          await removeUser(db);
          await AsyncStorage.removeItem("token");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authContext}>
        <View onLayout={onLayoutRootView}></View>
        <NavigationContainer ref={navigationRef}>
          {loginState.token !== null && loginState.token !== undefined ? (
            <Stack.Navigator
              screenOptions={{
                useNativeDriver: true,
                headerShown: false,
              }}
              initialRouteName={"Login"}
              detachInactiveScreens={false}
            >
              <Stack.Screen name="Main" component={MainLayout} />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={() => options}
              />
              <Stack.Screen
                name="TrasladoListing"
                component={TrasladoListing}
                options={() => options}
              />
              <Stack.Screen
                name="TrasladosDia"
                component={TrasladosDia}
                options={() => options}
              />
              <Stack.Screen
                name="Traslados"
                component={Traslados}
                options={() => options}
              />
              <Stack.Screen
                name="LayoutTraslado"
                component={LayoutTraslado}
                options={() => options}
              />
              <Stack.Screen
                name="Entregas"
                component={EntregasDescargas}
                options={() => options}
              />
              <Stack.Screen
                name="Entrega"
                component={Entrega}
                options={() => options}
              />
              <Stack.Screen
                name="EntregasLocal"
                component={EntregasLocal}
                options={() => options}
              />
              <Stack.Screen
                name="ArticulosEntrega"
                component={ArticulosEntrega}
                options={() => options}
              />
              <Stack.Screen
                name="Articulos"
                component={Articulos}
                options={() => options}
              />
              <Stack.Screen
                name="ArticulosSeleccionados"
                component={ArticulosSeleccionados}
                options={() => options}
              />
              <Stack.Screen
                name="QrHerramienta"
                component={QrHerramienta}
                options={() => options}
              />
              ):
              <RootStackScreen />
            </Stack.Navigator>
          ) : (
            <RootStackScreen />
          )}
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
