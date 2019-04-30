import { AntDesign } from '@expo/vector-icons';
import { roleImages } from 'assets/images/map';
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
import { NavigationTransitionProps } from 'react-navigation';
import { NextStepButtonWithContainer } from 'src/components/NextStepButtonWithContainer';
import { AppState } from 'src/entities/AppState';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';

interface IInjectedProps {
    appState: AppState;
}

@inject('appState')
@observer
export class RolesScreen extends React.Component<IInjectedProps & NavigationTransitionProps> {
    public static navigationOptions = {
        title: 'Assign Roles',
    };

    public render() {
        const keyExtractor = (codename: CodeName) => codename.word;

        return (
            <View style={styles.screenContainer}>
                <FlatList
                    style={styles.wordListContainer}
                    data={this.props.appState.codeNames}
                    renderItem={this.renderWord}
                    keyExtractor={keyExtractor}
                />
                <NextStepButtonWithContainer onPress={this.goNext} />
            </View>
        );
    }

    private renderWord = (wordInfo: ListRenderItemInfo<CodeName>) => {
        const codeName = wordInfo.item;

        return (
            <View key={codeName.word} style={styles.wordContainer}>
                <Text style={styles.word}>{codeName.word.toLowerCase()}</Text>
                <View style={styles.rolesSelectorContainer}>{this.renderRoleImages(codeName)}</View>
            </View>
        );
    };

    private renderRoleImages(codeName: CodeName) {
        const { appState } = this.props;

        return Object.keys(roleImages).map((roleKey) => {
            const role = Number(roleKey) as Role;
            const currentWordRole = codeName.role;
            const isSelected = role === currentWordRole;
            const roleImage = roleImages[role];

            const onPress = () => appState.setCodeNameRole(codeName, role);

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
        this.props.navigation.navigate('Game');
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
