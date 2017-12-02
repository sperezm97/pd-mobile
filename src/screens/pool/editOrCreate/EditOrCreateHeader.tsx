import * as React from 'react';
import { StyleSheet } from 'react-native';
import { AV, useSectionListHeaderAnimation } from '~/components/animation/AnimationHelpers';
import { PDText } from '~/components/PDText';

interface EditOrCreateSectionHeaderProps {
    title: string;
}

export const EditOrCreateSectionHeader: React.FC<EditOrCreateSectionHeaderProps> = (props) => {

    const { sectionHeaderOpacity } = useSectionListHeaderAnimation();

    return (
        <AV opacity={ sectionHeaderOpacity }>
            <PDText type="bodyGreyBold" style={ styles.text }>
                {props.title}
            </PDText>
        </AV>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#737373',
        marginBottom: 10,
        marginTop: 15,
    },
});
