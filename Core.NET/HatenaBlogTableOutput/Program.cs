using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HatenaBlogTableOutput
{
    class ProgramArgs
    {
        public string DataBaseUrl { get; private set; }
        public string Version { get; private set; }
        public string MaxLevelText { get; private set; }
        public string MinLevelText { get; private set; }

        public ProgramArgs(string[] args)
        {
            Version = "";
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
                    case "--db_url":
                        DataBaseUrl = args[i + 1];
                        i += 1;
                        break;
                    case "--max_level":
                        MaxLevelText = args[i + 1];
                        break;
                    case "--min_level":
                        MinLevelText = args[i + 1];
                        break;
                }
            }
        }
    }

    class GetMusicDataTableArgs
    {
        public string Url { get; private set; }
        public string Version { get; private set; }

        public GetMusicDataTableArgs(ProgramArgs args)
            : this(args.DataBaseUrl, args.Version)
        {
        }

        public GetMusicDataTableArgs(string url, string version = "")
        {
            Url = url;
            Version = version;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            var programArgs = new ProgramArgs(args);

            var getTableArgs = new GetMusicDataTableArgs(programArgs.DataBaseUrl);
            var musicDataTable = GetMusicDataTable(getTableArgs);
            var (expert, master) = SplitMusicDataTable(musicDataTable);
            var minLevel = decimal.Parse(programArgs.MinLevelText);
            var maxLevel = decimal.Parse(programArgs.MaxLevelText);
            Console.WriteLine(GenerateTableText(minLevel, maxLevel, expert, master));
        }

        private static IMusicDataTable<IMusicDataTableUnit> GetMusicDataTable(GetMusicDataTableArgs args)
        {
            var connector = new ChunithmMusicDatabaseHttpClientConnector(args.Url);
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
