using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using ChunithmClientLibrary.PlaylogRecord;
using RecentSimulator.Analysis;
using System;
using System.IO;
using System.Linq;

namespace RecentSimulator
{
    class Program
    {
        private static readonly bool UPDATE_HISTORY = true;

        private static string userId;
        private static string password;
        private static int aimeId;

        private static MusicDataTable musicDataTable;
        private static History history = new History();

        static void Main(string[] args)
        {
            userId = args[0];
            password = args[1];
            aimeId = int.Parse(args[2]);

            if (UPDATE_HISTORY)
            {
                GetMusicDataTable();
                UpdateHistory();
            }
            else
            {
                var historyCsvPath = "./playlog/history.csv";
                if (File.Exists(historyCsvPath))
                {
                    history = ReadHistory(historyCsvPath);
                }

                var analyzers = new IAnalyzer[]
                {
                    new DeductionAnalyzer(history),
                    new Analyzer1(history),
                };

                foreach (var analyzer in analyzers)
                {
                    analyzer.Analyze();
                    analyzer.Dump();
                }

                Console.WriteLine("解析完了");
            }
            Console.ReadLine();
        }

        // 楽曲テーブルの取得
        private static void GetMusicDataTable()
        {
            if (!UPDATE_HISTORY)
            {
                musicDataTable = new MusicDataTable();
                return;
            }

            using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(""))
            {
                var getTableResult = databaseConnector.GetTableAsync().Result;
                if (!getTableResult.Success)
                {
                    throw new Exception("楽曲テーブルの取得に失敗");
                }
                if (getTableResult.MusicDataTable == null)
                {
                    throw new Exception("楽曲テーブルがnull");
                }
                musicDataTable = new MusicDataTable();
                musicDataTable.Add(getTableResult.MusicDataTable);
                Console.WriteLine("楽曲テーブル取得");
            }
        }

        private static void UpdateHistory()
        {
            var historyCsvPath = "./playlog/history.csv";

            var playlog = RequestPlaylog();
            var playlogRecordTable = new PlaylogRecordTable();
            playlogRecordTable.Add(playlog);

            foreach (var unit in playlogRecordTable.TableUnits)
            {
                var musicData = musicDataTable.GetTableUnit(unit.Name);
                if (musicData != null)
                {
                    unit.Id = musicData.Id;
                    unit.Genre = musicData.Genre;
                    unit.BaseRating = musicData.GetBaseRating(unit.Difficulty);
                    unit.Rating = Utility.GetRating(unit.BaseRating, unit.Score);
                }
            }

            {
                var writer = new PlaylogRecordTableCsvWriter();
                var csvPath = $"./playlog/playlog_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.csv";
                writer.Set(playlogRecordTable);
                writer.Write(csvPath);
                Console.WriteLine($"最新プレイ履歴のCSV出力 : {csvPath}");
            }

            {
                var history = File.Exists(historyCsvPath) ? ReadHistory(historyCsvPath) : new History();
                Program.history = MergeHistory(history, playlogRecordTable);
                WriteHistory(historyCsvPath, Program.history);
                Console.WriteLine("HistoryのCSV出力");
            }
        }

        private static History MergeHistory(History history, PlaylogRecordTable palylogRecordTable)
        {
            var mergedHistory = new History(history);
            var lastPlayUnit = history.GetTableUnits().LastOrDefault();
            var lastNumber = lastPlayUnit?.Number ?? 0;
            var lastPlayDate = lastPlayUnit?.PlayDate ?? new DateTime();
            var updated = palylogRecordTable.GetTableUnits()
                .Where(u => u.PlayDate > lastPlayDate)
                .Where(u => u.Id != DefaultParameter.Id && u.Difficulty != Difficulty.WorldsEnd)
                .Select((u, index) => new HistoryUnit(u) { Number = lastNumber + (index + 1) });
            mergedHistory.Add(updated);
            return mergedHistory;
        }

        private static void WriteHistory(string path, History history)
        {
            var writer = new HistoryWriter();
            writer.Set(history);
            writer.Write(path);
        }

        private static History ReadHistory(string path)
        {
            var reader = new HistoryReader();
            var table = reader.Read(Utility.LoadStringContent(path));
            return new History(table);
        }

        private static Playlog RequestPlaylog()
        {
            using (var connector = new ChunithmNetHttpClientConnector())
            {
                Login(connector, userId, password, aimeId);
                return GetPlaylog(connector);
            }
        }

        private static void Login(IChunithmNetConnector connector, string userId, string password, int aimeId)
        {
            // ログインAPI
            {
                var login = connector.LoginAsync(userId, password).Result;
                if (!login.Success)
                {
                    throw new Exception("ログインに失敗");
                }
                Console.WriteLine("ログイン");
            }

            // aime選択API
            {
                var selectAime = connector.SelectAimeAsync(aimeId).Result;
                if (!selectAime.Success)
                {
                    throw new Exception("Aime選択失敗");
                }
                Console.WriteLine("Aime選択");
            }
        }

        private static Playlog GetPlaylog(IChunithmNetConnector connector)
        {
            var getPlaylog = connector.GetPlaylogAsync().Result;
            if (!getPlaylog.Success)
            {
                throw new Exception("プレイ履歴の取得に失敗");
            }
            Console.WriteLine("プレイ履歴取得");

            var playlog = getPlaylog.Playlog;
            if (playlog == null)
            {
                throw new Exception("プレイ履歴がnull");
            }

            return playlog;
        }
    }
}
