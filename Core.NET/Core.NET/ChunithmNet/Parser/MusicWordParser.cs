using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.Parser;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ChunithmClientLibrary.ChunithmNet.Parser
{
    public class MusicWordParser : HtmlParser<MusicWord>
    {
        public override MusicWord Parse(IHtmlDocument document)
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

            var musicWord = new MusicWord();

            musicWord.Units = GetUnits(musicDetail);

            return musicWord;
        }

        private bool IsValidDocument(IHtmlDocument document)
        {
            return HtmlParseUtility.GetPageTitle(document) == "楽曲別レコード";
        }

        private MusicWord.Unit[] GetUnits(IElement content)
        {
            var contents = content.GetElementsByClassName("musiclist_box");
            if (contents == null)
            {
                return new MusicWord.Unit[0];
            }

            var units = new List<MusicWord.Unit>();
            foreach (var unit in contents.Select(ParseUnit))
            {
                units.Add(unit);
            }
            return units.ToArray();
        }

        private MusicWord.Unit ParseUnit(IElement content, int index)
        {
            var unit = new MusicWord.Unit();

            unit.Id = GetId(content);
            unit.Name = GetName(content);

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
    }
}
