using ChunithmClientLibrary.Writer;
using ClosedXML.Excel;
using System.Linq;
using Header = ChunithmClientLibrary.MusicData.XmlIO.Header;

namespace ChunithmClientLibrary.MusicData
{
    public sealed class MusicDataTableXmlWriter : XmlWriter<IMusicDataTable<IMusicDataTableUnit>>, IWriter<IMusicDataTable<IMusicDataTableUnit>>
    {
        public override XLWorkbook CreateWorkbook(IMusicDataTable<IMusicDataTableUnit> data)
        {
            var workbook = new XLWorkbook();

            ApplyRecord(workbook.AddWorksheet("MusicData"), data);



            return workbook;
        }

        private void ApplyRecord(IXLWorksheet worksheet, IMusicDataTable<IMusicDataTableUnit> data)
        {
            if (worksheet == null || data == null)
            {
                return;
            }

            var header = new Header().GetColumnsMappedByParameter();

            worksheet.Cell(1, header[Header.Parameter.Index].Index).Value = header[Header.Parameter.Index].Text;
            worksheet.Cell(1, header[Header.Parameter.Id].Index).Value = header[Header.Parameter.Id].Text;
            worksheet.Cell(1, header[Header.Parameter.Name].Index).Value = header[Header.Parameter.Name].Text;
            worksheet.Cell(1, header[Header.Parameter.Genre].Index).Value = header[Header.Parameter.Genre].Text;
            worksheet.Cell(1, header[Header.Parameter.Basic].Index).Value = header[Header.Parameter.Basic].Text;
            worksheet.Cell(1, header[Header.Parameter.Advanced].Index).Value = header[Header.Parameter.Advanced].Text;
            worksheet.Cell(1, header[Header.Parameter.Expert].Index).Value = header[Header.Parameter.Expert].Text;
            worksheet.Cell(1, header[Header.Parameter.Master].Index).Value = header[Header.Parameter.Master].Text;
            worksheet.Cell(1, header[Header.Parameter.BasicVerified].Index).Value = header[Header.Parameter.BasicVerified].Text;
            worksheet.Cell(1, header[Header.Parameter.AdvancedVerified].Index).Value = header[Header.Parameter.AdvancedVerified].Text;
            worksheet.Cell(1, header[Header.Parameter.ExpertVerified].Index).Value = header[Header.Parameter.ExpertVerified].Text;
            worksheet.Cell(1, header[Header.Parameter.MasterVerified].Index).Value = header[Header.Parameter.MasterVerified].Text;


            var musicDatas = data.GetTableUnits().ToList();
            for (var i = 0; i < musicDatas.Count; i++)
            {
                var row = i + 2;
                worksheet.Cell(row, header[Header.Parameter.Index].Index).Value = i + 1;
                worksheet.Cell(row, header[Header.Parameter.Id].Index).Value = musicDatas[i].Id;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).Value = musicDatas[i].Name;
                worksheet.Cell(row, header[Header.Parameter.Name].Index).DataType = XLDataType.Text;
                worksheet.Cell(row, header[Header.Parameter.Genre].Index).Value = musicDatas[i].Genre;
                worksheet.Cell(row, header[Header.Parameter.Basic].Index).Value = musicDatas[i].GetBaseRating(Difficulty.Basic);
                worksheet.Cell(row, header[Header.Parameter.Advanced].Index).Value = musicDatas[i].GetBaseRating(Difficulty.Advanced);
                worksheet.Cell(row, header[Header.Parameter.Expert].Index).Value = musicDatas[i].GetBaseRating(Difficulty.Expert);
                worksheet.Cell(row, header[Header.Parameter.Master].Index).Value = musicDatas[i].GetBaseRating(Difficulty.Master);
                worksheet.Cell(row, header[Header.Parameter.BasicVerified].Index).Value = musicDatas[i].VerifiedBaseRating(Difficulty.Basic);
                worksheet.Cell(row, header[Header.Parameter.AdvancedVerified].Index).Value = musicDatas[i].VerifiedBaseRating(Difficulty.Advanced);
                worksheet.Cell(row, header[Header.Parameter.ExpertVerified].Index).Value = musicDatas[i].VerifiedBaseRating(Difficulty.Expert);
                worksheet.Cell(row, header[Header.Parameter.MasterVerified].Index).Value = musicDatas[i].VerifiedBaseRating(Difficulty.Master);
            }
        }
    }
}
