using ChunithmClientLibrary.Reader;

namespace ChunithmClientLibrary.PlayerRecord
{
    public sealed class PlayerRecordContainerJsonReader : JsonReader<IPlayerRecordContainer>, IReader<string, IPlayerRecordContainer>
    {
        public override IPlayerRecordContainer Read(string json)
        {
            return Utility.DeserializeFromJson<PlayerRecordContainer>(json);
        }
    }
}
