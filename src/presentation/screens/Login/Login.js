import React, { useState } from "react";
import { registerForPushNotificationsAsync } from "../../../infrastructure/api/Notification";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
//import {signIn} from '../../../infrastructure/stores/login';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "react-native-paper";
import { AuthContext } from "../../components/Context";
import { UserEndpoint } from "../../../infrastructure/api/api";
import { useNetInfo } from "@react-native-community/netinfo";
import { COLORS, FONTS, SIZES } from "../../../application/constants";
const Login = ({ navigation }) => {
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  //const dispatch = useDispatch();
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const { colors } = useTheme();
  const { signIn } = React.useContext(AuthContext);
  //const { signIn } = React.useContext(AuthContext);
  //const signIn = useSelector(state => state.loginReducer.signIn);
  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  const loginHandle = () => {
    if (!netInfo.isConnected) {
      Alert.alert(
        "No internet connection!",
        "Esta accion no esta disponible sin conexion a internet.",
        [{ text: "Okay" }]
      );
    } else {
      setLoading(true);
      let foundUser = {};

      if (data.username.length == 0 || data.password.length == 0) {
        Alert.alert(
          "Wrong Input!",
          "Username or password field cannot be empty.",
          [{ text: "Okay" }]
        );
        setLoading(false);
        return;
      }

      (async () => {
        let token = await registerForPushNotificationsAsync();
        console.log(token);
        if (token === undefined || token === "undefined" || token === null) {
          Alert.alert("Error!", "Error al registrar el dispositivo.", [
            { text: "Okay" },
          ]);
        } else {
          const userLogin = {
            username: data.username,
            password: data.password,
            ExponentPushToken: token,
          };
          UserEndpoint.Login(userLogin)
            .toPromise()
            .then((x) => {
              signIn(x);
            })
            .catch((z) => {
              console.log(z);
              Alert.alert(
                "Acceso incorrecto!",
                "El usuario o la contraseña no es correcto",
                [{ text: "Ok" }]
              );
            })
            .finally((c) => {
              setLoading(false);
            });

          /**if (foundUser.status === 401 || foundUser.length == 0) {
           
            setLoading(false);
            return;
          }
          **/
        }
      })();
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: COLORS.base }}>
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
        <View style={{ ...styles.container, backgroundColor: COLORS.base }}>
          <View style={styles.header}>
            <Text style={styles.text_header}>Bienvenido!</Text>
          </View>
          <Animatable.View
            animation="fadeInUpBig"
            style={[
              styles.footer,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.text_footer,
                {
                  color: colors.text,
                },
              ]}
            >
              Nombre Usuario
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.text} size={20} />
              <TextInput
                placeholder="Usuario"
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange(val)}
                onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
              />
              {data.check_textInputChange ? (
                <Animatable.View animation="bounceIn">
                  <Feather
                    name="check-circle"
                    color={COLORS.primary}
                    size={20}
                  />
                </Animatable.View>
              ) : null}
            </View>
            {data.isValidUser ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Usuario incorrecto</Text>
              </Animatable.View>
            )}

            <Text
              style={[
                styles.text_footer,
                {
                  color: colors.text,
                  marginTop: 35,
                },
              ]}
            >
              Contraseña
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color={colors.text} size={20} />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                autoCapitalize="none"
                onChangeText={(val) => handlePasswordChange(val)}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color="grey" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {data.isValidPassword ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Contraseña incorrecta</Text>
              </Animatable.View>
            )}

            <TouchableOpacity>
              <Text style={{ color: COLORS.primary, marginTop: 15 }}>
                Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  loginHandle();
                }}
              >
                <LinearGradient
                  colors={[COLORS.base, COLORS.primary]}
                  style={styles.signIn}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: COLORS.additionalColor11,
                      },
                    ]}
                  >
                    Ingreso
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
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
