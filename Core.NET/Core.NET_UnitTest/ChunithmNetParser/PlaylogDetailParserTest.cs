using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Data;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class PlaylogDetailParserTest
    {
        [TestMethod]
        public void PlaylogDetailParser_Test1()
        {
            var playlogDetail = GetPlaylogDetail("PlaylogDetail/html_test_case_1.html");
            Assert.IsNotNull(playlogDetail, "パースチェック");

            Assert.AreEqual("Summer is over", playlogDetail.Name, "楽曲名チェック");
            Assert.AreEqual(Difficulty.Master, playlogDetail.Difficulty, "難易度チェック");
            Assert.AreEqual(1006611, playlogDetail.Score, "スコアチェック");
            Assert.AreEqual(Rank.SS, playlogDetail.Rank, "ランクチェック");
            Assert.AreEqual(true, playlogDetail.IsClear, "クリアチェック");
            Assert.AreEqual(true, playlogDetail.IsNewRecord, "NEW RECORD チェック");
            Assert.AreEqual(ComboStatus.None, playlogDetail.ComboStatus, "コンボチェック");
            Assert.AreEqual(ChainStatus.None, playlogDetail.ChainStatus, "チェインチェック");
            Assert.AreEqual(2, playlogDetail.Track, "プレイトラックチェック");
            Assert.AreEqual(new DateTime(2018, 11, 5, 21, 45, 0), playlogDetail.PlayDate, "プレイ日時チェック");
            Assert.AreEqual("THE 3RD PLANET フレスポ八潮店", playlogDetail.StoreName, "プレイ店舗チェック");
            Assert.AreEqual("黒柳 ルリ子", playlogDetail.CharacterName, "キャラクターチェック");
            Assert.AreEqual("勇気のしるし", playlogDetail.SkillName, "スキル名チェック");
            Assert.AreEqual(5, playlogDetail.SkillLevel, "スキルレベルチェック");
            Assert.AreEqual(96684, playlogDetail.SkillResult, "スキルリザルトチェック");
            Assert.AreEqual(1156, playlogDetail.MaxCombo, "MAX COMBO チェック");
            Assert.AreEqual(1872, playlogDetail.JusticeCriticalCount, "JCチェック");
            Assert.AreEqual(43, playlogDetail.JusticeCount, "Jチェック");
            Assert.AreEqual(6, playlogDetail.AttackCount, "Aチェック");
            Assert.AreEqual(3, playlogDetail.MissCount, "Mチェック");
            Assert.AreEqual(100.39, playlogDetail.TapPercentage, "TAPチェック");
            Assert.AreEqual(100.96, playlogDetail.HoldPercentage, "HOLDチェック");
            Assert.AreEqual(101, playlogDetail.SlidePercentage, "SLIDEチェック");
            Assert.AreEqual(101, playlogDetail.AirPercentage, "AIRチェック");
            Assert.AreEqual(100.17, playlogDetail.FlickPercentage, "FLICKチェック");
        }

        [TestMethod]
        public void PlaylogDetailParser_Error_Test1()
        {
            var playlogDetail = GetPlaylogDetail("Common/error_page.html");
            Assert.IsNull(playlogDetail);
        }

        private PlaylogDetail GetPlaylogDetail(string path)
        {
            return new PlaylogDetailParser().Parse(TestUtility.LoadResource(path));
        }
    }
}
