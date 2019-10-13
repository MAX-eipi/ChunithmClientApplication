using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicLevelParserTest
    {
        [TestMethod]
        public void MusicLevelParser_Test1()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("MusicLevel/html_test_case_1.html"));
            Assert.IsNotNull(musicLevel, "パースチェック");

            Assert.AreEqual(41, musicLevel.MusicCount, "楽曲数");
            Assert.AreEqual(39, musicLevel.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(39, musicLevel.SCount, "S 楽曲数");
            Assert.AreEqual(39, musicLevel.SsCount, "SS 楽曲数");
            Assert.AreEqual(39, musicLevel.SssCount, "SSS 楽曲数");
            Assert.AreEqual(39, musicLevel.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(39, musicLevel.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(0, musicLevel.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicLevel.Units;
            Assert.AreEqual(3, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(531, unit.Id, "ID");
                Assert.AreEqual("ホーリーナイト", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(10.7, unit.Level, "レベル");
                Assert.AreEqual(1009974, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(138, unit.Id, "ID");
                Assert.AreEqual("conflict", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(10.7, unit.Level, "レベル");
                Assert.AreEqual(1010000, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[2];
                Assert.IsNotNull(unit);
                Assert.AreEqual(692, unit.Id, "ID");
                Assert.AreEqual("足立オウフwwww", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Expert, unit.Difficulty, "難易度");
                Assert.AreEqual(10.7, unit.Level, "レベル");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void MusicLevelParser_Test2()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("MusicLevel/html_test_case_2.html"));
            Assert.IsNotNull(musicLevel, "パースチェック");

            Assert.AreEqual(219, musicLevel.MusicCount, "楽曲数");
            Assert.AreEqual(215, musicLevel.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(215, musicLevel.SCount, "S 楽曲数");
            Assert.AreEqual(215, musicLevel.SsCount, "SS 楽曲数");
            Assert.AreEqual(215, musicLevel.SssCount, "SSS 楽曲数");
            Assert.AreEqual(208, musicLevel.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(192, musicLevel.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(2, musicLevel.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(2, musicLevel.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicLevel.Units;
            Assert.AreEqual(2, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(354, unit.Id, "ID");
                Assert.AreEqual("ラブリー☆えんじぇる!!", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(12.0, unit.Level, "レベル");
                Assert.AreEqual(1009957, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.FullChainPlatinum, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(626, unit.Id, "ID");
                Assert.AreEqual("アンノウン・マザーグース", unit.Name, "楽曲名");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(12.0, unit.Level, "レベル");
                Assert.AreEqual(1009614, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.FullCombo, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void MusicLevelParser_Error_Test1()
        {
            var musicLevel = new MusicLevelParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicLevel);
        }
    }
}
