import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { NavigationScreenProps } from 'react-navigation';
import { Profile } from '@src/core/model';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as config from '@src/core/config';
import * as AppAuth from 'expo-app-auth';
import { googleImage, favidImage } from '@src/assets/images';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten/theme';
import { themes } from '@src/core/themes';

interface State {
  profile: Profile;
}

interface SignInContainerProps {
  auth: AuthStateModel;
  loading: boolean;
  onAuth: (any) => void;
  onLoadAuthState: () => void;
}

type props = ThemedComponentProps & NavigationScreenProps & SignInContainerProps;
class SignInContainerComponent extends React.Component<props, State> {
  public state: State = {
    profile: null,
  };

  public componentWillMount() {
    this.props.onLoadAuthState();
  }

  private auth = async () => {
    const result = await AppAuth.authAsync(config.auth);
    this.props.onAuth(result);
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    let signInContent = (
      <View style={themedStyle.container}>
        <Image source={favidImage.imageSource} style={themedStyle.ImageLogoStyle} />
        <Text style={themedStyle.WelcomeText}>Bem vindo ao</Text>
        <Text style={[themedStyle.WelcomeText, themedStyle.WelcomeTextBold]}>Favid Artista!</Text>
        <View style={themedStyle.contentContainer}>
          <TouchableOpacity style={themedStyle.GooglePlusStyle} onPress={() => this.auth()}>
            <Image source={googleImage.imageSource} style={themedStyle.ImageIconStyle} />
            <Text style={themedStyle.TextStyle}> Continue com Google </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    if (this.props.loading) {
      signInContent = (
        <View style={themedStyle.container}>
          <Text style={themedStyle.TextStyle}>Autenticando usuário...</Text>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return signInContent;
  }
}

const mapStateToProps = ({ auth }) => ({
  auth: auth.authState,
  loading: auth.loading,
});

const mapDispatchToProps = dispatch => ({
  onAuth: authResult => dispatch(actions.auth(authResult)),
  onLoadAuthState: () => dispatch(actions.loadAuthState()),
});


const SignInContainer = withStyles(SignInContainerComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    alignItems: 'center',
    paddingVertical: 100,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 130,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-2'],
    height: 50,
    width: 250,
    borderRadius: 4,
    borderColor: theme['color-basic-400'],
    borderWidth: 1.5,
    padding: 10,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  ImageLogoStyle: {
    padding: 10,
    margin: 5,
    height: 150,
    width: 150,
    resizeMode: 'stretch',
  },
  TextStyle: {
    color: theme['color-basic-400'],
    fontFamily: 'opensans-bold',
    fontSize: 18,
    marginBottom: 4,
    marginRight: 20,
  },
  WelcomeTextBold: {
    fontFamily: 'opensans-bold',
  },
  WelcomeText: {
    color: theme['color-basic-400'],
    fontSize: 30,
    marginBottom: 4,
    marginRight: 20,
    fontFamily: 'opensans-regular',
    textAlign: 'center',
    width: 300,
  },
}));

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInContainer);
