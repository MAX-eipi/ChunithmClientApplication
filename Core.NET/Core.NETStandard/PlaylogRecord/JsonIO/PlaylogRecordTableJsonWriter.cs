using ChunithmClientLibrary.Writer;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public sealed class PlaylogRecordTableJsonWriter : JsonWriter<IPlaylogRecordTable<IPlaylogRecordTableUnit>, PlaylogRecordTable>, IWriter<IPlaylogRecordTable<IPlaylogRecordTableUnit>>
    {
        public override PlaylogRecordTable CreateJsonData(IPlaylogRecordTable<IPlaylogRecordTableUnit> data)
        {
            var jsonObject = new PlaylogRecordTable();
            foreach (var unit in data.GetTableUnits())
            {
                var recordUnit = new PlaylogRecordTableUnit();
                recordUnit.Set(unit);
                jsonObject.TableUnits.Add(recordUnit);
            }

            return jsonObject;
        }
    }
}
