using ChunithmClientLibrary;
using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlayerRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.PlayerReocrd
{
    [TestClass]
    [TestCategory(TestUtility.Category.PlayerRecord)]
    [TestCategory(TestUtility.Category.JsonIO)]
    public class PlayerRecordContainerJsonIOTest
    {
        [TestMethod]
        public void PlayerRecordContainer_JsonIO_Test1()
        {
            var expectedPlayerRecordTable = new PlayerRecordContainer();
            expectedPlayerRecordTable.Basic.Add<HighScoreRecordTableUnit>(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = Genre.POPS_AND_ANIME,
                    Difficulty = Difficulty.Basic,
                    Score = 9750000,
                    BaseRating = 1.0,
                    Rating = 1.0,
                }
            });
            expectedPlayerRecordTable.Advanced.Add<HighScoreRecordTableUnit>(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 2,
                    Name = "TEST MUSIC 2",
                    Genre = Genre.niconico,
                    Difficulty = Difficulty.Advanced,
                    Score = 1000000,
                    BaseRating = 3.0,
                    Rating = 4.0,
                }
            });
            expectedPlayerRecordTable.Expert.Add<HighScoreRecordTableUnit>(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 3,
                    Name = "TEST MUSIC 3",
                    Genre = Genre.東方Project,
                    Difficulty = Difficulty.Expert,
                    Score = 1005000,
                    BaseRating = 7.0,
                    Rating = 7.5,
                }
            });
            expectedPlayerRecordTable.Master.Add<HighScoreRecordTableUnit>(new List<HighScoreRecordTableUnit>()
            {
                new HighScoreRecordTableUnit
                {
                    Id = 4,
                    Name = "TEST MUSIC 4",
                    Genre = Genre.VARIETY,
                    Difficulty = Difficulty.Master,
                    Score = 1007500,
                    BaseRating = 10.0,
                    Rating = 12.0,
                }
            });

            var path = "PlayerRecord/JsonIOTest/json_io_test_1.json";

            var writer = new PlayerRecordContainerJsonWriter();
            writer.Set(expectedPlayerRecordTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new PlayerRecordContainerJsonReader();
            var actualPlayerRecordTable = reader.Read(TestUtility.LoadResource(path));

            PlayerRecordTestUtility.AreEqual(expectedPlayerRecordTable, actualPlayerRecordTable);
        }
    }
}
