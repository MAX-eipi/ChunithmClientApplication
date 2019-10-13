using ChunithmClientLibrary.Reader;

namespace ChunithmClientLibrary.MusicData
{
    public sealed class MusicDataTableJsonReader : JsonReader<IMusicDataTable<IMusicDataTableUnit>>, IReader<string, IMusicDataTable<IMusicDataTableUnit>>
    {
        public override IMusicDataTable<IMusicDataTableUnit> Read(string json)
        {
            return Utility.DeserializeFromJson<MusicDataTable>(json);
        }
    }
}
