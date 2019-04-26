import { Font } from 'expo';
import { Provider } from 'mobx-react';
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { AppState } from 'src/entities/AppState';
import { GameConfigScreen } from 'src/screens/GameConfigScreen';
import { InitialScreen } from 'src/screens/InitialScreen';
import { RolesScreen } from 'src/screens/RolesScreen';
import { WordsScreen } from 'src/screens/WordsScreen';

const AppNavigator = createStackNavigator(
    {
        Initial: {
            screen: InitialScreen,
        },
        GameConfig: {
            screen: GameConfigScreen,
        },
        Words: {
            screen: WordsScreen,
        },
        Roles: {
            screen: RolesScreen,
        },
    },
    {
        initialRouteName: 'Initial',
    },
);

const AppContainer = createAppContainer(AppNavigator);

interface IAppState {
    fontLoaded: boolean;
}

export default class App extends React.PureComponent<IAppState> {
    public state = {
        fontLoaded: false,
    };

    public async componentDidMount() {
        await Font.loadAsync({
            'sky-fall': require('assets/fonts/sky_fall.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    public render() {
        if (!this.state.fontLoaded) {
            return null;
        }

        return (
            <Provider appState={new AppState()}>
                <AppContainer />
            </Provider>
        );
    }
}
