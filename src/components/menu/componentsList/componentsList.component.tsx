import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  List,
  ListProps,
} from '@kitten/ui';
import React from 'react';
import {
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import {
  ComponentsListItem,
  ComponentsListItemProps,
} from './componentsListItem.component';
import { ComponentsListItemData } from './type';

const { width } = Dimensions.get('window');
const itemWidth: number = width / 2 - 32;

// @ts-ignore (override `renderItem` prop)
interface ComponentProps extends ListProps {
  data: ComponentsListItemData[];
  onItemPress: (index: number) => void;
  renderItem?: (info: ListRenderItemInfo<ComponentsListItemData>) => React.ReactElement<any>;
}

export type ComponentsListProps = ThemedComponentProps & ComponentProps;

type ListItemElement = React.ReactElement<ComponentsListItemProps>;
type ListItemElementInfo = ListRenderItemInfo<ComponentsListItemData>;

class ComponentsListComponent extends React.Component<ComponentsListProps> {

  public render(): React.ReactNode {
    const { themedStyle, ...restProps } = this.props;

    return (
      <List
        numColumns={2}
        columnWrapperStyle={themedStyle.columnWrapperStyle}
        renderItem={this.renderItem}
        {...restProps}
      />
    );
  }

  private onItemPress = (index: number) => {
    this.props.onItemPress(index);
  };

  private renderItem = (info: ListItemElementInfo): ListItemElement => {
    return (
      <ComponentsListItem
        style={this.props.themedStyle.item}
        activeOpacity={0.75}
        data={info.item}
        onPress={this.onItemPress}
      />
    );
  };
}

export const ComponentsList = withStyles(ComponentsListComponent, (theme: ThemeType) => ({
  item: {
    flex: 1,
    height: 160,
    maxWidth: itemWidth,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
}));
