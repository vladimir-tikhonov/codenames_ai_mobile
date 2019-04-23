import { Font, LinearGradient } from 'expo';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';

interface IInitialScreenState {
    fontLoaded: boolean;
}

export class InitialScreen extends React.PureComponent<NavigationTransitionProps, IInitialScreenState> {
    public static navigationOptions = {
        header: null,
    };

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
            <LinearGradient style={styles.screenContainer} colors={['#842552', '#C76D57', '#EEA744', '#F8D047']}>
                <View style={styles.headerContainer}>
                    <Text style={{ ...styles.header, ...styles.headerWhite }}>CodeNames</Text>
                    <Text style={{ ...styles.header, ...styles.headerBlack }}>AI</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.startGame}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Start Game</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    private startGame = () => {
        this.props.navigation.navigate('GameConfig');
    };
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    header: {
        fontFamily: 'sky-fall',
        fontSize: 30,
    },
    headerWhite: {
        color: 'white',
    },
    headerBlack: {
        color: 'black',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#EBDEC4',
        borderRadius: 15,
        padding: 20,
    },
    buttonText: {
        fontFamily: 'sky-fall',
        fontSize: 24,
    },
});
