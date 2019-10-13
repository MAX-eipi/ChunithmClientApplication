using ChunithmClientLibrary;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace RecentSimulator.Analysis
{
    public class DeductionAnalyzer : IAnalyzer
    {
        private readonly History history;

        private List<HistoryUnit> recentCandidates = new List<HistoryUnit>();

        private List<List<HistoryUnit>> recentCandidateTable = new List<List<HistoryUnit>>();

        public DeductionAnalyzer(History history)
        {
            this.history = new History(history);
        }

        public void Analyze()
        {
            recentCandidateTable.Clear();

            InitializeRecentCandidates();
            foreach (var x in history.TableUnits.Select((unit, index) => new { unit, index }))
            {
                var unit = x.unit;

                var recents = GetRecents();
                var minBaseRating = recents.Min(u => u.BaseRating);
                var minRating = recents.Min(u => u.Rating);
                var minScore = recents.Min(u => u.Score);

                if (Conditions1(unit, minBaseRating, minRating))
                {
                    var delete = recentCandidates.First(u => IsRemovingTarget1(u, unit));
                    Transition(unit, delete);
                }
                else if (Conditions2(unit, minBaseRating, minRating, minScore))
                {
                    // do nothing
                }
                else
                {
                    var delete = recentCandidates.First();
                    Transition(unit, delete);
                }

                recentCandidateTable.Add(recentCandidates.Select(u => new HistoryUnit(u)).ToList());
            }
        }

        public void Dump()
        {
            var rootDirectory = "./result/analysis/deducation_analyzer";
            if (!Directory.Exists(rootDirectory))
            {
                Directory.CreateDirectory(rootDirectory);
            }
            
            var csvColumnMap = new Dictionary<string, Func<HistoryUnit, object>>
            {
                { "No", u => u.Number },
                { "Id", u => u.Id },
                { "楽曲名", u => u.Name },
                { "ジャンル", u => Utility.ToGenreText(u.Genre) },
                { "難易度", u => Utility.ToDifficultyText(u.Difficulty) },
                { "スコア", u => u.Score },
                { "ランク", u => u.Rank },
                { "譜面定数", u => u.BaseRating },
                { "プレイレート", u => u.Rating },
                { "NEW RECORD", u => u.IsNewRecord },
                { "CLEAR", u => u.IsClear },
                { "コンボ", u => Utility.ToComboStatusText(u.ComboStatus) },
                { "チェイン", u => Utility.ToChainStatusText(u.ChainStatus) },
                { "トラック", u => u.Track },
                { "プレイ日時", u => u.PlayDate },
                { "表示レート", u => u.DisplayRating },
                { "ベスト枠", u => u.TotalBestRating },
            };
            foreach (var (recentCandidates, index) in recentCandidateTable.Select((recentCandidates, index) => (recentCandidates, index)))
            {
                var directoryPath = $"{rootDirectory}/playlog_{index + 1}";
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                
                using (var writer = new StreamWriter($"{directoryPath}/recent_candidate_{index + 1}.csv", false, Encoding.UTF8))
                {
                    var header = csvColumnMap.Keys.Aggregate((acc, src) => acc + "," + src);
                    writer.WriteLine(header);

                    foreach (var unit in recentCandidates)
                    {
                        var row = csvColumnMap.Values
                            .Select(cnv => cnv(unit))
                            .Select(value => value is string ? $"\"{value}\"" : value)
                            .Aggregate((acc, src) => acc + "," + src);
                        writer.WriteLine(row);
                    }
                }
                
                using (var writer = new StreamWriter($"{directoryPath}/recent_{index + 1}.csv", false, Encoding.UTF8))
                {
                    var header = csvColumnMap.Keys.Aggregate((acc, src) => acc + "," + src);
                    writer.WriteLine(header);

                    foreach (var unit in GetRecents(recentCandidates))
                    {
                        var row = csvColumnMap.Values
                            .Select(cnv => cnv(unit))
                            .Select(value => value is string ? $"\"{value}\"" : value)
                            .Aggregate((acc, src) => acc + "," + src);
                        writer.WriteLine(row);
                    }
                }
            }
        }

        private void InitializeRecentCandidates()
        {
            var totalBestRating = history.GetTableUnits().FirstOrDefault()?.TotalBestRating ?? 0;
            recentCandidates.Clear();
            recentCandidates.AddRange(Enumerable.Range(1, 30)
                .Select(index => index - 30)
                .Select(number => new HistoryUnit { Number = number, TotalBestRating = totalBestRating }));
        }
        
        private List<HistoryUnit> GetRecents()
        {
            return GetRecents(recentCandidates);
        }

        private List<HistoryUnit> GetRecents(List<HistoryUnit> recentCandidates)
        {
            return recentCandidates
                .OrderByDescending(u => u.Rating)
                .ThenByDescending(u => u.BaseRating)
                .Take(10)
                .Select(u => new HistoryUnit(u))
                .ToList();
        }

        private bool Conditions1(HistoryUnit unit, double minBaseRating, double minRating)
        {
            if (unit.Rating <= 0)
            {
                return false;
            }

            if (unit.Rating > minRating)
            {
                return true;
            }

            if (Math.Abs(unit.Rating - minRating) <= 0.0001 && unit.BaseRating > minBaseRating)
            {
                return true;
            }

            return false;
        }

        private bool IsRemovingTarget1(HistoryUnit target, HistoryUnit comparison)
        {
            if (target.Rating < comparison.Rating || Math.Abs(target.Rating - comparison.Rating) <= 0.0001 && target.BaseRating < comparison.BaseRating)
            {
                return true;
            }

            return false;
        }

        private bool Conditions2(HistoryUnit unit, double minBaseRating, double minRating, int minScore)
        {
            if (unit.Rating >= minRating || unit.Score >= minScore || unit.Score >= Utility.RANK_SSS_BORDER_SCORE)
            {
                return true;
            }

            return false;
        }

        private void Transition(HistoryUnit add, HistoryUnit delete)
        {
            recentCandidates.RemoveAll(u => u.Number == delete.Number);
            recentCandidates.Add(add);
        }
    }
}
