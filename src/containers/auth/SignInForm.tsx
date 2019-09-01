import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Text } from '@kitten/ui';
import * as firebase from 'firebase';
import React from 'react';
import { Alert, StyleSheet, View, ViewProps } from 'react-native';
import Modal from 'react-native-modal';

import { EmailIconFill, LockIconFill } from '@src/assets/icons';
import { textStyle, ValidationInput } from '@src/components/common';
import { EmailValidator, PasswordValidator } from '@src/core/validators';
import { AuthFormData } from './type';

interface ComponentProps {
  onDataChange: (value: AuthFormData | undefined) => void;
}

export type SignInFormProps = ThemedComponentProps & ViewProps & ComponentProps;

type State = AuthFormData & {
  showResetPasswordModal: boolean;
};

class SignInFormComponent extends React.Component<SignInFormProps, State> {
  public state: State = {
    email: '',
    password: '',
    showResetPasswordModal: false,
  };

  public componentDidUpdate(prevProps: SignInFormProps, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);

    const isStateChanged: boolean = this.state !== prevState;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      this.props.onDataChange(this.state);
    } else if (becomeInvalid) {
      this.props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      this.props.onDataChange(this.state);
    }
  }

  public render() {
    const { style, themedStyle, theme, ...restProps } = this.props;

    return (
      <View {...restProps} style={[themedStyle.container, style]}>
        <ValidationInput
          autoCompleteType='email'
          icon={EmailIconFill}
          onChangeText={this.handleEmailChange}
          keyboardType='email-address'
          placeholder='Email'
          style={themedStyle.emailInput}
          textStyle={textStyle.paragraph}
          validator={EmailValidator}
          value={this.state.email}
        />
        <ValidationInput
          autoCompleteType='password'
          icon={LockIconFill}
          onChangeText={this.handlePasswordChange}
          placeholder='Senha'
          secureTextEntry={true}
          style={themedStyle.passwordInput}
          textStyle={textStyle.paragraph}
          validator={PasswordValidator}
          value={this.state.password}
        />
        <View style={themedStyle.forgotPasswordContainer}>
          <Button
            style={themedStyle.forgotPasswordButton}
            textStyle={themedStyle.forgotPasswordText}
            appearance='ghost'
            activeOpacity={0.75}
            onPress={this.handleForgotPassword}
          >
            Esqueceu a senha?
          </Button>
          <ResetPasswordModal
            visible={this.state.showResetPasswordModal}
            email={this.state.email}
            onChangeEmail={this.handleEmailChange}
            onRequestClose={this.handleRequestCloseResetPasswordModal}
            onRequestSendEmail={this.handleRequestSendEmail}
          />
        </View>
      </View>
    );
  }

  private handleRequestCloseResetPasswordModal = () => {
    this.setState({ showResetPasswordModal: false });
  };

  private handleRequestSendEmail = async () => {
    const { email } = this.state;
    try {
      this.setState({ showResetPasswordModal: false });
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert('Sucesso', `Um email para resetar a senha foi enviado para ${email}`);
    } catch (e) {
      Alert.alert('Falha', e.message);
    }
  };

  private handleForgotPassword = () => {
    this.setState({ showResetPasswordModal: true });
  };

  private handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  private handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  private isValid = (value: AuthFormData): boolean => {
    const { email, password } = value;

    return !!(email && password);
  };
}

const ResetPasswordModal = ({ visible, email, onChangeEmail, onRequestClose, onRequestSendEmail }) => {
  const style = React.useMemo(
    () =>
      StyleSheet.create({
        container: { padding: 20, flex: 1 },
        component: { marginTop: 20 },
      }),
    [],
  );

  return (
    <Modal isVisible={visible} onBackdropPress={onRequestClose}>
      <View style={style.container}>
        <Text>Qual é o seu email?</Text>
        <ValidationInput
          style={style.component}
          autoCompleteType='email'
          icon={EmailIconFill}
          onChangeText={onChangeEmail}
          keyboardType='email-address'
          placeholder='Email'
          textStyle={textStyle.paragraph}
          validator={EmailValidator}
          value={email}
        />
        <Button style={style.component} disabled={!email} onPress={onRequestSendEmail}>
          Resetar senha
        </Button>
      </View>
    </Modal>
  );
};

export const SignInForm = withStyles(SignInFormComponent, (theme: ThemeType) => ({
  container: {},
  emailInput: {
    backgroundColor: theme['background-basic-color-1'],
  },
  passwordInput: {
    marginTop: 16,
    backgroundColor: theme['background-basic-color-1'],
  },
}));
