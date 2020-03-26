define(["require", "exports", "./MusicData", "./MusicDataTable", "./MusicDataTableWriter"], function (require, exports, MusicData_1, MusicDataTable_1, MusicDataTableWriter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Instance {
        constructor(config) {
            this.config = config;
        }
        updateTable(parameters) {
            let sheet = this.config.musicDataSheet;
            let oldMusicDataTable = MusicDataTable_1.MusicDataTable.createBySheet(sheet);
            let newMusicDataTable = MusicDataTable_1.MusicDataTable.createByParameters(parameters);
            let musicDataTable = MusicDataTable_1.MusicDataTable.mergeMusicDataTable(oldMusicDataTable, newMusicDataTable);
            let writer = new MusicDataTableWriter_1.MusicDataTableWriter(musicDataTable);
            writer.writeTable(sheet);
            return musicDataTable;
        }
        getTable() {
            let sheet = this.config.musicDataSheet;
            let musicDataTable = MusicDataTable_1.MusicDataTable.createBySheet(sheet);
            return musicDataTable;
        }
        updateMusicData(parameters) {
            let sheet = this.config.musicDataSheet;
            let musicDataTable = MusicDataTable_1.MusicDataTable.createBySheet(sheet);
            let musicDatas = parameters.map(function (p) { return MusicData_1.MusicData.createByParameter(p); });
            let updated = musicDataTable.updateMusicDatas(musicDatas);
            let writer = new MusicDataTableWriter_1.MusicDataTableWriter(musicDataTable);
            writer.writeTable(sheet);
            return updated;
        }
    }
    exports.Instance = Instance;
});
