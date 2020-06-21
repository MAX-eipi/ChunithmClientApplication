using ChunithmClientLibrary;
using ChunithmClientLibrary.PlaylogRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.PlaylogRecord
{
    [TestClass]
    [TestCategory(TestUtility.Category.PlaylogRecord)]
    [TestCategory(TestUtility.Category.JsonIO)]
    public class PlaylogRecordTableJsonIOTest
    {
        [TestMethod]
        public void PlaylogRecordTable_JsonIO_Test1()
        {
            var expectedPlaylogRecordTable = new PlaylogRecordTable();
            expectedPlaylogRecordTable.Add<PlaylogRecordTableUnit>(new List<PlaylogRecordTableUnit>()
            {
                new PlaylogRecordTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = "POPS & ANIME",
                    Difficulty = Difficulty.Basic,
                    Score = 1000000,
                    Rank = Rank.SS,
                    BaseRating = 1.0,
                    Rating = 2.0,
                    IsNewRecord = false,
                    IsClear = true,
                    ComboStatus = ComboStatus.FullCombo,
                    ChainStatus = 0,
                    PlayDate = new DateTime(2018, 2, 14, 0, 0, 0),
                }
            });

            var path = "PlaylogRecord/JsonIOTest/json_io_test_1.json";

            var writer = new PlaylogRecordTableJsonWriter();
            writer.Set(expectedPlaylogRecordTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new PlaylogRecordTableJsonReader();
            var actualPlaylogRecordTable = reader.Read(TestUtility.LoadResource(path));

            PlaylogRecordTableTestUtility.AreEqual(expectedPlaylogRecordTable, actualPlaylogRecordTable);
        }
    }
}
