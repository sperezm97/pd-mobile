// Script that pulls the latest version of each recipe for caching.
import { DevConfig, ProdConfig } from '../../Config/Network';
import { ApolloClient } from 'apollo-client';
import { devFormulaMap, FormulaMap, prodFormulaMap } from './masterMap';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import { FormulaAPI } from '../../gql/FormulaAPI';
import { LatestFormula } from '../../gql/generated/LatestFormula';
import { RS } from '../../RecipeUtil';
import { FormulaKey } from '../../../models/recipe/FormulaKey';
import { WaterTypeValue } from '../../../models/Pool/WaterType';
import fs from 'fs';
import { FormulaTransformer } from '../../gql/FormulaTransformer';

export type FormulaKeyMap = Record<WaterTypeValue, FormulaKey[]>;

export const preload = async (isProd: boolean) => {

    const config = isProd ? ProdConfig : DevConfig;
    const formulaIdMap = isProd ? prodFormulaMap : devFormulaMap;
    const formulaIdList = getIdsFromMap(formulaIdMap);
    const fileName = isProd ? 'prod_formulas.json' : 'dev_formulas.json';
    const filePath = `src/services/formulas/preload/generated/${fileName}`;

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: createHttpLink({
            uri: config.gql_url,
            fetch: fetch as any,        // yikes!
        }),
        defaultOptions: { query: { fetchPolicy: 'no-cache' } },
    });

    const fetchAll = formulaIdList.map(async f => {
        console.log('fetching: ' + f);
        const result = await client.query<LatestFormula>({ query: FormulaAPI.fetchLatestFormulaQuery, variables: { id: f } });
        return result.data.latestFormula;
    });

    const formulas = (await Promise.all(fetchAll)).map(FormulaTransformer.fromAPI);
    const formulaKeys = formulas.map(f => RS.getKey(f));

    const formulaKeysMap = getMapWithKeysInsteadOfIds(formulaIdMap, formulaKeys);

    const content = JSON.stringify({
        defaultFormulaKeys: formulaKeysMap,
        formulas,
    });

    try {
        fs.writeFileSync(filePath, content);
    } catch (err) {
        console.error(err);
    }
};

const getIdsFromMap = (input: FormulaMap): string[] => {
    const waterTypes = Object.keys(input) as WaterTypeValue[];
    let uniqueIds = new Set<string>();

    waterTypes.forEach(wt => {
        input[wt].forEach(fid => {
            uniqueIds.add(fid);
        });
    });

    return Array.from(uniqueIds);
};

const getMapWithKeysInsteadOfIds = (fm: FormulaMap, keys: FormulaKey[]): FormulaKeyMap => {
    const waterTypes = Object.keys(fm) as WaterTypeValue[];
    const res = {};

    waterTypes.forEach((wt) => {
        res[wt] = fm[wt].map(id => findKeyForId(id, keys)).filter(k => !!k);
    });
    return res as any;
};

const findKeyForId = (id: string, keys: FormulaKey[]): FormulaKey | null => {
    return keys.find(k => k.substr(0, id.length) === id) ?? null;
};

const loadAllEnvironments = async () => {
    console.log('packaging dev formulas...');
    await preload(false);
    console.log('packaging prod formulas...');
    await preload(true);
    console.log('done!');
};

loadAllEnvironments();
