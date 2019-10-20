using ChunithmClientLibrary.Table;
using System;

namespace ChunithmClientLibrary.PlaylogRecord
{
    public interface IPlaylogRecordTableUnit : ITableUnit
    {
        int Id { get; }
        string Name { get; }
        string Genre { get; }
        Difficulty Difficulty { get; }
        int Score { get; }
        Rank Rank { get; }
        double BaseRating { get; }
        double Rating { get; }
        bool IsNewRecord { get; }
        bool IsClear { get; }
        ComboStatus ComboStatus { get; }
        ChainStatus ChainStatus { get; }
        int Track { get; }
        DateTime PlayDate { get; }
    }
}
