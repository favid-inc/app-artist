import * as AppAuth from 'expo-app-auth';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';
import React from 'react';
import { Alert } from 'react-native';

import * as config from '@src/core/config';
import { claimAccount } from './claimAccount';

interface AuthContext {
  isSigningIn: boolean;
  claims: firebase.auth.IdTokenResult['claims'];
  user: firebase.UserInfo;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext>(null);

type Credentials =
  | {
      type: 'google' | 'facebook';
      oAuthCredential: firebase.auth.OAuthCredential;
    }
  | {
      type: 'email';
      email: string;
      password: string;
    };

interface Props {
  children: React.ReactNode;
}

type State = AuthContext;

export class FirebaseAuth extends React.Component<Props, State> {
  public state: State = {
    isSigningIn: true,
    claims: {},
    user: null,
    signInWithGoogle: () => this.signInWithGoogle(),
    signInWithFacebook: () => this.signInWithFacebook(),
    signInWithEmailAndPassword: (email, password) => this.signInWithEmailAndPassword(email, password),
    signOut: () => this.signOut(),
    signUp: (email, password) => this.signUp(email, password),
  };

  private subscription: () => void;

  public render() {
    return (
      <AuthContext.Provider value={this.state}>
        <AuthContext.Consumer>{() => this.props.children}</AuthContext.Consumer>
      </AuthContext.Provider>
    );
  }

  public componentDidMount() {
    this.subscription = firebase.auth().onAuthStateChanged(async (user) => {
      const { claims } = await user.getIdTokenResult();
      this.setState({ isSigningIn: false, user, claims });
    });
  }

  public componentWillUnmount() {
    this.subscription();
  }

  private async signUp(email: string, password: string) {
    this.setState({ isSigningIn: true });

    try {
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await user.sendEmailVerification();
      Alert.alert('Confirmação de conta', `Um email de verificação de conta foi enviado para ${user.email}.`);
    } catch (e) {
      Alert.alert('Erro ao criar conta', (e && e.message) || 'Verifique sua conexão com a internet e tente novamente');
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async signInWithEmailAndPassword(email: string, password: string) {
    this.setState({ isSigningIn: true });

    try {
      const auth = await this.sigIn({ type: 'email', email, password });
      if (!auth) {
        Alert.alert('Credencias inválidas', 'Não foi possível entrar no app com os dados informados');
      } else if (!auth.user.emailVerified) {
        Alert.alert('Confirmação de conta', 'Verifique seu email antes de acessar o aplicativo');
      } else {
        await claimAccount(await auth.user.getIdToken());
      }
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async signInWithGoogle() {
    this.setState({ isSigningIn: true });
    try {
      const { idToken, accessToken } = await AppAuth.authAsync(config.auth.google);
      const oAuthCredential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      const { user } = await this.sigIn({ type: 'google', oAuthCredential });
      await claimAccount(await user.getIdToken());
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async signInWithFacebook() {
    this.setState({ isSigningIn: true });
    try {
      const { token } = await Facebook.logInWithReadPermissionsAsync(
        config.auth.facebook.appid,
        config.auth.facebook.options,
      );

      const oAuthCredential = firebase.auth.FacebookAuthProvider.credential(token);
      const { user } = await this.sigIn({ type: 'facebook', oAuthCredential });
      await claimAccount(await user.getIdToken());
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async sigIn(credentials: Credentials): Promise<firebase.auth.UserCredential> {
    try {
      switch (credentials.type) {
        case 'email':
          return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
        case 'facebook':
        case 'google':
          return firebase.auth().signInWithCredential(credentials.oAuthCredential);
        default:
          throw new Error();
      }
    } catch (e) {
      Alert.alert('Desculpe', 'Infelizmente ocorreu um erro durante a autenticação');
    }
  }

  private async signOut() {
    firebase.auth().signOut();
  }
}
