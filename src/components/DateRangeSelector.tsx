import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectableTextButton } from '~/components/buttons/SelectableTextButton';

interface DateRangeSelectorProps {
    /** Callback invoked when the range is updated by the user with the new range */
    onRangeUpdated: (currentDateRange: DateRange) => void;
    /** Array of date ranges to render in component */
    dateRange: DateRange[];
    currentDateRange: DateRange;
}

export type DateRange = '24H' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

export const DateRangeSelector: React.FunctionComponent<DateRangeSelectorProps> = (props) => {
    const handleDateRangeChanged = (selectedDateRange: DateRange) => {
        props.onRangeUpdated(selectedDateRange);
    };

    const getButtons = () => {
        let count = 0;
        return props.dateRange.map((range: DateRange) => (
            <SelectableTextButton
                key={ count++ }
                buttonText={ range }
                onPress={ () => handleDateRangeChanged(range) }
                isSelected={ range === props.currentDateRange }
            />
        ));
    };
    return <View style={ styles.container }>{getButtons()}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
});
