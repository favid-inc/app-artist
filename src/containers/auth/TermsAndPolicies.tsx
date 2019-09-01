import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, CheckBox } from '@kitten/ui';
import React from 'react';
import { Linking, View } from 'react-native';

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
      <PoliciesButton themedStyle={themedStyle} />
      <TermsButton themedStyle={themedStyle} />
    </View>
  );
}

const PoliciesButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(
    () =>
      Linking.openURL(
        'https://onyx-harmony-239219.firebaseapp.com/terms-and-policies/Poli%CC%81tica%20de%20Seguranc%CC%A7a%20e%20Privacidade%20-%20FAVID%20-%2011.04.2019.pdf',
      ),
    [],
  );

  return (
    <Button status='primary' onPress={handleClick} size='tiny' appearance='ghost'>
      Politica de Segurança/Privacide
    </Button>
  );
};

const TermsButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(
    () =>
      Linking.openURL(
        'https://onyx-harmony-239219.firebaseapp.com/terms-and-policies/Termos%20de%20Uso%20do%20Site%20ou%20Aplicativo%20-%20FAVID%20-%2011.04.2019.pdf',
      ),
    [],
  );

  return (
    <Button status='primary' onPress={handleClick} size='tiny' appearance='ghost'>
      Termos de Uso
    </Button>
  );
};

export const TermsAndPolicies = withStyles<ComponentProps>(TermsAndPoliciesComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
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
