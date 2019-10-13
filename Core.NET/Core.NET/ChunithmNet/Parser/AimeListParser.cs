using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public sealed class AimeListParser : HtmlParser<AimeList>
    {
        public override AimeList Parse(IHtmlDocument document)
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

            var parseData = new AimeList();

            parseData.Units = GetUnits(content);

            return parseData;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "Aime選択・利用権設定";
        }

        private AimeList.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("box_player");
            if (contents == null)
            {
                return new AimeList.Unit[0];
            }

            var units = new List<AimeList.Unit>();
            foreach (var unit in contents.Select(PaseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private AimeList.Unit PaseUnit(IElement content, int index)
        {
            var unit = new AimeList.Unit();

            unit.RebornCount = GetRebornCount(content);
            unit.Level = GetLevel(content);
            unit.Name = GetName(content);
            unit.NowRating = GetNowRating(content);
            unit.MaxRating = GetMaxRating(content);
            unit.VoucherText = GetVoucherText(content);

            return unit;
        }

        private int GetRebornCount(IElement node)
        {
            var playerRebornText = node.GetElementsByClassName("player_reborn")?.FirstOrDefault()?.TextContent;
            int.TryParse(playerRebornText, out int rebornCount);
            return rebornCount;
        }

        private int GetLevel(IElement node)
        {
            var playerInfo = GetPlayerInfoTexts(node);
            int.TryParse(new Regex(@"Lv.(\d+)").Match(playerInfo[0]).Groups?[1]?.Value, out int level);
            return level;
        }

        private string GetName(IElement node)
        {
            var playerInfo = GetPlayerInfoTexts(node);
            var name = playerInfo[1];
            return name;
        }

        private double GetNowRating(IElement node)
        {
            var ratingInfo = GetRatingInfoText(node);
            var regex = new Regex(@"(\d{1,2}\.\d{1,2})");
            var matches = regex.Matches(ratingInfo);

            double.TryParse(matches[0].Value, out double nowRating);
            return nowRating;
        }

        private double GetMaxRating(IElement node)
        {
            var ratingInfo = GetRatingInfoText(node);
            var regex = new Regex(@"(\d{1,2}\.\d{1,2})");
            var matches = regex.Matches(ratingInfo);

            double.TryParse(matches[1].Value, out double maxRating);
            return maxRating;
        }

        private string GetVoucherText(IElement node)
        {
            return node.GetElementsByClassName("home_player_riyouken")?.FirstOrDefault()?.TextContent
                .Replace("\t", "")
                .Replace("\n", "");
        }

        private string[] GetPlayerInfoTexts(IElement node)
        {
            return node.GetElementsByClassName("player_name")?.FirstOrDefault()?.TextContent
                .Replace("\t", "")
                .Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);
        }

        private string GetRatingInfoText(IElement node)
        {
            return node.GetElementsByClassName("player_rating")?.FirstOrDefault()?.TextContent
                .Replace("\t", "")
                .Replace("\n", "");
        }
    }
}
