using ChunithmClientLibrary.PlaylogRecord.XmlIO;
using ChunithmClientLibrary.Reader;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public sealed class PlaylogRecordTableXmlReader : IReader<IXLWorksheet, IPlaylogRecordTable<IPlaylogRecordTableUnit>>
    {
        public IPlaylogRecordTable<IPlaylogRecordTableUnit> Read(string workbookPath)
        {
            return Read(workbookPath, "Playlog");
        }

        public IPlaylogRecordTable<IPlaylogRecordTableUnit> Read(string workbookPath, string sheetName)
        {
            if (!File.Exists(workbookPath))
            {
                throw new FileNotFoundException();
            }

            var workbook = new XLWorkbook(workbookPath);
            if (workbook == null)
            {
                throw new InvalidDataException();
            }

            var sheet = workbook.Worksheet(sheetName);
            if (sheet == null)
            {
                throw new InvalidDataException();
            }

            return Read(sheet);
        }

        public IPlaylogRecordTable<IPlaylogRecordTableUnit> Read(IXLWorksheet source)
        {
            var playlogRecordTable = new PlaylogRecordTable();

            var header = new Header().GetColumnsMappedByParameter();
            var rows = source.Rows().Skip(1);
            foreach (var row in rows)
            {
                playlogRecordTable.Add(CreatePlaylogRecord(header, row));
            }

            return playlogRecordTable;
        }

        private PlaylogRecordTableUnit CreatePlaylogRecord(Dictionary<Header.Parameter, Header.Column> header, IXLRow row)
        {
            var playlogRecord = new PlaylogRecordTableUnit();

            playlogRecord.Id = row.Cell(header[Header.Parameter.Id].Index).GetValue<int>();
            playlogRecord.Name = row.Cell(header[Header.Parameter.Name].Index).GetValue<string>();
            playlogRecord.Genre = row.Cell(header[Header.Parameter.Genre].Index).GetValue<string>();
            playlogRecord.Difficulty = Utility.ToDifficulty(row.Cell(header[Header.Parameter.Difficulty].Index).GetValue<string>());
            playlogRecord.Score = row.Cell(header[Header.Parameter.Score].Index).GetValue<int>();
            playlogRecord.Rank = Utility.ToRank(row.Cell(header[Header.Parameter.Rank].Index).GetValue<string>());
            playlogRecord.BaseRating = row.Cell(header[Header.Parameter.BaseRating].Index).GetValue<double>();
            playlogRecord.Rating = row.Cell(header[Header.Parameter.Rating].Index).GetValue<double>();
            playlogRecord.IsNewRecord = row.Cell(header[Header.Parameter.IsNewRecord].Index).GetValue<bool>();
            playlogRecord.IsClear = row.Cell(header[Header.Parameter.IsClear].Index).GetValue<bool>();
            playlogRecord.ComboStatus = (ComboStatus)Enum.Parse(typeof(ComboStatus), row.Cell(header[Header.Parameter.ComboStatus].Index).GetValue<string>());
            playlogRecord.ChainStatus = (ChainStatus)Enum.Parse(typeof(ChainStatus), row.Cell(header[Header.Parameter.ChainStatus].Index).GetValue<string>());
            playlogRecord.Track = row.Cell(header[Header.Parameter.Track].Index).GetValue<int>();
            playlogRecord.PlayDate = row.Cell(header[Header.Parameter.PlayDate].Index).GetValue<DateTime>();

            return playlogRecord;
        }
    }
}
