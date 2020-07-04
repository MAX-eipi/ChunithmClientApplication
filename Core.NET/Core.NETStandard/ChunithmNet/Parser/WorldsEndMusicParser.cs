using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public class WorldsEndMusicParser : HtmlParser<WorldsEndMusic>
    {
        public override WorldsEndMusic Parse(IHtmlDocument document)
        {
            if (document == null)
            {
                throw new ArgumentNullException(nameof(document));
            }

            if (!IsValidDocument(document))
            {
                return null;
            }

            var musicDetail = document.GetElementById("inner");
            if (musicDetail == null)
            {
                return null;
            }

            var worldsEndMusic = new WorldsEndMusic();

            worldsEndMusic.Units = GetUnits(musicDetail);

            return worldsEndMusic;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "WORLD'S END レコード";
        }

        private WorldsEndMusic.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("musiclist_box");
            if (contents == null)
            {
                return new WorldsEndMusic.Unit[0];
            }

            var units = new List<WorldsEndMusic.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private WorldsEndMusic.Unit ParseUnit(IElement content, int index)
        {
            var unit = new WorldsEndMusic.Unit();

            unit.Id = GetId(content);
            unit.Name = GetName(content);
            unit.Difficulty = GetDifficulty(content);
            unit.WorldsEndLevel = GetWorldsEndLevel(content);
            unit.WorldsEndType = GetWorldsEndType(content);
            unit.Score = GetScore(content);
            unit.Rank = GetRank(content);
            unit.IsClear = GetIsClear(content);
            unit.ComboStatus = GetComboStatus(content);
            unit.ChainStatus = GetChainStatus(content);

            return unit;
        }

        private int GetId(IElement content)
        {
            return HtmlParseUtility.GetWorldsEndMusicId(content);
        }

        private string GetName(IElement content)
        {
            return content.GetElementsByClassName("musiclist_worldsend_title")?.FirstOrDefault()?.TextContent ?? DefaultParameter.Name;
        }

        private Difficulty GetDifficulty(IElement content)
        {
            return Difficulty.WorldsEnd;
        }

        private int GetWorldsEndLevel(IElement content)
        {
            return HtmlParseUtility.GetWorldsEndLevelFromHighScoreRecord(content);
        }

        private WorldsEndType GetWorldsEndType(IElement content)
        {
            return HtmlParseUtility.GetWorldsEndTypeFromMusicListWorldsEndIcon(content);
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
