import { H2, Paragraph, Card, Text, View, XStack, YStack } from 'tamagui';

type OptionT = {
  step: number;
  title: string;
  desc: string;
};

const howItWork: OptionT[] = [
  {
    step: 1,
    title: 'Buy Your Number',
    desc: 'Choose any number from the available range',
  },
  {
    step: 2,
    title: 'Wait for Draw',
    desc: 'Numbers are drawn at the end of the month',
  },
  { step: 3, title: 'Win Prizes', desc: 'If your number matches, you win the prize!' },
];

type HowItWorkSectionProps = {
  options?: OptionT[];
  title?: string;
};

export const HowItWorkSection = ({
  options = howItWork,
  title = 'How It Works',
}: HowItWorkSectionProps) => {
  return (
    <Card padded rounded={'$true'} gap="$4">
      <H2 fontWeight="700">{title}</H2>

      <YStack gap="$3">
        {options.map((item, index) => (
          <XStack key={index} gap="$4" items="center">
            <View
              bg="$black3"
              rounded={'$true'}
              width={40}
              height={40}
              themeInverse
              items="center"
              justify="center">
              <Text fontSize={16} fontWeight="bold">
                {item.step}
              </Text>
            </View>
            <YStack flex={1}>
              <Paragraph fontWeight="900" size="$6">
                {item.title}
              </Paragraph>
              <Paragraph size="$3">{item.desc}</Paragraph>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </Card>
  );
};
