import format from 'date-fns/format';
import * as React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { PDText } from '../PDText';
import { useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { ChartCardViewModel } from './ChartCardViewModel';

interface ChartCardProps {
    viewModel: ChartCardViewModel;
    containerStyles?: StyleProp<ViewStyle>;
}

export const ChartCard: React.FC<ChartCardProps> = (props) => {

    const webView = useRef<WebView>(null);
    const theme = useTheme();
    const [isChartVisible, setIsChartVisible] = useState(false);

    const formatTimestamp = (ts: number, df: string): string => {
        return format(ts, df);
    };

    const getDateLabels = () => {
        let count = 0;
        if (props.viewModel.timestamps.length === 0) {
            return [];
        }
        const first = props.viewModel.timestamps[0];
        const last = props.viewModel.timestamps[props.viewModel.timestamps.length - 1];
        const dateFormat = 'MMM';
        return [formatTimestamp(first, dateFormat), formatTimestamp(last, dateFormat)].map((range) => (
            <PDText color="greyDark" style={ styles.labelText } key={ count++ }>
                {range}
            </PDText>
        ));
    };

    const onChartLibraryLoaded = () => {
        if (webView !== null) {
            const labels = props.viewModel.timestamps.map((d) => formatTimestamp(d, 'MMM d, ha'));
            const graphData = {
                points: props.viewModel.values,
                dates: labels,
                idealMin: props.viewModel.idealMin,
                idealMax: props.viewModel.idealMax,
                theme: { backgroundColor: theme.colors.white },
            };
            const graphString = JSON.stringify(graphData);
            console.log('Graphing:');
            console.log(graphString);
            webView.current?.injectJavaScript(`setTimeout(() => {
                window.graphData(${graphString});
            }, 100);`);
            // TODO: make an event that the webview fires after it's loaded the chart (and set the background color).
            setTimeout(() => {
                setIsChartVisible(true);
            }, 250);
        }
    };

    console.log('Rendering charts again!!!!!!!!!!!');
    const chartPath =
        Platform.OS === 'android' ? 'file:///android_asset/charts/Charts.html' : './web.bundle/Charts.html';

    return (
        <PDView bgColor="white" style={ [styles.container, props.containerStyles] }>
            <PDText type="subHeading" color="greyDark" style={ styles.title }>{props.viewModel.title}</PDText>
            <PDView style={ styles.chartContainer }>
                <PDView
                    style={ styles.chartWebViewContainer }
                    pointerEvents={ props.viewModel.interactive ? 'auto' : 'none' }
                    opacity={ isChartVisible ? 1 : 0 }>
                    <WebView
                        ref={ webView }
                        onLoadEnd={ onChartLibraryLoaded }
                        originWhitelist={ ['*'] }
                        source={ { uri: chartPath } }
                        scrollEnabled={ false }
                        style={ styles.chartWebView }
                        androidHardwareAccelerationDisabled
                    />
                </PDView>
                <PDView style={ styles.labelContainer }>{getDateLabels()}</PDView>
            </PDView>
            {props.children}
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        paddingTop: 10,
        flex: 1,
        borderRadius: 8,
        paddingBottom: 10,
        minHeight: 225,
        maxWidth: 405,
    },
    title: {
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    chartContainer: {
        paddingHorizontal: 15,
        alignItems: 'center',
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    chartWebViewContainer: {
        flex: 1,
        height: 225,
        width: '100%',
        marginHorizontal: 15,
        overflow: 'hidden',
    },
    chartWebView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    labelText: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
});
