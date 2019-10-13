namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class WorldsEndMusic
    {
        public class Unit
        {
            public int Id { get; set; } = DefaultParameter.Id;
            public string Name { get; set; } = DefaultParameter.Name;
            public Difficulty Difficulty { get; set; } = DefaultParameter.Difficulty;
            public int WorldsEndLevel { get; set; } = DefaultParameter.WorldsEndLevel;
            public WorldsEndType WorldsEndType { get; set; } = DefaultParameter.WorldsEndType;
            public int Score { get; set; } = DefaultParameter.Score;
            public Rank Rank { get; set; } = DefaultParameter.Rank;
            public bool IsClear { get; set; } = DefaultParameter.IsClear;
            public ComboStatus ComboStatus { get; set; } = DefaultParameter.ComboStatus;
            public ChainStatus ChainStatus { get; set; } = DefaultParameter.ChainStatus;
        }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
