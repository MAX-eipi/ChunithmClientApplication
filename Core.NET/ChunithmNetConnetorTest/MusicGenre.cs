using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IMusicGenreGetResponse MusicGenre(int genreCode, Difficulty difficulty)
        {
            Console.WriteLine($"API: MusicGenre({genreCode}, {difficulty})");
            var musicGenre = connector.GetMusicGenreAsync(genreCode, difficulty).Result;
            if (musicGenre.Success)
            {
                Console.WriteLine(" Successful");

                var recordUnits = musicGenre.MusicGenre.Units;
                for (var i = 0; i < recordUnits.Length; i++)
                {
                    Console.WriteLine($" Record Unit {i}");
                    Console.WriteLine($"  {recordUnits[i].Id}: {recordUnits[i].Name}");
                    Console.WriteLine($"  ジャンル: {recordUnits[i].Genre}");
                    Console.WriteLine($"  難易度: {recordUnits[i].Difficulty}");
                    Console.WriteLine($"  スコア: {recordUnits[i].Score}");
                }
            }
            else
            {
                ShowCommonErrorMessage(musicGenre);
            }

            return musicGenre;
        }
    }
}
