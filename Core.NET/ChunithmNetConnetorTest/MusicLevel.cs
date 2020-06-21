using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IMusicLevelGetResponse MusicLevel(int level)
        {
            Console.WriteLine($"API: MusicLevel({level})");
            var musicLevel = connector.GetMusicLevelAsync(level).Result;
            if (musicLevel.Success)
            {
                Console.WriteLine(" Successful");

                var recordUnits = musicLevel.MusicLevel.Units;
                for (var i = 0; i < recordUnits.Length; i++)
                {
                    Console.WriteLine($" Record Unit {i}");
                    Console.WriteLine($"  {recordUnits[i].Id}: {recordUnits[i].Name}");
                    Console.WriteLine($"  難易度: {recordUnits[i].Difficulty}");
                    Console.WriteLine($"  スコア: {recordUnits[i].Score}");
                }
            }
            else
            {
                ShowCommonErrorMessage(musicLevel);
            }

            return musicLevel;
        }
    }
}
