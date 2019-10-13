using ChunithmClientLibrary.Reader;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public sealed class PlaylogRecordTableJsonReader : JsonReader<IPlaylogRecordTable<IPlaylogRecordTableUnit>>, IReader<string, IPlaylogRecordTable<IPlaylogRecordTableUnit>>
    {
        public override IPlaylogRecordTable<IPlaylogRecordTableUnit> Read(string json)
        {
            return Utility.DeserializeFromJson<PlaylogRecordTable>(json);
        }
    }
}
