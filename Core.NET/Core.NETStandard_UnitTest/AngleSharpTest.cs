using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Parse)]
    public class AngleSharpTest
    {
        private static IHtmlDocument LoadHtmlDocument(string path)
        {
            var source = File.ReadAllText(path);
            var parser = new HtmlParser();
            return parser.ParseDocument(source);
        }

        [TestMethod]
        public void ParseErrorPageTest()
        {
            var path = TestUtility.ResourceDirectory + "/API/Error.html";
            var doc = LoadHtmlDocument(path);
            Assert.IsNotNull(doc, "ドキュメント生成");
            var contents = doc.GetElementById("inner");
            Assert.IsNotNull(contents, "コンテンツ取得");

            var errorInfo = contents.GetElementsByClassName("block")?.FirstOrDefault();
            Assert.IsNotNull(errorInfo, "エラー情報取得");
            var errorCodeRegex = new Regex(@"Error Code: (\d*)");
            var errorCodeText = errorCodeRegex.Match(errorInfo.GetElementsByClassName("font_small")?[0]?.TextContent).Groups?[1]?.Value;
            int.TryParse(errorCodeText, out int errorCode);
            Assert.AreEqual(200106, errorCode, "エラーコードチェック");
            var errorMessage = errorInfo.GetElementsByClassName("font_small")?[1]?.TextContent
                .Replace("\t", "")
                .Replace("\n", "");
            Assert.AreEqual("エラーが発生しました。再度ログインしてください。", errorMessage, "エラーメッセージチェック");
        }
    }
}