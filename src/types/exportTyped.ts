import { DataBase, Config } from '../types/types';
import testDatabase from '../queries/testDb.json';
import configUntyped from '../config/config.json';

export const database = testDatabase as DataBase;
export const config = configUntyped as Config;
