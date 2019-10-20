using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmMusicDatabase.API;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using ChunithmClientLibrary.ChunithmNet.API;
using ChunithmClientLibrary.ChunithmNet.HttpClientConnector;
using ChunithmClientLibrary.MusicData;
using System;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace ChunithmMusicDataTableCreator
{
    [DataContract]
    public class UserInfo
    {
        [DataMember]
        private string segaId = "";
        [IgnoreDataMember]
        public string SegaId => segaId;

        [DataMember]
        private string password = "";
        [IgnoreDataMember]
        public string Password => password;

        [DataMember]
        private int aimeId = 0;
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
        }
        
        private const int GENRE_CODE_ALL = 99;

        static int Main(string[] args)
        {
            try
            {
                var argument = new Argument(args);

                var musicDataTable = new MusicDataTable();
                using (var connector = new ChunithmNetHttpClientConnector())
                using (var databaseConnector = new ChunithmMusicDatabaseHttpClientConnector(argument.Host))
                {
                    var currentTable = databaseConnector.GetTableAsync().GetMusicDatabaseApiResult("get current table... ");

                    connector.LoginAsync(argument.SegaId, argument.Password).GetNetApiResult("login... ");
                    connector.SelectAimeAsync(argument.AimeId).GetNetApiResult("selecting aime... ");

                    var musicGenre = connector.GetMusicGenreAsync(GENRE_CODE_ALL, Difficulty.Master).GetNetApiResult("downloading music list... ");
                    musicDataTable.Add(musicGenre.MusicGenre);

                    if (currentTable.MusicDataTable.GetTableUnits().Count() == musicDataTable.GetTableUnits().Count())
                    {
                        Console.WriteLine("skip update.");
                        return 0;
                    }

                    for (var i = 0; i < argument.MaxLevel; i++)
                    {
                        var musicLevel = connector.GetMusicLevelAsync(i).GetNetApiResult($"downloading level info ({i + 1}/{argument.MaxLevel})", false);
                        musicDataTable.Add(musicLevel.MusicLevel);
                    }

                    databaseConnector.UpdateTableAsync(musicDataTable.MusicDatas).GetMusicDatabaseApiResult("sending table... ");

                    Console.WriteLine("completed.");
                    return 0;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return 1;
            }
        }
    }

    public static class Extensions
    {
        public static TResponse GetNetApiResult<TResponse>(this Task<TResponse> request, string message, bool showSuccess = true)
            where TResponse : IChunithmNetApiResponse
        {
            Console.WriteLine(message);

            var response = request.Result;
            if (response.Success)
            {
                if (showSuccess)
                {
                    Console.WriteLine("success.");
                }
            }
            else
            {
                Console.WriteLine("failure.");
                Console.WriteLine("[Error Code]");
                Console.WriteLine(response.ErrorCode);
                Console.WriteLine("[Error Message]");
                Console.WriteLine(response.ErrorMessage);
                throw new ApplicationException();
            }
            return response;
        }

        public static TResponse GetMusicDatabaseApiResult<TResponse>(this Task<TResponse> request, string message)
            where TResponse : IChunithmMusicDatabaseApiResponse
        {
            Console.WriteLine(message);

            var result = request.Result;
            if (result.Success)
            {
                Console.WriteLine("success.");
            }
            else
            {
                Console.WriteLine("failure.");
                throw new ApplicationException();
            }
            return result;
        }
    }
}
