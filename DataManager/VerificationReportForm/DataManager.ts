import * as MD from "../DataManager/src/MusicData";
import * as MDT from "../DataManager/src/MusicDataTable";
import * as MDTW from "../DataManager/src/MusicDataTableWriter";
import * as UTIL from "../DataManager/src/utility";
import * as INSTANCE from "../DataManager/src/Instance";
import * as CONFIG from "../DataManager/src/Configuration";

export const Instance = INSTANCE.Instance;
export type Instance = INSTANCE.Instance;

export type Configuration = CONFIG.Configuration;

export const MusicData = MD.MusicData;
export type MusicData = MD.MusicData;

export const MusicDataTable = MDT.MusicDataTable;
export type MusicDataTable = MDT.MusicDataTable;

export const MusicDataTableWriter = MDTW.MusicDataTableWriter;

export const Difficulty = UTIL.Difficulty;
export type Difficulty = UTIL.Difficulty;

export const Genre = UTIL.Genre;
export type Genre = UTIL.Genre;

export const toGenreText = UTIL.toGenreText;