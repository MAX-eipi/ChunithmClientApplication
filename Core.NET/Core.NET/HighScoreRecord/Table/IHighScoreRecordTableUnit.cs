using ChunithmClientLibrary.Table;

namespace ChunithmClientLibrary.HighScoreRecord
{
    public interface IHighScoreRecordTableUnit : ITableUnit
    {
        int Id { get; }
        string Name { get; }
        string Genre { get; }
        Difficulty Difficulty { get; }
        int Score { get; }
        Rank Rank { get; }
        double BaseRating { get; }
        double Rating { get; }
        bool IsClear { get; }
        ComboStatus ComboStatus { get; }
        ChainStatus ChainStatus { get; }
    }
}
