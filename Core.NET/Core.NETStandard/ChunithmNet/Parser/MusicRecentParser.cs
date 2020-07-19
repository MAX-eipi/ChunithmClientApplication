using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public class MusicRecentParser : HtmlParser<MusicRecent>
    {
        public override MusicRecent Parse(IHtmlDocument document)
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

            var MusicRecent = new MusicRecent();

            MusicRecent.Units = GetUnits(musicDetail);

            return MusicRecent;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "楽曲別レコード";
        }

        private MusicRecent.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("musiclist_box");
            if (contents == null)
            {
                return new MusicRecent.Unit[0];
            }

            var units = new List<MusicRecent.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private MusicRecent.Unit ParseUnit(IElement content, int index)
        {
            var unit = new MusicRecent.Unit();

            unit.Id = GetId(content);
            unit.Name = GetName(content);

            return unit;
        }

        private int GetId(IElement content)
        {
            return HtmlParseUtility.GetMusicId(content.ParentElement);
        }

        private string GetName(IElement content)
        {
            return HtmlParseUtility.GetMusicTitle(content);
        }
    }
}
