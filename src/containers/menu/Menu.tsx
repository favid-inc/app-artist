import { ThemedComponentProps, ThemeProvider, ThemeType, withStyles } from '@kitten/theme';
import { BottomNavigation, BottomNavigationTab } from '@kitten/ui';
import { ListIconFill, PersonIconFill } from '@src/assets/icons';
import { SafeAreaView } from '@src/core/navigation';
import { themes } from '@src/core/themes';
import React from 'react';

interface ComponentProps {
  selectedIndex: number;
  onTabSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;

class MenuComponent extends React.Component<Props> {

  public render(): React.ReactNode {
    const { selectedIndex, themedStyle } = this.props;

    return (
      <SafeAreaView style={themedStyle.safeAreaContainer}>
        <ThemeProvider theme={{ ...this.props.theme, ...themes['App Theme'] }}>
          <BottomNavigation appearance='noIndicator' selectedIndex={selectedIndex} onSelect={this.onTabSelect}>
            <BottomNavigationTab title='Pedidos' icon={ListIconFill} />
            <BottomNavigationTab title='Configurações' icon={PersonIconFill} />
          </BottomNavigation>
        </ThemeProvider>
      </SafeAreaView>
    );
  }
  private onTabSelect = (index: number) => {
    this.props.onTabSelect(index);
  };
}

export const Menu = withStyles(MenuComponent, (theme: ThemeType) => ({
  safeAreaContainer: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
