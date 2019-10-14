using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using System;
using System.IO;
using System.Runtime.Serialization;

namespace ChunithmMusicDataTableCreator
{
    [DataContract]
    public class UserInfo
    {
        [DataMember]
        private string segaId;
        [IgnoreDataMember]
        public string SegaId => segaId;
        
        [DataMember]
        private string password;
        [IgnoreDataMember]
        public string Password => password;
        
        [DataMember]
        private int aimeId;
        [IgnoreDataMember]
        public int AimeId => aimeId;
    }
    
    class Program
    {
        private class Argument
        {
            public string Host { get; private set; }

            public string SegaId { get; private set; } = "";
            public string Password { get; private set; } = "";
            public int AimeId { get; private set; } = 0;

            public bool OutputJson { get; private set; } = false;
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
                        case "--user_info":
                            SetUserInfo(args[i + 1]);
                            i += 2;
                            break;
                        case "--output_json":
                            OutputJson = true;
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
            
            private void SetUserInfo(string path)
            {
                var source = Utility.LoadStringContent(path);
                var userInfo = Utility.DeserializeFromJson<UserInfo>(source);
                SegaId = userInfo.SegaId;
                Password = userInfo.Password;
                AimeId = userInfo.AimeId;   
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
            using (var connector = new ChunithmNetHttpClientConnector())
            using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(argument.Host))
            {   
                Console.WriteLine("get current table... ");
                var currentTableGet = databaseConnector.GetTableAsync().Result;
                if (currentTableGet.Success)
                {
                }
                
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
                
                if (argument.OutputJson)
                {
                    Console.Write("outputting table file... ");
                    var writer = new MusicDataTableJsonWriter();
                    writer.Set(musicDataTable);
                    writer.Write(argument.GetOutputFilePath("table.json"));
                    Console.WriteLine("done.");
                }
                
                Console.Write("sending table... ");

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
        }

        private static void WriteLineChunithmNetConnectionError(IChunithmNetApiResponse response)
        {
            Console.WriteLine(response.ErrorCode);
            Console.WriteLine(response.ErrorMessage);
        }
    }
}
