using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class ComboStatusTest
    {
        [TestMethod]
        public void ComboStatus_Convert_ComboStatusTextToComboStatus_Test1()
        {
            Assert.AreEqual(ComboStatus.FullCombo, Utility.ToComboStatus(Utility.COMBO_STATUS_FULL_COMBO_TEXT), "FULL COMBO");
            Assert.AreEqual(ComboStatus.AllJustice, Utility.ToComboStatus(Utility.COMBO_STATUS_ALL_JUSTICE_TEXT), "ALL JUSTICE");
            Assert.AreEqual(ComboStatus.None, Utility.ToComboStatus(Utility.COMBO_STATUS_NONE_TEXT), "NONE");

            Assert.AreEqual(ComboStatus.None, Utility.ToComboStatus(null));
            Assert.AreEqual(ComboStatus.None, Utility.ToComboStatus(""));
            Assert.AreEqual(ComboStatus.None, Utility.ToComboStatus("full combo"));
            Assert.AreEqual(ComboStatus.None, Utility.ToComboStatus("all justice"));
        }

        [TestMethod]
        public void ComboStatus_Convert_ComboStatusToComboStatusText_Test1()
        {
            Assert.AreEqual(Utility.COMBO_STATUS_FULL_COMBO_TEXT, Utility.ToComboStatusText(ComboStatus.FullCombo), "FULL COMBO");
            Assert.AreEqual(Utility.COMBO_STATUS_ALL_JUSTICE_TEXT, Utility.ToComboStatusText(ComboStatus.AllJustice), "ALL JUSTICE");
            Assert.AreEqual(Utility.COMBO_STATUS_NONE_TEXT, Utility.ToComboStatusText(ComboStatus.None), "NONE");

            Assert.AreEqual(Utility.COMBO_STATUS_NONE_TEXT, Utility.ToComboStatusText((ComboStatus)(-1)));
            Assert.AreEqual(Utility.COMBO_STATUS_NONE_TEXT, Utility.ToComboStatusText((ComboStatus)(3)));
        }
    }
}
