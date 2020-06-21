namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class AimeList
    {
        public class Unit
        {
            public int RebornCount { get; set; }
            public int Level { get; set; }
            public string Name { get; set; }
            public double NowRating { get; set; }
            public double MaxRating { get; set; }
            [System.Obsolete]
            public string VoucherText { get; set; }
        }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
