import * as React from 'react';
import {
    Alert, LayoutAnimation, SectionList, SectionListData, StyleSheet,
} from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { ChartCard } from '~/components/charts/ChartCard';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDText } from '~/components/PDText';
import { useLoadFormulaHook, useRealmPoolHistoryHook } from '~/hooks/RealmPoolHook';
import { useStandardStatusBar } from '~/hooks/useStatusBar';
import { LogEntry } from '~/models/logs/LogEntry';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useThunkDispatch, useTypedSelector } from '~/redux/AppState';
import { updatePool } from '~/redux/selectedPool/Actions';
import { Database } from '~/repository/Database';
import { EmailService } from '~/services/EmailService';
import { Haptic } from '~/services/HapticService';
import { Util } from '~/services/Util';

import { useNavigation } from '@react-navigation/native';

import { PoolHistoryListItem } from './PoolHistoryListItem';
import PoolServiceConfigSection from './PoolServiceConfigSection';
import { usePoolChart } from './usePoolChart';
import { ForumPrompt } from '~/screens/home/footer/ForumPrompt';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';


export const PoolScreen: React.FC = () => {
    useStandardStatusBar();
    const selectedPool = useTypedSelector((state) => state.selectedPool);
    const dispatchThunk = useThunkDispatch();
    const theme = useTheme();

    const { navigate } = useNavigation<PDStackNavigationProps>();

    // This coalesces from `Pool | undefined` to `Pool | null`
    const history = useRealmPoolHistoryHook(selectedPool?.objectId ?? null);

    const [selectedHistoryCellIds, setSelectedHistoryCellIds] = React.useState<string[]>([]);

    const formula = useLoadFormulaHook(selectedPool?.formulaId);
    const selectedFormulaId = useTypedSelector((state) => state.selectedFormulaKey);
    const chartData = usePoolChart();

    /// If the user selects a new recipe, save it to the pool.
    /// This is so dangerous & error-prone
    React.useEffect(() => {
        if (!selectedPool || !selectedFormulaId || selectedPool.recipeKey === selectedFormulaId) {
            return;
        }
        dispatchThunk(
            updatePool({
                ...selectedPool,
                recipeKey: selectedFormulaId ?? undefined,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormulaId]);

    if (!selectedPool || !formula) {
        return <PDView  />;
    }

    const handleEditButtonPressed = () => {
        navigate('EditPoolNavigator');
    };

    const handleChartsPressed = () => {
        navigate('PoolHistory');
    };

    const handleHistoryCellPressed = (logEntryId: string) => {
        Haptic.light();
        const wasPreviouslyActive = selectedHistoryCellIds.includes(logEntryId);
        let newActiveIds = Util.deepCopy(selectedHistoryCellIds);
        if (wasPreviouslyActive) {
            newActiveIds = newActiveIds.filter((x) => x !== logEntryId);
        } else {
            newActiveIds.push(logEntryId);
        }

        // Animate the progress bar change here:
        const springAnimationProperties = {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY,
        };
        const animationConfig = {
            duration: 50, // how long the animation will take
            create: undefined,
            update: springAnimationProperties,
            delete: undefined,
        };
        LayoutAnimation.configureNext(animationConfig);
        setSelectedHistoryCellIds(newActiveIds);
    };

    const handleHistoryCellDeletePressed = (logEntryId: string) => {
        Alert.alert(
            'Delete Log Entry?',
            'This cannot be undone.',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'DELETE',
                    onPress: () => deleteLogEntryConfirmed(logEntryId),
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };

    const deleteLogEntryConfirmed = (logEntryId: string) => {
        setSelectedHistoryCellIds(selectedHistoryCellIds.filter((x) => x !== logEntryId));
        Database.deleteLogEntry(logEntryId);
    };

    const handleHistoryCellEmailPressed = (logEntry: LogEntry) => {
        EmailService.emailLogEntry(logEntry, selectedPool?.email ?? '');
    };

    const renderItem = (section: SectionListData<any>, item: any): JSX.Element => {
        let titleElement = (
            <PDText type="heading" style={ styles.sectionTitle }>
                {section.title}
            </PDText>
        );
        let contentBody = <></>;
        let marginHorizontal = 0;
        let marginBottom = 14;

        if (section.key === 'service_section') {
            contentBody = <PoolServiceConfigSection />;
        } else if (section.key === 'trends_section') {
            marginHorizontal = 18;
            if (history.length < 1) {
                return <PDView />;
            }
            contentBody = (
                <TouchableScale onPress={ handleChartsPressed } activeScale={ 0.98 } style={ styles.recipeButton }>
                    <ChartCard viewModel={ chartData } containerStyles={ styles.chartCard } />
                </TouchableScale>
            );
        } else if (section.key === 'history_section') {
            marginBottom = 6;
            marginHorizontal = 18;

            if (history.indexOf(item) !== 0) {
                titleElement = <></>;
            }
            contentBody = (
                <PoolHistoryListItem
                    key={ item.objectId }
                    logEntry={ item }
                    handleCellSelected={ handleHistoryCellPressed }
                    handleDeletePressed={ handleHistoryCellDeletePressed }
                    handleEmailPressed={ handleHistoryCellEmailPressed }
                    isExpanded={ selectedHistoryCellIds.includes(item.objectId) }
                />
            );
        }

        // We need the key here to change after a purchase to cause a re-render:
        return (
            <PDView key={ `${section}-${item.objectId}` } style={ { marginBottom, marginHorizontal } }>
                {section.key === 'service_section' || titleElement}
                {contentBody}
            </PDView>
        );
    };

    const renderSectionFooter = (section: SectionListData<any>) => {
        if (section.key !== 'history_section' || history.length === 0) {
            return <PDView />;
        }
        return (
            <PDView style={ { marginHorizontal: PDSpacing.md } }>
                <ForumPrompt />
            </PDView>
        );
    };

    const sections: SectionListData<any>[] = [
        {
            title: '',
            data: [{ key: 'bogus_recipe' }],
            key: 'service_section',
        },
        {
            title: 'Trends',
            data: [{ key: 'bogus_trends' }],
            key: 'trends_section',
        },
        {
            title: 'History',
            data: history,
            key: 'history_section',
        },
    ];
    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader textType="heading" hasEditButton color="blue" handlePressedEdit={ handleEditButtonPressed }>
                Pool Details
            </ScreenHeader>
            <SectionList
                sections={ sections }
                style={ [styles.sectionList , { backgroundColor: theme.colors.background }] }
                renderItem={ ({ section, item }) => renderItem(section, item) }
                contentInset={ { bottom: 34 } }
                stickySectionHeadersEnabled={ true }
                keyExtractor={ (section, item) => `${section.key}|${item}` }
                renderSectionFooter={ (info) => renderSectionFooter(info.section) }
            />
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionList: {
        flex: 1,
    },
    sectionTitle: {
        marginTop: 6,
        marginBottom: 4,
    },
    recipeButton: {
        flexDirection: 'row',
    },
    chartCard: {
        borderRadius: 24,
        marginHorizontal: 12,
        marginBottom: 12,
    },
});
