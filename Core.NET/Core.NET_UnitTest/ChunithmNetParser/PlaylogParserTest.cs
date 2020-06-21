using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    [TestCategory(TestUtility.Category.HtmlParser)]
    public class PlaylogParserTest
    {
        [TestMethod]
        public void PlaylogParser_Test1()
        {
            var parser = new PlaylogParser();
            var playlog = parser.Parse(TestUtility.LoadResource("Playlog/html_test_case_1.html"));
            Assert.IsNotNull(playlog, "パースチェック");

            var units = playlog.Units;
            Assert.AreEqual(50, units.Length, "件数チェック");
            {
                var data = units[49];
                Assert.IsNotNull(data, "data");
                Assert.AreEqual("Summer is over", data.Name, "楽曲名");
                Assert.AreEqual("https://chunithm-net.com/mobile/img/7f762cd037e10951.jpg", data.ImageName, "イメージ名");
                Assert.AreEqual(Difficulty.Master, data.Difficulty, "難易度");
                Assert.AreEqual(1008965, data.Score, "スコア");
                Assert.AreEqual(Rank.SSS, data.Rank, "ランク");
                Assert.AreEqual(true, data.IsClear, "クリア");
                Assert.AreEqual(true, data.IsNewRecord, "ニューレコード");
                Assert.AreEqual(ComboStatus.None, data.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, data.ChainStatus, "チェインランプ");
                Assert.AreEqual(3, data.Track, "トラック");
                Assert.AreEqual(new DateTime(2018, 11, 5, 21, 49, 0), data.PlayDate, "プレイ日時");
            }
            {
                var data = units[45];
                Assert.IsNotNull(data, "data");
                Assert.AreEqual("Kronos", data.Name, "楽曲名");
                Assert.AreEqual("https://chunithm-net.com/mobile/img/9c5e71b3588dbc70.jpg", data.ImageName, "イメージ名");
                Assert.AreEqual(Difficulty.Expert, data.Difficulty, "難易度");
                Assert.AreEqual(831635, data.Score, "スコア");
                Assert.AreEqual(Rank.BBB, data.Rank, "ランク");
                Assert.AreEqual(false, data.IsClear, "クリア");
                Assert.AreEqual(false, data.IsNewRecord, "ニューレコード");
                Assert.AreEqual(ComboStatus.None, data.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, data.ChainStatus, "チェインランプ");
                Assert.AreEqual(2, data.Track, "トラック");
                Assert.AreEqual(new DateTime(2018, 11, 5, 21, 34, 0), data.PlayDate, "プレイ日時");
            }
        }

        [TestMethod]
        public void PlaylogParser_Error_Test1()
        {
            var playlog = new PlaylogParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(playlog);
        }
    }
}
