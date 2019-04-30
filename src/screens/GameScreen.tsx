import { MaterialCommunityIcons } from '@expo/vector-icons';
import { roleImages } from 'assets/images/map';
import * as colors from 'config/colors';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
    Alert,
    Button,
    ImageBackground,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { NavigationParams, NavigationTransitionProps } from 'react-navigation';
import { AppState } from 'src/entities/AppState';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';
import { getFriendlyAgentsRole, getOpponentAgentsRole } from 'src/entities/Team';

interface IInjectedProps {
    appState: AppState;
}

@inject('appState')
@observer
export class GameScreen extends React.Component<NavigationTransitionProps & IInjectedProps> {
    public static navigationOptions = ({ navigation }: { navigation: NavigationParams }) => ({
        title: 'Ready To Play!',
        headerRight: (
            <View style={{ marginRight: 10 }}>
                <Button onPress={navigation.getParam('finishGame') || (() => ({}))} title="Finish Game" />
            </View>
        ),
    });

    public componentDidMount() {
        this.props.navigation.setParams({ finishGame: this.finishGame });
    }

    public render() {
        const keyExtractor = (codename: CodeName) => codename.word;

        return (
            <View style={styles.screenContainer}>
                <SectionList
                    style={styles.wordListContainer}
                    sections={this.buildSections()}
                    renderItem={this.renderWord}
                    renderSectionHeader={this.renderSection}
                    keyExtractor={keyExtractor}
                />
            </View>
        );
    }

    private buildSections = () => {
        const { appState } = this.props;
        const friendlyAgentsRole = getFriendlyAgentsRole(appState.selectedTeam);
        const opponentAgentsRole = getOpponentAgentsRole(appState.selectedTeam);
        const options = { excludeHidden: true };

        return [
            { title: 'Your Agents', data: appState.getCodeNamesWithRole(friendlyAgentsRole, options) },
            { title: 'Assassin', data: appState.getCodeNamesWithRole(Role.Assasin, options) },
            { title: 'Opponents Agents', data: appState.getCodeNamesWithRole(opponentAgentsRole, options) },
            { title: 'Bystanders', data: appState.getCodeNamesWithRole(Role.Bystander, options) },
            { title: 'Hidden', data: appState.getHiddenCodeNames() },
        ];
    };

    private renderSection = ({ section }: { section: SectionListData<any> }) => {
        if (section.data.length === 0) {
            return null;
        }

        return <Text style={styles.sectionHeader}>{section.title}</Text>;
    };

    private renderWord = (wordInfo: ListRenderItemInfo<CodeName>) => {
        const { appState } = this.props;

        const codeName = wordInfo.item;
        const roleImage = roleImages[codeName.role];
        const onEyePress = () => appState.toggleCodeNameVisibility(codeName);
        const isHidden = appState.hiddenCodeNames.has(codeName);
        const eyeIcon = isHidden ? 'eye' : 'eye-off';

        return (
            <View key={codeName.word} style={styles.wordContainer}>
                <ImageBackground
                    source={roleImage}
                    style={{ ...styles.roleImageContainer }}
                    imageStyle={styles.roleImage}
                />
                <Text style={{ ...styles.word, ...(isHidden && styles.wordHidden) }}>
                    {codeName.word.toLowerCase()}
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableHighlight onPress={onEyePress}>
                        <MaterialCommunityIcons name={eyeIcon} size={32} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    };

    private finishGame = () => {
        Alert.alert('Finish Game', 'Are you sure?', [
            {
                text: 'Yes',
                onPress: () => {
                    this.props.navigation.navigate('Initial');
                },
            },
            { text: 'No' },
        ]);
    };
}

const styles = StyleSheet.create({
    finishButton: {
        marginRight: 10,
    },
    screenContainer: {
        flex: 1,
        padding: 10,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wordListContainer: {
        flex: 1,
        width: '100%',
    },
    sectionHeader: {
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5,
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: colors.gray,
        paddingLeft: 15,
        paddingRight: 15,
    },
    word: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    wordHidden: {
        opacity: 0.3,
    },
    rolesSelectorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    roleImageContainer: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
