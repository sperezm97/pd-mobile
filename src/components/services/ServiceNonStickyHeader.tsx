import React from 'react';
import { StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { useTypedSelector } from '~/redux/AppState';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

/// The reading list header is partially scrollable -- this is the part that disappears under the navbar:
export const ServiceNonStickyHeader: React.FC<{}> = () => {
    const theme = useTheme();
    const pool = useTypedSelector((state) => state.selectedPool);
    const deviceSettings = useTypedSelector((state) => state.deviceSettings);

    if (!pool) { return <PDView />; }

    const volumeDisplay = VolumeUnitsUtil.getDisplayVolume(pool.gallons, deviceSettings);
    const detailsText = getDisplayForWaterType(pool.waterType);

    return (
        <PDView style={ styles.container } bgColor="white">
            <PDText type="subHeading" >{pool.name}</PDText>
            <PDView style={ styles.row }>
                <PDView style={ styles.containerIcon }>
                    <SVG.IconInformation fill={ theme.colors.greyDark } />
                </PDView>
                <PDText type="bodyRegular" color="greyDark">
                    {volumeDisplay}, {detailsText}
                </PDText>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PDSpacing.md,
        // This creates the least-surprising background color when over-scrolling:
        marginTop: -10000000,
        paddingTop: 10000000 + PDSpacing.md,
    },
    containerIcon: {
        paddingRight: PDSpacing.xs,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PDSpacing.xs,
    },
});
