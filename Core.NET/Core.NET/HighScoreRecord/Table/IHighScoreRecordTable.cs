using ChunithmClientLibrary.Table;

namespace ChunithmClientLibrary.HighScoreRecord
{
    public interface IHighScoreRecordTable<THighScoreRecordTableUnit> : ITable<THighScoreRecordTableUnit>
        where THighScoreRecordTableUnit : IHighScoreRecordTableUnit
    {
    }
}