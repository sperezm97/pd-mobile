import * as React from 'react';
import { StyleSheet, Text, TextProps, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MaskedView from '@react-native-community/masked-view';

interface PDGradientTextProps extends TextProps {
    /// The id for a shared-element fluid transition
    shared?: string;
    colors: string[];
}

export class PDGradientText extends React.Component<PDGradientTextProps, {}> {
    render() {
        const textStyle = StyleSheet.flatten([styles.default, this.props.style]);
        return (
            <View style={ { flexDirection: 'row' } }>
                <MaskedView maskElement={ <Text style={ textStyle }>{this.props.children}</Text> }>
                    <LinearGradient colors={ this.props.colors } start={ { x: -0.2, y: -0.3 } } end={ { x: 1.05, y: 1.2 } }>
                        <Text style={ [textStyle, { opacity: 0 }] }>{this.props.children}</Text>
                    </LinearGradient>
                </MaskedView>
                <View style={ { flex: 1 } } />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    default: {
        fontFamily: 'Poppins-Regular',
        fontWeight: '700',
        fontSize: 28,
    },
});
