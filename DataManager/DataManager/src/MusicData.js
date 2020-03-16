define(["require", "exports", "./utility"], function (require, exports, utility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MusicData {
        constructor() {
            this.Id = -1;
            this.Name = "";
            this.Genre = "";
            this.BasicLevel = 0;
            this.AdvancedLevel = 0;
            this.ExpertLevel = 0;
            this.MasterLevel = 0;
            this.BasicVerified = false;
            this.AdvancedVerified = false;
            this.ExpertVerified = false;
            this.MasterVerified = false;
        }
        getLevel(difficulty) {
            switch (difficulty) {
                case utility_1.Difficulty.Basic:
                    return this.BasicLevel;
                case utility_1.Difficulty.Advanced:
                    return this.AdvancedLevel;
                case utility_1.Difficulty.Expert:
                    return this.ExpertLevel;
                case utility_1.Difficulty.Master:
                    return this.MasterLevel;
            }
            return 0;
        }
        setLevel(difficulty, level) {
            switch (difficulty) {
                case utility_1.Difficulty.Basic:
                    this.BasicLevel = level;
                    break;
                case utility_1.Difficulty.Advanced:
                    this.AdvancedLevel = level;
                    break;
                case utility_1.Difficulty.Expert:
                    this.ExpertLevel = level;
                    break;
                case utility_1.Difficulty.Master:
                    this.MasterLevel = level;
                    break;
            }
        }
        getVerified(difficulty) {
            switch (difficulty) {
                case utility_1.Difficulty.Basic:
                    return this.BasicVerified;
                case utility_1.Difficulty.Advanced:
                    return this.AdvancedVerified;
                case utility_1.Difficulty.Expert:
                    return this.ExpertVerified;
                case utility_1.Difficulty.Master:
                    return this.MasterVerified;
            }
            return false;
        }
        setVerified(difficulty, verified) {
            switch (difficulty) {
                case utility_1.Difficulty.Basic:
                    this.BasicVerified = verified;
                    break;
                case utility_1.Difficulty.Advanced:
                    this.AdvancedVerified = verified;
                    break;
                case utility_1.Difficulty.Expert:
                    this.ExpertVerified = verified;
                    break;
                case utility_1.Difficulty.Master:
                    this.MasterVerified = verified;
                    break;
            }
        }
        clone() {
            return MusicData.createByParameter(this);
        }
        static createByParameter(parameter) {
            var musicData = new MusicData();
            musicData.Id = parameter.Id;
            musicData.Name = parameter.Name;
            musicData.Genre = parameter.Genre;
            musicData.BasicLevel = parameter.BasicLevel;
            musicData.AdvancedLevel = parameter.AdvancedLevel;
            musicData.ExpertLevel = parameter.ExpertLevel;
            musicData.MasterLevel = parameter.MasterLevel;
            musicData.BasicVerified = parameter.BasicVerified;
            musicData.AdvancedVerified = parameter.AdvancedVerified;
            musicData.ExpertVerified = parameter.ExpertVerified;
            musicData.MasterVerified = parameter.MasterVerified;
            return musicData;
        }
        static createByRow(row) {
            var musicData = new MusicData();
            musicData.Id = row[1];
            musicData.Name = row[2];
            musicData.Genre = row[3];
            musicData.BasicLevel = row[4];
            musicData.AdvancedLevel = row[5];
            musicData.ExpertLevel = row[6];
            musicData.MasterLevel = row[7];
            musicData.BasicVerified = row[8];
            musicData.AdvancedVerified = row[9];
            musicData.ExpertVerified = row[10];
            musicData.MasterVerified = row[11];
            return musicData;
        }
    }
    exports.MusicData = MusicData;
});
