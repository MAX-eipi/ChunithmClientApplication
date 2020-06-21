using ChunithmClientLibrary.PlaylogRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace ChunithmClientLibraryUnitTest.PlaylogRecord
{
    public static class PlaylogRecordTableTestUtility
    {
        public static void AreEqual(IPlaylogRecordTable<IPlaylogRecordTableUnit> expected, IPlaylogRecordTable<IPlaylogRecordTableUnit> actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            var expectedTableUnits = expected.GetTableUnits().ToList();
            var actualTableUnits = actual.GetTableUnits().ToList();
            Assert.IsNotNull(expectedTableUnits, "expected.GetTableUnits()");
            Assert.IsNotNull(actualTableUnits, "actual.GetTableUnits()");
            Assert.AreEqual(expectedTableUnits.Count, actualTableUnits.Count, "件数");

            var count = expectedTableUnits.Count;
            for (var i = 0; i < count; i++)
            {
                AreEqual(expectedTableUnits[i], actualTableUnits[i]);
            }
        }

        public static void AreEqual(IPlaylogRecordTableUnit expected, IPlaylogRecordTableUnit actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            Assert.AreEqual(expected.Id, actual.Id, "楽曲ID");
            Assert.AreEqual(expected.Name, actual.Name, "楽曲名");
            Assert.AreEqual(expected.Genre, actual.Genre, "ジャンル");
            Assert.AreEqual(expected.Difficulty, actual.Difficulty, "難易度");
            Assert.AreEqual(expected.Score, actual.Score, "スコア");
            Assert.AreEqual(expected.Rank, actual.Rank, "ランク");
            Assert.AreEqual(expected.BaseRating, actual.BaseRating, "譜面定数");
            Assert.AreEqual(expected.Rating, actual.Rating, "単曲レート値");
            Assert.AreEqual(expected.IsNewRecord, actual.IsNewRecord, "NEW RECORD");
            Assert.AreEqual(expected.IsClear, actual.IsClear, "クリア");
            Assert.AreEqual(expected.ComboStatus, actual.ComboStatus, "フルコンボステータス");
            Assert.AreEqual(expected.ChainStatus, actual.ChainStatus, "フルチェインステータス");
            Assert.AreEqual(expected.PlayDate, actual.PlayDate, "プレイ日時");
        }
    }
}
