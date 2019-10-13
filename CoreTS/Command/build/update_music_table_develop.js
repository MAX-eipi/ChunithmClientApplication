/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/update_music_table.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../ChunithmClientLibrary/CoreTS/src/ChunithmNetConnector.ts":
/*!*******************************************************************!*\
  !*** ../ChunithmClientLibrary/CoreTS/src/ChunithmNetConnector.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TIME_OUT = 10000;
class ChunithmNetConnector {
    static post(localPath, payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: ChunithmNetConnector.createUrl(localPath),
                data: payload,
                timeout: TIME_OUT,
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        });
    }
    static createUrl(localPath) {
        return "https://chunithm-net.com/mobile/" + localPath;
    }
    static getToken(document) {
        return document.getElementsByName("token")[0].getAttribute("value");
    }
}
exports.ChunithmNetConnector = ChunithmNetConnector;


/***/ }),

/***/ "../ChunithmClientLibrary/CoreTS/src/HtmlParseUtility.ts":
/*!***************************************************************!*\
  !*** ../ChunithmClientLibrary/CoreTS/src/HtmlParseUtility.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = __webpack_require__(/*! ./Utility */ "../ChunithmClientLibrary/CoreTS/src/Utility.ts");
class HtmlParseUtility {
    static getPageTitle(document) {
        if (!document) {
            return "";
        }
        let e1 = document.getElementById("page_title");
        if (!e1) {
            return "";
        }
        return e1.textContent;
    }
    static getMusicTitle(content) {
        let e1 = content.getElementsByClassName("music_title");
        if (!e1 || !e1[0]) {
            return Utility_1.DefaultParameter.musicName;
        }
        let e2 = e1[0];
        return e2.textContent;
    }
    static getPlayMusicDataTitle(content) {
        let e1 = content.getElementsByClassName("play_musicdata_title");
        if (!e1 || !e1[0]) {
            return Utility_1.DefaultParameter.musicName;
        }
        let e2 = e1[0];
        return e2.textContent;
    }
    static getMusicId(content, className) {
        if (!className) {
            let e1 = content.getElementsByTagName("input");
            if (!e1) {
                return Utility_1.DefaultParameter.id;
            }
            for (var i = 0; i < e1.length; i++) {
                if (e1[i] && e1[i].getAttribute("name") == "idx") {
                    var idText = e1[i].getAttribute("value");
                    var id = parseInt(idText);
                    return id ? id : Utility_1.DefaultParameter.id;
                }
            }
            return Utility_1.DefaultParameter.id;
        }
        else {
            let e1 = content.getElementsByClassName(className);
            if (!e1 || !e1[0]) {
                return Utility_1.DefaultParameter.id;
            }
            let e2 = e1[0];
            let onclick = e2.getAttribute("onclick");
            if (!onclick) {
                return Utility_1.DefaultParameter.id;
            }
            let match = onclick.match(/musicId_(\d+)/);
            if (!match || !match[1]) {
                return Utility_1.DefaultParameter.id;
            }
            let id = parseInt(match[1]);
            if (!id && id !== 0) {
                return Utility_1.DefaultParameter.id;
            }
            return id;
        }
    }
    static getWorldsEndMusicId(content) {
        return HtmlParseUtility.getMusicId(content, "musiclist_worldsend_title");
    }
    static getPlayMusicDataHighScore(content) {
        let e1 = content.querySelector(".play_musicdata_highscore > .text_b");
        let scoreText = e1 ? e1.textContent : null;
        return Utility_1.parseScore(scoreText);
    }
    static getPlayMusicDataScore(content) {
        let e1 = content.getElementsByClassName("play_musicdata_score_text");
        let e2 = e1 ? e1[0] : null;
        let scoreText = e2 ? e2.textContent.replace("Score：", "") : null;
        return Utility_1.parseScore(scoreText);
    }
    static getScoreFromMusicDetail(content) {
        let e1 = content.getElementsByClassName("block_underline");
        let e2 = e1 ? e1[0] : null;
        let e3 = e2 ? e2.getElementsByTagName("span") : null;
        let e4 = e3 ? e3[1] : null;
        let scoreText = e4 ? e4.textContent : null;
        return Utility_1.parseScore(scoreText);
    }
    static getDifficulty(content) {
        if (content.className.indexOf("master") !== -1) {
            return Utility_1.Difficulty.Master;
        }
        else if (content.className.indexOf("expert") !== -1) {
            return Utility_1.Difficulty.Expert;
        }
        else if (content.className.indexOf("advanced") !== -1) {
            return Utility_1.Difficulty.Advanced;
        }
        else if (content.className.indexOf("basic") !== -1) {
            return Utility_1.Difficulty.Basic;
        }
        else if (content.className.indexOf("world_end") !== -1) {
            return Utility_1.Difficulty.WorldsEnd;
        }
        return Utility_1.DefaultParameter.difficulty;
    }
    static getDifficultyFromPlayTrackResult(content) {
        let e1 = content.getElementsByClassName("play_track_result");
        let e2 = e1 ? e1[0] : null;
        let e3 = e2 ? e2.getElementsByTagName("img") : null;
        let e4 = e3 ? e3[0] : null;
        let difficultyText = e4 ? e4.getAttribute("src") : null;
        if (!difficultyText) {
            return Utility_1.DefaultParameter.difficulty;
        }
        if (difficultyText.indexOf("basic") !== -1) {
            return Utility_1.Difficulty.Basic;
        }
        else if (difficultyText.indexOf("advanced") !== -1) {
            return Utility_1.Difficulty.Advanced;
        }
        else if (difficultyText.indexOf("expert") !== -1) {
            return Utility_1.Difficulty.Expert;
        }
        else if (difficultyText.indexOf("master") !== -1) {
            return Utility_1.Difficulty.Master;
        }
        else if (difficultyText.indexOf("worldsend") !== -1) {
            return Utility_1.Difficulty.WorldsEnd;
        }
        return Utility_1.DefaultParameter.difficulty;
    }
    static getIsNewRecord(content) {
        let e1 = content.getElementsByClassName("play_musicdata_score_img");
        let scoreImage = e1 ? e1[0] : null;
        let e2 = scoreImage ? scoreImage.getElementsByTagName("img") : null;
        let e3 = e2 ? e2[0] : null;
        let newRecord = e3 ? e3.getAttribute("src") : null;
        if (!newRecord) {
            return Utility_1.DefaultParameter.isNewRecord;
        }
        return newRecord.indexOf("icon_newrecord") !== -1;
    }
    static getRank(content) {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("icon_rank") !== -1) {
                let match = icon.match(/icon_rank_(\d+).png/);
                let rankCode = (match && match[1]) ? parseInt(match[1]) : null;
                return Utility_1.toRank(rankCode);
            }
        }
        return Utility_1.DefaultParameter.rank;
    }
    static getIsClear(content) {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("clear") !== -1) {
                return true;
            }
        }
        return Utility_1.DefaultParameter.isClear;
    }
    static getComboStatus(content) {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("alljustice") !== -1) {
                return Utility_1.ComboStatus.AllJustice;
            }
            else if (icon.indexOf("fullcombo") !== -1) {
                return Utility_1.ComboStatus.FullCombo;
            }
        }
        return Utility_1.DefaultParameter.comboStatus;
    }
    static getChainStatus(content) {
        let playMusicDataIcons = HtmlParseUtility.getPlayMusicDataIcons(content);
        for (var i = 0; i < playMusicDataIcons.length; i++) {
            let icon = playMusicDataIcons[i];
            if (icon.indexOf("fullchain2") !== -1) {
                return Utility_1.ChainStatus.FullChainGold;
            }
            else if (icon.indexOf("fullchain") !== -1) {
                return Utility_1.ChainStatus.FullChainPlatinum;
            }
        }
        return Utility_1.DefaultParameter.chainStatus;
    }
    static getPlayMusicDataIcons(content) {
        var e1 = content.getElementsByClassName("play_musicdata_icon");
        var e2 = e1 ? e1[0] : null;
        var e3 = e2 ? e2.getElementsByTagName("img") : null;
        if (!e3) {
            return new Array();
        }
        var playMusicDataIcons = new Array();
        for (var i = 0; i < e3.length; i++) {
            var icon = e3[i].getAttribute("src");
            if (icon) {
                playMusicDataIcons.push(icon);
            }
        }
        return playMusicDataIcons;
    }
    static getPlayDataListDate(content) {
        return HtmlParseUtility._getPlayDate(content, "play_datalist_date");
    }
    static getMusicDataDetailDate(content) {
        return HtmlParseUtility._getPlayDate(content, "musicdata_detail_date");
    }
    static getPlayDate(content) {
        return HtmlParseUtility._getPlayDate(content, "box_inner01");
    }
    static _getPlayDate(content, className) {
        let e1 = content.getElementsByClassName(className);
        let playDateText = (e1 && e1[0]) ? e1[0].textContent : null;
        if (!playDateText) {
            return Utility_1.DefaultParameter.playDate;
        }
        let playDateRegex = /(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/;
        let match = playDateText.match(playDateRegex);
        if (!match) {
            return Utility_1.DefaultParameter.playDate;
        }
        var year = parseInt(match[1]);
        var month = parseInt(match[2]);
        var day = parseInt(match[3]);
        var hour = parseInt(match[4]);
        var minute = parseInt(match[5]);
        if (year !== NaN && month !== NaN && day !== NaN && hour !== NaN && minute !== NaN) {
            return new Date(year, month - 1, day, hour, minute);
        }
        return Utility_1.DefaultParameter.playDate;
    }
    static getTrack(content) {
        let e1 = content.getElementsByClassName("play_track_text");
        let trackText = (e1 && e1[0]) ? e1[0].textContent.replace("Track ", "") : null;
        let track = parseInt(trackText);
        if (track === NaN) {
            return Utility_1.DefaultParameter.track;
        }
        return track;
    }
    static getImageName(content) {
        let e1 = content.getElementsByClassName("play_jacket_img");
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let imageName = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;
        return imageName ? imageName : Utility_1.DefaultParameter.imageName;
    }
    static getArtistName(content) {
        let e1 = content.getElementsByClassName("play_musicdata_artist");
        return (e1 && e1[0]) ? e1[0].textContent : Utility_1.DefaultParameter.artistName;
    }
    static getPlayCount(content) {
        let e1 = content.getElementsByClassName("block_underline");
        let e2 = (e1 && e1[1]) ? e1[1].getElementsByTagName("span") : null;
        let playCountText = (e2 && e2[1]) ? e2[1].textContent : null;
        let playCount = parseInt(playCountText);
        if (playCount === NaN) {
            return Utility_1.DefaultParameter.playCount;
        }
        return playCount;
    }
    static getWorldsEndLevelFromHighScoreRecord(content) {
        return HtmlParseUtility.getWorldsEndLevel(content, "musiclist_worldsend_star");
    }
    static getWorldsEndLevelFromMusicDetail(content) {
        return HtmlParseUtility.getWorldsEndLevel(content, "musiclist_worldsend_star2");
    }
    static getWorldsEndLevel(content, className) {
        let e1 = content.getElementsByClassName(className);
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let starImage = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;
        if (!starImage) {
            return Utility_1.DefaultParameter.worldsEndLevel;
        }
        let match = starImage.match(/icon_we_star(\d+).png/);
        let level = match ? parseInt(match[1]) : NaN;
        return level !== NaN ? level : Utility_1.DefaultParameter.worldsEndLevel;
    }
    static getWorldsEndType(content, className) {
        let e1 = content.getElementsByClassName(className);
        let e2 = (e1 && e1[0]) ? e1[0].getElementsByTagName("img") : null;
        let typeImage = (e2 && e2[0]) ? e2[0].getAttribute("src") : null;
        if (!typeImage) {
            return Utility_1.DefaultParameter.worldsEndType;
        }
        var match = typeImage.match(/icon_we_(\d+).png/);
        var typeCode = match ? parseInt(match[1]) : NaN;
        return typeCode !== NaN ? Utility_1.toWorldsEndType(typeCode) : Utility_1.DefaultParameter.worldsEndType;
    }
}
exports.HtmlParseUtility = HtmlParseUtility;


/***/ }),

/***/ "../ChunithmClientLibrary/CoreTS/src/Utility.ts":
/*!******************************************************!*\
  !*** ../ChunithmClientLibrary/CoreTS/src/Utility.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["Invalid"] = 0] = "Invalid";
    Difficulty[Difficulty["Basic"] = 1] = "Basic";
    Difficulty[Difficulty["Advanced"] = 2] = "Advanced";
    Difficulty[Difficulty["Expert"] = 3] = "Expert";
    Difficulty[Difficulty["Master"] = 4] = "Master";
    Difficulty[Difficulty["WorldsEnd"] = 5] = "WorldsEnd";
})(Difficulty = exports.Difficulty || (exports.Difficulty = {}));
var Genre;
(function (Genre) {
    Genre[Genre["Invalid"] = 0] = "Invalid";
    Genre[Genre["POPS_AND_ANIME"] = 1] = "POPS_AND_ANIME";
    Genre[Genre["niconico"] = 2] = "niconico";
    Genre[Genre["\u6771\u65B9Project"] = 3] = "\u6771\u65B9Project";
    Genre[Genre["VARIETY"] = 4] = "VARIETY";
    Genre[Genre["\u30A4\u30ED\u30C9\u30EA\u30DF\u30C9\u30EA"] = 5] = "\u30A4\u30ED\u30C9\u30EA\u30DF\u30C9\u30EA";
    Genre[Genre["\u8A00\u30CE\u8449Project"] = 6] = "\u8A00\u30CE\u8449Project";
    Genre[Genre["ORIGINAL"] = 7] = "ORIGINAL";
    Genre[Genre["All"] = 8] = "All";
})(Genre = exports.Genre || (exports.Genre = {}));
var Rank;
(function (Rank) {
    Rank[Rank["None"] = 0] = "None";
    Rank[Rank["D"] = 1] = "D";
    Rank[Rank["C"] = 2] = "C";
    Rank[Rank["B"] = 3] = "B";
    Rank[Rank["BB"] = 4] = "BB";
    Rank[Rank["BBB"] = 5] = "BBB";
    Rank[Rank["A"] = 6] = "A";
    Rank[Rank["AA"] = 7] = "AA";
    Rank[Rank["AAA"] = 8] = "AAA";
    Rank[Rank["S"] = 9] = "S";
    Rank[Rank["SS"] = 10] = "SS";
    Rank[Rank["SSA"] = 11] = "SSA";
    Rank[Rank["SSS"] = 12] = "SSS";
    Rank[Rank["Max"] = 13] = "Max";
})(Rank = exports.Rank || (exports.Rank = {}));
var ComboStatus;
(function (ComboStatus) {
    ComboStatus[ComboStatus["None"] = 0] = "None";
    ComboStatus[ComboStatus["FullCombo"] = 1] = "FullCombo";
    ComboStatus[ComboStatus["AllJustice"] = 2] = "AllJustice";
})(ComboStatus = exports.ComboStatus || (exports.ComboStatus = {}));
var ChainStatus;
(function (ChainStatus) {
    ChainStatus[ChainStatus["None"] = 0] = "None";
    ChainStatus[ChainStatus["FullChainGold"] = 1] = "FullChainGold";
    ChainStatus[ChainStatus["FullChainPlatinum"] = 2] = "FullChainPlatinum";
})(ChainStatus = exports.ChainStatus || (exports.ChainStatus = {}));
var WorldsEndType;
(function (WorldsEndType) {
    WorldsEndType[WorldsEndType["Invalid"] = 0] = "Invalid";
    WorldsEndType[WorldsEndType["\u62DB"] = 1] = "\u62DB";
    WorldsEndType[WorldsEndType["\u72C2"] = 2] = "\u72C2";
    WorldsEndType[WorldsEndType["\u6B62"] = 3] = "\u6B62";
    WorldsEndType[WorldsEndType["\u6539"] = 4] = "\u6539";
    WorldsEndType[WorldsEndType["\u4E21"] = 5] = "\u4E21";
    WorldsEndType[WorldsEndType["\u5618"] = 6] = "\u5618";
    WorldsEndType[WorldsEndType["\u534A"] = 7] = "\u534A";
    WorldsEndType[WorldsEndType["\u6642"] = 8] = "\u6642";
    WorldsEndType[WorldsEndType["\u5149"] = 9] = "\u5149";
    WorldsEndType[WorldsEndType["\u5272"] = 10] = "\u5272";
    WorldsEndType[WorldsEndType["\u8DF3"] = 11] = "\u8DF3";
    WorldsEndType[WorldsEndType["\u5F3E"] = 12] = "\u5F3E";
    WorldsEndType[WorldsEndType["\u623B"] = 13] = "\u623B";
    WorldsEndType[WorldsEndType["\u4F38"] = 14] = "\u4F38";
    WorldsEndType[WorldsEndType["\u5E03"] = 15] = "\u5E03";
    WorldsEndType[WorldsEndType["\u6577"] = 16] = "\u6577";
    WorldsEndType[WorldsEndType["\u7FD4"] = 17] = "\u7FD4";
    WorldsEndType[WorldsEndType["\u8B0E"] = 18] = "\u8B0E";
    WorldsEndType[WorldsEndType["\u7591"] = 19] = "\u7591";
    WorldsEndType[WorldsEndType["\u9A5A"] = 20] = "\u9A5A";
    WorldsEndType[WorldsEndType["\u907F"] = 21] = "\u907F";
    WorldsEndType[WorldsEndType["\u901F"] = 22] = "\u901F";
    WorldsEndType[WorldsEndType["\u6B4C"] = 23] = "\u6B4C";
    WorldsEndType[WorldsEndType["\u6CA1"] = 24] = "\u6CA1";
    WorldsEndType[WorldsEndType["\u821E"] = 25] = "\u821E";
    WorldsEndType[WorldsEndType["\u4FFA"] = 26] = "\u4FFA";
    WorldsEndType[WorldsEndType["\u8535"] = 27] = "\u8535";
    WorldsEndType[WorldsEndType["\u899A"] = 28] = "\u899A";
})(WorldsEndType = exports.WorldsEndType || (exports.WorldsEndType = {}));
exports.RANK_MAX_BORDER_SCORE = 1010000;
exports.RANK_SSS_BORDER_SCORE = 1007500;
exports.RANK_SSA_BORDER_SCORE = 1005000;
exports.RANK_SS_BORDER_SCORE = 1000000;
exports.RANK_S_BORDER_SCORE = 975000;
exports.RANK_AAA_BORDER_SCORE = 950000;
exports.RANK_AA_BORDER_SCORE = 925000;
exports.RANK_A_BORDER_SCORE = 900000;
exports.RANK_BBB_BORDER_SCORE = 800000;
exports.RANK_BB_BORDER_SCORE = 700000;
exports.RANK_B_BORDER_SCORE = 600000;
exports.RANK_C_BORDER_SCORE = 500000;
exports.RANK_D_BORDER_SCORE = 0;
exports.RANK_NONE_BORDER_SCORE = 0;
exports.RANK_MAX_TEXT = "MAX";
exports.RANK_SSS_TEXT = "SSS";
exports.RANK_SSA_TEXT = "SS+";
exports.RANK_SS_TEXT = "SS";
exports.RANK_S_TEXT = "S";
exports.RANK_AAA_TEXT = "AAA";
exports.RANK_AA_TEXT = "AA";
exports.RANK_A_TEXT = "A";
exports.RANK_BBB_TEXT = "BBB";
exports.RANK_BB_TEXT = "BB";
exports.RANK_B_TEXT = "B";
exports.RANK_C_TEXT = "C";
exports.RANK_D_TEXT = "D";
exports.RANK_NONE_TEXT = "NONE";
exports.RANK_MAX_CODE = 10;
exports.RANK_SSS_CODE = 10;
exports.RANK_SSA_CODE = 9;
exports.RANK_SS_CODE = 9;
exports.RANK_S_CODE = 8;
exports.RANK_AAA_CODE = 7;
exports.RANK_AA_CODE = 6;
exports.RANK_A_CODE = 5;
exports.RANK_BBB_CODE = 4;
exports.RANK_BB_CODE = 3;
exports.RANK_B_CODE = 2;
exports.RANK_C_CODE = 1;
exports.RANK_D_CODE = 0;
exports.RANK_NONE_CODE = -1;
function getBorderScore(rank) {
    switch (rank) {
        case Rank.Max:
            return exports.RANK_MAX_BORDER_SCORE;
        case Rank.SSS:
            return exports.RANK_SSS_BORDER_SCORE;
        case Rank.SSA:
            return exports.RANK_SSA_BORDER_SCORE;
        case Rank.SS:
            return exports.RANK_SS_BORDER_SCORE;
        case Rank.S:
            return exports.RANK_S_BORDER_SCORE;
        case Rank.AAA:
            return exports.RANK_AAA_BORDER_SCORE;
        case Rank.AA:
            return exports.RANK_AA_BORDER_SCORE;
        case Rank.A:
            return exports.RANK_A_BORDER_SCORE;
        case Rank.BBB:
            return exports.RANK_BBB_BORDER_SCORE;
        case Rank.BB:
            return exports.RANK_BB_BORDER_SCORE;
        case Rank.B:
            return exports.RANK_B_BORDER_SCORE;
        case Rank.C:
            return exports.RANK_C_BORDER_SCORE;
        case Rank.D:
            return exports.RANK_D_BORDER_SCORE;
    }
    return exports.RANK_NONE_BORDER_SCORE;
}
exports.getBorderScore = getBorderScore;
function getRank(score) {
    if (score >= exports.RANK_MAX_BORDER_SCORE) {
        return Rank.Max;
    }
    else if (score >= exports.RANK_SSS_BORDER_SCORE) {
        return Rank.SSS;
    }
    else if (score >= exports.RANK_SSA_BORDER_SCORE) {
        return Rank.SSA;
    }
    else if (score >= exports.RANK_SS_BORDER_SCORE) {
        return Rank.SS;
    }
    else if (score >= exports.RANK_S_BORDER_SCORE) {
        return Rank.S;
    }
    else if (score >= exports.RANK_AAA_BORDER_SCORE) {
        return Rank.AAA;
    }
    else if (score >= exports.RANK_AA_BORDER_SCORE) {
        return Rank.AA;
    }
    else if (score >= exports.RANK_A_BORDER_SCORE) {
        return Rank.A;
    }
    else if (score >= exports.RANK_BBB_BORDER_SCORE) {
        return Rank.BBB;
    }
    else if (score >= exports.RANK_BB_BORDER_SCORE) {
        return Rank.BB;
    }
    else if (score >= exports.RANK_B_BORDER_SCORE) {
        return Rank.B;
    }
    else if (score >= exports.RANK_C_BORDER_SCORE) {
        return Rank.C;
    }
    else if (score >= exports.RANK_D_BORDER_SCORE) {
        return Rank.D;
    }
    return exports.RANK_NONE_BORDER_SCORE;
}
exports.getRank = getRank;
function toRank(rankCode) {
    switch (rankCode) {
        case exports.RANK_SSS_CODE:
            return Rank.SSS;
        case exports.RANK_SS_CODE:
            return Rank.SS;
        case exports.RANK_S_CODE:
            return Rank.S;
        case exports.RANK_AAA_CODE:
            return Rank.AAA;
        case exports.RANK_AA_CODE:
            return Rank.AA;
        case exports.RANK_A_CODE:
            return Rank.A;
        case exports.RANK_BBB_CODE:
            return Rank.BBB;
        case exports.RANK_BB_CODE:
            return Rank.BB;
        case exports.RANK_B_CODE:
            return Rank.B;
        case exports.RANK_C_CODE:
            return Rank.C;
        case exports.RANK_D_CODE:
            return Rank.D;
    }
    return Rank.None;
}
exports.toRank = toRank;
function toRankText(rank) {
    switch (rank) {
        case Rank.Max:
            return exports.RANK_MAX_TEXT;
        case Rank.SSS:
            return exports.RANK_SSS_TEXT;
        case Rank.SSA:
            return exports.RANK_SSA_TEXT;
        case Rank.SS:
            return exports.RANK_SS_TEXT;
        case Rank.S:
            return exports.RANK_S_TEXT;
        case Rank.AAA:
            return exports.RANK_AAA_TEXT;
        case Rank.AA:
            return exports.RANK_AA_TEXT;
        case Rank.A:
            return exports.RANK_A_TEXT;
        case Rank.BBB:
            return exports.RANK_BBB_TEXT;
        case Rank.BB:
            return exports.RANK_BB_TEXT;
        case Rank.B:
            return exports.RANK_B_TEXT;
        case Rank.C:
            return exports.RANK_C_TEXT;
        case Rank.D:
            return exports.RANK_D_TEXT;
        case Rank.None:
            return exports.RANK_NONE_TEXT;
    }
}
exports.toRankText = toRankText;
function toRankCode(value) {
    if (typeof value === "number") {
        switch (value) {
            case Rank.Max:
                return exports.RANK_MAX_CODE;
            case Rank.SSS:
                return exports.RANK_SSS_CODE;
            case Rank.SSA:
                return exports.RANK_SSA_CODE;
            case Rank.SS:
                return exports.RANK_SS_CODE;
            case Rank.S:
                return exports.RANK_S_CODE;
            case Rank.AAA:
                return exports.RANK_AAA_CODE;
            case Rank.AA:
                return exports.RANK_AA_CODE;
            case Rank.A:
                return exports.RANK_A_CODE;
            case Rank.BBB:
                return exports.RANK_BBB_CODE;
            case Rank.BB:
                return exports.RANK_BB_CODE;
            case Rank.B:
                return exports.RANK_B_CODE;
            case Rank.C:
                return exports.RANK_C_CODE;
            case Rank.D:
                return exports.RANK_D_CODE;
            case Rank.None:
                return exports.RANK_NONE_CODE;
        }
    }
    else if (typeof value === "string") {
        switch (value) {
            case exports.RANK_SSS_TEXT:
                return exports.RANK_SSS_CODE;
            case exports.RANK_SS_TEXT:
                return exports.RANK_SS_CODE;
            case exports.RANK_S_TEXT:
                return exports.RANK_S_CODE;
            case exports.RANK_AAA_TEXT:
                return exports.RANK_AAA_CODE;
            case exports.RANK_AA_TEXT:
                return exports.RANK_AA_CODE;
            case exports.RANK_A_TEXT:
                return exports.RANK_A_CODE;
            case exports.RANK_BBB_TEXT:
                return exports.RANK_BBB_CODE;
            case exports.RANK_BB_TEXT:
                return exports.RANK_BB_CODE;
            case exports.RANK_B_TEXT:
                return exports.RANK_B_CODE;
            case exports.RANK_C_TEXT:
                return exports.RANK_C_CODE;
            case exports.RANK_D_TEXT:
                return exports.RANK_D_CODE;
        }
        return exports.RANK_NONE_CODE;
    }
}
exports.toRankCode = toRankCode;
class DefaultParameter {
}
DefaultParameter.id = -1;
DefaultParameter.musicName = "";
DefaultParameter.artistName = "";
DefaultParameter.imageName = "";
DefaultParameter.genre = Genre.Invalid;
DefaultParameter.difficulty = Difficulty.Invalid;
DefaultParameter.level = 0;
DefaultParameter.worldsEndLevel = -1;
DefaultParameter.worldsEndType = WorldsEndType.Invalid;
DefaultParameter.score = 0;
DefaultParameter.rank = Rank.None;
DefaultParameter.baseRating = 0;
DefaultParameter.rating = 0;
DefaultParameter.isNewRecord = false;
DefaultParameter.isClear = false;
DefaultParameter.comboStatus = ComboStatus.None;
DefaultParameter.chainStatus = ChainStatus.None;
DefaultParameter.track = 0;
DefaultParameter.playDate = new Date(0);
DefaultParameter.playCount = 0;
DefaultParameter.storeName = "";
DefaultParameter.characterName = "";
DefaultParameter.skillName = "";
DefaultParameter.skillLevel = 0;
DefaultParameter.skillResult = 0;
DefaultParameter.maxCombo = 0;
DefaultParameter.justiceCriticalCount = 0;
DefaultParameter.justiceCount = 0;
DefaultParameter.attackCount = 0;
DefaultParameter.missCount = 0;
DefaultParameter.tapPercentage = 0;
DefaultParameter.holdPercentage = 0;
DefaultParameter.slidePercentage = 0;
DefaultParameter.airPercentage = 0;
DefaultParameter.flickPercentage = 0;
exports.DefaultParameter = DefaultParameter;
function parseScore(scoreText) {
    if (!scoreText) {
        return DefaultParameter.score;
    }
    var score = parseInt(scoreText.replace(/,/g, ""));
    if (!score) {
        return DefaultParameter.score;
    }
    return score;
}
exports.parseScore = parseScore;
function parseNumber(text, defaultValue = NaN) {
    if (!text) {
        return defaultValue;
    }
    var num = parseInt(text.replace(/,/g, ""));
    if (!num) {
        return defaultValue;
    }
    return num;
}
exports.parseNumber = parseNumber;
function toGenre(genreName) {
    switch (genreName) {
        case "POPS & ANIME":
            return Genre.POPS_AND_ANIME;
        case "niconico":
            return Genre.niconico;
        case "東方Project":
            return Genre.東方Project;
        case "VARIETY":
            return Genre.VARIETY;
        case "イロドリミドリ":
            return Genre.イロドリミドリ;
        case "言ノ葉Project":
            return Genre.言ノ葉Project;
        case "ORIGINAL":
            return Genre.ORIGINAL;
        case "ALL":
            return Genre.All;
    }
    return Genre.Invalid;
}
exports.toGenre = toGenre;
function toWorldsEndType(typeCode) {
    return DefaultParameter.worldsEndType;
}
exports.toWorldsEndType = toWorldsEndType;
function getBorderBaseRating(levelText) {
    var integer = 0;
    var decimal = 0;
    if (levelText.indexOf("+") !== -1) {
        decimal = 0.7;
    }
    levelText = levelText.replace("+", "");
    integer = parseInt(levelText);
    if (integer === NaN) {
        return DefaultParameter.baseRating;
    }
    return integer + decimal;
}
exports.getBorderBaseRating = getBorderBaseRating;
function toDocument(html) {
    return (new DOMParser()).parseFromString(html, "text/html");
}
exports.toDocument = toDocument;


/***/ }),

/***/ "../ChunithmClientLibrary/CoreTS/src/musicGenre.ts":
/*!*********************************************************!*\
  !*** ../ChunithmClientLibrary/CoreTS/src/musicGenre.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HtmlParseUtility_1 = __webpack_require__(/*! ./HtmlParseUtility */ "../ChunithmClientLibrary/CoreTS/src/HtmlParseUtility.ts");
const Utility_1 = __webpack_require__(/*! ./Utility */ "../ChunithmClientLibrary/CoreTS/src/Utility.ts");
var MusicGenre;
(function (MusicGenre) {
    class DataUnit {
        constructor() {
            this.id = Utility_1.DefaultParameter.id;
            this.name = Utility_1.DefaultParameter.musicName;
            this.genre = Utility_1.DefaultParameter.genre;
            this.difficulty = Utility_1.DefaultParameter.difficulty;
            this.score = Utility_1.DefaultParameter.score;
            this.rank = Utility_1.DefaultParameter.rank;
            this.isClear = Utility_1.DefaultParameter.isClear;
            this.comboStatus = Utility_1.DefaultParameter.comboStatus;
            this.chainStatus = Utility_1.DefaultParameter.chainStatus;
        }
    }
    MusicGenre.DataUnit = DataUnit;
    class Data {
        constructor() {
            this.units = new Array();
        }
    }
    MusicGenre.Data = Data;
    class Parser {
        parse(document) {
            if (document == null) {
                throw { message: "argument null exception" };
            }
            if (!this.isValidDocument(document)) {
                return null;
            }
            var scoreListResult = document.getElementById("scoreList_result");
            if (scoreListResult == null) {
                return null;
            }
            var musicDetail = document.getElementById("inner");
            if (musicDetail == null) {
                return null;
            }
            var musicGenre = new Data();
            musicGenre.musicCount = this.getMusicCount(scoreListResult);
            musicGenre.clearCount = this.getClearCount(scoreListResult);
            musicGenre.sCount = this.getSCount(scoreListResult);
            musicGenre.ssCount = this.getSsCount(scoreListResult);
            musicGenre.sssCount = this.getSssCount(scoreListResult);
            musicGenre.fullComboCount = this.getFullComboCount(scoreListResult);
            musicGenre.allJusticeCount = this.getAllJusticeCount(scoreListResult);
            musicGenre.fullChainGoldCount = this.getFullChainGoldCount(scoreListResult);
            musicGenre.fullChainPlatinumCount = this.getFullChainPlatinumCount(scoreListResult);
            musicGenre.units = this.getUnits(musicDetail);
            return musicGenre;
        }
        isValidDocument(document) {
            return HtmlParseUtility_1.HtmlParseUtility.getPageTitle(document) == "楽曲別レコード";
        }
        getMusicCount(content) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_clear") !== -1) {
                    return score.denominator;
                }
            }
            return 0;
        }
        getClearCount(content) {
            return this.getNumerator(content, "icon_clear");
        }
        getSCount(content) {
            return this.getNumerator(content, "icon_rank_8");
        }
        getSsCount(content) {
            return this.getNumerator(content, "icon_rank_9");
        }
        getSssCount(content) {
            return this.getNumerator(content, "icon_rank_10");
        }
        getFullComboCount(content) {
            return this.getNumerator(content, "icon_fullcombo");
        }
        getAllJusticeCount(content) {
            return this.getNumerator(content, "icon_alljustice");
        }
        getFullChainGoldCount(content) {
            return this.getNumerator(content, "icon_fullchain2");
        }
        getFullChainPlatinumCount(content) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_fullchain") !== -1 && score.key.indexOf("icon_fullchain2") === -1) {
                    return score.numerator;
                }
            }
            return 0;
        }
        getNumerator(content, key) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf(key) !== -1) {
                    return score.numerator;
                }
            }
            return 0;
        }
        getScoreList(content) {
            var scoreListContents = content.getElementsByClassName("score_list");
            if (scoreListContents == null) {
                return new Array();
            }
            var getKey = (e) => {
                var e1 = e.getElementsByClassName("score_list_left");
                if (!e1 || e1.length == 0) {
                    return null;
                }
                var e2 = e1[0].getElementsByTagName("img");
                if (!e2 || e2.length == 0) {
                    return null;
                }
                var e3 = e2[0].getAttribute("src");
                if (!e3 || e3 == "") {
                    return null;
                }
                return e3;
            };
            var getValue = (e) => {
                var e1 = e.getElementsByClassName("score_list_right");
                if (!e1 || e1.length == 0) {
                    return null;
                }
                var values = e1[0].textContent.replace(" ", "").split("/");
                if (!values || values.length < 2) {
                    return null;
                }
                return {
                    numerator: parseInt(values[0]),
                    denominator: parseInt(values[1]),
                };
            };
            var scoreList = new Array();
            for (var i = 0; i < scoreListContents.length; i++) {
                let score = scoreListContents[i];
                let key = getKey(score);
                let value = getValue(score);
                if (!key || !value) {
                    continue;
                }
                scoreList.push({
                    key: key,
                    numerator: value.numerator,
                    denominator: value.denominator
                });
            }
            return scoreList;
        }
        getUnits(content) {
            var contents = content.getElementsByClassName("musiclist_box");
            if (contents == null) {
                return new Array();
            }
            var units = new Array();
            for (var i = 0; i < contents.length; i++) {
                units.push(this.parseUnit(contents[i], i));
            }
            return units;
        }
        parseUnit(content, index) {
            var unit = new DataUnit();
            unit.id = this.getId(content);
            unit.name = this.getName(content);
            unit.genre = this.getGenre(content);
            unit.difficulty = this.getDifficulty(content);
            unit.score = this.getScore(content);
            unit.rank = this.getRank(content);
            unit.isClear = this.getIsClear(content);
            unit.comboStatus = this.getComboStatus(content);
            unit.chainStatus = this.getChainStatus(content);
            return unit;
        }
        getId(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getMusicId(content);
        }
        getName(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getMusicTitle(content);
        }
        getGenre(content) {
            var e1 = content.parentElement.parentElement.getElementsByClassName("genre");
            var genreText = (e1 && e1[0]) ? e1[0].textContent : null;
            if (!genreText) {
                return Utility_1.DefaultParameter.genre;
            }
            return Utility_1.toGenre(genreText);
        }
        getDifficulty(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getDifficulty(content);
        }
        getScore(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getPlayMusicDataHighScore(content);
        }
        getRank(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getRank(content);
        }
        getIsClear(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getIsClear(content);
        }
        getComboStatus(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getComboStatus(content);
        }
        getChainStatus(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getChainStatus(content);
        }
    }
    MusicGenre.Parser = Parser;
})(MusicGenre = exports.MusicGenre || (exports.MusicGenre = {}));


/***/ }),

/***/ "../ChunithmClientLibrary/CoreTS/src/musicLevel.ts":
/*!*********************************************************!*\
  !*** ../ChunithmClientLibrary/CoreTS/src/musicLevel.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HtmlParseUtility_1 = __webpack_require__(/*! ./HtmlParseUtility */ "../ChunithmClientLibrary/CoreTS/src/HtmlParseUtility.ts");
const Utility_1 = __webpack_require__(/*! ./Utility */ "../ChunithmClientLibrary/CoreTS/src/Utility.ts");
var MusicLevel;
(function (MusicLevel) {
    class DataUnit {
        constructor() {
            this.id = Utility_1.DefaultParameter.id;
            this.name = Utility_1.DefaultParameter.musicName;
            this.difficulty = Utility_1.DefaultParameter.difficulty;
            this.level = Utility_1.DefaultParameter.level;
            this.score = Utility_1.DefaultParameter.score;
            this.rank = Utility_1.DefaultParameter.rank;
            this.isClear = Utility_1.DefaultParameter.isClear;
            this.comboStatus = Utility_1.DefaultParameter.comboStatus;
            this.chainStatus = Utility_1.DefaultParameter.chainStatus;
        }
    }
    MusicLevel.DataUnit = DataUnit;
    class Data {
        constructor() {
            this.units = new Array();
        }
    }
    MusicLevel.Data = Data;
    class Parser {
        parse(document) {
            if (document == null) {
                throw { message: "argument null exception" };
            }
            if (!this.isValidDocument(document)) {
                return null;
            }
            var scoreListResult = document.getElementById("scoreList_result");
            if (scoreListResult == null) {
                return null;
            }
            var musicDetail = document.getElementById("inner");
            if (musicDetail == null) {
                return null;
            }
            var musicLevel = new Data();
            musicLevel.musicCount = this.getMusicCount(scoreListResult);
            musicLevel.clearCount = this.getClearCount(scoreListResult);
            musicLevel.sCount = this.getSCount(scoreListResult);
            musicLevel.ssCount = this.getSsCount(scoreListResult);
            musicLevel.sssCount = this.getSssCount(scoreListResult);
            musicLevel.fullComboCount = this.getFullComboCount(scoreListResult);
            musicLevel.allJusticeCount = this.getAllJusticeCount(scoreListResult);
            musicLevel.fullChainGoldCount = this.getFullChainGoldCount(scoreListResult);
            musicLevel.fullChainPlatinumCount = this.getFullChainPlatinumCount(scoreListResult);
            musicLevel.units = this.getUnits(musicDetail);
            return musicLevel;
        }
        isValidDocument(document) {
            return HtmlParseUtility_1.HtmlParseUtility.getPageTitle(document) == "楽曲別レコード";
        }
        getMusicCount(content) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_clear") !== -1) {
                    return score.denominator;
                }
            }
            return 0;
        }
        getClearCount(content) {
            return this.getNumerator(content, "icon_clear");
        }
        getSCount(content) {
            return this.getNumerator(content, "icon_rank_8");
        }
        getSsCount(content) {
            return this.getNumerator(content, "icon_rank_9");
        }
        getSssCount(content) {
            return this.getNumerator(content, "icon_rank_10");
        }
        getFullComboCount(content) {
            return this.getNumerator(content, "icon_fullcombo");
        }
        getAllJusticeCount(content) {
            return this.getNumerator(content, "icon_alljustice");
        }
        getFullChainGoldCount(content) {
            return this.getNumerator(content, "icon_fullchain2");
        }
        getFullChainPlatinumCount(content) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf("icon_fullchain") !== -1 && score.key.indexOf("icon_fullchain2") === -1) {
                    return score.numerator;
                }
            }
            return 0;
        }
        getNumerator(content, key) {
            var scoreList = this.getScoreList(content);
            for (var i = 0; i < scoreList.length; i++) {
                let score = scoreList[i];
                if (score.key.indexOf(key) !== -1) {
                    return score.numerator;
                }
            }
            return 0;
        }
        getScoreList(content) {
            var scoreListContents = content.getElementsByClassName("score_list");
            if (scoreListContents == null) {
                return new Array();
            }
            var getKey = (e) => {
                var e1 = e.getElementsByClassName("score_list_left");
                if (!e1 || e1.length == 0) {
                    return null;
                }
                var e2 = e1[0].getElementsByTagName("img");
                if (!e2 || e2.length == 0) {
                    return null;
                }
                var e3 = e2[0].getAttribute("src");
                if (!e3 || e3 == "") {
                    return null;
                }
                return e3;
            };
            var getValue = (e) => {
                var e1 = e.getElementsByClassName("score_list_right");
                if (!e1 || e1.length == 0) {
                    return null;
                }
                var values = e1[0].textContent.replace(" ", "").split("/");
                if (!values || values.length < 2) {
                    return null;
                }
                return {
                    numerator: parseInt(values[0]),
                    denominator: parseInt(values[1]),
                };
            };
            var scoreList = new Array();
            for (var i = 0; i < scoreListContents.length; i++) {
                let score = scoreListContents[i];
                let key = getKey(score);
                let value = getValue(score);
                if (!key || !value) {
                    continue;
                }
                scoreList.push({
                    key: key,
                    numerator: value.numerator,
                    denominator: value.denominator
                });
            }
            return scoreList;
        }
        getUnits(content) {
            var contents = content.getElementsByClassName("musiclist_box");
            if (contents == null) {
                return new Array();
            }
            var units = new Array();
            for (var i = 0; i < contents.length; i++) {
                units.push(this.parseUnit(contents[i], i));
            }
            return units;
        }
        parseUnit(content, index) {
            var unit = new DataUnit();
            unit.id = this.getId(content);
            unit.name = this.getName(content);
            unit.difficulty = this.getDifficulty(content);
            unit.level = this.getLevel(content);
            unit.score = this.getScore(content);
            unit.rank = this.getRank(content);
            unit.isClear = this.getIsClear(content);
            unit.comboStatus = this.getComboStatus(content);
            unit.chainStatus = this.getChainStatus(content);
            return unit;
        }
        getId(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getMusicId(content);
        }
        getName(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getMusicTitle(content);
        }
        getDifficulty(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getDifficulty(content);
        }
        getLevel(content) {
            let e1 = content.parentElement.parentElement.getElementsByClassName("box01_title");
            let levelText = (e1 && e1[0]) ? e1[0].textContent.replace("LEVEL ", "") : null;
            if (!levelText) {
                return Utility_1.DefaultParameter.level;
            }
            return Utility_1.getBorderBaseRating(levelText);
        }
        getScore(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getPlayMusicDataHighScore(content);
        }
        getRank(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getRank(content);
        }
        getIsClear(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getIsClear(content);
        }
        getComboStatus(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getComboStatus(content);
        }
        getChainStatus(content) {
            return HtmlParseUtility_1.HtmlParseUtility.getChainStatus(content);
        }
    }
    MusicLevel.Parser = Parser;
})(MusicLevel = exports.MusicLevel || (exports.MusicLevel = {}));


/***/ }),

/***/ "./src/Connector.ts":
/*!**************************!*\
  !*** ./src/Connector.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Connector {
    constructor(url) {
        this.url = url;
    }
    post(payload) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: this.url,
                data: JSON.stringify(payload),
                timeout: Connector.TIME_OUT,
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        });
    }
}
Connector.DEVELOP_URL = "https://script.google.com/macros/s/AKfycbxujx4njFMXtNUKkzvCHIMz21RPt2F74XSzS5xgy9gkoFQ9l4A/exec";
Connector.RELEASE_URL = "https://script.google.com/macros/s/AKfycbwPX8T16HvB4Z26f8NXsT55Ixre2rV0wgnN_nx9/exec";
Connector.TIME_OUT = 10000;
exports.Connector = Connector;


/***/ }),

/***/ "./src/update_music_table.ts":
/*!***********************************!*\
  !*** ./src/update_music_table.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChunithmNetConnector_1 = __webpack_require__(/*! ../../ChunithmClientLibrary/CoreTS/src/ChunithmNetConnector */ "../ChunithmClientLibrary/CoreTS/src/ChunithmNetConnector.ts");
const musicGenre_1 = __webpack_require__(/*! ../../ChunithmClientLibrary/CoreTS/src/musicGenre */ "../ChunithmClientLibrary/CoreTS/src/musicGenre.ts");
const musicLevel_1 = __webpack_require__(/*! ../../ChunithmClientLibrary/CoreTS/src/musicLevel */ "../ChunithmClientLibrary/CoreTS/src/musicLevel.ts");
const Utility_1 = __webpack_require__(/*! ../../ChunithmClientLibrary/CoreTS/src/Utility */ "../ChunithmClientLibrary/CoreTS/src/Utility.ts");
const Connector_1 = __webpack_require__(/*! ./Connector */ "./src/Connector.ts");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let token = ChunithmNetConnector_1.ChunithmNetConnector.getToken(document);
        if (!token) {
            alert("トークンが取得できません。取得可能なページで再度実行してください。");
            return;
        }
        var musicDataTable = new Array();
        var musicListIndex = new Array();
        {
            let musicGenreResult = yield ChunithmNetConnector_1.ChunithmNetConnector.post("record/musicGenre/sendBasic", { genre: "99", token: token });
            if (!musicGenreResult) {
                alert("楽曲リストの取得に失敗しました");
                return;
            }
            let parser = new musicGenre_1.MusicGenre.Parser();
            var musicGenre = parser.parse(Utility_1.toDocument(musicGenreResult));
            for (let unit of musicGenre.units) {
                let musicId = unit.id.toString();
                musicListIndex.push(musicId);
                musicDataTable[musicId] = {
                    Id: unit.id,
                    Name: unit.name,
                    Genre: unit.genre,
                    BasicLevel: 0,
                    AdvancedLevel: 0,
                    ExpertLevel: 0,
                    MasterLevel: 0,
                    BasicVerified: false,
                    AdvancedVerified: false,
                    ExpertVerified: false,
                    MasterVerified: false,
                };
            }
        }
        {
            const MAX_LEVEL = 20;
            let musicLevelResult = new Array();
            for (var i = 0; i <= MAX_LEVEL; i++) {
                let level = i;
                musicLevelResult[i] = (yield ChunithmNetConnector_1.ChunithmNetConnector.post("record/musicLevel/sendSearch", { level: level.toString(), token: token }));
                if (!musicLevelResult[i]) {
                    alert("楽曲リストの取得に失敗しました");
                    return;
                }
            }
            let parser = new musicLevel_1.MusicLevel.Parser();
            for (var i = 0; i < musicLevelResult.length; i++) {
                let musicLevel = parser.parse(Utility_1.toDocument(musicLevelResult[i]));
                for (let unit of musicLevel.units) {
                    let musicId = unit.id.toString();
                    switch (unit.difficulty) {
                        case Utility_1.Difficulty.Basic:
                            musicDataTable[musicId].BasicLevel = unit.level;
                            break;
                        case Utility_1.Difficulty.Advanced:
                            musicDataTable[musicId].AdvancedLevel = unit.level;
                            break;
                        case Utility_1.Difficulty.Expert:
                            musicDataTable[musicId].ExpertLevel = unit.level;
                            break;
                        case Utility_1.Difficulty.Master:
                            musicDataTable[musicId].MasterLevel = unit.level;
                            break;
                    }
                }
            }
        }
        var musicList = new Array();
        for (let musicId of musicListIndex) {
            let unit = musicDataTable[musicId];
            musicList.push(unit);
        }
        let connector = new Connector_1.Connector(Connector_1.Connector.DEVELOP_URL);
        var updateResult = yield connector.post({ API: "table/update", MusicDatas: musicList });
        if (updateResult) {
            alert("楽曲リストの更新に成功しました");
        }
        else {
            alert("楽曲リストの更新に失敗しました");
        }
    });
})();


/***/ })

/******/ });