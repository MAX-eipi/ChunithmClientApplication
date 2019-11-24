using ChunithmClientLibrary.MusicData;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.MusicData
{
    [TestClass]
    [TestCategory(TestUtility.Category.MusicData)]
    [TestCategory(TestUtility.Category.JsonIO)]
    public class MusicDataTableJsonIOTest
    {
        [TestMethod]
        public void MusicDataTable_JsonIO_Test1()
        {
            var expectedMusicDataTable = new MusicDataTable();
            expectedMusicDataTable.Add(new List<MusicDataTableUnit>()
            {
                new MusicDataTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = "POPS & ANIME",
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

            var path = "MusicData/JsonIOTest/json_io_test_1.json";

            var writer = new MusicDataTableJsonWriter();
            writer.Set(expectedMusicDataTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new MusicDataTableJsonReader();
            var actualMusicDataTable = reader.Read(TestUtility.LoadResource(path));

            MusicDataTestUtility.AreEqual(expectedMusicDataTable, actualMusicDataTable);
        }
    }
}
