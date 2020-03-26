define(["require", "exports", "./MusicData", "./utility"], function (require, exports, MusicData_1, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MusicDataTable {
        constructor() {
            this.table = new Array();
            this.idMap = {};
            this.nameMap = {};
        }
        getTable() {
            return this.table;
        }
        getMusicDataById(id) {
            if (id !== 0 && !id) {
                return null;
            }
            let index = this.idMap[id.toString()];
            return this.getMusicDataByIndex(index);
        }
        getMusicDataByName(name) {
            let index = name ? this.nameMap[name] : null;
            return this.getMusicDataByIndex(index);
        }
        getMusicDataByIndex(index) {
            if (index !== 0 && !index) {
                return null;
            }
            return this.table[index];
        }
        updateMusicDatas(musicDatas) {
            var updatedMusicDatas = new Array();
            for (var i = 0; i < musicDatas.length; i++) {
                var updatedMusicData = this.updateMusicData(musicDatas[i]);
                if (updatedMusicData) {
                    updatedMusicDatas.push(updatedMusicData);
                }
            }
            return updatedMusicDatas;
        }
        updateMusicData(musicData) {
            if (!musicData) {
                return null;
            }
            let targetMusicData = this.getMusicDataByName(musicData.Name);
            if (!targetMusicData) {
                return null;
            }
            let difficulties = [
                utility_1.Difficulty.Basic,
                utility_1.Difficulty.Advanced,
                utility_1.Difficulty.Expert,
                utility_1.Difficulty.Master,
            ];
            for (var i = 0; i < difficulties.length; i++) {
                let difficulty = difficulties[i];
                if (!targetMusicData.getVerified(difficulty) && musicData.getLevel(difficulty) > 0 && musicData.getVerified(difficulty)) {
                    targetMusicData.setLevel(difficulty, musicData.getLevel(difficulty));
                    targetMusicData.setVerified(difficulty, true);
                }
            }
            return targetMusicData;
        }
        toJson() {
            return JSON.stringify({ MusicDatas: this.table });
        }
        static createByParameters(parameters) {
            let musicDataTable = new MusicDataTable();
            for (var i = 0; i < parameters.length; i++) {
                var musicData = MusicData_1.MusicData.createByParameter(parameters[i]);
                musicDataTable.table.push(musicData);
                musicDataTable.idMap[musicData.Id.toString()] = i;
                musicDataTable.nameMap[musicData.Name] = i;
            }
            return musicDataTable;
        }
        static createBySheet(sheet) {
            let musicDataTable = new MusicDataTable();
            let rows = sheet.getDataRange().getValues();
            for (var i = 1; i < rows.length; i++) {
                let musicData = MusicData_1.MusicData.createByRow(rows[i]);
                let index = i - 1;
                musicDataTable.table.push(musicData);
                musicDataTable.idMap[musicData.Id.toString()] = index;
                musicDataTable.nameMap[musicData.Name] = index;
            }
            return musicDataTable;
        }
        static createByJson(json) {
            let musicDataTable = new MusicDataTable();
            let musicDatas = JSON.parse(json).MusicDatas;
            for (var i = 0; i < musicDatas.length; i++) {
                let musicData = MusicData_1.MusicData.createByParameter(musicDatas[i]);
                musicDataTable.table.push(musicData);
                musicDataTable.idMap[musicData.Id.toString()] = i;
                musicDataTable.nameMap[musicData.Name] = i;
            }
            return musicDataTable;
        }
        static mergeMusicDataTable(oldMusicDataTable, newMusicDataTable) {
            let musicDataTable = new MusicDataTable();
            let newTable = newMusicDataTable.getTable();
            for (var i = 0; i < newTable.length; i++) {
                let musicData = new MusicData_1.MusicData();
                let oldMusicData = oldMusicDataTable.getMusicDataById(newTable[i].Id);
                musicData.Id = newTable[i].Id;
                musicData.Name = newTable[i].Name || (oldMusicData ? oldMusicData.Name : "");
                musicData.Genre = newTable[i].Genre || (oldMusicData ? oldMusicData.Genre : "");
                musicData.setLevel(utility_1.Difficulty.Basic, oldMusicData ? oldMusicData.getLevel(utility_1.Difficulty.Basic) : newTable[i].getLevel(utility_1.Difficulty.Basic));
                musicData.setLevel(utility_1.Difficulty.Advanced, oldMusicData ? oldMusicData.getLevel(utility_1.Difficulty.Advanced) : newTable[i].getLevel(utility_1.Difficulty.Advanced));
                musicData.setLevel(utility_1.Difficulty.Expert, oldMusicData ? oldMusicData.getLevel(utility_1.Difficulty.Expert) : newTable[i].getLevel(utility_1.Difficulty.Expert));
                musicData.setLevel(utility_1.Difficulty.Master, oldMusicData ? oldMusicData.getLevel(utility_1.Difficulty.Master) : newTable[i].getLevel(utility_1.Difficulty.Master));
                musicData.setVerified(utility_1.Difficulty.Basic, oldMusicData ? oldMusicData.getVerified(utility_1.Difficulty.Basic) : false);
                musicData.setVerified(utility_1.Difficulty.Advanced, oldMusicData ? oldMusicData.getVerified(utility_1.Difficulty.Advanced) : false);
                musicData.setVerified(utility_1.Difficulty.Expert, oldMusicData ? oldMusicData.getVerified(utility_1.Difficulty.Expert) : false);
                musicData.setVerified(utility_1.Difficulty.Master, oldMusicData ? oldMusicData.getVerified(utility_1.Difficulty.Master) : false);
                musicDataTable.table.push(musicData);
                let index = i;
                musicDataTable.idMap[musicData.Id.toString()] = index;
                musicDataTable.nameMap[musicData.Name] = index;
            }
            return musicDataTable;
        }
    }
    exports.MusicDataTable = MusicDataTable;
});
