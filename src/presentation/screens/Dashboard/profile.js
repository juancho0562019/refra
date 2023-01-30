import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { connect } from "react-redux";
import { loadUser, toggleTheme } from "../../../infrastructure/stores";
import { AuthContext } from "../../components/Context";
import {
  IconButton,
  TextButton,
  LineDivider,
  ProgressBar,
  ProfileValue,
  ProfileRadioButton,
} from "../../components";
import { SharedElement } from "react-navigation-shared-element";
import { getUser } from "../../../application/services";
import { useSelector, useDispatch } from "react-redux";
import {
  COLORS,
  FONTS,
  SIZES,
  icons,
  images,
} from "../../../application/constants";

const Profile = ({ navigation, appTheme, route }) => {
  const [newCourseNotification, setNewCourseNotification] = useState(false);
  const [studyReminder, setStudyReminder] = useState(false);
  const { signOut } = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  // Handler
  const isFocused = useIsFocused();
  function toggleThemeHandler() {
    if (appTheme?.name == "light") {
      toggleTheme("dark");
    } else {
      toggleTheme("light");
    }
  }

  const [data, setData] = useState({
    username: "",
    nombres: "",
    apellidos: "",
    lastAccess: "",
  });

  function handleLayout() {
    navigation.navigate("LayoutTraslado", { sharedElementPrefix: "Profile" });
  }
  function handleTraslado() {
    navigation.navigate("TrasladoListing", { sharedElementPrefix: "Profile" });
  }
  function handleEntrega() {
    navigation.navigate("EntregasLocal", { sharedElementPrefix: "Profile" });
  }

  useEffect(() => {
    if (isFocused) {
      dispatch(loadUser());
    }
  }, [isFocused]);

  const getUserData = async () => {
    //signOut();
    try {
      const dbResult = await getUser();
      return dbResult.rows._array[0];
    } catch (err) {
      throw err;
    }
  };
  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 50,
          paddingHorizontal: SIZES.padding,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: appTheme?.textColor, ...FONTS.h1 }}>Perfil</Text>
      </View>
    );
  }

  function renderProfileCard() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.padding,
          paddingHorizontal: SIZES.radius,
          paddingVertical: 20,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.primary3,
          marginTop: 50,
        }}
      >
        {/* Profile Image */}
        <TouchableOpacity style={{ width: 80, height: 80 }}>
          <Image
            source={images.student_1}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              borderWidth: 1,
              borderColor: COLORS.white,
            }}
          />

          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                marginBottom: -15,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                backgroundColor: COLORS.primary,
              }}
            >
              <Image
                source={icons.camera}
                resizeMode="contain"
                style={{
                  width: 17,
                  height: 17,
                }}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Details */}
        <View
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            alignItems: "flex-start",
          }}
        >
          <Text style={{ color: COLORS.white, ...FONTS.h2 }}>
            {user?.nombres}
          </Text>

          <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
            {user?.apellidos}
          </Text>
          <Text style={{ color: COLORS.white, ...FONTS.h2 }}>PERFIL</Text>
        </View>
      </View>
    );
  }

  function renderProfileSectionFirst() {
    return (
      <View style={styles.profileSectionContainer}>
        <ProfileValue
          icon={icons.profile}
          label="Nombres"
          value={user?.nombres}
        />

        <LineDivider />

        <ProfileValue
          icon={icons.profile}
          label="Apellidos"
          value={user?.apellidos}
        />

        <LineDivider />

        <ProfileValue
          icon={icons.profile}
          label="Bodega"
          value={user?.bodegaNombre}
        />

        <LineDivider />

        <ProfileValue
          icon={icons.password}
          label="Ultimo Acceso"
          value={user?.lastAccess}
        />

        <LineDivider />

        <ProfileValue
          icon={icons.networking}
          value="Cerrar sesion"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    );
  }

  function renderTraslados() {
    return (
      <View style={styles.profileSectionContainer}>
        <Text style={{ color: COLORS.primary3, marginTop: 30, ...FONTS.h2 }}>
          TRASLADOS
        </Text>
        {/**<ProfileValue
          icon={icons.add}
          value="Traslados"
          onPress={() => {
            handleLayout();
          }}
        />
        <LineDivider />**/}
        <ProfileValue
          icon={icons.add}
          value="Generar"
          onPress={() => {
            handleTraslado();
          }}
        />
        <LineDivider />
        <ProfileValue
          icon={icons.all}
          value="Recibir"
          onPress={() => {
            handleEntrega();
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.backgroundColor1 }}>
      {/* Header */}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SIZES.padding,
          paddingBottom: 250,
        }}
      >
        {/* Profile Card */}
        {renderProfileCard()}

        {/* Profile Section 1 */}
        {renderProfileSectionFirst()}

        {/* Profile Section 2 */}
        {renderTraslados()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSectionContainer: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    borderColor: COLORS.gray20,
  },
});

function mapStateToProps(state) {
  return {
    appTheme: state.themeReducer.appTheme,
    error: state.themeReducer.error,
  };
}

function mapDispatchToProps() {
  return {
    toggleTheme: (themeType) => {
      return toggleTheme(themeType);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
