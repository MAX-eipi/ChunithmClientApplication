using ChunithmClientLibrary;
using ChunithmClientLibrary.PlaylogRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace ChunithmClientLibraryUnitTest.PlaylogRecord
{
    [TestClass]
    [TestCategory(TestUtility.Category.XmlIO)]
    [TestCategory(TestUtility.Category.PlaylogRecord)]
    public class PlaylogRecordTableXmlIOTest
    {
        [TestMethod]
        public void PlaylogRecordTable_XmlIO_Test1()
        {
            var expectedPlaylogRecordTable = new PlaylogRecordTable();
            expectedPlaylogRecordTable.Add<PlaylogRecordTableUnit>(new List<PlaylogRecordTableUnit>()
            {
                new PlaylogRecordTableUnit
                {
                    Id = 1,
                    Name = "TEST MUSIC 1",
                    Genre = Genre.POPS_AND_ANIME,
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

            var path = "PlaylogRecord/XmlIOTest/xml_io_test_1.xlsx";

            var writer = new PlaylogRecordTableXmlWriter();
            writer.Set(expectedPlaylogRecordTable);
            writer.Write(TestUtility.GetResourcePath(path));

            var reader = new PlaylogRecordTableXmlReader();
            var actualPlaylogRecordTable = reader.Read(TestUtility.GetResourcePath(path));

            PlaylogRecordTableTestUtility.AreEqual(expectedPlaylogRecordTable, actualPlaylogRecordTable);
        }
    }
}
