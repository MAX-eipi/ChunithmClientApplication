using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class ChainStatusTest
    {
        [TestMethod]
        public void ChainStatus_ChainStatusTextToChainStatus_Test1()
        {
            Assert.AreEqual(ChainStatus.FullChainGold, Utility.ToChainStatus("FULL CHAIN 2"), "FULL CHAIN 2");
            Assert.AreEqual(ChainStatus.FullChainPlatinum, Utility.ToChainStatus("FULL CHAIN"), "FULL CHAIN");
            Assert.AreEqual(ChainStatus.None, Utility.ToChainStatus("NONE"), "NONE");

            Assert.AreEqual(ChainStatus.None, Utility.ToChainStatus(null));
            Assert.AreEqual(ChainStatus.None, Utility.ToChainStatus(""));
            Assert.AreEqual(ChainStatus.None, Utility.ToChainStatus("full chain 2"));
            Assert.AreEqual(ChainStatus.None, Utility.ToChainStatus("full chain"));
        }

        [TestMethod]
        public void ChainStatus_ChainStatusToChainStatusText_Test1()
        {
            Assert.AreEqual("FULL CHAIN 2", Utility.ToChainStatusText(ChainStatus.FullChainGold), "FULL CHAIN 2");
            Assert.AreEqual("FULL CHAIN", Utility.ToChainStatusText(ChainStatus.FullChainPlatinum), "FULL CHAIN");
            Assert.AreEqual("NONE", Utility.ToChainStatusText(ChainStatus.None), "NONE");

            Assert.AreEqual("NONE", Utility.ToChainStatusText((ChainStatus)(-1)));
            Assert.AreEqual("NONE", Utility.ToChainStatusText((ChainStatus)(10)));
        }
    }
}
