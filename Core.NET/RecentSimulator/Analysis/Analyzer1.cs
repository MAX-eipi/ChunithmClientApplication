using ChunithmClientLibrary;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace RecentSimulator.Analysis
{
    // https://max-eipi-unirecentanalysis.hatenablog.com/entry/2019/04/15/194713
    // これのパターン1の実装
    public class Analyzer1 : IAnalyzer
    {
        private History history;
        
        private Dictionary<int, List<HistoryUnit>> excludeCandidateMap = new Dictionary<int, List<HistoryUnit>>();
        private Dictionary<int, List<HistoryUnit>> subExcludeCandidateMap = new Dictionary<int, List<HistoryUnit>>();
        
        public Analyzer1(History history)
        {
            this.history = new History(history);
        }
        
        public void Analyze()
        {
            excludeCandidateMap.Clear();
            subExcludeCandidateMap.Clear();
            for (var i = 1; i < history.TableUnits.Count(); i++)
            {
                var before = history.TableUnits[i - 1];
                var after = history.TableUnits[i];
                if (before.DisplayRating >= after.DisplayRating)
                {
                    continue;
                }
                
                if (Math.Abs(before.TotalBestRating - after.TotalBestRating) < 0.0001)
                {
                    var candidates = new List<HistoryUnit>();
                    var diffDisplayRating = after.DisplayRating - before.DisplayRating;
                    foreach (var unit in history.TableUnits.Where(u => u.Number < after.Number))
                    {
                        if (Math.Abs(after.Rating - unit.Rating - 40 * diffDisplayRating) < 0.4)
                        {
                            candidates.Add(new HistoryUnit(unit));
                        }
                    }
                    excludeCandidateMap.Add(after.Number, candidates);
                }
                else
                {
                    // https://max-eipi-unirecentanalysis.hatenablog.com/entry/2019/04/13/174716
                    // 2-b参考
                    var diffTotalBestRating = after.TotalBestRating - before.TotalBestRating;
                    var diffDisplayRating = after.DisplayRating - before.DisplayRating;
                    
                    var candidates = new List<HistoryUnit>();
                    foreach (var unit in history.TableUnits.Where(u => u.Number < after.Number))
                    {
                        if (Math.Abs(diffTotalBestRating + after.Rating - unit.Rating - 40 * diffDisplayRating) < 0.4)
                        {
                            candidates.Add(new HistoryUnit(unit));
                        }
                    }
                    
                    if (Math.Abs(diffTotalBestRating - 40 * diffDisplayRating) >= 0.4)
                    {
                        excludeCandidateMap.Add(after.Number, candidates);
                    }
                    else
                    {
                        subExcludeCandidateMap.Add(after.Number, candidates);
                    }
                }
            }
        }
        
        public void Dump()
        {
            var rootDirectory = "./result/analysis/analyzer1";
            if (!Directory.Exists(rootDirectory))
            {
                Directory.CreateDirectory(rootDirectory);
            }
            
            var csvColumnMap = new Dictionary<string, Func<HistoryUnit, object>>
            {
                { "No", u => u.Number },
                { "Id", u => u.Id },
                { "楽曲名", u => u.Name },
                { "ジャンル", u => u.Genre },
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
            {
                var unitQuery = 
                    from candidates in excludeCandidateMap
                    let insertUnit = history.TableUnits.First(u => u.Number == candidates.Key)
                    select new { unit = insertUnit, candidates = candidates.Value };
                foreach (var query in unitQuery)
                {
                    using (var writer = new StreamWriter($"{rootDirectory}/exclude_candidate_{query.unit.Number}.csv", false, Encoding.UTF8))
                    {
                        var header = csvColumnMap.Keys.Aggregate((acc, src) => acc + "," + src);
                        writer.WriteLine(header);
                        
                        foreach (var unit in query.candidates)
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
            {
                var unitQuery = 
                    from candidates in subExcludeCandidateMap
                    let insertUnit = history.TableUnits.First(u => u.Number == candidates.Key)
                    select new { unit = insertUnit, candidates = candidates.Value };
                foreach (var query in unitQuery)
                {
                    using (var writer = new StreamWriter($"{rootDirectory}/sub_exclude_candidate_{query.unit.Number}.csv", false, Encoding.UTF8))
                    {
                        var header = csvColumnMap.Keys.Aggregate((acc, src) => acc + "," + src);
                        writer.WriteLine(header);
                        
                        foreach (var unit in query.candidates)
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
        }
    }
}