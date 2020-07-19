using ChunithmClientLibrary.Writer;

namespace ChunithmClientLibrary.MusicData
{
    public sealed class MusicDataTableJsonWriter : JsonWriter<IMusicDataTable<IMusicDataTableUnit>, MusicDataTable>, IWriter<IMusicDataTable<IMusicDataTableUnit>>
    {
        public override MusicDataTable CreateJsonData(IMusicDataTable<IMusicDataTableUnit> data)
        {
            var musicDataTable = new MusicDataTable();
            musicDataTable.Add(data);
            return musicDataTable;
        }
    }
}
