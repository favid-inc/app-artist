import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import React from 'react';
import { Linking, Platform, Share, View } from 'react-native';

import {
  BookFill,
  FileTextIconFill,
  LogOutIconFill,
  MenuIconMessaging,
  PeopleIconFill,
  PersonIconFill,
  MessageCircleIconFill,
} from '@src/assets/icons';
import { AuthContext } from '@src/core/auth';
import pkg from '../../../package.json';

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
          themedStyle={themedStyle}
          onNavigate={this.handleNavigateToWallet}
        />
        <NavigateToAccountButton
          themedStyle={themedStyle}
          onNavigate={this.handleNavigateToAccount}
        />
        <NavigateToReviewsButton
          themedStyle={themedStyle}
          onNavigate={this.handleNavigateToReviews}
        />
        <ShareAffilliationButton themedStyle={themedStyle} />
        <NeedHelpButton themedStyle={themedStyle} />
        <PoliciesButton
          themedStyle={themedStyle}
          onNavigate={this.handleNavigatePolicies}
        />
        <SigOutButton themedStyle={themedStyle} />
        <Text category='p1' appearance='hint'>
          Versão: {pkg.version}
        </Text>
      </View>
    );
  }

  private handleNavigateToAccount = () => {
    this.props.onNavigate('Conta');
  };

  private handleNavigateToReviews = () => {
    this.props.onNavigate('Avaliações');
  };

  private handleNavigatePolicies = () => {
    this.props.onNavigate('Políticas');
  };

  private handleNavigateToWallet = () => {
    this.props.onNavigate('Minha Carteira');
  };
}

const NavigateToAccountButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button
      status='info'
      style={themedStyle.button}
      onPress={onNavigate}
      icon={PersonIconFill}
      size='large'
    >
      Meu Perfil
    </Button>
  );
};

const NavigateToWalletButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button
      status='info'
      style={themedStyle.button}
      onPress={onNavigate}
      icon={BookFill}
      size='large'
    >
      Minha Carteira
    </Button>
  );
};

const NavigateToReviewsButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button
      status='info'
      style={themedStyle.button}
      onPress={onNavigate}
      icon={MessageCircleIconFill}
      size='large'
    >
      Minhas Avaliações
    </Button>
  );
};

const SigOutButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleClick = React.useCallback(() => context.signOut(), [context]);

  return (
    <Button
      status='danger'
      style={themedStyle.button}
      onPress={handleClick}
      icon={LogOutIconFill}
      size='large'
    >
      Deslogar
    </Button>
  );
};

const ShareAffilliationButton = ({ themedStyle }) => {
  const context = React.useContext(AuthContext);
  const handleClick = React.useCallback(async () => {
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
    <Button
      status='warning'
      style={themedStyle.button}
      onPress={handleClick}
      icon={PeopleIconFill}
      size='large'
    >
      Convidar Afiliado
    </Button>
  );
};

const NeedHelpButton = ({ themedStyle }) => {
  const handleClick = React.useCallback(
    () => Linking.openURL('https://favid.com.br/suporte/'),
    [],
  );

  return (
    <Button
      status='primary'
      style={themedStyle.button}
      onPress={handleClick}
      icon={MenuIconMessaging}
      size='large'
    >
      Preciso de Ajuda
    </Button>
  );
};

const PoliciesButton = ({ themedStyle, onNavigate }) => {
  return (
    <Button
      status='primary'
      style={themedStyle.button}
      onPress={onNavigate}
      icon={FileTextIconFill}
      size='large'
    >
      Políticas
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
