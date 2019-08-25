import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import React from 'react';
import { Linking, View } from 'react-native';
import { BookFill, FileTextIconFill, LogOutIconFill, PersonIconFill, MenuIconMessaging } from '@src/assets/icons';
import { AuthContext } from '@src/core/auth';
// import { loadProfile } from './account/loadProfile';

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
        <SigOutButton themedStyle={themedStyle} />
        <NeedHelpButton themedStyle={themedStyle} />
        <PoliciesButton themedStyle={themedStyle} />
        <TermsButton themedStyle={themedStyle} />
      </View>
    );
  }

  // public componentDidMount() {
  //   this.handleLoad();
  // }

  private handleNavigateToAccount = () => {
    this.props.onNavigate('Conta');
  };

  private handleNavigateToWallet = () => {
    this.props.onNavigate('Minha Carteira');
  };

  // private handleLoad = async () => {
  //   try {
  //     const artist = await loadProfile();
  //     if (artist) {
  //       this.setState({ userNotVerified: Boolean(artist.iuguSubAccountId) });
  //     }
  //   } catch (error) {
  //     console.log('[Settings.tsx] before error:', error);
  //   }
  // };
}

const NavigateToAccountButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button status='info' style={themedStyle.Button} onPress={onNavigate} icon={PersonIconFill} size='giant'>
      Conta
    </Button>
  );
};

const NavigateToWalletButton = ({ themedStyle, onNavigate, userNotVerified }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Button
        status='info'
        disabled={userNotVerified}
        style={themedStyle.Button}
        onPress={onNavigate}
        icon={BookFill}
        size='giant'
      >
        Minha Carteira
      </Button>
      {userNotVerified ? (
        <Text appearance='hint' style={{ textAlign: 'center' }}>
          Sua conta está sedo verificada...
        </Text>
      ) : null}
    </View>
  );
};

const SigOutButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleSignOutClick = React.useCallback(() => context.signOut(), [context]);

  return (
    <Button status='danger' style={themedStyle.Button} onPress={handleSignOutClick} icon={LogOutIconFill} size='giant'>
      Deslogar
    </Button>
  );
};

const NeedHelpButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(
    () => Linking.openURL('mailto:suporte.favid@gmail.com?subject=Preciso de Ajuda com o aplicativo&'),
    [],
  );

  return (
    <Button status='primary' style={themedStyle.Button} onPress={handleClick} icon={MenuIconMessaging} size='giant'>
      Preciso de Ajuda
    </Button>
  );
};

const PoliciesButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(
    () =>
      Linking.openURL(
        'https://onyx-harmony-239219.firebaseapp.com/terms-and-policies/Poli%CC%81tica%20de%20Seguranc%CC%A7a%20e%20Privacidade%20-%20FAVID%20-%2011.04.2019.pdf',
      ),
    [],
  );

  return (
    <Button status='primary' style={themedStyle.Button} onPress={handleClick} icon={FileTextIconFill} size='giant'>
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
    <Button status='primary' style={themedStyle.Button} onPress={handleClick} icon={FileTextIconFill} size='giant'>
      Termos de Uso
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
  Button: {
    marginVertical: 20,
  },
}));
