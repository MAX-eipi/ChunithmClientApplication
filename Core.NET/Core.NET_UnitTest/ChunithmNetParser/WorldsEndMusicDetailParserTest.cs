using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class WorldsEndMusicDetailParserTest
    {
        [TestMethod]
        public void WorldsEndMusicDetailParser_Test1()
        {
            var source = TestUtility.LoadResource("WorldsEndMusicDetail/html_test_case_1.html");
            var parser = new WorldsEndMusicDetailParser();
            var worldsEndMusicDetail = parser.Parse(source);
            Assert.IsNotNull(worldsEndMusicDetail, "パースチェック");
            Assert.AreEqual("G e n g a o z o", worldsEndMusicDetail.Name, "楽曲名チェック");
            Assert.AreEqual("-45", worldsEndMusicDetail.ArtistName, "アーティスト名チェック");
            Assert.AreEqual("https://chunithm-net.com/mobile/img/25060651b6218ce9.jpg", worldsEndMusicDetail.ImageName, "ジャケット名チェック");
            Assert.AreEqual(9, worldsEndMusicDetail.WorldsEndLevel, "レベルチェック");
            Assert.AreEqual(WorldsEndType.狂, worldsEndMusicDetail.WorldsEndType, "タイプチェック");
            var unit = worldsEndMusicDetail.WorldsEnd;
            Assert.IsNotNull(unit, "ユニットチェック");
            Assert.IsNull(worldsEndMusicDetail.GetUnit(Difficulty.Invalid), "ユニット取得チェック1");
            Assert.AreEqual(unit, worldsEndMusicDetail.GetUnit(Difficulty.WorldsEnd), "ユニット取得チェック2");
            Assert.AreEqual(Difficulty.WorldsEnd, unit.Difficulty, "難易度チェック");
            Assert.AreEqual(205950, unit.Score, "スコアチェック");
            Assert.AreEqual(false, unit.IsClear, "クリアチェック");
            Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボチェック");
            Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインチェック");
            Assert.AreEqual(new DateTime(2018, 1, 11, 21, 31, 0), unit.PlayDate, "最終プレイ日時チェック");
            Assert.AreEqual(1, unit.PlayCount, "プレイ回数チェック");
        }

        [TestMethod]
        public void WorldsEndMusicDetailParser_Error_Test1()
        {
            var worldsEndMusicDetail = new WorldsEndMusicDetailParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(worldsEndMusicDetail);
        }
    }
}
