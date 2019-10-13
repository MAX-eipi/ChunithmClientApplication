using ChunithmClientLibrary;
using ChunithmClientLibrary.PlaylogRecord;
using ChunithmClientLibrary.Reader;
using System;

namespace RecentSimulator
{
    public class HistoryReader : CsvReader<IPlaylogRecordTable<IHistoryUnit>>
    {
        public override IPlaylogRecordTable<IHistoryUnit> Read(string source)
        {
            var playlogRecordTable = new History();

            var rows = source.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            for (var i = 1; i < rows.Length; i++)
            {
                playlogRecordTable.Add(ParseRow(rows[i]));
            }

            return playlogRecordTable;
        }

        private HistoryUnit ParseRow(string row)
        {
            var unit = new HistoryUnit();

            var index = 0;

            unit.Number = GetField(row, ref index, int.Parse);
            unit.Id = GetField(row, ref index, int.Parse);
            unit.Name = GetTextField(row, ref index);
            unit.Genre = Utility.ToGenre(GetTextField(row, ref index));
            unit.Difficulty = Utility.ToDifficulty(GetTextField(row, ref index));
            unit.Score = GetField(row, ref index, int.Parse);
            unit.Rank = Utility.ToRank(GetTextField(row, ref index));
            unit.BaseRating = GetField(row, ref index, double.Parse);
            unit.Rating = GetField(row, ref index, double.Parse);
            unit.IsNewRecord = GetField(row, ref index, bool.Parse);
            unit.IsClear = GetField(row, ref index, bool.Parse);
            unit.ComboStatus = Utility.ToComboStatus(GetTextField(row, ref index));
            unit.ChainStatus = Utility.ToChainStatus(GetTextField(row, ref index));
            unit.Track = GetField(row, ref index, int.Parse);
            unit.PlayDate = DateTime.Parse(GetTextField(row, ref index));
            unit.DisplayRating = GetField(row, ref index, double.Parse);
            unit.TotalBestRating = GetField(row, ref index, double.Parse);

            return unit;
        }
    }
}
