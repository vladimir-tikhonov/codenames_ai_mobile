import { AntDesign } from '@expo/vector-icons';
import * as colors from 'config/colors';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
    FlatList,
    ImageBackground,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { NextStepButtonWithContainer } from 'src/components/NextStepButtonWithContainer';
import { AppState } from 'src/entities/AppState';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';

interface IInjectedProps {
    appState: AppState;
}

interface ICondenameWithKey {
    key: string;
    codename: CodeName;
}

const images = {
    [Role.RedTeam]: require('assets/images/red.png'),
    [Role.BlueTeam]: require('assets/images/blue.png'),
    [Role.Bystander]: require('assets/images/bystander.png'),
    [Role.Assasin]: require('assets/images/assasin.png'),
};

function addKeys(codenames: CodeName[]) {
    return codenames.map((codename) => ({ key: codename.word, codename }));
}

@inject('appState')
@observer
export class RolesScreen extends React.Component<IInjectedProps> {
    public static navigationOptions = {
        title: 'Assign Roles',
    };

    public render() {
        return (
            <View style={styles.screenContainer}>
                <FlatList
                    style={styles.wordListContainer}
                    data={addKeys(this.props.appState.codeNames)}
                    renderItem={this.renderWord}
                />
                <NextStepButtonWithContainer onPress={this.goNext} />
            </View>
        );
    }

    private renderWord = (wordInfo: ListRenderItemInfo<ICondenameWithKey>) => {
        const word = wordInfo.item.codename.word;
        return (
            <View key={wordInfo.item.key} style={styles.wordContainer}>
                <Text style={styles.word}>{word.toLowerCase()}</Text>
                <View style={styles.rolesSelectorContainer}>{this.renderRoleImages(word)}</View>
            </View>
        );
    };

    private renderRoleImages(word: string) {
        const { appState } = this.props;

        return Object.keys(images).map((roleKey) => {
            const role = Number(roleKey) as Role;
            const currentWordRole = appState.getWordRole(word);
            const isSelected = role === currentWordRole;
            const roleImage = images[role];

            const onPress = () => appState.setWordRole(word, role);

            return (
                <TouchableWithoutFeedback key={roleKey} onPress={onPress}>
                    <ImageBackground
                        source={roleImage}
                        style={{ ...styles.roleImageContainer, ...(isSelected && styles.roleImageContainerSelected) }}
                        imageStyle={styles.roleImage}
                    >
                        {isSelected && <AntDesign name="checkcircleo" size={20} color="white" />}
                    </ImageBackground>
                </TouchableWithoutFeedback>
            );
        });
    }

    private goNext = () => {
        // noop
    };
}

const styles = StyleSheet.create({
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
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    rolesSelectorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    roleImageContainer: {
        height: 44,
        width: 44,
        resizeMode: 'contain',
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 22,
    },
    roleImageContainerSelected: {
        borderColor: 'black',
    },
    roleImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
