using System;

namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class PlaylogDetail
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

        public string StoreName { get; set; } = DefaultParameter.StoreName;
        public string CharacterName { get; set; } = DefaultParameter.CharacterName;
        public string SkillName { get; set; } = DefaultParameter.SkillName;
        public int SkillLevel { get; set; } = DefaultParameter.SkillLevel;
        public int SkillResult { get; set; } = DefaultParameter.SkillResult;

        public int MaxCombo { get; set; } = DefaultParameter.MaxCombo;
        public int JusticeCriticalCount { get; set; } = DefaultParameter.JusticeCriticalCount;
        public int JusticeCount { get; set; } = DefaultParameter.JusticeCount;
        public int AttackCount { get; set; } = DefaultParameter.AttackCount;
        public int MissCount { get; set; } = DefaultParameter.MissCount;

        public double TapPercentage { get; set; } = DefaultParameter.TapPercentage;
        public double HoldPercentage { get; set; } = DefaultParameter.HoldPercentage;
        public double SlidePercentage { get; set; } = DefaultParameter.SlidePercentage;
        public double AirPercentage { get; set; } = DefaultParameter.AirPercentage;
        public double FlickPercentage { get; set; } = DefaultParameter.FlickPercentage;
    }
}
