import { ApplyForAffiliation } from '@favid-inc/api/lib/app-artist';
import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import md5 from 'md5';
import React from 'react';
import { Linking, Platform, Share, View } from 'react-native';

import {
  BookFill,
  FileTextIconFill,
  LogOutIconFill,
  MenuIconMessaging,
  PeopleIconFill,
  PersonIconFill,
} from '@src/assets/icons';
import { AuthContext } from '@src/core/auth';
import * as config from '@src/core/config';

import { readApplyForAffiliationLink } from './readApplyForAffiliationLink';

interface Props {
  onNavigate: (pathName: string) => void;
}

export type SettingsComponentProps = ThemedComponentProps & Props;

interface State {
  userNotVerified: boolean;
}

class SettingsComponent extends React.Component<SettingsComponentProps, State> {
  public state: State = {
    userNotVerified: true,
  };

  public render() {
    const { themedStyle } = this.props;

    return (
      <View style={themedStyle.container}>
        <NavigateToWalletButton
          userNotVerified={false}
          themedStyle={themedStyle}
          onNavigate={this.handleNavigateToWallet}
        />
        <NavigateToAccountButton themedStyle={themedStyle} onNavigate={this.handleNavigateToAccount} />
        <ShareAffilliationButton themedStyle={themedStyle} />
        <NeedHelpButton themedStyle={themedStyle} />
        <PoliciesButton themedStyle={themedStyle} />
        <SigOutButton themedStyle={themedStyle} />
      </View>
    );
  }

  private handleNavigateToAccount = () => {
    this.props.onNavigate('Conta');
  };

  private handleNavigateToWallet = () => {
    this.props.onNavigate('Minha Carteira');
  };
}

const NavigateToAccountButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button status='info' style={themedStyle.button} onPress={onNavigate} icon={PersonIconFill} size='large'>
      Conta
    </Button>
  );
};

const NavigateToWalletButton = ({ themedStyle, onNavigate, userNotVerified }) => {
  return (
    <>
      <Button
        status='info'
        disabled={userNotVerified}
        style={themedStyle.button}
        onPress={onNavigate}
        icon={BookFill}
        size='large'
      >
        Minha Carteira
      </Button>
      {userNotVerified && (
        <Text appearance='hint' style={{ textAlign: 'center', marginBottom: 20 }}>
          Sua conta está sendo verificada...
        </Text>
      )}
    </>
  );
};

const SigOutButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleSignOutClick = React.useCallback(() => context.signOut(), [context]);

  return (
    <Button status='danger' style={themedStyle.button} onPress={handleSignOutClick} icon={LogOutIconFill} size='large'>
      Deslogar
    </Button>
  );
};

const ShareAffilliationButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleSignOutClick = React.useCallback(async () => {
    const { url } = await readApplyForAffiliationLink();
    Share.share(
      Platform.select({
        ios: {
          title: `Venha participar do Favid como meu afiliado`,
          url,
        },
        android: {
          title: `Venha participar do Favid como meu afiliado`,
          message: `Venha participar do Favid como meu afiliado: "${url}"`,
        },
      }),
    );
  }, [context]);

  return (
    <Button status='warning' style={themedStyle.button} onPress={handleSignOutClick} icon={PeopleIconFill} size='large'>
      Convidar Afiliado
    </Button>
  );
};

const NeedHelpButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(() => Linking.openURL('https://favid.com.br/suporte/'), []);

  return (
    <Button status='primary' style={themedStyle.button} onPress={handleClick} icon={MenuIconMessaging} size='large'>
      Preciso de Ajuda
    </Button>
  );
};

const PoliciesButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(() => Linking.openURL('https://www.favid.com.br/politicas/'), []);

  return (
    <Button status='primary' style={themedStyle.button} onPress={handleClick} icon={FileTextIconFill} size='large'>
      Politicas
    </Button>
  );
};

export const Settings = withStyles(SettingsComponent, (theme: ThemeType) => ({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
}));
