using ChunithmClientLibrary.ChunithmNet.API;
using System;

namespace ChunithmNetConnetorTest
{
    partial class Program
    {
        private static IPlaylogDetailGetResponse PlaylogDetail(int index)
        {
            Console.WriteLine($"API: PlaylogDetail({index})");
            var playlogDetailResult = connector.GetPlaylogDetailAsync(index).Result;

            if (playlogDetailResult.Success)
            {
                var playlogDetail = playlogDetailResult.PlaylogDetail;
                Console.WriteLine("  Successful");
                Console.WriteLine($"  楽曲名: {playlogDetail.Name}");
                Console.WriteLine($"  難易度: {playlogDetail.Difficulty}");
                Console.WriteLine($"  スコア: {playlogDetail.Score}");
                Console.WriteLine($"  トラック: {playlogDetail.Track}");
                Console.WriteLine($"  プレイ日時: {playlogDetail.PlayDate}");
                Console.WriteLine($"  ジャケット: {playlogDetail.ImageName}");
                Console.WriteLine($"  店舗名: {playlogDetail.StoreName}");
                Console.WriteLine($"  キャラクター名: {playlogDetail.CharacterName}");
                Console.WriteLine($"  スキル: {playlogDetail.SkillName}");
                Console.WriteLine($"  スキルレベル: {playlogDetail.SkillLevel}");
                Console.WriteLine($"  スキルリザルト: {playlogDetail.SkillResult}");
                Console.WriteLine($"  MAXコンボ: {playlogDetail.MaxCombo}");
                Console.WriteLine("  判定内訳: ({0}, {1}, {2}, {3})",
                    playlogDetail.JusticeCriticalCount,
                    playlogDetail.JusticeCount,
                    playlogDetail.AttackCount,
                    playlogDetail.MissCount);
                Console.WriteLine("  ノーツ比率: ({0}%, {1}%, {2}%, {3}%, {4}%)",
                    playlogDetail.TapPercentage,
                    playlogDetail.HoldPercentage,
                    playlogDetail.SlidePercentage,
                    playlogDetail.AirPercentage,
                    playlogDetail.FlickPercentage);
            }
            else
            {
                ShowCommonErrorMessage(playlogDetailResult);
            }

            return playlogDetailResult;
        }
    }
}
