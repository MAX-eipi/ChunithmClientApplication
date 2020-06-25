using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class ScoreTest
    {
        [TestMethod]
        public void ParseScoreTest()
        {
            Assert.AreEqual(0, Utility.ParseScore("0"), "パースチェック 1");
            Assert.AreEqual(500000, Utility.ParseScore("500,000"), "パースチェック 2");
            Assert.AreEqual(1000000, Utility.ParseScore("1,000,000"), "パースチェック 3");
            Assert.AreEqual(0, Utility.ParseScore(null), "パースチェック 4");
            Assert.AreEqual(0, Utility.ParseScore(""), "パースチェック 5");
        }
    }
}
