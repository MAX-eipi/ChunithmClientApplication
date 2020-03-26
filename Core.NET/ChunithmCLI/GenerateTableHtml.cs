using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using System.IO;
using System.Linq;
using System.Web;

namespace ChunithmCLI
{
    public class GenerateTableHtml : ICommand
    {
        public class Argument
        {
            public string HostUrl { get; private set; }
            public string TemplateHtmlPath { get; private set; }
            public string DistributionPath { get; private set; }
            public string VersionName { get; private set; }

            public Argument(string[] args)
            {
                for (var i = 0; i < args.Length; i++)
                {
                    switch (args[i])
                    {
                        case "--host":
                            HostUrl = args[i + 1];
                            break;
                        case "--src":
                            TemplateHtmlPath = args[i + 1];
                            break;
                        case "--dist":
                            DistributionPath = args[i + 1];
                            break;
                        case "--version":
                            VersionName = args[i + 1];
                            break;
                    }
                }
            }
        }

        private const string COMMAND_NAME = "gen-table-html";

        public string GetCommandName()
        {
            return COMMAND_NAME;
        }

        public bool Called(string[] args)
        {
            if (args == null && !args.Any())
            {
                return false;
            }

            return args[0] == COMMAND_NAME;
        }

        public void Call(string[] args)
        {
            var arg = new Argument(args);

            IMusicDataTable<IMusicDataTableUnit> table = null;
            using (var connector = new ChunithmMusicDatabaseHttpClientConnector(arg.HostUrl))
            {
                var tableGet = connector.GetTableAsync().Result;
                table = tableGet.MusicDataTable;
            }

            using (var writer = new StreamWriter(arg.DistributionPath))
            {
                var source = GenerateSource(table, arg.VersionName, arg.TemplateHtmlPath);
                writer.Write(source);
            }
        }

        private string GenerateSource(IMusicDataTable<IMusicDataTableUnit> table, string versionName, string templatePath)
        {
            var source = ReadTemplate(templatePath);

            var tableTemplate = GetTemplate(source, "__TEMPLATE-TABLE__");
            var unitTemplate = GetTemplate(source, "__TEMPLATE-TABLE-ROW__");

            foreach (var group in table.GetTableUnits().GroupBy(u => u.Genre))
            {
                var tableBodyHtml = group
                    .Select(u =>
                    {
                        var src = unitTemplate;
                        src = src.Replace("%music-name%", HttpUtility.HtmlEncode(u.Name));
                        src = src.Replace("%base-rating-basic%", u.GetBaseRating(Difficulty.Basic).ToString("0.0"));
                        src = src.Replace("%base-rating-advanced%", u.GetBaseRating(Difficulty.Advanced).ToString("0.0"));
                        src = src.Replace("%base-rating-expert%", u.GetBaseRating(Difficulty.Expert).ToString("0.0"));
                        src = src.Replace("%base-rating-master%", u.GetBaseRating(Difficulty.Master).ToString("0.0"));

                        src = src.Replace("%unverified-basic%", !u.VerifiedBaseRating(Difficulty.Basic) ? "unverified" : "");
                        src = src.Replace("%unverified-advanced%", !u.VerifiedBaseRating(Difficulty.Advanced) ? "unverified" : "");
                        src = src.Replace("%unverified-expert%", !u.VerifiedBaseRating(Difficulty.Expert) ? "unverified" : "");
                        src = src.Replace("%unverified-master%", !u.VerifiedBaseRating(Difficulty.Master) ? "unverified" : "");

                        return src;
                    })
                    .Aggregate((acc, src) => acc + "\n" + src);

                var tableHtml = tableTemplate.Replace("%table-body%", tableBodyHtml);
                source = source.Replace($@"%table({group.Key})%", tableHtml);
            }

            return source;
        }

        private string ReadTemplate(string templatePath)
        {
            using (var reader = new StreamReader(templatePath))
            {
                return reader.ReadToEnd();
            }
        }

        private string GetTemplate(string source, string symbol)
        {
            var startWord = $"<!--{symbol}";
            var start = source.IndexOf(startWord);
            if (start < 0)
            {
                return "";
            }

            var endWord = "-->";
            var end = source.IndexOf(endWord, start);
            if (end < 0)
            {
                return "";
            }

            return source.Substring(start + startWord.Length, end - (start + startWord.Length)).Trim();
        }
    }
}
