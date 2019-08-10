import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { Settings } from './Settings';
import * as actions from '../../store/actions';
import { ContainerView } from '@src/components/common';
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten';

interface Props {
  onSignOut: () => void;
}

export class SettingsContainerComponent extends Component<NavigationScreenProps & Props & ThemedComponentProps> {
  private onNavigate = (pathName: string): void => {
    this.props.navigation.navigate(pathName);
  };

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
}
const ContainerStyled = withStyles(SettingsContainerComponent, (theme: ThemeType) => ({
  contentContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
    justifyContent: 'start',
  },
  text: {
    textAlign: 'center',
  },
}));

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(actions.signOut()),
});

export const SettingsContainer = connect(
  null,
  mapDispatchToProps,
)(ContainerStyled);
