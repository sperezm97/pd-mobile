import * as RNFS from 'react-native-fs';
import { Util } from '~/services/Util';

const csvFolderName = 'csv';
const secondsInDay = 86400;
const fileNamePrefix = 'pooldash_';
const fileNameSuffix = '.csv';

export namespace TempCsvRepo {
    /// Saves string as a csv file, returns the filepath
    /// Also cleans up old files older than 24 hrs.
    export const saveCSV = async (data: string): Promise<string> => {
        try {
            await ensureDirectoryExists();

            // Make some room if needed:
            await deleteOldFiles();

            // TODO: make this more robust? nah.
            const filename = fileNamePrefix + new Date().toISOString() + fileNameSuffix;
            const filePath = getFilepathForFilename(filename);

            await RNFS.writeFile(filePath, data, 'utf8');
            return filePath;
        } catch (e) {
            console.warn(JSON.stringify(e));
            return Promise.reject(e);
        }
    };

    export const readCSV = async (filePath: string): Promise<string> => {
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return Promise.reject('File does not exist!');
        }

        const fileData = await RNFS.readFile(filePath, 'utf8');
        return fileData;
    };

    export const ensureDirectoryExists = async (): Promise<void> => {
        const dirPath = `${RNFS.DocumentDirectoryPath}/${csvFolderName}`;
        const fileExists = await RNFS.exists(dirPath);
        if (!fileExists) {
            try {
                await RNFS.mkdir(dirPath);
            } catch (e) {
                console.warn(e);
                return Promise.reject(e);
            }
        }
    };

    const getFilepathForFilename = (filename: string): string => {
        const filePath = `${RNFS.DocumentDirectoryPath}/${csvFolderName}/${filename}`;
        return filePath;
    };

    // Deletes all files older than 24 hours
    const deleteOldFiles = async (): Promise<void> => {
        const folderPath = `${RNFS.DocumentDirectoryPath}/${csvFolderName}/`;
        const allCsvFiles = await RNFS.readDir(folderPath);

        const deletePromises: Promise<void>[] = [];

        allCsvFiles.forEach((file) => {
            const now = new Date();
            const dateStringFromFilename = Util.removePrefixIfPresent(
                fileNamePrefix,
                Util.removeSuffixIfPresent(fileNameSuffix, file.name),
            );
            const fileDate = new Date(dateStringFromFilename);
            const secondsSinceFileDate = (now.getTime() - fileDate.getTime()) / 1000;
            if (secondsSinceFileDate > secondsInDay) {
                deletePromises.push(deleteFile(file.path));
            }
        });

        await Promise.all(deletePromises);
    };

    const deleteFile = async (filePath: string): Promise<void> => {
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
            return;
        }
        try {
            await RNFS.unlink(filePath);
        } catch (e) {
            return Promise.reject(e);
        }
    };
}
