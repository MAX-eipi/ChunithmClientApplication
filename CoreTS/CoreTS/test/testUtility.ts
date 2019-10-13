import * as fs from 'fs-extra';
import { toDocument } from '../src/Utility';

export function readFile(path: string): string {
    return fs.readFileSync(path, { encoding: 'utf-8' });
}

export function loadResource(path: string): string {
    return readFile("../CHUNITHMRecordLeaderUnitTest/Resources/" + path);
}

export function loadDocument(path: string): Document {
    return toDocument(loadResource(path));
}