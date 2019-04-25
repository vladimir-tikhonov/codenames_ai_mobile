import * as colors from 'config/colors';
import { LinearGradient } from 'expo';
import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';

export class InitialScreen extends React.PureComponent<NavigationTransitionProps> {
    public static navigationOptions = {
        header: null,
    };

    public render() {
        return (
            <LinearGradient style={styles.screenContainer} colors={colors.gradient}>
                <View style={styles.headerContainer}>
                    <Text style={{ ...styles.header, ...styles.headerWhite }}>CodeNames</Text>
                    <Text style={{ ...styles.header, ...styles.headerBlack }}>AI</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image source={require('assets/images/bond.png')} style={styles.image} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.startGame}
                        underlayColor={colors.bystander}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonText}>Start Game</Text>
                    </TouchableHighlight>
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
        height: 150,
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
    imageContainer: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    buttonContainer: {
        height: 150,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: colors.bystander,
        borderRadius: 15,
        alignItems: 'center',
        width: 200,
        paddingVertical: 15,
        marginBottom: 40,
    },
    buttonText: {
        fontSize: 26,
    },
});
