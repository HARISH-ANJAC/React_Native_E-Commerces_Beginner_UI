// LoginScreen.tsx
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../Utils/Contsants";
import CustomTextInput from "../Components/CustomTextInput";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isValidEmail, isValidPassword } from "../Utils/validators";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const LoginScreen = () => {
  const [LoginForm, setLoginForm] = useState({
    loginId: "",
    password: "",
    rememberMe: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedLoginId = await AsyncStorage.getItem("rememberedLoginId");
        const savedPassword = await AsyncStorage.getItem("rememberedPassword");

        if (savedLoginId && savedPassword) {
          setLoginForm({
            loginId: savedLoginId,
            password: savedPassword,
            rememberMe: true,
          });
        }
      } catch (error) {
        console.error("Error loading saved credentials", error);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const { loginId, password, rememberMe } = LoginForm;

    if (!loginId || !password) {
      setErrorMessage("Please enter email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const login = await auth().signInWithEmailAndPassword(
        loginId.trim(),
        password
      );

      if (login?.user) {
        setErrorMessage("");
        ToastAndroid.show("Login Success", ToastAndroid.SHORT);
        setIsLoading(false);
        navigation.navigate("Products");

        if (rememberMe) {
          await AsyncStorage.setItem("rememberedLoginId", loginId);
          await AsyncStorage.setItem("rememberedPassword", password);
        } else {
          await AsyncStorage.removeItem("rememberedLoginId");
          await AsyncStorage.removeItem("rememberedPassword");
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email address format.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Incorrect email or password. Please try again.");
          break;
        case "auth/user-not-found":
          setErrorMessage("No account found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Too many attempts. Try again later.");
          break;
        default:
          setErrorMessage(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.Very_light }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp("12%") : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: wp("6%") }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Illustration */}
          <View style={styles.topIllustration}>
            <Image
              source={require("../assets/Loginframe.png")}
              style={{
                width: wp("70%"),
                height: hp("25%"),
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={[styles.titleText, { color: COLORS.textDark }]}>
              Welcome Back 👋
            </Text>
            <Text style={styles.subtitleText}>
              Sign in to access our RNAssignment dashboard
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: hp("3%") }}>
            {/* Email */}
            <View>
              <Text style={styles.label}>Email</Text>
              <CustomTextInput
                type={"email"}
                placeholder="Email"
                value={LoginForm.loginId}
                onChangeText={(text) =>
                  setLoginForm({ ...LoginForm, loginId: text })
                }
                error={
                  LoginForm.loginId && !isValidEmail(LoginForm.loginId)
                    ? "Please enter a valid email."
                    : ""
                }
              />
            </View>

            {/* Password */}
            <View>
              <Text style={styles.label}>Password</Text>
              <CustomTextInput
                type="password"
                placeholder="Password"
                value={LoginForm.password}
                onChangeText={(text) =>
                  setLoginForm({ ...LoginForm, password: text })
                }
                error={
                  LoginForm.password && !isValidPassword(LoginForm.password)
                    ? "Password must be at least 6 characters."
                    : ""
                }
              />
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.rememberForgotContainer}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() =>
                  setLoginForm({
                    ...LoginForm,
                    rememberMe: !LoginForm.rememberMe,
                  })
                }
              >
                <FontAwesome
                  name={LoginForm.rememberMe ? "check-square" : "square-o"}
                  size={wp("5%")}
                  color={COLORS.primary}
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator
                  color={COLORS.white}
                  size={"small"}
                  style={{ paddingVertical: hp("2%") }}
                />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: hp("8%") }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  topIllustration: {
    alignItems: "center",
    marginBottom: hp("4%"),
  },
  titleContainer: {
    marginBottom: hp("4%"),
  },
  titleText: {
    fontSize: wp("7%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  subtitleText: {
    textAlign: "center",
    color: "#4b5563",
    fontSize: wp("4%"),
  },
  label: {
    color: COLORS.Slate_Gray,
    fontWeight: "600",
    fontSize: wp("4%"),
    marginBottom: hp("1%"),
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp("2%"),
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: wp("2%"),
    fontWeight: "600",
    fontSize: wp("3.5%"),
    color: COLORS.primary,
  },
  forgotText: {
    textDecorationLine: "underline",
    fontSize: wp("3.5%"),
    color: COLORS.primary,
    fontWeight: "600",
  },
  errorMessage: {
    color: "#dc2626",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: wp("3%"),
    marginTop: hp("1.5%"),
  },
  loginButtonText: {
    color: COLORS.white,
    textAlign: "center",
    paddingVertical: hp("2%"),
    fontSize: wp("4.5%"),
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
