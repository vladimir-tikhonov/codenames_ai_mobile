import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { Team } from 'src/entities/Team';

interface IGameConfigScreenState {
    selectedTeam: Team;
}

export class GameConfigScreen extends React.PureComponent<NavigationTransitionProps, IGameConfigScreenState> {
    public static navigationOptions = {
        title: 'Configure your game',
    };

    public state = {
        selectedTeam: Team.Blue,
    };

    public render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.teamSelectorContainer}>
                    <Text style={styles.chooseTeamHeader}>Choose you team</Text>
                    {this.renderTeamSelector(Team.Blue, styles.teamSelectorBlue)}
                    {this.renderTeamSelector(Team.Red, styles.teamSelectorRed)}
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
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamSelectorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});
