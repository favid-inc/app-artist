import { createStackNavigator } from 'react-navigation';

import { connect } from './context';
import { DeclineOrderContainer } from './declineOrder';
import { PlayOrderVideoContainer } from './playOrderVideo';
import { RecordOrderVideoContainer } from './recordOrderVideo';
import { SelectOrderContainer } from './selectOrder';
import { UploadOrderVideoContainer } from './uploadOrderVideo';

export const OrdersNavigator = connect(
  createStackNavigator(
    {
      SelectOrder: SelectOrderContainer,
      PlayOrderVideo: PlayOrderVideoContainer,
      RecordOrderVideo: RecordOrderVideoContainer,
      UploadOrderVideo: UploadOrderVideoContainer,
      DeclineOrder: DeclineOrderContainer,
    },
    {
      headerMode: 'screen',
      defaultNavigationOptions: {
        headerTransparent: true,
      },
    },
  ),
);
