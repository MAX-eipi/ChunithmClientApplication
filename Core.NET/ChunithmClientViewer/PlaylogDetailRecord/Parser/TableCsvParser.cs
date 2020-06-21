using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Reader;
using System;

namespace ChunithmClientViewer.PlaylogDetailRecord
{
    public class TableCsvReader : CsvReader<Table>
    {
        public class ParseException : Exception
        {
            public Exception Exception { get; private set; }
            public string Row { get; private set; }
            public string Parameter { get; private set; }

            public ParseException(Exception exception, string row, string parameter)
            {
                Exception = exception;
                Row = row;
                Parameter = parameter;
            }
        }

        public override Table Read(string source)
        {
            var record = new Table();
            var row = source.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            for (var i = 1; i < row.Length; i++)
            {
                record.RecordUnits.Add(ParseRow(row[i]));
            }
            return record;
        }

#if DEBUG
        public
#endif
            TableUnit ParseRow(string row)
        {
            var recordUnit = new TableUnit();
            var index = 0;
            recordUnit.Number = GetField(row, ref index, int.Parse);
            recordUnit.PlayCount = GetField(row, ref index, int.Parse);
            var playlogDetail = new PlaylogDetail();
            playlogDetail.Name = GetTextField(row, ref index);
            playlogDetail.Difficulty = GetField(row, ref index, value => (Difficulty)Enum.Parse(typeof(Difficulty), value));
            playlogDetail.Score = GetField(row, ref index, int.Parse);
            playlogDetail.JusticeCriticalCount = GetField(row, ref index, int.Parse);
            playlogDetail.JusticeCount = GetField(row, ref index, int.Parse);
            playlogDetail.AttackCount = GetField(row, ref index, int.Parse);
            playlogDetail.MissCount = GetField(row, ref index, int.Parse);
            playlogDetail.MaxCombo = GetField(row, ref index, int.Parse);
            playlogDetail.TapPercentage = GetField(row, ref index, double.Parse);
            playlogDetail.HoldPercentage = GetField(row, ref index, double.Parse);
            playlogDetail.SlidePercentage = GetField(row, ref index, double.Parse);
            playlogDetail.AirPercentage = GetField(row, ref index, double.Parse);
            playlogDetail.FlickPercentage = GetField(row, ref index, double.Parse);
            playlogDetail.IsClear = GetField(row, ref index, bool.Parse);
            playlogDetail.IsNewRecord = GetField(row, ref index, bool.Parse);
            playlogDetail.ComboStatus = GetField(row, ref index, value => (ComboStatus)Enum.Parse(typeof(ComboStatus), value));
            playlogDetail.ChainStatus = GetField(row, ref index, value => (ChainStatus)Enum.Parse(typeof(ChainStatus), value));
            playlogDetail.PlayDate = DateTime.Parse(GetTextField(row, ref index));
            playlogDetail.Track = GetField(row, ref index, int.Parse);
            playlogDetail.CharacterName = GetTextField(row, ref index);
            playlogDetail.SkillName = GetTextField(row, ref index);
            playlogDetail.SkillLevel = GetField(row, ref index, int.Parse);
            playlogDetail.SkillResult = GetField(row, ref index, int.Parse);
            playlogDetail.StoreName = GetTextField(row, ref index);
            recordUnit.LinkNumber = GetField(row, ref index, int.Parse);
            recordUnit.PlaylogDetail = playlogDetail;
            return recordUnit;
        }
    }
}
