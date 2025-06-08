import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/index";

const AccordionDemo = (): React.ReactNode => {
  return (
    <ScrollView
      className="flex-1 bg-gray-950"
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 24,
      }}
      scrollEnabled={true}
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 mb-14 mt-5">
          <Text className="text-white text-2xl font-semibold text-center mb-2">
            Frequently Asked Questions
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Everything you need to know about our platform
          </Text>
        </View>
        <View className="mx-6">
          <Accordion className="space-y-1">
            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  How do I get started?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6">
                    Getting started is simple. Create your account, complete
                    your profile, and explore the dashboard. Our onboarding
                    guide will walk you through the essential features to help
                    you get up and running quickly.
                  </Text>
                </View>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  What features are available?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6 mb-4">
                    Our platform includes comprehensive tools designed for
                    efficiency and collaboration:
                  </Text>
                  <View className="space-y-2">
                    <Text className="text-gray-300 text-sm">
                      • Advanced analytics and reporting
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      • Real-time team collaboration
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      • Automated workflow management
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      • Secure data storage and backup
                    </Text>
                  </View>
                </View>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  What are the pricing options?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6 mb-4">
                    We offer flexible pricing plans to suit different needs:
                  </Text>
                  <View className="space-y-3">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-sm font-medium">
                          Starter Plan
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          Perfect for individuals
                        </Text>
                      </View>
                      <Text className="text-white text-sm font-medium">
                        $9/month
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-sm font-medium">
                          Pro Plan
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          Best for teams
                        </Text>
                      </View>
                      <Text className="text-white text-sm font-medium">
                        $29/month
                      </Text>
                    </View>
                  </View>
                </View>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  How can I get support?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6 mb-4">
                    Our support team is available 24/7 to assist you:
                  </Text>
                  <View className="space-y-2">
                    <Text className="text-gray-300 text-sm">
                      Email: support@company.com
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      Live chat: Available in-app
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      Phone: +1 (555) 123-4567
                    </Text>
                  </View>
                </View>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  Can I cancel my subscription anytime?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6">
                    Yes, you can cancel your subscription at any time from your
                    account settings. Your access will continue until the end of
                    your current billing period, and no further charges will be
                    applied.
                  </Text>
                </View>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="border border-gray-800 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-900/50">
                <Text className="text-white text-base font-medium">
                  Is my data secure?
                </Text>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-gray-900/30 border-t border-gray-800">
                <View className="ml-3">
                  <Text className="text-gray-300 text-sm leading-6">
                    Absolutely. We use industry-standard encryption, regular
                    security audits, and comply with major data protection
                    regulations. Your data is stored securely and never shared
                    with third parties without your explicit consent.
                  </Text>
                </View>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View className="items-center mt-12 opacity-60">
          <Text className="text-gray-500 text-center text-xs">
            Still have questions? Contact our support team
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AccordionDemo;
