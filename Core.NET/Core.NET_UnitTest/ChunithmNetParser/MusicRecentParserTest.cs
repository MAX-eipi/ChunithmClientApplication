using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicRecentParserTest
    {
        [TestMethod]
        public void MusicRecentParser_Test1()
        {
            var musicRecent = new MusicRecentParser().Parse(TestUtility.LoadResource("MusicRecent/html_test_case_1.html"));
            Assert.IsNotNull(musicRecent, "パースチェック");

            var units = musicRecent.Units;
            Assert.AreEqual(10, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(696, unit.Id, "ID");
                Assert.AreEqual("Summer is over", unit.Name, "楽曲名");
            }
            {
                var unit = units[9];
                Assert.IsNotNull(unit);
                Assert.AreEqual(695, unit.Id, "ID");
                Assert.AreEqual("ハートアタック", unit.Name, "楽曲名");
            }
        }

        [TestMethod]
        public void MusicRecentParser_Error_Test1()
        {
            var musicRecent = new MusicRecentParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicRecent);
        }
    }
}
