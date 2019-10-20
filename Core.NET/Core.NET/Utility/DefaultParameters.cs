using System;

namespace ChunithmClientLibrary
{
    public class DefaultParameter
    {
        public static readonly int Id = -1;
        public static readonly string Name = "";
        public static readonly string ArtistName = "";
        public static readonly string ImageName = "";
        [Obsolete]
        public static readonly Genre Genre = Genre.Invalid;
        public static readonly string GenreText = "";
        public static readonly Difficulty Difficulty = Difficulty.Invalid;
        public static readonly double Level = 0;
        public static readonly int WorldsEndLevel = -1;
        public static readonly WorldsEndType WorldsEndType = WorldsEndType.Invalid;
        public static readonly int Score = 0;
        public static readonly Rank Rank = Rank.None;
        public static readonly double BaseRating = 0;
        public static readonly double Rating = 0;
        public static readonly bool IsNewRecord = false;
        public static readonly bool IsClear = false;
        public static readonly ComboStatus ComboStatus = ComboStatus.None;
        public static readonly ChainStatus ChainStatus = ChainStatus.None;
        public static readonly int Track = 0;
        public static readonly DateTime PlayDate = new DateTime();
        public static readonly int PlayCount = 0;
        public static readonly string StoreName = "";
        public static readonly string CharacterName = "";
        public static readonly string SkillName = "";
        public static readonly int SkillLevel = 0;
        public static readonly int SkillResult = 0;
        public static readonly int MaxCombo = 0;
        public static readonly int JusticeCriticalCount = 0;
        public static readonly int JusticeCount = 0;
        public static readonly int AttackCount = 0;
        public static readonly int MissCount = 0;
        public static readonly double TapPercentage = 0;
        public static readonly double HoldPercentage = 0;
        public static readonly double SlidePercentage = 0;
        public static readonly double AirPercentage = 0;
        public static readonly double FlickPercentage = 0;
    }
}
