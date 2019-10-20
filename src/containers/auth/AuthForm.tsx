import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import { Button, Tab, TabView } from '@kitten/ui';
import React from 'react';
import { View } from 'react-native';

import { textStyle } from '@src/components/common';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { AuthFormData } from './type';

interface ComponentProps {
  onSignIn: (formData: AuthFormData) => void;
  onSignUp: (formData: AuthFormData) => void;
}

const TAB_INDEX_SIGN_IN: number = 0;
const TAB_INDEX_SIGN_UP: number = 1;

export type SignIn5Props = ThemedComponentProps & ComponentProps;

interface State {
  selectedTabIndex: number;
  signInFormData: AuthFormData;
  signUpFormData: AuthFormData;
}

class AuthFormComponent extends React.Component<SignIn5Props, State> {
  public state: State = {
    selectedTabIndex: 0,
    signInFormData: undefined,
    signUpFormData: undefined,
  };

  public render() {
    const { themedStyle } = this.props;
    const submitButtonEnabled: boolean = !!this.getSelectedFormData();

    return (
      <View style={themedStyle.container}>
        <TabView
          style={themedStyle.tabView}
          tabBarStyle={themedStyle.tabBar}
          indicatorStyle={themedStyle.tabViewIndicator}
          selectedIndex={this.state.selectedTabIndex}
          onSelect={this.onTabSelect}
        >
          <Tab titleStyle={themedStyle.tabTitle} title='Entrar'>
            <SignInForm style={themedStyle.tabContentContainer} onDataChange={this.handleSignInFormChange} />
          </Tab>
          <Tab titleStyle={themedStyle.tabTitle} title='Registrar'>
            <SignUpForm style={themedStyle.tabContentContainer} onDataChange={this.handleSignUpFormChange} />
          </Tab>
        </TabView>
        <Button
          style={themedStyle.submitButton}
          textStyle={textStyle.button}
          size='giant'
          onPress={this.handleSubmitButtonPress}
          disabled={!submitButtonEnabled}
        >
          {this.state.selectedTabIndex === TAB_INDEX_SIGN_IN ? 'ENTRAR' : 'CRIAR CONTA'}
        </Button>
      </View>
    );
  }

  private handleSubmitButtonPress = () => {
    const { selectedTabIndex } = this.state;

    const formValue = this.getSelectedFormData();

    switch (selectedTabIndex) {
      case TAB_INDEX_SIGN_IN:
        return this.props.onSignIn(formValue);
      case TAB_INDEX_SIGN_UP:
        return this.props.onSignUp(formValue);
    }
  };

  private onTabSelect = (selectedTabIndex: number) => {
    this.setState({ selectedTabIndex });
  };

  private handleSignInFormChange = (signInFormData: AuthFormData | undefined) => {
    this.setState({ signInFormData });
  };

  private handleSignUpFormChange = (signUpFormData: AuthFormData | undefined) => {
    this.setState({ signUpFormData });
  };

  private getSelectedFormData = (): AuthFormData => {
    const { selectedTabIndex, signInFormData, signUpFormData } = this.state;

    switch (selectedTabIndex) {
      case TAB_INDEX_SIGN_IN:
        return signInFormData;
      case TAB_INDEX_SIGN_UP:
        return signUpFormData;
    }
  };
}

export const AuthForm = withStyles(AuthFormComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    alignContent: 'stretch',
  },
  tabContentContainer: {
    // marginVertical: 8,
    paddingVertical: 20,
  },
  tabView: {
    flex: 1,
    paddingHorizontal: 10,
    // margin: 5,
  },
  tabBar: {
    backgroundColor: 'transparent',
    color: theme['text-hint-color'],
  },
  tabViewIndicator: {
    backgroundColor: theme['text-hint-color'],
  },
  tabTitle: {
    color: theme['text-hint-color'],
    ...textStyle.label,
  },
  submitButton: {
    // marginHorizontal: 16,
  },
}));
