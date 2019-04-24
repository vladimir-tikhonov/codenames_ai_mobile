import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { Team } from 'src/entities/Team';

interface IGameConfigScreenState {
    selectedTeam: Team;
    aiHelp: boolean;
}

export class GameConfigScreen extends React.PureComponent<NavigationTransitionProps, IGameConfigScreenState> {
    public static navigationOptions = {
        title: 'Configure your game',
    };

    public state = {
        selectedTeam: Team.Blue,
        aiHelp: true,
    };

    public render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.teamSelectorContainer}>
                    <Text style={styles.chooseTeamHeader}>Choose you team</Text>
                    {this.renderTeamSelector(Team.Blue, styles.teamSelectorBlue)}
                    {this.renderTeamSelector(Team.Red, styles.teamSelectorRed)}
                </View>
                <View style={styles.aiHelpContainer}>
                    <Switch value={this.state.aiHelp} onValueChange={this.toggleAiHelp} />
                    <Text style={styles.aiHelpLabel} onPress={this.toggleAiHelp}>
                        AI Help: {this.state.aiHelp ? 'On ' : 'Off'}
                    </Text>
                </View>
                <View style={styles.continueButtomWrapper}>
                    <TouchableOpacity>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    private renderTeamSelector(team: Team, additionalStyles: object) {
        const onSelection = () => this.setState({ selectedTeam: team });

        return (
            <TouchableWithoutFeedback onPress={onSelection}>
                <View style={{ ...styles.teamSelector, ...additionalStyles }}>
                    {team === this.state.selectedTeam ? (
                        <AntDesign name="checkcircleo" size={36} color="white" />
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    private toggleAiHelp = () => {
        this.setState({ aiHelp: !this.state.aiHelp });
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
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    chooseTeamHeader: {
        fontFamily: 'sky-fall',
        fontSize: 18,
    },
    teamSelector: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 75,
        borderRadius: 15,
        marginTop: 10,
    },
    teamSelectorBlue: {
        backgroundColor: '#357BA4',
    },
    teamSelectorRed: {
        backgroundColor: '#D5393A',
    },
    aiHelpContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiHelpLabel: {
        fontFamily: 'sky-fall',
        fontSize: 16,
        paddingTop: 30,
        paddingBottom: 30,
    },
    continueButtomWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#EBDEC4',
        borderRadius: 15,
        padding: 20,
        marginBottom: 100,
    },
    buttonText: {
        fontFamily: 'sky-fall',
        fontSize: 24,
    },
});
