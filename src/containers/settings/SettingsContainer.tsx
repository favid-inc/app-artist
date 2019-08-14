import { ThemedComponentProps, ThemeType, withStyles } from '@kitten/theme';
import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';

import { ContainerView } from '@src/components/common';

import * as actions from '../../store/actions';

import { Settings } from './Settings';

interface Props {
  onSignOut: () => void;
}

export class SettingsContainerComponent extends Component<NavigationScreenProps & Props & ThemedComponentProps> {
  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    return (
      <ContainerView style={themedStyle.contentContainer}>
        <Settings
          onNavigate={(pathName: string) => this.onNavigate(pathName)}
          onSignOut={this.props.onSignOut.bind(this)}
        />
      </ContainerView>
    );
  }
  private onNavigate = (pathName: string): void => {
    this.props.navigation.navigate(pathName);
  };
}
const ContainerStyled = withStyles(SettingsContainerComponent, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  text: {
    textAlign: 'center',
  },
}));

const mapDispatchToProps = (dispatch) => ({
  onSignOut: () => dispatch(actions.signOut()),
});

export const SettingsContainer = connect(
  null,
  mapDispatchToProps,
)(ContainerStyled);
