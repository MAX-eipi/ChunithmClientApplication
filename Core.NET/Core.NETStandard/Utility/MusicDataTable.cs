using ChunithmClientLibrary.MusicData;

namespace ChunithmClientLibrary
{
    public static partial class Utility
    {
        private static IMusicDataTable<IMusicDataTableUnit> globalMusicDataTable;

        public static void SetGlobalMusicDataTable(IMusicDataTable<IMusicDataTableUnit> globalMusicDataTable)
        {
            Utility.globalMusicDataTable = globalMusicDataTable;
        }

        public static IMusicDataTable<IMusicDataTableUnit> GetGlobalMusicDataTable()
        {
            return Utility.globalMusicDataTable;
        }
    }
}
