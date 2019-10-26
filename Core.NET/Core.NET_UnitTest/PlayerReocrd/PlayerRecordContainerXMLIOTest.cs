using ChunithmClientLibrary;
using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlayerRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.PlayerReocrd
{
    [TestClass]
    [TestCategory(TestUtility.Category.XmlIO)]
    [TestCategory(TestUtility.Category.PlayerRecord)]
    public class PlayerRecordContainerXmlIOTest
    {
        [TestMethod]
        public void PlayerRecordContainer_XmlIO_Test1()
        {
            var expectedPlayerRecordTable = new PlayerRecordContainer();
            expectedPlayerRecordTable.Basic.Add(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = "POPS & ANIME",
                    Difficulty = Difficulty.Basic,
                    Score = 9750000,
                    BaseRating = 1.0,
                    Rating = 1.0,
                }
            });
            expectedPlayerRecordTable.Advanced.Add(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 2,
                    Name = "TEST MUSIC 2",
                    Genre = "niconico",
                    Difficulty = Difficulty.Advanced,
                    Score = 1000000,
                    BaseRating = 3.0,
                    Rating = 4.0,
                }
            });
            expectedPlayerRecordTable.Expert.Add(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 3,
                    Name = "TEST MUSIC 3",
                    Genre = "東方Project",
                    Difficulty = Difficulty.Expert,
                    Score = 1005000,
                    BaseRating = 7.0,
                    Rating = 7.5,
                }
            });
            expectedPlayerRecordTable.Master.Add(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 4,
                    Name = "TEST MUSIC 4",
                    Genre = "VARIETY",
                    Difficulty = Difficulty.Master,
                    Score = 1007500,
                    BaseRating = 10.0,
                    Rating = 12.0,
                }
            });

            var path = "PlayerRecord/XmlIOTest/xml_io_test_1.xlsx";

            var writer = new PlayerRecordContainerXmlWriter();
            writer.Set(expectedPlayerRecordTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new PlayerRecordContainerXmlReader();
            var actualPlayerRecordTable = reader.Read(TestUtility.GetResourcePath(path));

            PlayerRecordTestUtility.AreEqual(expectedPlayerRecordTable, actualPlayerRecordTable);
        }
    }
}
