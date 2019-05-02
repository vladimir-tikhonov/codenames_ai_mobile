import { Eye, EyeOff } from 'assets/icons';
import { roleImages } from 'assets/images/map';
import * as colors from 'config/colors';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Dimensions,
    FlatList,
    ImageBackground,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { Scene, TabBar, TabBarProps, TabView } from 'react-native-tab-view';
import { NavigationParams, NavigationTransitionProps } from 'react-navigation';
import { loadAssociations } from 'src/api/associations';
import { AppState } from 'src/entities/AppState';
import { Association } from 'src/entities/Association';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';
import { getFriendlyAgentsRole, getOpponentAgentsRole } from 'src/entities/Team';

interface IInjectedProps {
    appState: AppState;
}

const codenamesKeyExtractor = (codename: CodeName) => codename.word;
const associationKeyExtractor = (association: Association) =>
    association.associationWord + association.associatedWords.join();

const routesConfig = {
    codeNames: {
        key: 'codeNames',
        index: 0,
    },
    associations: {
        key: 'associations',
        index: 1,
    },
};

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

    public state = {
        index: 0,
        routes: [
            { key: routesConfig.codeNames.key, title: 'Code Names' },
            { key: routesConfig.associations.key, title: 'Hints' },
        ],
    };

    public async componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({ finishGame: this.finishGame });
        await this.refreshAssociations();
    }

    public render() {
        const dimentions = Dimensions.get('window');

        return (
            <TabView
                navigationState={this.state}
                renderScene={this.renderScene}
                onIndexChange={this.onIndexChange}
                initialLayout={{ width: dimentions.width, height: dimentions.height }}
                renderTabBar={this.renderTabBar}
            />
        );
    }

    private renderScene = ({ route }: Scene<any>) => {
        switch (route.key) {
            case 'codeNames':
                return <WordsTab {...this.props} />;
            case 'associations':
                return <HintsTab {...this.props} />;
            default:
                return null;
        }
    };

    private renderTabBar = (props: TabBarProps) => {
        return <TabBar {...props} style={styles.tapBar} renderLabel={this.renderTapBarLabel} />;
    };

    private renderTapBarLabel = ({ route }: Scene<any>) => (
        <Text style={styles.tapBarLabel}>{route.title.toUpperCase()}</Text>
    );

    private onIndexChange = async (index: number) => {
        this.setState({ index });
        if (index === routesConfig.associations.index) {
            await this.refreshAssociations();
        }
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

    private async refreshAssociations() {
        const { appState } = this.props;
        if (appState.associationsWereLoaded) {
            return;
        }

        const associations = await loadAssociations(appState.getVisibleCodeNames(), appState.selectedTeam);
        appState.setAssociations(associations);
    }
}

@observer
class WordsTab extends React.Component<IInjectedProps> {
    public render() {
        return (
            <View style={styles.screenContainer}>
                <SectionList
                    style={styles.wordListContainer}
                    sections={this.buildSections()}
                    renderItem={this.renderWord}
                    renderSectionHeader={this.renderSection}
                    keyExtractor={codenamesKeyExtractor}
                    initialNumToRender={15}
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
        const EyeIcon = isHidden ? Eye : EyeOff;

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
                <View style={styles.eyeIconContainer}>
                    <TouchableHighlight onPress={onEyePress}>
                        <EyeIcon height={32} width={32} fill={colors.bystander} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    };
}

@observer
class HintsTab extends React.Component<IInjectedProps> {
    public render() {
        const { appState } = this.props;
        if (!appState.enableAi) {
            return this.renderHintsDisabledScreen();
        }

        if (!appState.associationsWereLoaded) {
            return this.renderLoadingScreen();
        }

        const sortedAssociations = appState.associations.sort((a, b) => a.overallScore - b.overallScore);

        if (sortedAssociations.length === 0) {
            return this.renderNoAssociationsScreen();
        }

        return (
            <View style={styles.screenContainer}>
                <FlatList
                    style={styles.wordListContainer}
                    data={sortedAssociations}
                    renderItem={this.renderAssociation}
                    keyExtractor={associationKeyExtractor}
                    initialNumToRender={10}
                />
            </View>
        );
    }

    private renderAssociation = (associationInfo: ListRenderItemInfo<Association>) => {
        const association = associationInfo.item;

        return (
            <View style={styles.associationContainer}>
                <Text style={styles.associationHeader}>
                    {association.associationWord} {association.associatedWords.length}
                </Text>
                {association.associatedWords.map(this.renderAssociationWord)}
                {this.renderRivalWords(association)}
            </View>
        );
    };

    private renderAssociationWord = (word: string) => {
        const codeName = this.props.appState.getCodeNameByWord(word);
        const roleImage = roleImages[codeName.role];

        return (
            <View key={word} style={styles.associationWordContainer}>
                <ImageBackground
                    source={roleImage}
                    style={styles.associationRoleImageContainer}
                    imageStyle={styles.associationRoleImage}
                />
                <Text style={styles.associationWord}>{codeName.word.toLowerCase()}</Text>
            </View>
        );
    };

    private renderRivalWords = (association: Association) => {
        const significantRivalWords = association.rivalWords.filter((_, i) => {
            const rivalWordScore = association.rivalWordScores[i];
            return rivalWordScore >= association.guessableScore / 1.2;
        });

        if (significantRivalWords.length === 0) {
            return null;
        }

        return (
            <>
                <Text style={styles.canBeConfusedLabel}>Can be confused with:</Text>
                {significantRivalWords.map(this.renderAssociationWord)}
            </>
        );
    };

    private renderHintsDisabledScreen = () => {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.noHintsLabel}>Hints are hidden becase "AI Help" was disabled</Text>
            </View>
        );
    };

    private renderNoAssociationsScreen = () => {
        return (
            <View style={styles.screenContainer}>
                <Text style={styles.noHintsLabel}>No associations found :(</Text>
            </View>
        );
    };

    private renderLoadingScreen = () => {
        return (
            <View style={styles.screenContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
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
    tapBar: {
        backgroundColor: 'white',
    },
    tapBarLabel: {
        margin: 8,
        color: 'black',
        fontWeight: 'bold',
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
    eyeIconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    noHintsLabel: {
        fontSize: 16,
        opacity: 0.3,
    },
    associationContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: colors.gray,
        paddingLeft: 15,
        paddingRight: 15,
    },
    associationHeader: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    associationWordContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        width: '100%',
    },
    associationRoleImageContainer: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    associationRoleImage: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },
    associationWord: {
        fontSize: 16,
        fontStyle: 'italic',
    },
    canBeConfusedLabel: {
        fontStyle: 'italic',
    },
});
