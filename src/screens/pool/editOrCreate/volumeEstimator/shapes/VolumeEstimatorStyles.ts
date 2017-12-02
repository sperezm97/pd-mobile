import { StyleSheet } from 'react-native';
import { PDSpacing } from '~/components/PDTheme';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: PDSpacing.lg,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: PDSpacing.sm,
    },

    shapeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: PDSpacing.sm,
        marginBottom: PDSpacing.lg,
        padding: PDSpacing.md,
        borderRadius: 16,
    },
    fromRowOneField: {
        marginTop: PDSpacing.sm,
    },
    textInput: {
        width: '49%',
    },
});
