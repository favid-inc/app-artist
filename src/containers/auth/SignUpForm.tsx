import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

import { EmailIconFill, LockIconFill } from '@src/assets/icons';
import { textStyle, ValidationInput } from '@src/components/common';
import { EmailValidator, PasswordValidator } from '@src/core/validators';
import { AuthFormData } from './type';

interface ComponentProps {
  onDataChange: (value: AuthFormData | undefined) => void;
}

export type SignUpFormProps = ThemedComponentProps & ViewProps & ComponentProps;

type State = AuthFormData;

class SignUpFormComponent extends React.Component<SignUpFormProps, State> {
  public state: State = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  public componentDidUpdate(prevProps: SignUpFormProps, prevState: State) {
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

    const confirmPasswordCaption =
      this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword
        ? 'Senhas não conferem'
        : '';

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
          icon={LockIconFill}
          onChangeText={this.handlePasswordChange}
          placeholder='Senha'
          secureTextEntry={true}
          style={themedStyle.passwordInput}
          textStyle={textStyle.paragraph}
          validator={PasswordValidator}
          value={this.state.password}
        />
        <ValidationInput
          caption={confirmPasswordCaption}
          icon={LockIconFill}
          onChangeText={this.handleConfirmPasswordChange}
          placeholder='Confirmar Senha'
          secureTextEntry={true}
          style={themedStyle.passwordInput}
          textStyle={textStyle.paragraph}
          validator={PasswordValidator}
          value={this.state.confirmPassword}
        />
      </View>
    );
  }

  private handleEmailChange = (email: string) => {
    this.setState({ email });
  };

  private handlePasswordChange = (password: string) => {
    this.setState({ password });
  };

  private handleConfirmPasswordChange = (confirmPassword: string) => {
    this.setState({ confirmPassword });
  };

  private isValid = (value: AuthFormData): boolean => {
    const { email, password, confirmPassword } = value;

    return email && password && password === confirmPassword;
  };
}

export const SignUpForm = withStyles(SignUpFormComponent, (theme: ThemeType) => ({
  container: {},
  emailInput: {
    backgroundColor: theme['background-basic-color-1'],
  },
  passwordInput: {
    marginTop: 16,
    backgroundColor: theme['background-basic-color-1'],
  },
}));
