using ChunithmClientLibrary;
using ChunithmClientLibrary.MusicData;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    [TestClass]
    [TestCategory(TestUtility.Category.XmlIO)]
    [TestCategory(TestUtility.Category.MusicData)]
    public class MusicDataTableXmlIOTest
    {
        [TestMethod]
        public void MusicDataTable_XmlIO_Test1()
        {
            var expectedMusicDataTable = new MusicDataTable();
            expectedMusicDataTable.Add<MusicDataTableUnit>(new List<MusicDataTableUnit>()
            {
                new MusicDataTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = Genre.POPS_AND_ANIME,
                    BasicLevel = 1.0,
                    AdvancedLevel = 3.0,
                    ExpertLevel = 7.0,
                    MasterLevel = 10.0,
                    BasicVerified = false,
                    AdvancedVerified = false,
                    ExpertVerified = false,
                    MasterVerified = false,
                }
            });

            var path = "MusicData/XMLIOTest/xml_io_test_1.xlsx";

            var writer = new MusicDataTableXmlWriter();
            writer.Set(expectedMusicDataTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new MusicDataTableXmlReader();
            var actualMusicDataTable = reader.Read(TestUtility.GetResourcePath(path));

            MusicDataTestUtility.AreEqual(expectedMusicDataTable, actualMusicDataTable);
        }
    }
}
