using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.Parser;
using ChunithmClientLibrary.MusicData;
using System;
using System.IO;
using System.Text;

namespace ChunithmMusicDataTableCreator
{
    class Program
    {
        private class Argument
        {
            public string Host { get; private set; }

            public string SegaId { get; private set; } = "";
            public string Password { get; private set; } = "";
            public int AimeId { get; private set; } = 0;

            public bool LocalMode { get; private set; } = false;
            public string SourceDirectoryPath { get; private set; } = "./Sources";
            public string SourceFileNameForamat { get; private set; } = "music_source_{0}.html";

            public bool OutputXml { get; private set; } = false;
            public string OutputDirectoryPath { get; private set; } = "./Outputs";

            public int MaxLevel { get; private set; } = 21;

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
                        case "--sega_id":
                            SegaId = args[i + 1];
                            i += 2;
                            break;
                        case "--password":
                            Password = args[i + 1];
                            i += 2;
                            break;
                        case "--aime_id":
                            AimeId = int.Parse(args[i + 1]);
                            i += 2;
                            break;

                        case "--local_mode":
                            LocalMode = true;
                            i++;
                            break;
                        case "--source_path":
                            SourceDirectoryPath = args[i + 1];
                            i += 2;
                            break;
                        case "--source_file_name_format":
                            SourceFileNameForamat = args[i + 1];
                            i += 2;
                            break;

                        case "--output_xml":
                            OutputXml = true;
                            i++;
                            break;
                        case "--output_directory_path":
                            OutputDirectoryPath = args[i + 1];
                            i += 2;
                            break;

                        case "--max_level":
                            MaxLevel = int.Parse(args[i + 1]);
                            i += 2;
                            break;

                        default:
                            Console.WriteLine("invalid argument[{0}] : {1}", i, args[i]);
                            i++;
                            break;
                    }
                }
            }

            public string GetSourceFilePath(string fileName)
            {
                return Path.Combine(SourceDirectoryPath, string.Format(SourceFileNameForamat, fileName));
            }

            public string GetOutputFilePath(string fileName)
            {
                return Path.Combine(OutputDirectoryPath, fileName);
            }
        }

        static void Main(string[] args)
        {
            var argument = new Argument(args);

            var musicDataTable = new MusicDataTable();
            if (argument.LocalMode)
            {
                Console.Write("parsing... ");
                {
                    var filePath = argument.GetSourceFilePath("list");
                    var parser = new MusicGenreParser();
                    using (var reader = new StreamReader(filePath, Encoding.UTF8))
                    {
                        var source = reader.ReadToEnd();
                        var data = parser.Parse(source);
                        musicDataTable.Add(data);
                    }
                }
                {
                    var parser = new MusicLevelParser();
                    for (var i = 0; i < argument.MaxLevel; i++)
                    {
                        var filePath = argument.GetSourceFilePath(i.ToString());
                        using (var reader = new StreamReader(filePath, Encoding.UTF8))
                        {
                            var source = reader.ReadToEnd();
                            var data = parser.Parse(source);
                            musicDataTable.Add(data);
                        }
                    }
                }
                Console.WriteLine("done.");
            }
            else
            {
                using (var connector = new ChunithmNetHttpClientConnector())
                {
                    Console.Write("login... ");
                    var login = connector.LoginAsync(argument.SegaId, argument.Password).Result;
                    if (login.Success)
                    {
                        Console.WriteLine("success.");
                    }
                    else
                    {
                        Console.WriteLine("failure.");
                        WriteLineChunithmNetConnectionError(login);
                        return;
                    }

                    Console.Write("selecting aime... ");
                    var aimeSelct = connector.SelectAimeAsync(argument.AimeId).Result;
                    if (aimeSelct.Success)
                    {
                        Console.WriteLine("success.");
                    }
                    else
                    {
                        Console.WriteLine("failure.");
                        WriteLineChunithmNetConnectionError(login);
                        return;
                    }

                    {
                        Console.Write("downloading music list... ");
                        var musicGenre = connector.GetMusicGenreAsync(Genre.All, Difficulty.Master).Result;
                        if (musicGenre.Success)
                        {
                            Console.WriteLine("success.");
                        }
                        else
                        {
                            Console.WriteLine("failure.");
                            WriteLineChunithmNetConnectionError(musicGenre);
                            return;
                        }
                        musicDataTable.Add(musicGenre.MusicGenre);
                    }
                    {
                        for (var i = 0; i < argument.MaxLevel; i++)
                        {
                            Console.Write("downloading level info ({0}/{1})... ", i + 1, argument.MaxLevel);
                            var musicLevel = connector.GetMusicLevelAsync(i).Result;
                            if (musicLevel.Success)
                            {
                                Console.WriteLine("success.");
                            }
                            else
                            {
                                Console.WriteLine("failure.");
                                WriteLineChunithmNetConnectionError(musicLevel);
                                return;
                            }
                            musicDataTable.Add(musicLevel.MusicLevel);
                        }
                    }
                }
            }

            if (argument.OutputXml)
            {
                Console.Write("outputting table file... ");
                var writer = new MusicDataTableXmlWriter();
                writer.Set(musicDataTable);
                writer.Write(argument.GetOutputFilePath("table.xlsx"));
                Console.WriteLine("done.");
            }

            Console.Write("sending table... ");
            var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(argument.Host);
            var result = databaseConnector.UpdateTableAsync(musicDataTable.MusicDatas).Result;
            if (result.Success)
            {
                Console.WriteLine("success.");
            }
            else
            {
                Console.WriteLine("failure.");
            }

            Console.WriteLine("completed.");
        }

        private static void WriteLineChunithmNetConnectionError(IChunithmNetApiResponse response)
        {
            Console.WriteLine(response.ErrorCode);
            Console.WriteLine(response.ErrorMessage);
        }
    }
}
