using ChunithmClientLibrary.HighScoreRecord;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace ChunithmClientLibraryUnitTest.HighScoreRecord
{
    public class HighScoreRecordTestUtility
    {
        public static void AreEqual<THighScoreRecordTableUnit>(
            IHighScoreRecordTable<THighScoreRecordTableUnit> expected,
            IHighScoreRecordTable<THighScoreRecordTableUnit> actual)
            where THighScoreRecordTableUnit : IHighScoreRecordTableUnit
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

        public static void AreEqual(IHighScoreRecordTableUnit expected, IHighScoreRecordTableUnit actual)
        {
            Assert.IsNotNull(expected, "expected");
            Assert.IsNotNull(actual, "actual");

            Assert.AreEqual(expected.Id, actual.Id, "楽曲ID");
            Assert.AreEqual(expected.Name, actual.Name, "楽曲名");
            Assert.AreEqual(expected.Genre, actual.Genre, "ジャンル");
            Assert.AreEqual(expected.Difficulty, actual.Difficulty, "難易度");
            Assert.AreEqual(expected.Score, actual.Score, "スコア");
            Assert.AreEqual(expected.BaseRating, actual.BaseRating, "譜面定数");
            Assert.AreEqual(expected.Rating, actual.Rating, "単曲レート値");
        }
    }
}
