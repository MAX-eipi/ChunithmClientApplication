using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicDetailParserTest
    {
        [TestMethod]
        public void MusicDetailParser_Test1()
        {
            var path = TestUtility.GetResourcePath("MusicDetail/html_test_case_1.html");
            var source = Utility.LoadStringContent(path);
            var parser = new MusicDetailParser();
            var musicDetail = parser.Parse(source);
            Assert.IsNotNull(musicDetail, "パースチェック");
            Assert.AreEqual("業 -善なる神とこの世の悪について-", musicDetail.Name, "楽曲名チェック");
            Assert.AreEqual("光吉猛修 VS 穴山大輔", musicDetail.ArtistName, "アーティスト名チェック");
            Assert.AreEqual("https://chunithm-net.com/mobile/img/6c682b055a448ee8.jpg", musicDetail.ImageName, "イメージ名チェック");

            {
                var unit = musicDetail.Basic;
                Assert.IsNotNull(unit, "BASICパースチェック");
                Assert.AreEqual(Difficulty.Basic, unit.Difficulty, "難易度");
                Assert.AreEqual(1010000, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "フルコンボステータス");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "フルチェインステータス");
                Assert.AreEqual(new DateTime(2018, 9, 21, 20, 5, 0), unit.PlayDate, "最終プレイ日時");
                Assert.AreEqual(1, unit.PlayCount, "プレイ回数");
            }
            {
                var unit = musicDetail.Advanced;
                Assert.IsNotNull(unit, "ADVANCEDパースチェック");
                Assert.AreEqual(Difficulty.Advanced, unit.Difficulty, "難易度");
                Assert.AreEqual(1010000, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "フルコンボステータス");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "フルチェインステータス");
                Assert.AreEqual(new DateTime(2018, 9, 27, 22, 1, 0), unit.PlayDate, "最終プレイ日時");
                Assert.AreEqual(4, unit.PlayCount, "プレイ回数");
            }
            {
                var unit = musicDetail.Expert;
                Assert.IsNotNull(unit, "EXPERTパースチェック");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(1006294, unit.Score, "スコア");
                Assert.AreEqual(Rank.SS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "フルコンボステータス");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "フルチェインステータス");
                Assert.AreEqual(new DateTime(2018, 10, 1, 21, 53, 0), unit.PlayDate, "最終プレイ日時");
                Assert.AreEqual(3, unit.PlayCount, "プレイ回数");
            }
            {
                var unit = musicDetail.Master;
                Assert.IsNotNull(unit, "MASTERパースチェック");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(991731, unit.Score, "スコア");
                Assert.AreEqual(Rank.S, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "フルコンボステータス");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "フルチェインステータス");
                Assert.AreEqual(new DateTime(2018, 10, 7, 15, 21, 0), unit.PlayDate, "最終プレイ日時");
                Assert.AreEqual(7, unit.PlayCount, "プレイ回数");
            }
        }

        [TestMethod]
        public void MusicDetailParser_Error_Test1()
        {
            var musicDetail = new MusicDetailParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicDetail);
        }
    }
}
