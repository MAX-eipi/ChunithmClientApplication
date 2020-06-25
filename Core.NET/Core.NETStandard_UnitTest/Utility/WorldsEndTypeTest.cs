using ChunithmClientLibrary;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ChunithmClientLibraryUnitTest
{
    [TestClass]
    [TestCategory(TestUtility.Category.Utility)]
    public class WorldsEndTypeTest
    {
        [TestMethod]
        public void WorldsEndType_Convert_WorldsEndTypeToWorldsEndTypeCode_Test1()
        {
            Assert.AreEqual(1, Utility.ToWorldsEndTypeCode(WorldsEndType.招), "招");
            Assert.AreEqual(2, Utility.ToWorldsEndTypeCode(WorldsEndType.狂), "狂");
            Assert.AreEqual(3, Utility.ToWorldsEndTypeCode(WorldsEndType.止), "止");
            Assert.AreEqual(4, Utility.ToWorldsEndTypeCode(WorldsEndType.改), "改");
            Assert.AreEqual(5, Utility.ToWorldsEndTypeCode(WorldsEndType.両), "両");
            Assert.AreEqual(6, Utility.ToWorldsEndTypeCode(WorldsEndType.嘘), "嘘");
            Assert.AreEqual(7, Utility.ToWorldsEndTypeCode(WorldsEndType.半), "半");
            Assert.AreEqual(8, Utility.ToWorldsEndTypeCode(WorldsEndType.時), "時");
            Assert.AreEqual(9, Utility.ToWorldsEndTypeCode(WorldsEndType.光), "光");
            Assert.AreEqual(10, Utility.ToWorldsEndTypeCode(WorldsEndType.割), "割");
            Assert.AreEqual(11, Utility.ToWorldsEndTypeCode(WorldsEndType.跳), "跳");
            Assert.AreEqual(12, Utility.ToWorldsEndTypeCode(WorldsEndType.弾), "弾");
            Assert.AreEqual(13, Utility.ToWorldsEndTypeCode(WorldsEndType.戻), "戻");
            Assert.AreEqual(14, Utility.ToWorldsEndTypeCode(WorldsEndType.伸), "伸");
            Assert.AreEqual(15, Utility.ToWorldsEndTypeCode(WorldsEndType.布), "布");
            Assert.AreEqual(16, Utility.ToWorldsEndTypeCode(WorldsEndType.敷), "敷");
            Assert.AreEqual(17, Utility.ToWorldsEndTypeCode(WorldsEndType.翔), "翔");
            Assert.AreEqual(18, Utility.ToWorldsEndTypeCode(WorldsEndType.謎), "謎");
            Assert.AreEqual(19, Utility.ToWorldsEndTypeCode(WorldsEndType.疑), "？");
            Assert.AreEqual(20, Utility.ToWorldsEndTypeCode(WorldsEndType.驚), "！");
            Assert.AreEqual(21, Utility.ToWorldsEndTypeCode(WorldsEndType.避), "避");
            Assert.AreEqual(22, Utility.ToWorldsEndTypeCode(WorldsEndType.速), "速");
            Assert.AreEqual(23, Utility.ToWorldsEndTypeCode(WorldsEndType.歌), "歌");
            Assert.AreEqual(24, Utility.ToWorldsEndTypeCode(WorldsEndType.没), "没");
            Assert.AreEqual(25, Utility.ToWorldsEndTypeCode(WorldsEndType.舞), "舞");
            Assert.AreEqual(26, Utility.ToWorldsEndTypeCode(WorldsEndType.俺), "俺");
            Assert.AreEqual(27, Utility.ToWorldsEndTypeCode(WorldsEndType.蔵), "蔵");
            Assert.AreEqual(28, Utility.ToWorldsEndTypeCode(WorldsEndType.覚), "覚");
            Assert.AreEqual(-1, Utility.ToWorldsEndTypeCode(WorldsEndType.Invalid), "INVALID");

            Assert.AreEqual(-1, Utility.ToWorldsEndTypeCode((WorldsEndType)(-1)));
            Assert.AreEqual(-1, Utility.ToWorldsEndTypeCode((WorldsEndType)(29)));
        }

        [TestMethod]
        public void WorldsEndType_Convert_WorldsEndTypeCodeToWorldEndType_Test1()
        {
            Assert.AreEqual(WorldsEndType.招, Utility.ToWorldsEndType(1), "招");
            Assert.AreEqual(WorldsEndType.狂, Utility.ToWorldsEndType(2), "狂");
            Assert.AreEqual(WorldsEndType.止, Utility.ToWorldsEndType(3), "止");
            Assert.AreEqual(WorldsEndType.改, Utility.ToWorldsEndType(4), "改");
            Assert.AreEqual(WorldsEndType.両, Utility.ToWorldsEndType(5), "両");
            Assert.AreEqual(WorldsEndType.嘘, Utility.ToWorldsEndType(6), "嘘");
            Assert.AreEqual(WorldsEndType.半, Utility.ToWorldsEndType(7), "半");
            Assert.AreEqual(WorldsEndType.時, Utility.ToWorldsEndType(8), "時");
            Assert.AreEqual(WorldsEndType.光, Utility.ToWorldsEndType(9), "光");
            Assert.AreEqual(WorldsEndType.割, Utility.ToWorldsEndType(10), "割");
            Assert.AreEqual(WorldsEndType.跳, Utility.ToWorldsEndType(11), "跳");
            Assert.AreEqual(WorldsEndType.弾, Utility.ToWorldsEndType(12), "弾");
            Assert.AreEqual(WorldsEndType.戻, Utility.ToWorldsEndType(13), "戻");
            Assert.AreEqual(WorldsEndType.伸, Utility.ToWorldsEndType(14), "伸");
            Assert.AreEqual(WorldsEndType.布, Utility.ToWorldsEndType(15), "布");
            Assert.AreEqual(WorldsEndType.敷, Utility.ToWorldsEndType(16), "敷");
            Assert.AreEqual(WorldsEndType.翔, Utility.ToWorldsEndType(17), "翔");
            Assert.AreEqual(WorldsEndType.謎, Utility.ToWorldsEndType(18), "謎");
            Assert.AreEqual(WorldsEndType.疑, Utility.ToWorldsEndType(19), "？");
            Assert.AreEqual(WorldsEndType.驚, Utility.ToWorldsEndType(20), "！");
            Assert.AreEqual(WorldsEndType.避, Utility.ToWorldsEndType(21), "避");
            Assert.AreEqual(WorldsEndType.速, Utility.ToWorldsEndType(22), "速");
            Assert.AreEqual(WorldsEndType.歌, Utility.ToWorldsEndType(23), "歌");
            Assert.AreEqual(WorldsEndType.没, Utility.ToWorldsEndType(24), "没");
            Assert.AreEqual(WorldsEndType.舞, Utility.ToWorldsEndType(25), "舞");
            Assert.AreEqual(WorldsEndType.俺, Utility.ToWorldsEndType(26), "俺");
            Assert.AreEqual(WorldsEndType.蔵, Utility.ToWorldsEndType(27), "蔵");
            Assert.AreEqual(WorldsEndType.覚, Utility.ToWorldsEndType(28), "覚");
            Assert.AreEqual(WorldsEndType.Invalid, Utility.ToWorldsEndType(-1), "INVALID");

            Assert.AreEqual(WorldsEndType.Invalid, Utility.ToWorldsEndType(29));
            Assert.AreEqual(WorldsEndType.Invalid, Utility.ToWorldsEndType(-2));
        }
    }
}
