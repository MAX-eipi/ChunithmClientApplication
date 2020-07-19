using ChunithmClientLibrary.MusicData;
using ChunithmClientLibrary.ChunithmMusicDatabase.HttpClientConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using ChunithmClientLibrary.ChunithmMusicDatabase.API;

namespace GasDataManagerConnectorTest
{
    class Program
    {
        static ChunithmMusicDatabaseHttpClientConnector connector;

        static readonly bool TABLE_UPDATE = false;
        static readonly bool MUSIC_DATA_UPDATE = false;

        static readonly string url = "https://script.google.com/macros/s/AKfycbxujx4njFMXtNUKkzvCHIMz21RPt2F74XSzS5xgy9gkoFQ9l4A/exec";

        static void Main(string[] args)
        {
            connector = new ChunithmMusicDatabaseHttpClientConnector(url);

            ITableGetResponse tableGet = null;
            tableGet = TableGet();

            if (TABLE_UPDATE)
            {
                if (tableGet != null)
                {
                    TableUpdate(new List<IMusicDataTableUnit>(tableGet.MusicDataTable.GetTableUnits()));
                }
            }

            if (MUSIC_DATA_UPDATE)
            {
                if (tableGet != null)
                {
                    var music = tableGet.MusicDataTable.GetTableUnits().FirstOrDefault();
                    if (music != null)
                    {
                        MusicDataUpdate(new List<IMusicDataTableUnit>() { music });
                    }
                }
            }

            Console.ReadLine();
        }

        static ITableGetResponse TableGet()
        {
            Console.WriteLine("楽曲テーブルを取得");
            try
            {
                var tableGet = connector.GetTableAsync().Result;
                foreach (var musicData in tableGet.MusicDataTable.GetTableUnits())
                {
                    Console.WriteLine(musicData.Name);
                }

                return tableGet;
            }
            catch (Exception e)
            {
                Console.WriteLine("失敗");
                Console.WriteLine(e.Message);
                throw e;
            }
        }

        static ITableUpdateResponse TableUpdate(List<IMusicDataTableUnit> musicDatas)
        {
            Console.WriteLine("楽曲テーブルの更新");
            try
            {
                var tableUpdate = connector.UpdateTableAsync(musicDatas).Result;
                var comparer = new MusicDataComparer();
                var update = musicDatas.Except(tableUpdate.MusicDataTable.GetTableUnits(), comparer);

                if (update.Count() > 0)
                {
                    foreach (var musicData in update)
                    {
                        Console.WriteLine(musicData.Name);
                    }
                }
                else
                {
                    Console.WriteLine("更新なし");
                }

                return tableUpdate;
            }
            catch(Exception e)
            {
                Console.WriteLine("失敗");
                Console.WriteLine(e.Message);
                throw e;
            }
        }

        static IMusicDataUpdateResponse MusicDataUpdate(List<IMusicDataTableUnit> musicDatas)
        {
            Console.WriteLine("楽曲の更新");
            try
            {
                var musicDataUpdate = connector.UpdateMusicDataAsync(musicDatas).Result;
                var comparer = new MusicDataComparer();
                var update = musicDatas.Except(musicDataUpdate.UpdatedMusicDatas, comparer);

                if (update.Count() > 0)
                {
                    foreach (var musicData in update)
                    {
                        Console.WriteLine(musicData.Name);
                    }
                }
                else
                {
                    Console.WriteLine("更新なし");
                }

                return musicDataUpdate;
            }
            catch (Exception e)
            {
                Console.WriteLine("失敗");
                Console.WriteLine(e.Message);
                throw e;
            }
        }

        private class MusicDataComparer : IEqualityComparer<IMusicDataTableUnit>
        {
            public bool Equals(IMusicDataTableUnit x, IMusicDataTableUnit y)
            {
                return x.Id == y.Id;
            }

            public int GetHashCode(IMusicDataTableUnit obj)
            {
                return obj.Id.GetHashCode();
            }
        }
    }
}
