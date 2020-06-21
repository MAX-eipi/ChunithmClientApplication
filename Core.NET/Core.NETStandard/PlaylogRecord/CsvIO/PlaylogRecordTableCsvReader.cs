using ChunithmClientLibrary.Reader;
using System;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public class PlaylogRecordTableCsvReader : CsvReader<IPlaylogRecordTable<IPlaylogRecordTableUnit>>
    {
        public override IPlaylogRecordTable<IPlaylogRecordTableUnit> Read(string source)
        {
            var playlogRecordTable = new PlaylogRecordTable();

            var rows = source.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            for (var i = 1; i < rows.Length; i++)
            {
                playlogRecordTable.Add(ParseRow(rows[i]));
            }

            return playlogRecordTable;
        }

        private PlaylogRecordTableUnit ParseRow(string row)
        {
            var unit = new PlaylogRecordTableUnit();

            var index = 0;

            unit.Id = GetField(row, ref index, int.Parse);
            unit.Name = GetTextField(row, ref index);
            unit.Genre = GetTextField(row, ref index);
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

            return unit;
        }
    }
}
