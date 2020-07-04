using ChunithmClientLibrary.ChunithmNet.Parser;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest.ChunithmNetParser
{
    [TestClass]
    [TestCategory(TestUtility.Category.ChunithmNetParser)]
    public class AimeListParserTest
    {
        [TestMethod]
        public void AimeListParser_Test1()
        {
            var aimeList = new AimeListParser().Parse(TestUtility.LoadResource("AimeList/html_test_case_1.html"));
            Assert.IsNotNull(aimeList, "パースチェック");

            var units = aimeList.Units;
            Assert.AreEqual(1, units.Length, "件数チェック");
            {
                var unit = units[0];
                Assert.AreEqual(0, unit.RebornCount, "転生数");
                Assert.AreEqual(9, unit.Level, "ユーザーレベル");
                Assert.AreEqual("＊＊＊＊＊＊＊＊", unit.Name, "ユーザー名");
                Assert.AreEqual(15.37, unit.NowRating, "現在レーティング");
                Assert.AreEqual(15.49, unit.MaxRating, "最大レーティング");
            }
        }

        [TestMethod]
        public void AimeListParser_Error_Test1()
        {
            var aimeList = new AimeListParser().Parse(TestUtility.LoadResource("Common/error_page.html"));
            Assert.IsNull(aimeList);
        }
    }
}
