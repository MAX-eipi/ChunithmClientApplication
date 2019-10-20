using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using ChunithmClientLibrary.Writer;
using System;
using System.IO;
using System.Text;

namespace ChunithmMusicDataTableCreator
{
    class Program
    {
        private enum OutputType
        {
            Json,
            Xlsx,
            Csv,
        }

        private class Argument
        {
            public string Host { get; private set; }

            public OutputType OutputType { get; private set; } = OutputType.Json;
            public string OutputPath { get; private set; } = "./table.json";

            public Argument(string[] args)
            {
                if (args == null)
                {
                    throw new ArgumentNullException(nameof(args));
                }

                for (var i = 0; i < args.Length;)
                {
                    switch (args[i])
                    {
                        case "--host":
                            Host = args[i + 1];
                            i += 2;
                            break;
                        case "--output_type":
                            SetOutputType(args[i + 1]);
                            i += 2;
                            break;
                        case "--output_path":
                            OutputPath = args[i + 1];
                            i += 2;
                            break;
                        default:
                            Console.WriteLine("invalid argument[{0}] : {1}", i, args[i]);
                            i++;
                            break;
                    }
                }
            }

            private void SetOutputType(string type)
            {
                var compare = type.ToLower();
                switch (compare)
                {
                    case "json":
                        OutputType = OutputType.Json;
                        break;
                    case "xlsx":
                        OutputType = OutputType.Xlsx;
                        break;
                    case "csv":
                        OutputType = OutputType.Csv;
                        break;
                }
            }
        }

        static void Main(string[] args)
        {
            var argument = new Argument(args);

            var table = GetTable(argument);
            var writer = GetWriter(argument);
            writer.Set(table);

            var directoryPath = Path.GetDirectoryName(argument.OutputPath);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            writer.Write(argument.OutputPath);

            Console.WriteLine("completed.");
        }

        private static IMusicDataTable<IMusicDataTableUnit> GetTable(Argument arg)
        {
            using (var connector = new ChunithmMusicDatabaseHttpClientConnector(arg.Host))
            {
                Console.WriteLine("get table...");
                var tableGet = connector.GetTableAsync().Result;
                if (tableGet.Success)
                {
                    Console.WriteLine("success.");
                }
                else
                {
                    Console.WriteLine("failure.");
                }

                return tableGet.MusicDataTable;
            }
        }

        private static IWriter<IMusicDataTable<IMusicDataTableUnit>> GetWriter(Argument arg)
        {
            switch (arg.OutputType)
            {
                case OutputType.Json:
                    return new MusicDataTableJsonWriter();
                case OutputType.Xlsx:
                    return new MusicDataTableXmlWriter();
                case OutputType.Csv:
                    return new MusicDataTableCsvWriter();
            }
            return null;
        }
    }

    class MusicDataTableCsvWriter : CsvWriter<IMusicDataTable<IMusicDataTableUnit>>
    {
        public override string CreateCsv(IMusicDataTable<IMusicDataTableUnit> data)
        {
            var csv = new StringBuilder();
            AppendHeader(csv);
            foreach (var unit in data.GetTableUnits())
            {
                AppendRow(csv, unit);
            }
            return csv.ToString();
        }

        private void AppendHeader(StringBuilder csv)
        {
            Append(csv, "ID");
            Append(csv, "楽曲名");
            Append(csv, "ジャンル");
            Append(csv, "BASIC");
            Append(csv, "ADVANCED");
            Append(csv, "EXPERT");
            Append(csv, "MASTER");
            Append(csv, "BASIC検証");
            Append(csv, "ADVANCED検証");
            Append(csv, "EXPERT検証");
            Append(csv, "MASTER検証", true);
        }

        private void AppendRow(StringBuilder csv, IMusicDataTableUnit unit)
        {
            Append(csv, unit.Id);
            Append(csv, unit.Name);
            Append(csv, unit.Genre);
            Append(csv, unit.GetBaseRating(Difficulty.Basic));
            Append(csv, unit.GetBaseRating(Difficulty.Advanced));
            Append(csv, unit.GetBaseRating(Difficulty.Expert));
            Append(csv, unit.GetBaseRating(Difficulty.Master));
            Append(csv, unit.VerifiedBaseRating(Difficulty.Basic));
            Append(csv, unit.VerifiedBaseRating(Difficulty.Advanced));
            Append(csv, unit.VerifiedBaseRating(Difficulty.Expert));
            Append(csv, unit.VerifiedBaseRating(Difficulty.Master), true);
        }
    }
}
