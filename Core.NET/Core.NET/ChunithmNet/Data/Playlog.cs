using System;

namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class Playlog
    {
        public class Unit
        {
            public string Name { get; set; } = DefaultParameter.Name;
            public string ImageName { get; set; } = DefaultParameter.ImageName;
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public int Score { get; set; } = DefaultParameter.Score;
            public Rank Rank { get; set; } = DefaultParameter.Rank;
            public bool IsNewRecord { get; set; } = DefaultParameter.IsNewRecord;
            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;
            public int Track { get; set; } = DefaultParameter.Track;
            public DateTime PlayDate { get; set; } = DefaultParameter.PlayDate;
        }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
