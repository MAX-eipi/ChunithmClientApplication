using ChunithmClientLibrary;
using ChunithmClientLibrary.PlaylogRecord;
using System;

namespace RecentSimulator
{
    public interface IHistoryUnit : IPlaylogRecordTableUnit
    {
        int Number { get; }
        double DisplayRating { get; }
        double TotalBestRating { get; }
    }

    public class HistoryUnit : IHistoryUnit
    {
        public int Number { get; set; } = 0;
        public int Id { get; set; } = DefaultParameter.Id;
        public string Name { get; set; } = DefaultParameter.Name;
        [Obsolete]
        public Genre Genre { get; set; } = DefaultParameter.Genre;
        public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
        public int Score { get; set; } = DefaultParameter.Score;
        public Rank Rank { get; set; } = DefaultParameter.Rank;
        public double BaseRating { get; set; } = DefaultParameter.BaseRating;
        public double Rating { get; set; } = DefaultParameter.Rating;
        public bool IsNewRecord { get; set; } = DefaultParameter.IsNewRecord;
        public bool IsClear { get; set; } = DefaultParameter.IsClear;
        public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
        public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;
        public int Track { get; set; } = DefaultParameter.Track;
        public DateTime PlayDate { get; set; } = DefaultParameter.PlayDate;
        public double DisplayRating { get; set; } = 0;
        public double TotalBestRating { get; set; } = 0;

        public HistoryUnit() { }

        public HistoryUnit(IHistoryUnit recordUnit)
        {
            if (recordUnit == null)
            {
                throw new ArgumentNullException(nameof(recordUnit));
            }

            Number = recordUnit.Number;
            Id = recordUnit.Id;
            Name = recordUnit.Name;
            Genre = recordUnit.Genre;
            Difficulty = recordUnit.Difficulty;
            Score = recordUnit.Score;
            Rank = recordUnit.Rank;
            BaseRating = recordUnit.BaseRating;
            Rating = recordUnit.Rating;
            IsNewRecord = recordUnit.IsNewRecord;
            IsClear = recordUnit.IsClear;
            ComboStatus = recordUnit.ComboStatus;
            ChainStatus = recordUnit.ChainStatus;
            Track = recordUnit.Track;
            PlayDate = recordUnit.PlayDate;
            DisplayRating = recordUnit.DisplayRating;
            TotalBestRating = recordUnit.TotalBestRating;
        }

        public HistoryUnit(IPlaylogRecordTableUnit recordUnit)
        {
            if (recordUnit == null)
            {
                throw new ArgumentNullException(nameof(recordUnit));
            }

            Number = 0;
            Id = recordUnit.Id;
            Name = recordUnit.Name;
            Genre = recordUnit.Genre;
            Difficulty = recordUnit.Difficulty;
            Score = recordUnit.Score;
            Rank = recordUnit.Rank;
            BaseRating = recordUnit.BaseRating;
            Rating = recordUnit.Rating;
            IsNewRecord = recordUnit.IsNewRecord;
            IsClear = recordUnit.IsClear;
            ComboStatus = recordUnit.ComboStatus;
            ChainStatus = recordUnit.ChainStatus;
            Track = recordUnit.Track;
            PlayDate = recordUnit.PlayDate;
            DisplayRating = 0;
            TotalBestRating = 0;
        }
    }
}
