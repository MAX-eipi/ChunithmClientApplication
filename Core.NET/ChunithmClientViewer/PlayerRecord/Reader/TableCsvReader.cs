using ChunithmClientLibrary;
using ChunithmClientLibrary.Reader;
using System;
using System.Collections.Generic;
using HighScoreRecord = ChunithmClientLibrary.HighScoreRecord;

namespace ChunithmClientViewer.PlayerRecord
{
    public class TableCsvReader : CsvReader<ChunithmClientLibrary.PlayerRecord.IPlayerRecordContainer>, IReader<string, ChunithmClientLibrary.PlayerRecord.IPlayerRecordContainer>
    {
        public override ChunithmClientLibrary.PlayerRecord.IPlayerRecordContainer Read(string source)
        {
            var playerRecord = new ChunithmClientLibrary.PlayerRecord.PlayerRecordContainer();
            playerRecord.Basic = new HighScoreRecord.HighScoreRecordTable();
            playerRecord.Advanced = new HighScoreRecord.HighScoreRecordTable();
            playerRecord.Expert = new HighScoreRecord.HighScoreRecordTable();
            playerRecord.Master = new HighScoreRecord.HighScoreRecordTable();

            var row = source.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            for (var i = 1; i < row.Length; i++)
            {
                var highScoreRecords = ParseRow(row[i]);
                playerRecord.GetTable(Difficulty.Basic).Add(highScoreRecords[Difficulty.Basic]);
                playerRecord.GetTable(Difficulty.Advanced).Add(highScoreRecords[Difficulty.Advanced]);
                playerRecord.GetTable(Difficulty.Expert).Add(highScoreRecords[Difficulty.Expert]);
                playerRecord.GetTable(Difficulty.Master).Add(highScoreRecords[Difficulty.Master]);
            }

            return playerRecord;
        }

#if DEBUG
        public
#endif
            Dictionary<Difficulty, HighScoreRecord.HighScoreRecordTableUnit> ParseRow(string row)
        {
            var highScoreRecords = new Dictionary<Difficulty, HighScoreRecord.HighScoreRecordTableUnit>();
            highScoreRecords[Difficulty.Basic] = new HighScoreRecord.HighScoreRecordTableUnit();
            highScoreRecords[Difficulty.Advanced] = new HighScoreRecord.HighScoreRecordTableUnit();
            highScoreRecords[Difficulty.Expert] = new HighScoreRecord.HighScoreRecordTableUnit();
            highScoreRecords[Difficulty.Master] = new HighScoreRecord.HighScoreRecordTableUnit();

            var index = 0;

            var id = GetField(row, ref index, int.Parse);
            highScoreRecords[Difficulty.Basic].Id = id;
            highScoreRecords[Difficulty.Advanced].Id = id;
            highScoreRecords[Difficulty.Expert].Id = id;
            highScoreRecords[Difficulty.Master].Id = id;

            var name = GetTextField(row, ref index);
            highScoreRecords[Difficulty.Basic].Name = name;
            highScoreRecords[Difficulty.Advanced].Name = name;
            highScoreRecords[Difficulty.Expert].Name = name;
            highScoreRecords[Difficulty.Master].Name = name;

            var genre = GetTextField(row, ref index);
            highScoreRecords[Difficulty.Basic].Genre = genre;
            highScoreRecords[Difficulty.Advanced].Genre = genre;
            highScoreRecords[Difficulty.Expert].Genre = genre;
            highScoreRecords[Difficulty.Master].Genre = genre;

            highScoreRecords[Difficulty.Basic].Score = GetField(row, ref index, int.Parse);
            highScoreRecords[Difficulty.Advanced].Score = GetField(row, ref index, int.Parse);
            highScoreRecords[Difficulty.Expert].Score = GetField(row, ref index, int.Parse);
            highScoreRecords[Difficulty.Master].Score = GetField(row, ref index, int.Parse);

            highScoreRecords[Difficulty.Basic].BaseRating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Advanced].BaseRating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Expert].BaseRating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Master].BaseRating = GetField(row, ref index, double.Parse);

            highScoreRecords[Difficulty.Basic].Rating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Advanced].Rating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Expert].Rating = GetField(row, ref index, double.Parse);
            highScoreRecords[Difficulty.Master].Rating = GetField(row, ref index, double.Parse);

            return highScoreRecords;
        }
    }
}
