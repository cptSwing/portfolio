import { DataBase, Config } from '../types/types';
import testDatabaseUntyped from '../queries/testDb.json';
import configUntyped from '../config/config.json';

export const database = testDatabaseUntyped as DataBase;
export const config = configUntyped as Config;
