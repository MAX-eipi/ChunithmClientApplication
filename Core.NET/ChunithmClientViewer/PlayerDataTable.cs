using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlaylogRecord;
using ChunithmClientViewer.PlaylogDetailRecord;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChunithmClientViewer
{
    public class PlayerDataTable
    {
        private IChunithmNetConnector chunithmNetConnector;
        private ChunithmMusicDatabaseHttpClientConnector dataManagerConnector;

        public PlayerDataTable(IChunithmNetConnector chunithmNetConnector, ChunithmMusicDatabaseHttpClientConnector dataManagerConnector)
        {
            this.chunithmNetConnector = chunithmNetConnector ?? throw new ArgumentNullException(nameof(chunithmNetConnector));
            this.dataManagerConnector = dataManagerConnector ?? throw new ArgumentNullException(nameof(dataManagerConnector));
        }

        public async Task<ChunithmClientLibrary.PlayerRecord.IPlayerRecordContainer> UpdatePlayerRecordAsync()
        {
            await LoadGlobalMusicDataTable();

            DebugLogger.WriteLine("HighScoreRecord更新の開始");

            ChunithmClientLibrary.PlayerRecord.IPlayerRecordContainer record = new ChunithmClientLibrary.PlayerRecord.PlayerRecordContainer();

            var difficulties = new[]
            {
                Difficulty.Basic,
                Difficulty.Advanced,
                Difficulty.Expert,
                Difficulty.Master,
            };

            foreach (var difficulty in difficulties)
            {
                DebugLogger.WriteLine($"{difficulty} の取得");

                var musicGenre = chunithmNetConnector.GetMusicGenreAsync(Utility.GENRE_ALL_CODE, difficulty);
                await musicGenre;
                if (!musicGenre.Result.Success)
                {
                    throw new Exception($"{difficulty}の取得に失敗しました");
                }

                var highScoreRecordTable = new HighScoreRecordTable();
                highScoreRecordTable.Add(musicGenre.Result.MusicGenre);
                record.SetTable(highScoreRecordTable, difficulty);
            }

            return record;
        }


        public async Task UpdatePlaylogAsync()
        {
            await LoadGlobalMusicDataTable();

            DebugLogger.WriteLine("PlaylogDetailRecord更新の開始");
            List<TableUnit> savedPlaylogDetailRecordUnits = null;
            {
                var readAsync = ReadPlaylogDetailRecordAsync("./test.csv");
                await readAsync;
                savedPlaylogDetailRecordUnits = readAsync.Result;
            }

            DebugLogger.WriteLine("Playlog の取得");
            IPlaylogRecordTable<IPlaylogRecordTableUnit> playlogRecord = null;
            {
                var playlogSend = chunithmNetConnector.GetPlaylogAsync();
                await playlogSend;

                if (!playlogSend.Result.Success)
                {
                    throw new Exception("Playlogの取得に失敗しました");
                }

                var _playlogRecord= new PlaylogRecordTable();
                _playlogRecord.Add(playlogSend.Result.Playlog);
                playlogRecord = _playlogRecord;
            }

            List<TableUnit> updatedPlaylogDetailRecordUnits = null;
            {
                var getAsync = GetUpdatedPlaylogDetailRecordUnitsAsync(playlogRecord, savedPlaylogDetailRecordUnits.LastOrDefault());
                await getAsync;
                updatedPlaylogDetailRecordUnits = getAsync.Result;
            }

            if (updatedPlaylogDetailRecordUnits.Count == 0)
            {
                DebugLogger.WriteLine("更新データなし");
                return;
            }

            DebugLogger.WriteLine("楽曲別レコードテーブル生成");
            var playlogDetailRecordUnitsGroupByMusic = GroupByMusic(updatedPlaylogDetailRecordUnits);

            DebugLogger.WriteLine("楽曲別レコードテーブル書き込み");
            await WritePlaylogDetailRecordByMusic(updatedPlaylogDetailRecordUnits);

            DebugLogger.WriteLine("更新データ書き込み");
            {
                var record = new Table();

                foreach (var recordUnit in savedPlaylogDetailRecordUnits)
                {
                    record.RecordUnits.Add(recordUnit);
                }

                foreach (var recordUnit in updatedPlaylogDetailRecordUnits)
                {
                    record.RecordUnits.Add(recordUnit);
                }

                var writer = new TableCsvWriter();
                writer.Set(record);
                writer.Write("./test.csv");
            }

            DebugLogger.WriteLine("Done.");
        }

        private async Task LoadGlobalMusicDataTable()
        {
            if (Utility.GetGlobalMusicDataTable() == null)
            {
                DebugLogger.WriteLine("楽曲テーブルのダウンロード");
                var tableGet = dataManagerConnector.GetTableAsync();
                await tableGet;
                Utility.SetGlobalMusicDataTable(tableGet.Result.MusicDataTable);
            }
        }

        private async Task<List<TableUnit>> ReadPlaylogDetailRecordAsync(string path)
        {
            var playlogDetailRecordUnits = new List<TableUnit>();

            if (File.Exists(path))
            {
                var csv = "";
                using (var reader = new StreamReader(path, Encoding.UTF8))
                {
                    var readAsync = reader.ReadToEndAsync();
                    await readAsync;
                    csv = readAsync.Result;
                }

                if (!string.IsNullOrWhiteSpace(csv))
                {
                    var parser = new TableCsvReader();
                    try
                    {
                        var record = parser.Read(csv);
                        playlogDetailRecordUnits = new List<TableUnit>(record.RecordUnits);
                    }
                    catch (TableCsvReader.ParseException e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }

            return playlogDetailRecordUnits;
        }

        private async Task<List<TableUnit>> GetUpdatedPlaylogDetailRecordUnitsAsync(IPlaylogRecordTable<IPlaylogRecordTableUnit> playlogRecord, TableUnit lastPlaylogDetailRecordUnit)
        {
            var updatedPlaylogDetailRecordUnits = new List<TableUnit>();
            var lastPlayDate = lastPlaylogDetailRecordUnit?.PlaylogDetail?.PlayDate ?? new DateTime();
            var startNumber = lastPlaylogDetailRecordUnit?.Number + 1 ?? 1;
            var startPlayCount = lastPlaylogDetailRecordUnit?.PlayCount + 1 ?? 1;

            var tableUnits = playlogRecord.GetTableUnits().ToList();
            for (var i = 0; i < tableUnits.Count; i++)
            {
                if (tableUnits[i].PlayDate <= lastPlayDate)
                {
                    continue;
                }

                var index = tableUnits.Count - (i + 1);
                DebugLogger.WriteLine("PlaylogDetailの取得 Index : {0}", index);
                var sendAsync = chunithmNetConnector.GetPlaylogDetailAsync(index);
                await sendAsync;

                var playlogDetail = sendAsync.Result;
                if (!playlogDetail.Success)
                {
                    throw new Exception($"PlaylogDetail[{index}]の取得に失敗しました");
                }

                var recordUnit = new TableUnit();
                recordUnit.Number = startNumber + updatedPlaylogDetailRecordUnits.Count;
                recordUnit.PlayCount = startPlayCount + updatedPlaylogDetailRecordUnits.Count;
                recordUnit.PlaylogDetail = playlogDetail.PlaylogDetail;
                updatedPlaylogDetailRecordUnits.Add(recordUnit);
            }

            return updatedPlaylogDetailRecordUnits;
        }

        private Dictionary<Tuple<string, Difficulty>, List<TableUnit>> GroupByMusic(List<TableUnit> playlogDetailRecordUnits)
        {
            var groupBy = new Dictionary<Tuple<string, Difficulty>, List<TableUnit>>();
            if (playlogDetailRecordUnits == null)
            {
                return groupBy;
            }

            foreach (var recordUnit in playlogDetailRecordUnits)
            {
                if (recordUnit == null)
                {
                    continue;
                }

                var key = new Tuple<string, Difficulty>(recordUnit.PlaylogDetail.Name, recordUnit.PlaylogDetail.Difficulty);
                if (!groupBy.ContainsKey(key))
                {
                    groupBy.Add(key, new List<TableUnit>());
                }

                groupBy[key].Add(recordUnit);
            }

            return groupBy;
        }

        private async Task WritePlaylogDetailRecordByMusic(List<TableUnit> playlogDetailRecordUnits)
        {
            var musicDetails = new Dictionary<string, MusicDetail>();
            var writer = new TableCsvWriter();
            var recordUnitsGroupByMusic = GroupByMusic(playlogDetailRecordUnits);
            foreach (var musicInfo in recordUnitsGroupByMusic.Keys)
            {
                var directory = GetDirectoryPath(musicInfo.Item1, musicInfo.Item2);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var currentIndex = 1;
                if (ExistsPlaylogDetailRecordFile(directory, musicInfo, currentIndex))
                {
                    DebugLogger.WriteLine($"{musicInfo.Item1}({musicInfo.Item2})の既存データ読み込み");
                    while (ExistsPlaylogDetailRecordFile(directory, musicInfo, currentIndex + 1))
                    {
                        currentIndex++;
                    }

                    var readAsync = ReadPlaylogDetailRecordAsync(GetPlaylogDetailRecordFilePath(directory, musicInfo, currentIndex));
                    await readAsync;
                    var savedPlaylogDetailRecordUnits = readAsync.Result;

                    var lastPlayDate = savedPlaylogDetailRecordUnits.LastOrDefault()?.PlaylogDetail.PlayDate ?? new DateTime();
                    var startNumber = savedPlaylogDetailRecordUnits.LastOrDefault()?.Number + 1 ?? 1;
                    if (recordUnitsGroupByMusic[musicInfo].Any(u => u.PlaylogDetail.PlayDate > lastPlayDate))
                    {
                        var updatedPlaylogDetailRecordUnits = new List<TableUnit>();
                        if (musicInfo.Item2 != Difficulty.WorldsEnd)
                        {
                            var getAsync = GetMusicDetail(musicDetails, musicInfo.Item1);
                            await getAsync;
                            var musicDetailUnit = getAsync.Result.GetUnit(musicInfo.Item2);
                            var sourceRecordUnits = recordUnitsGroupByMusic[musicInfo].Where(u => u.PlaylogDetail.PlayDate > lastPlayDate).ToList();
                            var startPlayCount = musicDetailUnit.PlayCount - sourceRecordUnits.Count + 1;
                            for (var i = 0; i < sourceRecordUnits.Count; i++)
                            {
                                var cloneRecordUnit = sourceRecordUnits[i].Clone();
                                cloneRecordUnit.Number = startNumber + i;
                                cloneRecordUnit.PlayCount = startPlayCount + i;
                                cloneRecordUnit.LinkNumber = sourceRecordUnits[i].Number;

                                sourceRecordUnits[i].LinkNumber = cloneRecordUnit.Number;

                                updatedPlaylogDetailRecordUnits.Add(cloneRecordUnit);
                            }
                        }
                        else
                        {
                            var sourceRecordUnits = recordUnitsGroupByMusic[musicInfo].Where(u => u.PlaylogDetail.PlayDate > lastPlayDate).ToList();
                            for (var i = 0; i < sourceRecordUnits.Count; i++)
                            {
                                var cloneRecordUnit = sourceRecordUnits[i].Clone();
                                cloneRecordUnit.Number = startNumber + i;
                                cloneRecordUnit.Number = startNumber + i;
                                cloneRecordUnit.LinkNumber = sourceRecordUnits[i].Number;

                                sourceRecordUnits[i].LinkNumber = cloneRecordUnit.Number;

                                updatedPlaylogDetailRecordUnits.Add(cloneRecordUnit);
                            }
                        }

                        var playlogDetailRecord = new Table();

                        foreach (var recordUnit in savedPlaylogDetailRecordUnits)
                        {
                            playlogDetailRecord.RecordUnits.Add(recordUnit);
                        }

                        foreach (var recordUnit in updatedPlaylogDetailRecordUnits)
                        {
                            playlogDetailRecord.RecordUnits.Add(recordUnit);
                        }

                        DebugLogger.WriteLine($"{musicInfo.Item1}({musicInfo.Item2})の書き出し");
                        writer.Set(playlogDetailRecord);
                        writer.Write(GetPlaylogDetailRecordFilePath(directory, musicInfo, currentIndex));
                    }
                }
                else
                {
                    var updatedPlaylogDetailRecordUnits = new List<TableUnit>();
                    var startNumber = 1;
                    if (musicInfo.Item2 != Difficulty.WorldsEnd)
                    {
                        var getAsync = GetMusicDetail(musicDetails, musicInfo.Item1);
                        await getAsync;
                        var musicDetailUnit = getAsync.Result.GetUnit(musicInfo.Item2);
                        var sourceRecordUnits = recordUnitsGroupByMusic[musicInfo];
                        var startPlayCount = (musicDetailUnit?.PlayCount - sourceRecordUnits.Count + 1) ?? 0;
                        for (var i = 0; i < sourceRecordUnits.Count; i++)
                        {
                            var cloneRecordUnit = sourceRecordUnits[i].Clone();
                            cloneRecordUnit.Number = startNumber + i;
                            cloneRecordUnit.PlayCount = startPlayCount + i;
                            cloneRecordUnit.LinkNumber = sourceRecordUnits[i].Number;

                            sourceRecordUnits[i].LinkNumber = cloneRecordUnit.Number;

                            updatedPlaylogDetailRecordUnits.Add(cloneRecordUnit);
                        }
                    }
                    else
                    {
                        var sourceRecordUnits = recordUnitsGroupByMusic[musicInfo];
                        for (var i = 0; i < sourceRecordUnits.Count; i++)
                        {
                            var cloneRecordUnit = sourceRecordUnits[i].Clone();
                            cloneRecordUnit.Number = startNumber + i;
                            cloneRecordUnit.PlayCount = startNumber + i;
                            cloneRecordUnit.LinkNumber = sourceRecordUnits[i].Number;

                            sourceRecordUnits[i].LinkNumber = cloneRecordUnit.Number;

                            updatedPlaylogDetailRecordUnits.Add(cloneRecordUnit);
                        }
                    }

                    var playlogDetailRecord = new Table();

                    foreach (var recordUnit in updatedPlaylogDetailRecordUnits)
                    {
                        playlogDetailRecord.RecordUnits.Add(recordUnit);
                    }

                    DebugLogger.WriteLine($"{musicInfo.Item1}({musicInfo.Item2})の書き出し");
                    writer.Set(playlogDetailRecord);
                    writer.Write(GetPlaylogDetailRecordFilePath(directory, musicInfo, currentIndex));
                }
            }
        }

        private async Task<MusicDetail> GetMusicDetail(Dictionary<string, MusicDetail> cachedMusicDetails, string name)
        {
            if (cachedMusicDetails.ContainsKey(name))
            {
                return cachedMusicDetails[name];
            }

            DebugLogger.WriteLine($"{name}の詳細情報取得");
            var id = Utility.GetId(name);
            var musicDetailAsync = chunithmNetConnector.GetMusicDetailAsync(id);
            await musicDetailAsync;

            var response = musicDetailAsync.Result;
            if (!response.Success)
            {
                throw new Exception($"MusicDetail:[{id}]の取得に失敗しました");
            }

            cachedMusicDetails.Add(name, response.MusicDetail);
            return response.MusicDetail;
        }

        private string GetDirectoryPath(string name, Difficulty difficulty)
        {
            const string root = "./PlaylogDetailRecordTable";
            var fixedName = name;
            foreach (var invalidChar in Path.GetInvalidFileNameChars())
            {
                fixedName = fixedName.Replace(invalidChar.ToString(), "");
            }

            return $"{root}/{fixedName}/{difficulty}";
        }

        private bool ExistsPlaylogDetailRecordFile(string directory, Tuple<string, Difficulty> musicInfo, int index)
        {
            return File.Exists(GetPlaylogDetailRecordFilePath(directory, musicInfo, index));
        }

        private string GetPlaylogDetailRecordFilePath(string directory, Tuple<string, Difficulty> musicInfo, int index)
        {
            return $"{directory}/{Utility.GetId(musicInfo.Item1)}_{(int)musicInfo.Item2}_{index}.csv";
        }
    }
}
