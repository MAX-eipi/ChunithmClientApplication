using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class PlaylogParser : HtmlParser<Playlog>
    {
        public override Playlog Parse(IHtmlDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            if (!IsValidDocument(document))
            {
                return null;
            }

            var content = document.GetElementById("inner");
            if (content == null)
            {
                return null;
            }

            var playlog = new Playlog();
            playlog.Units = GetUnits(content);
            return playlog;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "プレイ履歴";
        }

        private Playlog.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("frame02");
            if (contents == null)
            {
                return new Playlog.Unit[0];
            }

            var units = new List<Playlog.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            units.Reverse();
            return units.ToArray();
        }

        private Playlog.Unit ParseUnit(IElement content, int index)
        {
            var unit = new Playlog.Unit();

            unit.Name = GetName(content);
            unit.ImageName = GetImageName(content);
            unit.Difficulty = GetDifficulty(content);
            unit.Score = GetScore(content);
            unit.Rank = GetRank(content);
            unit.IsNewRecord = GetIsNewRecord(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);
            unit.Track = GetTrack(content);
            unit.PlayDate = GetPlayDate(content);

            return unit;
        }

        private string GetName(IElement content)
        {
            return content.GetElementsByClassName("play_musicdata_title")?.FirstOrDefault()?.TextContent ?? DefaultParameter.Name;
        }

        private string GetImageName(IElement content)
        {
            return HtmlParseUtility.GetImageName(content);
        }

        private Difficulty GetDifficulty(IElement content)
        {
            return HtmlParseUtility.GetDifficultyFromPlayTrackResult(content);
        }

        private int GetScore(IElement content)
        {
            return HtmlParseUtility.GetPlayMusicDataScore(content);
        }

        private Rank GetRank(IElement content)
        {
            return HtmlParseUtility.GetRank(content);
        }

        private bool GetIsNewRecord(IElement content)
        {
            return HtmlParseUtility.GetIsNewRecord(content);
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

        private int GetTrack(IElement content)
        {
            return HtmlParseUtility.GetTrack(content);
        }

        private DateTime GetPlayDate(IElement content)
        {
            return HtmlParseUtility.GetPlayDataListDate(content);
        }
    }
}
