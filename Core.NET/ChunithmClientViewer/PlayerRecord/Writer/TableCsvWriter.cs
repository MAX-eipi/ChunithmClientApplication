using ChunithmClientLibrary;
using ChunithmClientLibrary.HighScoreRecord;
using ChunithmClientLibrary.PlayerRecord;
using ChunithmClientLibrary.Writer;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ChunithmClientViewer.PlayerRecord
{
    public class TableCsvWriter : CsvWriter<IPlayerRecordContainer>, IWriter<IPlayerRecordContainer>
    {
        public override string CreateCsv(IPlayerRecordContainer data)
        {
            var recordUnits = new List<IHighScoreRecordTableUnit>();
            recordUnits.AddRange(data.Basic.GetTableUnits());
            recordUnits.AddRange(data.Advanced.GetTableUnits());
            recordUnits.AddRange(data.Expert.GetTableUnits());
            recordUnits.AddRange(data.Master.GetTableUnits());

            var builder = new StringBuilder();

            Append(builder, "ID");
            Append(builder, "楽曲名");
            Append(builder, "ジャンル");
            Append(builder, "スコア(BASIC)");
            Append(builder, "スコア(ADVANCED)");
            Append(builder, "スコア(EXPERT)");
            Append(builder, "スコア(MASTER)");
            Append(builder, "譜面定数(BASIC)");
            Append(builder, "譜面定数(ADVANCED)");
            Append(builder, "譜面定数(EXPERT)");
            Append(builder, "譜面定数(MASTER)");
            Append(builder, "プレイレート値(BASIC)");
            Append(builder, "プレイレート値(ADVANCED)");
            Append(builder, "プレイレート値(EXPERT)");
            Append(builder, "プレイレート値(MASTER)", true);

            var musics = recordUnits.GroupBy(u => u.Id, (_, result) => result.ToDictionary(u => u.Difficulty, u => u));
            foreach (var music in musics)
            {
                if (music == null || music.Count == 0)
                {
                    continue;
                }

                var unit = music.Values.FirstOrDefault();
                if (unit == null)
                {
                    continue;
                }

                Append(builder, unit.Id);
                Append(builder, unit.Name);
                Append(builder, unit.Genre);

                music.TryGetValue(Difficulty.Basic, out var basic);
                music.TryGetValue(Difficulty.Advanced, out var advanced);
                music.TryGetValue(Difficulty.Expert, out var expert);
                music.TryGetValue(Difficulty.Master, out var master);

                Append(builder, basic?.Score ?? 0);
                Append(builder, advanced?.Score ?? 0);
                Append(builder, expert?.Score ?? 0);
                Append(builder, master?.Score ?? 0);

                Append(builder, basic?.BaseRating ?? 0);
                Append(builder, advanced?.BaseRating ?? 0);
                Append(builder, expert?.BaseRating ?? 0);
                Append(builder, master?.BaseRating ?? 0);

                Append(builder, basic?.Rating ?? 0);
                Append(builder, advanced?.Rating ?? 0);
                Append(builder, expert?.Rating ?? 0);
                Append(builder, master?.Rating ?? 0, true);
            }

            return builder.ToString();
        }
    }
}
