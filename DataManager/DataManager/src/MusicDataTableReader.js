define(["require", "exports", "./MusicDataTable"], function (require, exports, MusicDataTable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MusicDataTableReader {
        readFromTable(sheet) {
            return MusicDataTable_1.MusicDataTable.createBySheet(sheet);
        }
    }
    exports.MusicDataTableReader = MusicDataTableReader;
});
