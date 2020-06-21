using System.IO;

namespace ChunithmClientLibrary.ChunithmNet
{
    public static class ChunithmNetUrl
    {
        public const string Root = "https://chunithm-net.com/mobile/";
        public const string Top = "https://chunithm-net.com/mobile/";
        public const string AimeList = "https://chunithm-net.com/mobile/AimeList.html";
        public const string Home = "https://chunithm-net.com/mobile/Home.html";
        public const string MusicDetail = "https://chunithm-net.com/mobile/MusicDetail.html";
        public const string MusicGenre = "https://chunithm-net.com/mobile/MusicGenre.html";
        public const string MusicLevel = "https://chunithm-net.com/mobile/MusicLevel.html";
        public const string Playlog = "https://chunithm-net.com/mobile/Playlog.html";
        public const string PlaylogDetail = "https://chunithm-net.com/mobile/PlaylogDetail.html";
        public const string WorldsEndMusic = "https://chunithm-net.com/mobile/WorldsEndMusic.html";
        public const string WorldsEndMusicDetail = "https://chunithm-net.com/mobile/WorldsEndMusicDetail.html";

        public static string CreateUrl(string localPath)
        {
            return Path.Combine(Root, localPath);
        }
    }
}
