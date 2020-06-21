using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlayerRecord.XmlIO;
using ChunithmClientLibrary.Writer;
using ClosedXML.Excel;
using System.Linq;

namespace ChunithmClientLibrary.PlayerRecord
{
    public sealed class PlayerRecordContainerXmlWriter : XmlWriter<IPlayerRecordContainer>, IWriter<IPlayerRecordContainer>
    {
        public override XLWorkbook CreateWorkbook(IPlayerRecordContainer data)
        {
            var workbook = new XLWorkbook();
            AddRecordSheet(workbook, "Basic", data.Basic);
            AddRecordSheet(workbook, "Advanced", data.Advanced);
            AddRecordSheet(workbook, "Expert", data.Expert);
            AddRecordSheet(workbook, "Master", data.Master);
            return workbook;
        }

        private void AddRecordSheet(XLWorkbook workbook, string sheetName, IHighScoreRecordTable<IHighScoreRecordTableUnit> record)
        {
            if (record == null)
            {
                return;
            }

            ApplyRecord(workbook.Worksheets.Add(sheetName), record);
        }

        private void ApplyRecord(IXLWorksheet worksheet, IHighScoreRecordTable<IHighScoreRecordTableUnit> table)
        {
            if (worksheet == null || table == null)
            {
                return;
            }

            var header = new Header().GetColumnsMappedByParameter();

            worksheet.Cell(1, header[Header.Parameter.Id].Index).Value = header[Header.Parameter.Id].Text;
            worksheet.Cell(1, header[Header.Parameter.Name].Index).Value = header[Header.Parameter.Name].Text;
            worksheet.Cell(1, header[Header.Parameter.Genre].Index).Value = header[Header.Parameter.Genre].Text;
            worksheet.Cell(1, header[Header.Parameter.Difficulty].Index).Value = header[Header.Parameter.Difficulty].Text;
            worksheet.Cell(1, header[Header.Parameter.Score].Index).Value = header[Header.Parameter.Score].Text;
            worksheet.Cell(1, header[Header.Parameter.BaseRating].Index).Value = header[Header.Parameter.BaseRating].Text;
            worksheet.Cell(1, header[Header.Parameter.Rating].Index).Value = header[Header.Parameter.Rating].Text;

            var tableUnits = table.GetTableUnits().ToList();
            for (var i = 0; i < tableUnits.Count; i++)
            {
                var row = i + 2;
                worksheet.Cell(row, header[Header.Parameter.Id].Index).Value = tableUnits[i].Id;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).Value = tableUnits[i].Name;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).DataType = XLDataType.Text;
                worksheet.Cell(row, header[Header.Parameter.Genre].Index).Value = tableUnits[i].Genre;
                worksheet.Cell(row, header[Header.Parameter.Difficulty].Index).Value = Utility.ToDifficultyText(tableUnits[i].Difficulty);
                worksheet.Cell(row, header[Header.Parameter.Score].Index).Value = tableUnits[i].Score;
                worksheet.Cell(row, header[Header.Parameter.BaseRating].Index).Value = tableUnits[i].BaseRating;
                worksheet.Cell(row, header[Header.Parameter.Rating].Index).Value = tableUnits[i].Rating;
            }
        }
    }
}
