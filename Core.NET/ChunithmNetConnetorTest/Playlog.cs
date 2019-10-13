using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IPlaylogGetResponse Playlog()
        {
            Console.WriteLine("API: Playlog()");
            var playlog = connector.GetPlaylogAsync().Result;

            if (playlog.Success)
            {
                Console.WriteLine("  Successful");

                var recordUnits = playlog.Playlog.Units;
                for (var i = 0; i < recordUnits.Length; i++)
                {
                    Console.WriteLine($"  Record Unit {i}");
                    Console.WriteLine($"   楽曲名: {recordUnits[i].Name}");
                    Console.WriteLine($"   難易度: {recordUnits[i].Difficulty}");
                    Console.WriteLine($"   スコア: {recordUnits[i].Score}");
                    Console.WriteLine($"   プレイ日時: {recordUnits[i].PlayDate}");
                }
            }
            else
            {
                ShowCommonErrorMessage(playlog);
            }

            return playlog;
        }
    }
}
