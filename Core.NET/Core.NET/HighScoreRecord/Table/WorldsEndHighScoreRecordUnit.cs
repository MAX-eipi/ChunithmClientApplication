using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.HighScoreRecord
{
    [DataContract]
    public sealed class WorldsEndHighScoreRecordTableUnit : IWorldsEndHighScoreRecordTableUnit
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        [Obsolete]
        public Genre Genre { get; set; }
        [DataMember]
        public Difficulty Difficulty { get; set; }
        [DataMember]
        public int WorldsEndLevel { get; set; }
        [DataMember]
        public WorldsEndType WorldsEndType { get; set; }

        [DataMember]
        public int Score { get; set; }
        [DataMember]
        public Rank Rank { get; set; }
        [DataMember]
        public double BaseRating { get; set; }
        [DataMember]
        public double Rating { get; set; }
        [DataMember]
        public bool IsClear { get; set; }
        [DataMember]
        public ComboStatus ComboStatus { get; set; }
        [DataMember]
        public ChainStatus ChainStatus { get; set; }

        public WorldsEndHighScoreRecordTableUnit() : base() { }

        public WorldsEndHighScoreRecordTableUnit(IWorldsEndHighScoreRecordTableUnit tableUnit)
        {
            Set(tableUnit);
        }

        public void Set(IWorldsEndHighScoreRecordTableUnit tableUnit)
        {
            if (tableUnit == null)
            {
                throw new ArgumentNullException(nameof(tableUnit));
            }

            Id = tableUnit.Id;
            Name = tableUnit.Name;
            Genre = tableUnit.Genre;
            Difficulty = tableUnit.Difficulty;
            WorldsEndLevel = tableUnit.WorldsEndLevel;
            WorldsEndType = tableUnit.WorldsEndType;
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
