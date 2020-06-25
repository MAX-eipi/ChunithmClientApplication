using ChunithmClientLibrary;

namespace ChunithmClientLibraryUnitTest
{
    public static class TestUtility
    {
        public static class Category
        {
            public const string ChunithmNetParser = "ChunithmNetParser";
            public const string CsvIO = "CsvIO";
            public const string HighScoreRecord = "HighScoreRecord";
            public const string HtmlParser = "HtmlParser";
            public const string JsonIO = "JsonIO";
            public const string MusicData = "MusicData";
            public const string Parse = "Parse";
            public const string PlayerRecord = "PlayerRecord";
            public const string PlaylogRecord = "PlaylogRecord";
            public const string Utility = "Utility";
            public const string XmlIO = "XmlIO";
        }

        public const string ResourceDirectory = "../../../Resources";

        public static string LoadResource(string path)
        {
            return Utility.LoadStringContent(GetResourcePath(path));
        }

        public static string GetResourcePath(string path)
        {
            return ResourceDirectory + "/" + path;
        }
    }
}
