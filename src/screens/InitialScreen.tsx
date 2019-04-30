import * as colors from 'config/colors';
import { LinearGradient } from 'expo';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { NextStepButtonWithContainer } from 'src/components/NextStepButtonWithContainer';

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
                <NextStepButtonWithContainer onPress={this.goNext} label={'Start Game'} />
            </LinearGradient>
        );
    }

    private goNext = () => {
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
});
