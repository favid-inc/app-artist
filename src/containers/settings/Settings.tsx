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
        <ShareAfilliationButton themedStyle={themedStyle} />
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

const ShareAfilliationButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleSignOutClick = React.useCallback(() => {
    const { user } = context;
    const s1 = md5(Date.now());
    const s2 = md5(`(${s1})[${user.email}]`);
    const s3 = md5(`(${s1})[${user.uid}]`);
    const s4 = md5(`(${s1})[${s2}][${s3}]`);

    const params: ApplyForAffiliation['Request']['params'] = { s1, s2, s3, s4 };

    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map((k) => esc(k) + '=' + esc(params[k]))
      .join('&');

    const url: ApplyForAffiliation['Request']['url'] = '/ApplyForAffiliation';

    const { baseURL } = config.api;

    const fullUrl = `${baseURL}/${url}?${query}`;

    Share.share(
      Platform.select({
        ios: {
          title: `Venha participar do Favid como meu afiliado`,
          url: fullUrl,
        },
        android: {
          title: `Venha participar do Favid como meu afiliado`,
          message: `Venha participar do Favid como meu afiliado: "${fullUrl}"`,
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
  const handleClick = React.useCallback(
    () => Linking.openURL('mailto:suporte.favid@gmail.com?subject=Preciso de Ajuda com o aplicativo&'),
    [],
  );

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
