using ChunithmClientLibrary;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace RecentSimulator.Analysis
{
    // https://max-eipi-unirecentanalysis.hatenablog.com/entry/2019/04/15/194713
    // これのパターン2の実装
    public class Analyzer2 : IAnalyzer
    {
        private History history;
        
        public Analyzer2(History history)
        {
            this.history = new History(history);
        }
        
        public void Analyze()
        {
            for (var i = 1; i < history.TableUnits.Count(); i++)
            {
                var before = history.TableUnits[i - 1];
                var after = history.TableUnits[i];
                if (before.DisplayRating <= after.DisplayRating)
                {
                    continue;
                }
                
                var difTotalBestRating = after.TotalBestRating - before.TotalBestRating;
                var diffDisplayRating = after.DisplayRating - before.DisplayRating;
            }
        }
        
        public void Dump()
        {
        }
    }
}