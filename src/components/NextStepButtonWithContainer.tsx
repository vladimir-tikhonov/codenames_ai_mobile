import * as colors from 'config/colors';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

interface INextStepButtonWithContainerProps {
    disabled?: boolean;
    onPress(): void;
    label?: string;
}

export class NextStepButtonWithContainer extends React.Component<INextStepButtonWithContainerProps> {
    public render() {
        return (
            <View style={styles.buttonContainer}>
                <TouchableHighlight
                    disabled={this.props.disabled}
                    style={styles.button}
                    underlayColor={colors.bystander}
                    activeOpacity={1}
                    onPress={this.props.onPress}
                >
                    <Text
                        style={{
                            ...styles.buttonText,
                            ...(this.props.disabled && styles.buttonTextDisabled),
                        }}
                    >
                        {this.props.label || 'Continue'}
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 130,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: colors.bystander,
        borderRadius: 15,
        alignItems: 'center',
        width: 200,
        paddingVertical: 15,
        marginBottom: 40,
    },
    buttonText: {
        fontSize: 26,
    },
    buttonTextDisabled: {
        opacity: 0.3,
    },
});
