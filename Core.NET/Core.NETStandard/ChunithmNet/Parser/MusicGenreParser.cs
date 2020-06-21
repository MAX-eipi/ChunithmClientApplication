using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class MusicGenreParser : HtmlParser<MusicGenre>
    {
        public override MusicGenre Parse(IHtmlDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            if (!IsValidDocument(document))
            {
                return null;
            }

            var scoreListResult = document.GetElementById("scoreList_result");
            if (scoreListResult == null)
            {
                return null;
            }

            var musicDetail = document.GetElementById("inner");
            if (musicDetail == null)
            {
                return null;
            }

            var musicGenre = new MusicGenre();

            musicGenre.MusicCount = GetMusicCount(scoreListResult);
            musicGenre.ClearCount = GetClearCount(scoreListResult);
            musicGenre.SCount = GetSCount(scoreListResult);
            musicGenre.SsCount = GetSsCount(scoreListResult);
            musicGenre.SssCount = GetSssCount(scoreListResult);
            musicGenre.FullComboCount = GetFullComboCount(scoreListResult);
            musicGenre.AllJusticeCount = GetAllJusticeCount(scoreListResult);
            musicGenre.FullChainGoldCount = GetFullChainGoldCount(scoreListResult);
            musicGenre.FullChainPlatinumCount = GetFullChainPlatinumCount(scoreListResult);
            musicGenre.Units = GetUnits(musicDetail);

            return musicGenre;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "楽曲別レコード";
        }

        private int GetMusicCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_clear"))
                {
                    return score.Item3;
                }
            }

            return 0;
        }

        private int GetClearCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_clear"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetSCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_rank_8"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetSsCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_rank_9"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetSssCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_rank_10"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetFullComboCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_fullcombo"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetAllJusticeCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_alljustice"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetFullChainGoldCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_fullchain2"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private int GetFullChainPlatinumCount(IElement content)
        {
            var scoreList = GetScoreList(content);
            foreach (var score in scoreList)
            {
                if (score.Item1.Contains("icon_fullchain") && !score.Item1.Contains("icon_fullchain2"))
                {
                    return score.Item2;
                }
            }

            return 0;
        }

        private List<Tuple<string, int, int>> GetScoreList(IElement content)
        {
            var scoreListContents = content.GetElementsByClassName("score_list");

            if (scoreListContents == null)
            {
                return new List<Tuple<string, int, int>>();
            }

            var scoreList = new List<Tuple<string, int, int>>();
            foreach (var score in scoreListContents)
            {
                var left = score
                    .GetElementsByClassName("score_list_left")?.FirstOrDefault()?
                    .GetElementsByTagName("img")?.FirstOrDefault()?
                    .GetAttribute("src");

                if (string.IsNullOrEmpty(left))
                {
                    continue;
                }

                var right = score
                    .GetElementsByClassName("score_list_right")?.FirstOrDefault()?
                    .TextContent?.Replace(" ", "").Split(new[] { "/" }, StringSplitOptions.None);

                if (right == null || right.Length < 2)
                {
                    continue;
                }

                var numerator = 0;
                var denominator = 0;

                if (!int.TryParse(right[0], out numerator))
                {
                    continue;
                }

                if (!int.TryParse(right[1], out denominator))
                {
                    continue;
                }

                scoreList.Add(new Tuple<string, int, int>(left, numerator, denominator));
            }

            return scoreList;
        }

        private MusicGenre.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("musiclist_box");
            if (contents == null)
            {
                return new MusicGenre.Unit[0];
            }

            var units = new List<MusicGenre.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private MusicGenre.Unit ParseUnit(IElement content, int index)
        {
            var unit = new MusicGenre.Unit();

            unit.Id = GetId(content);
            unit.Name = GetName(content);
            unit.Genre = GetGenre(content);
            unit.Difficulty = GetDifficulty(content);
            unit.Score = GetScore(content);
            unit.Rank = GetRank(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);

            return unit;
        }

        private int GetId(IElement content)
        {
            return HtmlParseUtility.GetMusicId(content);
        }

        private string GetName(IElement content)
        {
            return HtmlParseUtility.GetMusicTitle(content);
        }

        private string GetGenre(IElement content)
        {
            var genreName = content.ParentElement.ParentElement.GetElementsByClassName("genre")?.FirstOrDefault()?.TextContent;
            if (string.IsNullOrEmpty(genreName))
            {
                return DefaultParameter.Genre;
            }

            return genreName;
        }

        private Difficulty GetDifficulty(IElement content)
        {
            return HtmlParseUtility.GetDifficulty(content);
        }

        private int GetScore(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataHighScore(content);
        }

        private Rank GetRank(IElement content)
        {
            return HtmlParseUtility.GetRank(content);
        }

        private bool GetIsClear(IElement content)
        {
            return HtmlParseUtility.GetIsClear(content);
        }

        private ComboStatus GetComboStatus(IElement content)
        {
            return HtmlParseUtility.GetComboStatus(content);
        }

        private ChainStatus GetChainStatus(IElement content)
        {
            return HtmlParseUtility.GetChainStatus(content);
        }
    }
}
