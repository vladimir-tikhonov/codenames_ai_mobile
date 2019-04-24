import { Provider } from 'mobx-react';
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { AppState } from 'src/entities/AppState';
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

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.PureComponent {
    public render() {
        return (
            <Provider appState={new AppState()}>
                <AppContainer />
            </Provider>
        );
    }
}
