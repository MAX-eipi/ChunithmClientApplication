using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class MusicWordParserTest
    {
        [TestMethod]
        public void MusicWordParser_Test1()
        {
            var musicWord = new MusicWordParser().Parse(TestUtility.LoadResource("MusicWord/html_test_case_1.html"));
            Assert.IsNotNull(musicWord, "パースチェック");

            var units = musicWord.Units;
            Assert.AreEqual(1, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.IsNotNull(unit);
                Assert.AreEqual(320, unit.Id, "ID");
                Assert.AreEqual("010", unit.Name, "楽曲名");
            }
        }

        [TestMethod]
        public void MusicWordParser_Error_Test1()
        {
            var musicWord = new MusicWordParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(musicWord);
        }
    }
}
