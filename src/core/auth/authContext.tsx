import * as AppAuth from 'expo-app-auth';
import * as firebase from 'firebase';
import React from 'react';
import { Alert, AsyncStorage } from 'react-native';

interface AuthContext {
  user: firebase.UserInfo;
  isSignedIn: boolean;
  isSigningIn: boolean;
  signInWithOAuth: (oAuthProps: AppAuth.OAuthProps) => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext>({
  user: null,
  isSignedIn: false,
  isSigningIn: false,
  signInWithOAuth: () => null,
  signInWithEmailAndPassword: () => null,
  signUp: () => null,
  signOut: () => null,
});

interface FirebaseAuthProps {
  children: React.ReactNode;
}

interface FirebaseAuthState extends AuthContext {
  credentials?:
    | { type: 'none' }
    | {
        type: 'oauth';
        oAuthProps: AppAuth.OAuthProps;
        tokens: AppAuth.TokenResponse;
      }
    | {
        type: 'email';
        email: string;
        password: string;
      };
}

export class FirebaseAuth extends React.Component<FirebaseAuthProps, FirebaseAuthState> {
  public state: FirebaseAuthState = {
    user: null,
    credentials: { type: 'none' },
    isSignedIn: false,
    isSigningIn: false,
    signInWithOAuth: (oAuthProps) => this.signInWithOAuth(oAuthProps),
    signInWithEmailAndPassword: (email, password) => this.signInWithEmailAndPassword(email, password),
    signOut: () => this.signOut(),
    signUp: (email, password) => this.signUp(email, password),
  };

  private STORAGE_KEY: string = '@app-artist:core:auth:FirebaseAuth';

  private unsubscribe: firebase.Unsubscribe;

  public render() {
    return (
      <AuthContext.Provider value={this.state}>
        <AuthContext.Consumer>{() => this.props.children}</AuthContext.Consumer>
      </AuthContext.Provider>
    );
  }

  public async componentDidMount() {
    const { isSignedIn, credentials } = JSON.parse((await AsyncStorage.getItem(this.STORAGE_KEY)) || '{}');

    this.unsubscribe = firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);

    if (isSignedIn) {
      this.setState({ isSigningIn: true });
      try {
        this.sigIn(credentials);
      } finally {
        this.setState({ isSigningIn: false });
      }
    }
  }

  public async componentWillUnmount() {
    this.unsubscribe();
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

  private async signInWithOAuth(oAuthProps: AppAuth.OAuthProps) {
    this.setState({ isSigningIn: true });

    try {
      const tokens = await AppAuth.authAsync(oAuthProps);

      const { user } = await this.sigIn({ type: 'oauth', tokens, oAuthProps });

      await claimAccount(await user.getIdToken());
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async sigIn(credentials: FirebaseAuthState['credentials']): Promise<firebase.auth.UserCredential> {
    let firebaseCredential: firebase.auth.UserCredential;

    try {
      switch (credentials.type) {
        case 'email':
          firebaseCredential = await firebase
            .auth()
            .signInWithEmailAndPassword(credentials.email, credentials.password);
          break;
        case 'oauth':
          const oAuthCredential = getAuthProvider(credentials.oAuthProps).credential(
            credentials.tokens.idToken,
            credentials.tokens.accessToken,
          );

          firebaseCredential = await firebase.auth().signInWithCredential(oAuthCredential);
          break;
        default:
          throw new Error();
      }

      this.setState({ isSignedIn: firebaseCredential.user.emailVerified, credentials });

      return firebaseCredential;
    } catch (e) {
      this.setState({ isSignedIn: false, credentials: { type: 'none' } });

      Alert.alert('Desculpe', 'Infelizmente ocorreu um erro durante a autenticação');
    } finally {
      this.saveState();
    }
  }

  private async signOut() {
    const { credentials } = this.state;

    this.setState({ isSignedIn: false, credentials: { type: 'none' } });

    this.saveState();

    if (credentials.type === 'oauth') {
      AppAuth.revokeAsync(credentials.oAuthProps, {
        token: credentials.tokens.accessToken,
        isClientIdProvided: true,
      });
    }
  }

  private handleAuthStateChanged = async (user: firebase.UserInfo) => {
    this.setState({ user });

    const { isSignedIn, credentials } = this.state;

    if (isSignedIn && credentials && credentials.type === 'oauth') {
      try {
        if (Date.now() > new Date(credentials.tokens.accessTokenExpirationDate).getTime()) {
          return;
        }

        const { refreshToken } = credentials.tokens;
        const tokens = await AppAuth.refreshAsync(credentials.oAuthProps, refreshToken);

        await this.sigIn({
          ...credentials,
          tokens: {
            ...tokens,
            refreshToken,
          },
        });
      } catch (e) {
        this.signOut();
      }
    }
  };

  private saveState() {
    AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }
}

function getAuthProvider({ issuer }: AppAuth.OAuthProps) {
  switch (issuer) {
    case 'https://accounts.google.com':
      return firebase.auth.GoogleAuthProvider;
    default:
      throw new Error(`Unknown issuer: "${issuer}"`);
  }
}
