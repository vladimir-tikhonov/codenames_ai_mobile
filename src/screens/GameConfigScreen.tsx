import { AntDesign } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { AppState } from 'src/entities/AppState';
import { Team } from 'src/entities/Team';

interface IInjectedProps {
    appState: AppState;
}

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
                    {this.renderTeamSelector(Team.Blue, styles.teamSelectorBlue)}
                    {this.renderTeamSelector(Team.Red, styles.teamSelectorRed)}
                </View>
                <View style={styles.aiHelpContainer}>
                    <Switch value={enableAi} onValueChange={this.toggleAiHelp} />
                    <Text style={styles.aiHelpLabel} onPress={this.toggleAiHelp}>
                        AI Help: {enableAi ? 'On ' : 'Off'}
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
        const onSelection = () => (this.props.appState.selectedTeam = team);

        return (
            <TouchableWithoutFeedback onPress={onSelection}>
                <View style={{ ...styles.teamSelector, ...additionalStyles }}>
                    {team === this.props.appState.selectedTeam ? (
                        <AntDesign name="checkcircleo" size={36} color="white" />
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    private toggleAiHelp = () => {
        this.props.appState.enableAi = !this.props.appState.enableAi;
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
