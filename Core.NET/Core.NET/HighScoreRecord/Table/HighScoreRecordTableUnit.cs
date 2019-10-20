using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.HighScoreRecord
{
    [DataContract]
    public sealed class HighScoreRecordTableUnit : IHighScoreRecordTableUnit
    {
        [DataMember]
        public int Id { get; set; } = DefaultParameter.Id;
        [DataMember]
        public string Name { get; set; } = DefaultParameter.Name;
        [DataMember]
        [Obsolete]
        public Genre Genre { get; set; } = DefaultParameter.Genre;
        [DataMember]
        public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
        [DataMember]
        public int Score { get; set; } = DefaultParameter.Score;
        [DataMember]
        public Rank Rank { get; set; } = DefaultParameter.Rank;
        [DataMember]
        public double BaseRating { get; set; } = DefaultParameter.BaseRating;
        [DataMember]
        public double Rating { get; set; } = DefaultParameter.Rating;
        [DataMember]
        public bool IsClear { get; set; } = DefaultParameter.IsClear;
        [DataMember]
        public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
        [DataMember]
        public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;

        public HighScoreRecordTableUnit() { }

        public HighScoreRecordTableUnit(IHighScoreRecordTableUnit tableUnit)
        {
            Set(tableUnit);
        }

        public HighScoreRecordTableUnit(MusicLevel.Unit unit)
        {
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }

            Id = unit.Id;
            Name = unit.Name;
            Difficulty = unit.Difficulty;
            Score = unit.Score;
            Rank = unit.Rank;
            BaseRating = unit.Level;
            IsClear = unit.IsClear;
            ComboStatus = unit.ComboStatus;
            ChainStatus = unit.ChainStatus;
        }

        public HighScoreRecordTableUnit(MusicGenre.Unit unit)
        {
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }

            Id = unit.Id;
            Name = unit.Name;
            Genre = unit.Genre;
            Difficulty = unit.Difficulty;
            Score = unit.Score;
            Rank = unit.Rank;
            IsClear = unit.IsClear;
            ComboStatus = unit.ComboStatus;
            ChainStatus = unit.ChainStatus;
        }

        public void Set(IHighScoreRecordTableUnit tableUnit)
        {
            if (tableUnit == null)
            {
                throw new ArgumentNullException(nameof(tableUnit));
            }

            Id = tableUnit.Id;
            Name = tableUnit.Name;
            Genre = tableUnit.Genre;
            Difficulty = tableUnit.Difficulty;
            Score = tableUnit.Score;
            Rank = tableUnit.Rank;
            BaseRating = tableUnit.BaseRating;
            Rating = tableUnit.Rating;
            IsClear = tableUnit.IsClear;
            ComboStatus = tableUnit.ComboStatus;
            ChainStatus = tableUnit.ChainStatus;
        }
    }
}