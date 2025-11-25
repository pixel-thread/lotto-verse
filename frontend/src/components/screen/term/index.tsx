import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, H2, H3, Card, Separator } from 'tamagui';
import { Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';

export function TermsAndConditionsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <YStack gap="$6" maxW={800} self="center" width="100%">
          {/* Header */}
          <YStack gap="$3">
            <H2 fontSize={28} fontWeight="900">
              Terms & Conditions
            </H2>
            <Text fontSize={14}>Last Updated: November 13, 2025</Text>
          </YStack>

          {/* Age Restriction - Highlighted */}
          <Card
            backgroundColor="$red2"
            padding="$4"
            borderRadius="$6"
            borderWidth={2}
            borderColor="$red7">
            <YStack gap="$2">
              <Text fontSize={18} fontWeight="800" color="$red11">
                ⚠️ Age Restriction - 18+ Only
              </Text>
              <Text fontSize={15} color="$red11" lineHeight={22}>
                You must be at least 18 years of age to participate in any draw or purchase lucky
                numbers on this platform. By proceeding, you confirm that you meet this age
                requirement.
              </Text>
            </YStack>
          </Card>

          <Separator borderColor="$borderColor" />

          {/* Section 1 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              1. Acceptance of Terms
            </H3>
            <Text fontSize={15} lineHeight={24}>
              By accessing and using this platform, you accept and agree to be bound by the terms
              and provisions of this agreement. If you do not agree to these terms, please do not
              use this service.
            </Text>
          </YStack>

          {/* Section 2 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              2. Eligibility Requirements
            </H3>
            <YStack gap="$2" paddingInlineStart="$3">
              <Text fontSize={15} color="gray" lineHeight={24}>
                • You must be at least 18 years of age
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • You must have legal capacity to enter into binding contracts
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • You must reside in a jurisdiction where participation in draws is legal
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • You must provide accurate and truthful information during registration
              </Text>
            </YStack>
          </YStack>

          {/* Section 3 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              3. Account Responsibility
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              You are responsible for maintaining the confidentiality of your account credentials.
              All activities under your account are your responsibility. Notify us immediately of
              any unauthorized use of your account.
            </Text>
          </YStack>

          {/* Section 4 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              4. Draw Participation Rules
            </H3>
            <YStack gap="$2" paddingInlineStart="$3">
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Each lucky number can only be purchased once per draw
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Numbers are assigned on a first-come, first-served basis
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • All purchases are final and non-refundable once confirmed
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Winners will be selected randomly on the declared draw date
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Winner announcement will be made at 6:00 PM on the draw end date
              </Text>
            </YStack>
          </YStack>

          {/* Section 5 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              5. Payment Terms
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              All payments must be made in Indian Rupees (₹). We use secure third-party payment
              processors (Razorpay) to handle transactions. Entry fees and platform fees are clearly
              displayed before purchase and are non-refundable.
            </Text>
          </YStack>

          {/* Section 6 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              6. Winner Selection & Prize Distribution
            </H3>
            <YStack gap="$2" paddingInlineStart="$3">
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Winners are selected through a random, automated process
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Winners will be notified via email and phone within 24 hours
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Prize money will be transferred within 7-10 business days
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Winners must provide valid bank account details for prize transfer
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Applicable taxes are the responsibility of the winner
              </Text>
            </YStack>
          </YStack>

          {/* Section 7 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              7. Prohibited Activities
            </H3>
            <YStack gap="$2" paddingInlineStart="$3">
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Using automated systems or bots to purchase numbers
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Creating multiple accounts to circumvent rules
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Attempting to manipulate or interfere with the draw process
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Fraudulent payment methods or chargebacks
              </Text>
              <Text fontSize={15} color="gray" lineHeight={24}>
                • Reselling or transferring purchased numbers
              </Text>
            </YStack>
          </YStack>

          {/* Section 8 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              8. Privacy & Data Protection
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              We collect and process your personal data in accordance with our Privacy Policy. Your
              information is used solely for draw participation, winner notification, and prize
              distribution. We do not sell or share your data with third parties without consent.
            </Text>
          </YStack>

          {/* Section 9 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              9. Limitation of Liability
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              We are not liable for any indirect, incidental, or consequential damages arising from
              your use of this platform. Our total liability shall not exceed the amount of your
              entry fee for the relevant draw.
            </Text>
          </YStack>

          {/* Section 10 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              10. Draw Cancellation
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              We reserve the right to cancel or postpone any draw due to technical issues, legal
              requirements, or insufficient participation. In such cases, all entry fees will be
              refunded within 7 business days.
            </Text>
          </YStack>

          {/* Section 11 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              11. Modifications to Terms
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Continued use of the platform constitutes acceptance of
              modified terms.
            </Text>
          </YStack>

          {/* Section 12 */}
          {/* <YStack gap="$3"> */}
          {/*   <H3 fontSize={20} fontWeight="700"> */}
          {/*     12. Governing Law */}
          {/*   </H3> */}
          {/*   <Text fontSize={15} color="gray" lineHeight={24}> */}
          {/*     These terms are governed by the laws of India. Any disputes shall be resolved in the */}
          {/*     courts of [Your Jurisdiction]. */}
          {/*   </Text> */}
          {/* </YStack> */}

          {/* Section 13 */}
          <YStack gap="$3">
            <H3 fontSize={20} fontWeight="700">
              12. Contact Information
            </H3>
            <Text fontSize={15} color="gray" lineHeight={24}>
              For questions about these terms, please contact us at:
            </Text>
            <YStack gap="$1" paddingInlineStart="$3">
              <Text fontSize={15} color="gray">
                Email: 1998nongrum@gmail.com
              </Text>
            </YStack>
          </YStack>

          {/* Final Notice */}
          <Card
            backgroundColor="$blue2"
            padding="$4"
            borderRadius="$6"
            borderWidth={1}
            borderColor="$blue6">
            <Text fontSize={14} color="$blue11" lineHeight={22} text="center">
              By using this platform, you acknowledge that you have read, understood, and agree to
              be bound by these Terms and Conditions.
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
