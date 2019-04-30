import { CheckCircle } from 'assets/icons';
import * as colors from 'config/colors';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { ImageBackground, StyleSheet, Switch, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { NextStepButtonWithContainer } from 'src/components/NextStepButtonWithContainer';
import { AppState } from 'src/entities/AppState';
import { Team } from 'src/entities/Team';

interface IInjectedProps {
    appState: AppState;
}

const images = {
    blue: require('assets/images/blue-wide.png'),
    red: require('assets/images/red-wide.png'),
};

@inject('appState')
@observer
export class GameConfigScreen extends React.Component<NavigationTransitionProps & IInjectedProps> {
    public static navigationOptions = {
        title: 'Configure your game',
    };

    public render() {
        const { enableAi } = this.props.appState;

        return (
            <View style={styles.screenContainer}>
                <View style={styles.teamSelectorContainer}>
                    <Text style={styles.chooseTeamHeader}>Choose you team</Text>
                    {this.renderTeamSelector(Team.Blue, images.blue)}
                    {this.renderTeamSelector(Team.Red, images.red)}
                </View>
                <View style={styles.aiHelpContainer}>
                    <Switch value={enableAi} onValueChange={this.toggleAiHelp} />
                    <Text style={styles.aiHelpLabel} onPress={this.toggleAiHelp}>
                        AI Help: <Text style={{ fontWeight: 'bold' }}>{enableAi ? 'On ' : 'Off'}</Text>
                    </Text>
                </View>
                <NextStepButtonWithContainer onPress={this.goNext} />
            </View>
        );
    }

    private renderTeamSelector(team: Team, image: object) {
        const onSelection = () => (this.props.appState.selectedTeam = team);

        return (
            <TouchableWithoutFeedback onPress={onSelection}>
                <ImageBackground source={image} style={styles.teamSelector} imageStyle={styles.teamSelectorImage}>
                    {team === this.props.appState.selectedTeam ? (
                        <CheckCircle width={36} height={36} fill="white" />
                    ) : null}
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }

    private toggleAiHelp = () => {
        this.props.appState.enableAi = !this.props.appState.enableAi;
    };

    private goNext = () => {
        this.props.navigation.navigate('Words');
    };
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamSelectorContainer: {
        flex: 0.5,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    chooseTeamHeader: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    teamSelector: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 100,
        marginTop: 10,
    },
    teamSelectorImage: {
        borderRadius: 15,
    },
    teamSelectorBlue: {
        backgroundColor: colors.blue,
    },
    teamSelectorRed: {
        backgroundColor: colors.red,
    },
    aiHelpContainer: {
        flex: 1.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiHelpLabel: {
        fontSize: 18,
        paddingTop: 30,
        paddingBottom: 30,
    },
});
