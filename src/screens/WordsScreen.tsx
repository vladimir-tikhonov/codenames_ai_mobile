import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
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
import { AppState } from 'src/entities/AppState';
import { CodeName } from 'src/entities/CodeName';

interface ICondenameWithKey {
    key: string;
    codename: CodeName;
}

interface IInjectedProps {
    appState: AppState;
}

function addKeys(codenames: CodeName[]) {
    return codenames.map((codename) => ({ key: codename.word, codename }));
}

@inject('appState')
@observer
export class WordsScreen extends React.Component<IInjectedProps> {
    public static navigationOptions = {
        title: 'Enter Code Names',
    };

    private inputRef = React.createRef<TextInput>();

    public render() {
        return (
            <View style={styles.screenContainer}>
                <KeyboardAvoidingView behavior="padding" style={styles.wordListContainer} keyboardVerticalOffset={100}>
                    <FlatList
                        style={styles.wordListContainer}
                        data={addKeys(this.props.appState.codeNames)}
                        renderItem={this.renderWord}
                    />
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
                                <SimpleLineIcons name="camera" size={30} color="#EBDEC4" />
                            </TouchableHighlight>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight style={styles.continueButton} underlayColor="#EBDEC4" activeOpacity={1}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    private renderWord = (wordInfo: ListRenderItemInfo<ICondenameWithKey>) => {
        const onRemove = () => this.props.appState.removeWordFromCodeNames(wordInfo.item.codename.word);

        return (
            <View key={wordInfo.item.key} style={styles.wordContainer}>
                <Text style={styles.word}>{wordInfo.item.codename.word.toLowerCase()}</Text>
                <TouchableHighlight onPress={onRemove}>
                    <AntDesign name="delete" size={32} color="#EBDEC4" />
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
        borderBottomColor: '#EFEFEF',
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
        borderBottomColor: '#EFEFEF',
    },
    cameraButtonWrapper: {
        height: 40,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#EFEFEF',
    },
    buttonContainer: {
        height: 130,
        justifyContent: 'flex-end',
    },
    continueButton: {
        backgroundColor: '#EBDEC4',
        borderRadius: 15,
        padding: 20,
        marginBottom: 40,
    },
    continueButtonText: {
        fontSize: 26,
    },
});
