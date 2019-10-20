using ChunithmClientLibrary.PlaylogRecord.XmlIO;
using ChunithmClientLibrary.Writer;
using ClosedXML.Excel;
using System.Linq;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public sealed class PlaylogRecordTableXmlWriter : XmlWriter<IPlaylogRecordTable<IPlaylogRecordTableUnit>>, IWriter<IPlaylogRecordTable<IPlaylogRecordTableUnit>>
    {
        public override XLWorkbook CreateWorkbook(IPlaylogRecordTable<IPlaylogRecordTableUnit> data)
        {
            var workbook = new XLWorkbook();

            ApplyReocrd(workbook.Worksheets.Add("Playlog"), data);

            return workbook;
        }

        private void ApplyReocrd(IXLWorksheet worksheet, IPlaylogRecordTable<IPlaylogRecordTableUnit> record)
        {
            if (worksheet == null || record == null)
            {
                return;
            }

            var header = new Header().GetColumnsMappedByParameter();

            worksheet.Cell(1, header[Header.Parameter.Id].Index).Value = header[Header.Parameter.Id].Text;
            worksheet.Cell(1, header[Header.Parameter.Name].Index).Value = header[Header.Parameter.Name].Text;
            worksheet.Cell(1, header[Header.Parameter.Genre].Index).Value = header[Header.Parameter.Genre].Text;
            worksheet.Cell(1, header[Header.Parameter.Difficulty].Index).Value = header[Header.Parameter.Difficulty].Text;
            worksheet.Cell(1, header[Header.Parameter.Score].Index).Value = header[Header.Parameter.Score].Text;
            worksheet.Cell(1, header[Header.Parameter.Rank].Index).Value = header[Header.Parameter.Rank].Text;
            worksheet.Cell(1, header[Header.Parameter.BaseRating].Index).Value = header[Header.Parameter.BaseRating].Text;
            worksheet.Cell(1, header[Header.Parameter.Rating].Index).Value = header[Header.Parameter.Rating].Text;
            worksheet.Cell(1, header[Header.Parameter.IsNewRecord].Index).Value = header[Header.Parameter.IsNewRecord].Text;
            worksheet.Cell(1, header[Header.Parameter.IsClear].Index).Value = header[Header.Parameter.IsClear].Text;
            worksheet.Cell(1, header[Header.Parameter.ComboStatus].Index).Value = header[Header.Parameter.ComboStatus].Text;
            worksheet.Cell(1, header[Header.Parameter.ChainStatus].Index).Value = header[Header.Parameter.ChainStatus].Text;
            worksheet.Cell(1, header[Header.Parameter.Track].Index).Value = header[Header.Parameter.Track].Text;
            worksheet.Cell(1, header[Header.Parameter.PlayDate].Index).Value = header[Header.Parameter.PlayDate].Text;

            var playlogRecordUnits = record.GetTableUnits().Reverse().ToList();

            for (var i = 0; i < playlogRecordUnits.Count; i++)
            {
                var row = i + 2;
                worksheet.Cell(row, header[Header.Parameter.Id].Index).Value = playlogRecordUnits[i].Id;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).Value = playlogRecordUnits[i].Name;
                worksheet.Cell(row, header[Header.Parameter.Genre].Index).Value = playlogRecordUnits[i].Genre;
                worksheet.Cell(row, header[Header.Parameter.Difficulty].Index).Value = Utility.ToDifficultyText(playlogRecordUnits[i].Difficulty);
                worksheet.Cell(row, header[Header.Parameter.Score].Index).Value = playlogRecordUnits[i].Score;
                worksheet.Cell(row, header[Header.Parameter.Rank].Index).Value = Utility.ToRankText(Utility.GetRank(playlogRecordUnits[i].Score));
                worksheet.Cell(row, header[Header.Parameter.BaseRating].Index).Value = playlogRecordUnits[i].BaseRating;
                worksheet.Cell(row, header[Header.Parameter.Rating].Index).Value = playlogRecordUnits[i].Rating;
                worksheet.Cell(row, header[Header.Parameter.IsNewRecord].Index).Value = playlogRecordUnits[i].IsNewRecord;
                worksheet.Cell(row, header[Header.Parameter.IsClear].Index).Value = playlogRecordUnits[i].IsClear;
                worksheet.Cell(row, header[Header.Parameter.ComboStatus].Index).Value = playlogRecordUnits[i].ComboStatus;
                worksheet.Cell(row, header[Header.Parameter.ChainStatus].Index).Value = playlogRecordUnits[i].ChainStatus;
                worksheet.Cell(row, header[Header.Parameter.Track].Index).Value = playlogRecordUnits[i].Track;
                worksheet.Cell(row, header[Header.Parameter.PlayDate].Index).Value = playlogRecordUnits[i].PlayDate;
            }
        }
    }
}
