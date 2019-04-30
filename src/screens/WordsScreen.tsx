import { Camera, Trash } from 'assets/icons';
import * as colors from 'config/colors';
import { inject, observer } from 'mobx-react';
import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    ListRenderItemInfo,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputSubmitEditingEventData,
    TouchableHighlight,
    View,
} from 'react-native';
import { NavigationTransitionProps } from 'react-navigation';
import { NextStepButtonWithContainer } from 'src/components/NextStepButtonWithContainer';
import { AppState } from 'src/entities/AppState';
import { CodeName } from 'src/entities/CodeName';

interface IInjectedProps {
    appState: AppState;
}

const keyExtractor = (codename: CodeName) => codename.word;

@inject('appState')
@observer
export class WordsScreen extends React.Component<NavigationTransitionProps & IInjectedProps> {
    public static navigationOptions = {
        title: 'Enter Code Names',
    };

    private inputRef = React.createRef<TextInput>();

    public render() {
        return (
            <View style={styles.screenContainer}>
                <KeyboardAvoidingView behavior="padding" style={styles.wordListContainer} keyboardVerticalOffset={100}>
                    {this.renderWordList()}
                    <View style={styles.textInputContainer}>
                        <TextInput
                            ref={this.inputRef}
                            style={styles.textInput}
                            placeholder="Enter New Code Name(s)..."
                            enablesReturnKeyAutomatically
                            onSubmitEditing={this.onNewWordSubmit}
                        />
                        <View style={styles.cameraButtonWrapper}>
                            <TouchableHighlight>
                                <Camera height={28} width={28} fill={colors.bystander} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <NextStepButtonWithContainer onPress={this.goNext} disabled={this.isNothingSelected()} />
            </View>
        );
    }

    private isNothingSelected = () => {
        return this.props.appState.codeNames.length === 0;
    };

    private renderWordList = () => {
        if (this.isNothingSelected()) {
            return (
                <View style={{ ...styles.wordListContainer, ...styles.wordListContainerEmpty }}>
                    <Text style={styles.wordsPlaceholder}>Nothing here yet :)</Text>
                </View>
            );
        }

        return (
            <FlatList
                style={styles.wordListContainer}
                data={this.props.appState.codeNames}
                renderItem={this.renderWord}
                keyExtractor={keyExtractor}
                initialNumToRender={15}
            />
        );
    };

    private renderWord = (wordInfo: ListRenderItemInfo<CodeName>) => {
        const onRemove = () => this.props.appState.removeCodeName(wordInfo.item);

        return (
            <View key={wordInfo.item.word} style={styles.wordContainer}>
                <Text style={styles.word}>{wordInfo.item.word.toLowerCase()}</Text>
                <TouchableHighlight onPress={onRemove}>
                    <Trash width={30} height={30} fill={colors.bystander} />
                </TouchableHighlight>
            </View>
        );
    };

    private onNewWordSubmit = (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        const newWords = event.nativeEvent.text.split(' ');
        for (const newWord of newWords) {
            this.props.appState.addWordToCodeNames(newWord.trim());
        }
        this.inputRef.current!.clear();
    };

    private goNext = () => {
        this.props.navigation.navigate('Roles');
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
    wordListContainerEmpty: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wordsPlaceholder: {
        opacity: 0.5,
        fontSize: 20,
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
    textInputContainer: {
        flexDirection: 'row',
        height: 40,
        width: '100%',
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: colors.gray,
    },
    cameraButtonWrapper: {
        height: 40,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.gray,
    },
});
