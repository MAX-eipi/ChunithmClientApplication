using ChunithmClientLibrary.Writer;

namespace ChunithmClientLibrary.PlayerRecord
{
    public sealed class PlayerRecordContainerJsonWriter : JsonWriter<IPlayerRecordContainer, PlayerRecordContainer>
    {
        public override PlayerRecordContainer CreateJsonData(IPlayerRecordContainer data)
        {
            var playerRecord = new PlayerRecordContainer();
            playerRecord.Set(data);
            return playerRecord;
        }
    }
}
