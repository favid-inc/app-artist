import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';

import { ContainerView } from '@src/components/common';
import { Settings } from './Settings';

export class SettingsContainerComponent extends Component<NavigationScreenProps & ThemedComponentProps> {
  public render() {
    const { themedStyle } = this.props;

    return (
      <ContainerView style={themedStyle.contentContainer}>
        <Settings onNavigate={this.onNavigate} />
      </ContainerView>
    );
  }

  private onNavigate = (pathName: string): void => {
    this.props.navigation.navigate(pathName);
  };
}
export const SettingsContainer = withStyles(SettingsContainerComponent, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  text: {
    textAlign: 'center',
  },
}));
