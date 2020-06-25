using ChunithmClientLibrary.MusicData.XmlIO;
using ChunithmClientLibrary.Reader;
using ClosedXML.Excel;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ChunithmClientLibrary.MusicData
{
    public sealed class MusicDataTableXmlReader : IReader<IXLWorksheet, IMusicDataTable<IMusicDataTableUnit>>
    {
        public IMusicDataTable<IMusicDataTableUnit> Read(string workbookPath)
        {
            return Read(workbookPath, "MusicData");
        }

        public IMusicDataTable<IMusicDataTableUnit> Read(string workbookPath, string sheetName)
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

        public IMusicDataTable<IMusicDataTableUnit> Read(IXLWorksheet source)
        {
            var musicDataTable = new MusicDataTable();

            var header = new Header().GetColumnsMappedByParameter();
            var rows = source.Rows().Skip(1);
            foreach (var row in rows)
            {
                musicDataTable.Add(CreateMusicData(header, row));
            }

            return musicDataTable;
        }

        private MusicDataTableUnit CreateMusicData(Dictionary<Header.Parameter, Header.Column> header, IXLRow row)
        {
            var musicData = new MusicDataTableUnit();

            musicData.Id = row.Cell(header[Header.Parameter.Id].Index).GetValue<int>();
            musicData.Name = row.Cell(header[Header.Parameter.Name].Index).GetValue<string>();
            musicData.Genre = row.Cell(header[Header.Parameter.Genre].Index).GetValue<string>();
            musicData.SetBaseRating(Difficulty.Basic, row.Cell(header[Header.Parameter.Basic].Index).GetValue<double>());
            musicData.SetBaseRating(Difficulty.Advanced, row.Cell(header[Header.Parameter.Advanced].Index).GetValue<double>());
            musicData.SetBaseRating(Difficulty.Expert, row.Cell(header[Header.Parameter.Expert].Index).GetValue<double>());
            musicData.SetBaseRating(Difficulty.Master, row.Cell(header[Header.Parameter.Master].Index).GetValue<double>());
            musicData.SetVerifiedBaseRating(Difficulty.Basic, row.Cell(header[Header.Parameter.BasicVerified].Index).GetValue<bool>());
            musicData.SetVerifiedBaseRating(Difficulty.Advanced, row.Cell(header[Header.Parameter.AdvancedVerified].Index).GetValue<bool>());
            musicData.SetVerifiedBaseRating(Difficulty.Expert, row.Cell(header[Header.Parameter.ExpertVerified].Index).GetValue<bool>());
            musicData.SetVerifiedBaseRating(Difficulty.Master, row.Cell(header[Header.Parameter.MasterVerified].Index).GetValue<bool>());

            return musicData;
        }
    }
}
