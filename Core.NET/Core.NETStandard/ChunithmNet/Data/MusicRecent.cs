namespace ChunithmClientLibrary.ChunithmNet.Data
{
    public class MusicRecent
    {
        public class Unit
        {
            public int Id { get; set; } = DefaultParameter.Id;
            public string Name { get; set; } = DefaultParameter.Name;
        }

        public Unit[] Units { get; set; } = new Unit[0];
    }
}
