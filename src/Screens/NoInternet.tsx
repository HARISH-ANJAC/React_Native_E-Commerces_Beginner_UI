import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../Utils/Contsants";

interface NoInternetProps {
  onRetry?: () => void;
}

const { width } = Dimensions.get("window");

const NoInternet: React.FC<NoInternetProps> = ({ onRetry }) => {
  return (
    <View
      style={styles.container}
    >
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.primary} />
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <FontAwesome name="wifi" size={64} color="#ef4444" />
          <View style={styles.strike} />
        </View>

        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          You’re currently offline. Please check your network settings and try again.
        </Text>

        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.85}>
          <View
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:COLORS.primary
  },
  card: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrapper: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  strike: {
    position: "absolute",
    width: 70,
    height: 4,
    backgroundColor: "#ef4444",
    transform: [{ rotate: "-45deg" }],
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    backgroundColor:COLORS.primary,
    color:COLORS.black
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.black,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
