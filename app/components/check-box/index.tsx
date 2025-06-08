import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { AnimatedCheckbox } from "@/components/index";

const CheckBoxDemo: React.FC = (): React.ReactNode => {
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
    biometric: false,
  });

  const updateAgreement =
    (key: keyof typeof agreements) => (checked: boolean) => {
      setAgreements((prev) => ({ ...prev, [key]: checked }));
    };

  const canProceed = agreements.terms && agreements.privacy;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to React Native Glow</Text>
        <Text style={styles.subtitle}>
          Please review and accept our policies to continue
        </Text>

        <View style={styles.agreementsList}>
          <AnimatedCheckbox
            checked={agreements.terms}
            onPress={updateAgreement("terms")}
            label="I agree to the Terms of Service"
            size={20}
            borderRadius={4}
            activeColor="#3b82f6"
            inactiveColor="transparent"
            borderColor="#3f3f46"
            borderWidth={1}
            checkMarkColor="#ffffff"
            animationDuration={200}
            bounceEffect={true}
            containerStyle={styles.checkboxRow}
            labelStyle={styles.labelRequired}
          />

          <AnimatedCheckbox
            checked={agreements.privacy}
            onPress={updateAgreement("privacy")}
            label="I accept the Privacy Policy"
            size={20}
            borderRadius={4}
            activeColor="#3b82f6"
            inactiveColor="transparent"
            borderColor="#3f3f46"
            borderWidth={1}
            checkMarkColor="#ffffff"
            animationDuration={200}
            bounceEffect={true}
            containerStyle={styles.checkboxRow}
            labelStyle={styles.labelRequired}
          />

          <View style={styles.divider} />

          <AnimatedCheckbox
            checked={agreements.marketing}
            onPress={updateAgreement("marketing")}
            label="Send me promotional emails"
            size={18}
            borderRadius={4}
            activeColor="#10b981"
            inactiveColor="transparent"
            borderColor="#3f3f46"
            borderWidth={1}
            checkMarkColor="#ffffff"
            animationDuration={250}
            rippleEffect={true}
            containerStyle={styles.checkboxRow}
            labelStyle={styles.labelOptional}
          />

          <AnimatedCheckbox
            checked={agreements.biometric}
            onPress={updateAgreement("biometric")}
            label="Enable biometric authentication"
            size={18}
            borderRadius={4}
            activeColor="#8b5cf6"
            inactiveColor="transparent"
            borderColor="#3f3f46"
            borderWidth={1}
            checkMarkColor="#ffffff"
            animationDuration={250}
            rippleEffect={true}
            containerStyle={styles.checkboxRow}
            labelStyle={styles.labelOptional}
          />
        </View>

        <View style={styles.footer}>
          <View style={[styles.button, !canProceed && styles.buttonDisabled]}>
            <Text
              style={[
                styles.buttonText,
                !canProceed && styles.buttonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </View>
          <Text style={styles.footerNote}>
            Required fields must be accepted to proceed
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fafafa",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#a1a1aa",
    lineHeight: 22,
    marginBottom: 40,
  },
  agreementsList: {
    flex: 1,
  },
  checkboxRow: {
    paddingVertical: 16,
  },
  labelRequired: {
    fontSize: 15,
    color: "#fafafa",
    fontWeight: "400",
    marginLeft: 12,
    lineHeight: 20,
  },
  labelOptional: {
    fontSize: 15,
    color: "#d4d4d8",
    fontWeight: "400",
    marginLeft: 12,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#27272a",
    marginVertical: 8,
  },
  footer: {
    marginTop: 32,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#27272a",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  buttonTextDisabled: {
    color: "#71717a",
  },
  footerNote: {
    fontSize: 13,
    color: "#71717a",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default CheckBoxDemo;
