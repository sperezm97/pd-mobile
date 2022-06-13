import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { TextButton } from '~/components/buttons/TextButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { TargetRange } from '~/formulas/models/TargetRange';
import { useRealmPoolTargetRange } from '~/hooks/RealmPoolHook';
import { TargetRangeOverride } from '~/models/Pool/TargetRangeOverride';

import { Database } from '~/repository/Database';
import { Util } from '~/services/Util';
import { PartialPoolWithId } from '../pool/editOrCreate/hooks/useEntryPool';

import { TargetsHelper } from './TargetHelper';

interface CustomTargetsItemProps {
    tr: TargetRange;
    pool: PartialPoolWithId;
}

interface TargetFormFields {
    min: string;
    max: string;
}

/**
 *  List Item for Custom Targets by Defaults values from each wallType.
 */
const CustomTargetsItem: React.FC<CustomTargetsItemProps> = ({ tr, pool }) => {
    const locallySavedOverride = useRealmPoolTargetRange(tr.var, pool?.objectId); // ?? ({} as TargetRangeOverride);
    const theme = useTheme();

    // The min & max will sometimes be equal to the defaults, but we need to determine both for the sake of comparison
    const formulaDefaults = TargetsHelper.resolveMinMax(tr, null);
    const { min, max } = TargetsHelper.resolveMinMax(tr, locallySavedOverride);

    // We use empty-strings for defaults (to show the placeholder)
    const [formValues, setFormValues] = React.useState<TargetFormFields>({
        min: min === formulaDefaults.min ? '' : `${min}`,
        max: max === formulaDefaults.max ? '' : `${max}`,
    });

    const handleTextChange = useCallback(
        (fieldName: 'min' | 'max', newValue: string) => {
            const newFormValues = Util.deepCopy(formValues);
            newFormValues[fieldName] = newValue;
            setFormValues(newFormValues);
        },
        [formValues]
    );

    if (!pool) { return <></>; }

    // Check for errors:
    const effectiveMinValue = formValues.min.length ? +formValues.min : formulaDefaults.min;
    const effectiveMaxValue = formValues.max.length ? +formValues.max : formulaDefaults.max;
    const isValid = effectiveMaxValue >= effectiveMinValue;

    const isDefault = (field: 'min' | 'max'): Boolean => {
        if (field === 'min') {
            return formulaDefaults.min === min;
        }
        return formulaDefaults.max === max;
    };

    const reset = () => {
        if (locallySavedOverride) {
            Database.deleteCustomTarget(locallySavedOverride);
        }
        setFormValues({ min: '', max: '' });
    };

    const save = async () => {
        // If these are the default values, just delete them:
        if (formulaDefaults.max === +formValues.max && formulaDefaults.min === +formValues.min) {
            reset();
            return;
        }

        const newLocalOverride = {
            objectId: locallySavedOverride?.objectId ?? null, /// If this is null, the DB should create a new object
            min: formValues.min.length ? +formValues.min : formulaDefaults.min,
            max: formValues.max.length ? +formValues.max : formulaDefaults.max,
            poolId: pool.objectId,
            var: tr.var,
        };

        const mapCustomTarget = TargetRangeOverride.make(newLocalOverride);
        await Database.saveNewCustomTarget(mapCustomTarget);
    };

    const handleBlur = () => {
        if (isValid) {
            save();
        }
    };

    const enableResetButton = !isDefault('min') || !isDefault('max');

    return (
        <PDView style={ styles.container } bgColor="white" borderColor="border">
            <PDView style={ styles.topRow }  borderColor="border">
                <PDText type="bodyMedium" color="black">
                    {tr.name}
                </PDText>
                <TextButton
                    text="Reset"
                    onPress={ reset }
                    disabled={ !enableResetButton }
                    containerStyles={ [ styles.buttonContainer , { backgroundColor: theme.colors.greyLight }] }
                    textStyles={ [styles.buttonText,{ color: theme.colors.greyDark }, enableResetButton && { color: theme.colors.black }] }

                />
            </PDView>
            <PDView>
                <PDView style={ styles.inputRow }>
                    <BorderInputWithLabel
                        label="min"
                        placeholder={ `${formulaDefaults.min}` }
                        placeholderTextColor={ theme.colors.grey }
                        onChangeText={ (text) => handleTextChange('min', text) }
                        value={ formValues.min }
                        color="blue"
                        keyboardType="numeric"
                        onBlur={ handleBlur }
                    />
                    <BorderInputWithLabel
                        label="max"
                        placeholder={ `${formulaDefaults.max}` }
                        placeholderTextColor={ theme.colors.grey }
                        onChangeText={ (text) => handleTextChange('max', text) }
                        value={ formValues.max }
                        color="blue"
                        keyboardType="numeric"
                        onBlur={ handleBlur }
                    />
                </PDView>
                {!isValid && (
                    <PDView bgColor="blurredRed" style={ styles.errorContainer }>
                        <PDText type="bodyBold" color="red">
                            Your target’s min value cannot greater than the max value
                        </PDText>
                    </PDView>
                )}
                <PDView>
                    <PDText numberOfLines={ 3 } type="bodyRegular" color="grey">
                        {tr.description}
                    </PDText>
                </PDView>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        borderWidth: 2,
        padding: PDSpacing.lg,
        marginBottom: PDSpacing.sm,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        marginBottom: PDSpacing.sm,
        paddingBottom: PDSpacing.sm,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: PDSpacing.sm,
    },
    errorContainer: {
        borderRadius: 8,
        paddingVertical: PDSpacing.xs,
        paddingHorizontal: PDSpacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: PDSpacing.sm,
    },
    buttonContainer: {
        borderRadius: 12.5,
        minHeight: 34,
        minWidth: 75,
    },
    buttonText: {
        fontSize: 16,
        fontStyle: 'normal',
        color: '#7C7C7C',
    },
    isOverride: {
        color: '#1E6BFF',
    },
});

export default CustomTargetsItem;
