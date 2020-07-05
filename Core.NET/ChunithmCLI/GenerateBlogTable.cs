using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ChunithmCLI
{
    class GenerateBlogTable : ICommand
    {
        public class Argument
        {
            public string DataBaseUrl { get; private set; }
            public string VersionName { get; private set; }
            public string MaxLevelText { get; private set; }
            public string MinLevelText { get; private set; }
            public string DestinationPath { get; private set; }

            public Argument(string[] args)
            {
                VersionName = "";
                MinLevelText = "10.0";
                MaxLevelText = "14.2";

                for (var i = 0; i < args.Length; i++)
                {
                    if (!args[i].StartsWith("--"))
                    {
                        continue;
                    }

                    switch (args[i])
                    {
                        case "--db-url":
                            DataBaseUrl = args[i + 1];
                            i += 1;
                            break;
                        case "--max-level":
                            MaxLevelText = args[i + 1];
                            break;
                        case "--min-level":
                            MinLevelText = args[i + 1];
                            break;
                        case "--dest":
                            DestinationPath = args[i + 1];
                            break;
                        case "--version":
                            VersionName = args[i + 1];
                            break;
                    }
                }
            }
        }

        private const string COMMNAD_NAME = "gen-blog-table";

        public string GetCommandName()
        {
            return COMMNAD_NAME;
        }

        public bool Called(string[] args)
        {
            return args?.FirstOrDefault() == COMMNAD_NAME;
        }

        public void Call(string[] args)
        {
            var arg = new Argument(args);

            var musicDataTable = GetMusicDataTable(arg.DataBaseUrl);
            var (expert, master) = SplitMusicDataTable(musicDataTable);
            var minLevel = decimal.Parse(arg.MinLevelText);
            var maxLevel = decimal.Parse(arg.MaxLevelText);
            var tableText = GenerateTableText(minLevel, maxLevel, expert, master);

            if (Directory.Exists(Path.GetDirectoryName(arg.DestinationPath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(arg.DestinationPath));
            }

            using (var writer = new StreamWriter(arg.DestinationPath))
            {
                writer.Write(tableText);
            }
        }

        private static IMusicDataTable<IMusicDataTableUnit> GetMusicDataTable(string url)
        {
            var connector = new ChunithmMusicDatabaseHttpClientConnector(url);
            return connector.GetTableAsync().Result.MusicDataTable;
        }

        private static string GenerateTableText(decimal minLevel, decimal maxLevel, IMusicDataTableUnit[] expert, IMusicDataTableUnit[] master)
        {
            var table = new Dictionary<string, List<string>>();
            for (var level = minLevel; level <= maxLevel; level += 0.1m)
            {
                table[level.ToString("#.0")] = new List<string>();
            }
            foreach (var unit in expert)
            {
                table[unit.GetBaseRating(Difficulty.Expert).ToString("#.0")].Add($"{unit.Name}(EXP)");
            }
            foreach (var unit in master)
            {
                table[unit.GetBaseRating(Difficulty.Master).ToString("#.0")].Add(unit.Name);
            }

            var tableText = new StringBuilder();
            foreach (var (level, units) in table)
            {
                var musicNames = units.Any() ? units.Aggregate((src, acc) => $"{src} / {acc}") : "";
                tableText.AppendLine("<tr>");
                tableText.AppendLine($"    <td>{level}</td>");
                tableText.AppendLine($"    <td><p>{musicNames}</p></td>");
                tableText.AppendLine("</tr>");
            }
            return tableText.ToString();
        }

        private static (IMusicDataTableUnit[] expert, IMusicDataTableUnit[] master) SplitMusicDataTable(IMusicDataTable<IMusicDataTableUnit> musicDataTable)
        {
            var expert = musicDataTable.GetTableUnits()
                .Where(m => m.VerifiedBaseRating(Difficulty.Expert))
                .Where(m => m.GetBaseRating(Difficulty.Expert) >= 11.0)
                .ToArray();
            var master = musicDataTable.GetTableUnits()
                .Where(m => m.VerifiedBaseRating(Difficulty.Master))
                .ToArray();
            return (expert, master);
        }
    }
}
