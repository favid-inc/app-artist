import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

import { LockIconFill, PhoneIconFill } from '@src/assets/icons';
import { textStyle, ValidationInput } from '@src/components/common';
import { EmailValidator, StringValidator } from '@src/core/validators';
import { AuthFormData } from './type';

interface ComponentProps {
  onDataChange: (value: AuthFormData | undefined) => void;
}

export type SignInFormProps = ThemedComponentProps & ViewProps & ComponentProps;

type State = AuthFormData;

class SignInFormComponent extends React.Component<SignInFormProps, State> {
  public state: State = {
    email: '',
    password: '',
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

  public render(): React.ReactNode {
    const { style, themedStyle, theme, ...restProps } = this.props;

    return (
      <View {...restProps} style={[themedStyle.container, style]}>
        <ValidationInput
          style={themedStyle.phoneInput}
          textStyle={textStyle.paragraph}
          placeholder='Email'
          icon={PhoneIconFill}
          validator={EmailValidator}
          onChangeText={this.handleEmailChange}
        />
        <ValidationInput
          style={themedStyle.passwordInput}
          textStyle={textStyle.paragraph}
          placeholder='Senha'
          secureTextEntry={true}
          icon={LockIconFill}
          validator={StringValidator}
          onChangeText={this.handlePasswordChange}
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

  private isValid = (value: AuthFormData): boolean => {
    const { email, password, confirmPassword } = value;

    return email && password && password === confirmPassword;
  };
}

export const SignInForm = withStyles(SignInFormComponent, (theme: ThemeType) => ({
  container: {},
  phoneInput: {},
  passwordInput: {
    marginTop: 16,
  },
}));
