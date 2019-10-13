using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;

namespace ChunithmClientLibrary.Parser
{
    public abstract class HtmlParser<TParseData> : IParser<string, TParseData>, IParser<IHtmlDocument, TParseData>
    {
        public virtual TParseData Parse(string source)
        {
            var parser = new HtmlParser();
            return Parse(parser.ParseDocument(source));
        }

        public abstract TParseData Parse(IHtmlDocument document);
    }
}
