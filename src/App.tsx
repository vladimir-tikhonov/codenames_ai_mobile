import { Font } from 'expo';
import { Provider } from 'mobx-react';
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { AppState } from 'src/entities/AppState';
import { GameConfigScreen } from 'src/screens/GameConfigScreen';
import { GameScreen } from 'src/screens/GameScreen';
import { InitialScreen } from 'src/screens/InitialScreen';
import { RolesScreen } from 'src/screens/RolesScreen';
import { WordsScreen } from 'src/screens/WordsScreen';

const AppNavigator = createStackNavigator(
    {
        Initial: {
            screen: InitialScreen,
        },
        Config: {
            screen: GameConfigScreen,
        },
        Words: {
            screen: WordsScreen,
        },
        Roles: {
            screen: RolesScreen,
        },
        Game: {
            screen: GameScreen,
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

function cacheFonts(fonts: Font.FontMap[]) {
    return fonts.map((font) => Font.loadAsync(font));
}

export default class App extends React.PureComponent<IAppState> {
    public state = {
        fontLoaded: false,
    };

    public async componentDidMount() {
        const skyFallFont = {
            'sky-fall': require('assets/fonts/sky_fall.ttf'),
        };
        await Promise.all(cacheFonts([skyFallFont]));

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
