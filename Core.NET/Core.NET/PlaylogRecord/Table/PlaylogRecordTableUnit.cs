using ChunithmClientLibrary.ChunithmNet.Data;
using System;
using System.Runtime.Serialization;

namespace ChunithmClientLibrary.PlaylogRecord
{
    [DataContract]
    public sealed class PlaylogRecordTableUnit : IPlaylogRecordTableUnit
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Genre { get; set; }
        [DataMember]
        public Difficulty Difficulty { get; set; }
        [DataMember]
        public int Score { get; set; }
        [DataMember]
        public Rank Rank { get; set; }
        [DataMember]
        public double BaseRating { get; set; }
        [DataMember]
        public double Rating { get; set; }
        [DataMember]
        public bool IsNewRecord { get; set; }
        [DataMember]
        public bool IsClear { get; set; }
        [DataMember]
        public ComboStatus ComboStatus { get; set; }
        [DataMember]
        public ChainStatus ChainStatus { get; set; }
        [DataMember]
        public int Track { get; set; }
        [DataMember]
        public DateTime PlayDate { get; set; }

        public PlaylogRecordTableUnit() { }

        public PlaylogRecordTableUnit(IPlaylogRecordTableUnit recordUnit)
        {
            Set(recordUnit);
        }

        public PlaylogRecordTableUnit(Playlog.Unit unit)
        {
            if (unit == null)
            {
                throw new ArgumentNullException(nameof(unit));
            }

            Name = unit.Name;
            Difficulty = unit.Difficulty;
            Score = unit.Score;
            Rank = unit.Rank;
            IsNewRecord = unit.IsNewRecord;
            IsClear = unit.IsClear;
            ComboStatus = unit.ComboStatus;
            ChainStatus = unit.ChainStatus;
            Track = unit.Track;
            PlayDate = unit.PlayDate;
        }

        public void Set(IPlaylogRecordTableUnit recordUnit)
        {
            if (recordUnit == null)
            {
                throw new ArgumentNullException(nameof(recordUnit));
            }

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
        }
    }
}
