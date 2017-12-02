import Share, { MultipleOptions, Options } from 'react-native-share';
import { Pool } from '~/models/Pool';
import { TempCsvRepo } from '~/repository/TempCsvRepo';

import { Config } from './Config/AppConfig';
import { DataService } from './DataService';
import { Util } from './Util';

export namespace ExportService {
    /// If a pool is provided, the csv is just for that pool.
    /// Otherwise, the csv will include all data for all pools.
    export const generateAndShareCSV = async (pool: Pool | null) => {
        let csvDataString = '';
        if (pool === null) {
            csvDataString = DataService.generateCsvFileForAllPools();
        } else {
            csvDataString = DataService.generateCsvFileForPool(pool);
        }

        if (Config.isAndroid) {
            await shareCSVAndroid(csvDataString);
        } else {
            await saveAndShareCSViOS(csvDataString);
        }
    };

    /// On iOS, the base64 encoded urls only work in some apps, but not in others (ex: mail).
    /// So, we temporarily write the file to disk, then share a handle to that file, and then
    /// (much later) delete the files.
    const saveAndShareCSViOS = async (stringData: string): Promise<void> => {
        const filePath = await TempCsvRepo.saveCSV(stringData);

        const sharableURL = `file://${filePath}`;

        const options: Options | MultipleOptions = {
            title: 'pooldash export',
            subject: 'pooldash export',
            url: sharableURL,
            // activityItemSources: [
            //     {
            //         placeholderItem: { type: 'url', content: sharableURL },
            //         item: {
            //             default: {
            //                 type: 'url',
            //                 content: sharableURL
            //             }
            //         },
            //         dataTypeIdentifier: { default: 'kUTTypeCommaSeparatedText' },
            //         subject: { default: `pooldash export` },
            //         linkMetadata: {
            //             title: 'pooldash export',
            //             originalUrl: sharableURL,
            //             url: sharableURL
            //         }
            //     }
            // ]
        };

        return await share(options);
    };

    /// On Android, it's more reliable to base64 encode the string into the url directly.
    /// I assume that this won't scale, and I'll have to figure out the proper mixture of
    /// project permissions & folder names eventually.
    const shareCSVAndroid = async (stringData: string): Promise<void> => {
        const fileData = Util.stringToBase64(stringData);
        const sharableURL = `data:text/comma-separated-values;base64,${fileData}`;
        const fileName = `pd-${new Date().toISOString()}`;

        const options: Options = {
            url: sharableURL,
            type: 'text/csv',
            filename: fileName,
        };

        return await share(options);
    };

    const share = async (options: Options): Promise<void> => {
        try {
            await Share.open(options);
        } catch (e) {
            console.error(e);
            return Promise.reject('Failed to share csv file.');
        }
    };
}
