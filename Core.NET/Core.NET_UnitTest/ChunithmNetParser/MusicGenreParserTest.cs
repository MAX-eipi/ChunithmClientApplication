using ChunithmClientLibrary;
using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using static ChunithmClientLibrary.ChunithmNet.Data.MusicGenre;

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
                AssertUnit(
                    units[0],
                    639,
                    "sister's noise",
                    "POPS & ANIME",
                    Difficulty.Master,
                    1009974,
                    Rank.SSS,
                    true,
                    ComboStatus.AllJustice,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[1],
                    583,
                    "碧き孤島のアングゥィス",
                    "POPS & ANIME",
                    Difficulty.Master,
                    1008683,
                    Rank.SSS,
                    true,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[2],
                    363,
                    "true my heart -Lovable mix-",
                    "POPS & ANIME",
                    Difficulty.Master,
                    1009942,
                    Rank.SSS,
                    true,
                    ComboStatus.AllJustice,
                    ChainStatus.FullChainPlatinum);
            }
            {
                AssertUnit(
                    units[3],
                    159,
                    "ジングルベル",
                    "POPS & ANIME",
                    Difficulty.Master,
                    1008382,
                    Rank.SSS,
                    true,
                    ComboStatus.FullCombo,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[4],
                    631,
                    "初音ミクの激唱",
                    "niconico",
                    Difficulty.Master,
                    1003448,
                    Rank.SS,
                    true,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[5],
                    713,
                    "larva",
                    "ORIGINAL",
                    Difficulty.Master,
                    0,
                    Rank.None,
                    false,
                    ComboStatus.None,
                    ChainStatus.None);
            }
            {
                AssertUnit(
                    units[6],
                    180,
                    "怒槌",
                    "ORIGINAL",
                    Difficulty.Master,
                    996370,
                    Rank.S,
                    true,
                    ComboStatus.None,
                    ChainStatus.None);
            }
        }
        
        private static void AssertUnit(
            Unit unit,
            int id,
            string name,
            string genre,
            Difficulty difficulty,
            int score,
            Rank rank,
            bool isClear,
            ComboStatus comboStatus,
            ChainStatus chainStatus)
        {
            Assert.IsNotNull(unit);
            Assert.AreEqual(id, unit.Id, "ID");
            Assert.AreEqual(name, unit.Name, "楽曲名");
            Assert.AreEqual(genre, unit.Genre, "ジャンル");
            Assert.AreEqual(difficulty, unit.Difficulty, "難易度");
            Assert.AreEqual(score, unit.Score, "スコア");
            Assert.AreEqual(rank, unit.Rank, "ランク");
            Assert.AreEqual(isClear, unit.IsClear, "クリア");
            Assert.AreEqual(comboStatus, unit.ComboStatus, "コンボランプ");
            Assert.AreEqual(chainStatus, unit.ChainStatus, "チェインランプ");
        }

        [TestMethod]
        public void MusicGenreParser_Error_Test1()
        {
            var musicGenre = new MusicGenreParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicGenre);
        }
    }
}
