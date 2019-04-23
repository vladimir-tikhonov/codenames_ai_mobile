import { createAppContainer, createStackNavigator } from 'react-navigation';
import { GameConfigScreen } from 'src/screens/GameConfigScreen';
import { InitialScreen } from 'src/screens/InitialScreen';

const AppNavigator = createStackNavigator(
    {
        Initial: {
            screen: InitialScreen,
        },
        GameConfig: {
            screen: GameConfigScreen,
        },
    },
    {
        initialRouteName: 'Initial',
    },
);

export default createAppContainer(AppNavigator);
