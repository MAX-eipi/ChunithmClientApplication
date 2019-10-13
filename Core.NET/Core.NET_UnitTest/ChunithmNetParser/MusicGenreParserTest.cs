using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicGenreParserTest
    {
        [TestMethod]
        public void MusicGenreParser_Test1()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("MusicGenre/html_test_case_1.html"));
            Assert.IsNotNull(musicGenre, "パースチェック");

            Assert.AreEqual(535, musicGenre.MusicCount, "楽曲数");
            Assert.AreEqual(524, musicGenre.ClearCount, "クリア 楽曲数");
            Assert.AreEqual(524, musicGenre.SCount, "S 楽曲数");
            Assert.AreEqual(516, musicGenre.SsCount, "SS 楽曲数");
            Assert.AreEqual(476, musicGenre.SssCount, "SSS 楽曲数");
            Assert.AreEqual(441, musicGenre.FullComboCount, "フルコンボ 楽曲数");
            Assert.AreEqual(372, musicGenre.AllJusticeCount, "AJ 楽曲数");
            Assert.AreEqual(7, musicGenre.FullChainGoldCount, "フルチェイン(金) 楽曲数");
            Assert.AreEqual(7, musicGenre.FullChainPlatinumCount, "フルチェイン 楽曲数");

            var units = musicGenre.Units;
            Assert.AreEqual(7, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(639, unit.Id, "ID");
                Assert.AreEqual("sister's noise", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.POPS_AND_ANIME, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(1009974, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[1];
                Assert.IsNotNull(unit);
                Assert.AreEqual(583, unit.Id, "ID");
                Assert.AreEqual("碧き孤島のアングゥィス", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.POPS_AND_ANIME, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(1008683, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[2];
                Assert.IsNotNull(unit);
                Assert.AreEqual(363, unit.Id, "ID");
                Assert.AreEqual("true my heart -Lovable mix-", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.POPS_AND_ANIME, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(1009942, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.AllJustice, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.FullChainPlatinum, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[3];
                Assert.IsNotNull(unit);
                Assert.AreEqual(159, unit.Id, "ID");
                Assert.AreEqual("ジングルベル", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.POPS_AND_ANIME, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(1008382, unit.Score, "スコア");
                Assert.AreEqual(Rank.SSS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.FullCombo, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[4];
                Assert.IsNotNull(unit);
                Assert.AreEqual(631, unit.Id, "ID");
                Assert.AreEqual("初音ミクの激唱", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.niconico, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(1003448, unit.Score, "スコア");
                Assert.AreEqual(Rank.SS, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[5];
                Assert.IsNotNull(unit);
                Assert.AreEqual(713, unit.Id, "ID");
                Assert.AreEqual("larva", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.ORIGINAL, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(0, unit.Score, "スコア");
                Assert.AreEqual(Rank.None, unit.Rank, "ランク");
                Assert.AreEqual(false, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
            {
                var unit = units[6];
                Assert.IsNotNull(unit);
                Assert.AreEqual(180, unit.Id, "ID");
                Assert.AreEqual("怒槌", unit.Name, "楽曲名");
                Assert.AreEqual(Genre.ORIGINAL, unit.Genre, "ジャンル");
                Assert.AreEqual(Difficulty.Master, unit.Difficulty, "難易度");
                Assert.AreEqual(996370, unit.Score, "スコア");
                Assert.AreEqual(Rank.S, unit.Rank, "ランク");
                Assert.AreEqual(true, unit.IsClear, "クリア");
                Assert.AreEqual(ComboStatus.None, unit.ComboStatus, "コンボランプ");
                Assert.AreEqual(ChainStatus.None, unit.ChainStatus, "チェインランプ");
            }
        }

        [TestMethod]
        public void MusicGenreParser_Error_Test1()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicGenre);
        }
    }
}
