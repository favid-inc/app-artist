import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, CheckBox } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { textStyle } from '@src/components/common';

interface ComponentProps {
  onTermsAcceptedChange: (value: boolean) => void;
  termsAcceptedValue: boolean;
}

type Props = ComponentProps & ThemedComponentProps;

export function TermsAndPoliciesComponent({ themedStyle, onTermsAcceptedChange, termsAcceptedValue }: Props) {
  return (
    <View style={themedStyle.container}>
      <CheckBox
        style={themedStyle.termsCheckBox}
        textStyle={themedStyle.termsCheckBoxText}
        checked={termsAcceptedValue}
        text={'Declaro que li e concordo com os termos de uso'}
        onChange={onTermsAcceptedChange}
      />
      <PoliciesButton />
    </View>
  );
}

const PoliciesButton = withNavigation(({ navigation }) => {
  const handleClick = React.useCallback(() => navigation.navigate('Políticas'), [navigation]);

  return (
    <Button status='primary' onPress={handleClick} size='tiny' appearance='ghost'>
      Termos de uso e Políticas de Segurança/Privacide
    </Button>
  );
});

export const TermsAndPolicies = withStyles<ComponentProps>(TermsAndPoliciesComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    // width: 300,
  },
  termsCheckBox: {
    marginHorizontal: 20,
  },
  termsCheckBoxText: {
    fontSize: 11,
    color: theme['text-hint-color'],
    ...textStyle.paragraph,
  },
}));
