import pluralize from 'pluralize';
import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Scoop } from '~/models/Scoop';
import { Haptic } from '~/services/HapticService';

interface ScoopListItemProps {
    scoop: Scoop;
    handlePressedScoop: (scoop: Scoop) => void;
}

export const ScoopListItem: React.FC<ScoopListItemProps> = (props) => {

    const handlePressed = () => {
        Haptic.light();
        props.handlePressedScoop(props.scoop);
    };

    const unitsText = `${props.scoop.displayValue} ${pluralize(
        props.scoop.displayUnits,
        parseFloat(props.scoop.displayValue),
    )}`;


    return (
        <TouchableScale onPress={ handlePressed } activeScale={ 0.96 }>
            <PDView bgColor="white" borderColor="border" style={ styles.listItemContainer }>
                <PDText type="bodySemiBold" style={ styles.chemNameText }>
                    {props.scoop.chemName}
                </PDText>
                <PDText type="bodySemiBold" color="pink" style={ styles.unitsText }>
                    {unitsText}
                </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: 'row',
        marginBottom: PDSpacing.xs,
        marginHorizontal: 20,
        paddingVertical: PDSpacing.md,
        paddingHorizontal: PDSpacing.lg,
        borderRadius: 24,
        borderWidth: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chemNameText: {
        fontSize: 18,
    },
    unitsText: {
        fontSize: 18,
    },
});
