using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IWorldsEndMusicGetResponse WorldsEndMusic()
        {
            Console.WriteLine("API: WorldsEndMusic()");
            var worldsEndMusic = connector.GetWorldsEndMusicAsync().Result;

            if (worldsEndMusic.Success)
            {
                Console.WriteLine("  Successful");

                var recordUnits = worldsEndMusic.WorldsEndMusic.Units;
                for (var i = 0; i < recordUnits.Length; i++)
                {
                    Console.WriteLine($"  Record Unit {i}");
                    Console.WriteLine($"   楽曲名: {recordUnits[i].Name}");
                    Console.WriteLine($"   難易度: {recordUnits[i].Difficulty}");
                    Console.WriteLine($"   スコア: {recordUnits[i].Score}");
                }
            }
            else
            {
                ShowCommonErrorMessage(worldsEndMusic);
            }

            return worldsEndMusic;
        }
    }
}
