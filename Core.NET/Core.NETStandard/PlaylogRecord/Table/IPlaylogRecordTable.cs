using ChunithmClientLibrary.Table;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public interface IPlaylogRecordTable<TPlaylgoRecordTableUnit> : ITable<TPlaylgoRecordTableUnit>
        where TPlaylgoRecordTableUnit : IPlaylogRecordTableUnit
    {
    }
}
