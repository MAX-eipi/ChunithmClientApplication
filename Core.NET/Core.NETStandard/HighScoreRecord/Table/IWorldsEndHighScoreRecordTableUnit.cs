namespace ChunithmClientLibrary.HighScoreRecord
{
    public interface IWorldsEndHighScoreRecordTableUnit : IHighScoreRecordTableUnit
    {
        int WorldsEndLevel { get; }
        WorldsEndType WorldsEndType { get; }
    }
}
