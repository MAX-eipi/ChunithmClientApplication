﻿using ChunithmClientLibrary;
using ChunithmClientLibrary.PlaylogRecord;
using ChunithmClientLibrary.Writer;
using System.Text;

namespace RecentSimulator
{
    public class HistoryWriter : CsvWriter<IPlaylogRecordTable<IHistoryUnit>>
    {
        public override string CreateCsv(IPlaylogRecordTable<IHistoryUnit> data)
        {
            var builder = new StringBuilder();

            Append(builder, "No");
            Append(builder, "ID");
            Append(builder, "楽曲名");
            Append(builder, "ジャンル");
            Append(builder, "難易度");
            Append(builder, "スコア");
            Append(builder, "ランク");
            Append(builder, "譜面定数");
            Append(builder, "プレイレート");
            Append(builder, "NEW RECORD");
            Append(builder, "CLEAR");
            Append(builder, "コンボ");
            Append(builder, "チェイン");
            Append(builder, "トラック");
            Append(builder, "プレイ日時");
            Append(builder, "表示レート");
            Append(builder, "ベスト枠", true);

            foreach (var unit in data.GetTableUnits())
            {
                if (unit == null)
                {
                    continue;
                }

                Append(builder, unit.Number);
                Append(builder, unit.Id);
                Append(builder, unit.Name);
                Append(builder, Utility.ToGenreText(unit.Genre));
                Append(builder, Utility.ToDifficultyText(unit.Difficulty));
                Append(builder, unit.Score);
                Append(builder, Utility.ToRankText(unit.Rank));
                Append(builder, unit.BaseRating);
                Append(builder, unit.Rating);
                Append(builder, unit.IsNewRecord);
                Append(builder, unit.IsClear);
                Append(builder, Utility.ToComboStatusText(unit.ComboStatus));
                Append(builder, Utility.ToChainStatusText(unit.ChainStatus));
                Append(builder, unit.Track);
                Append(builder, unit.PlayDate);
                Append(builder, unit.DisplayRating);
                Append(builder, unit.TotalBestRating, true);
            }

            return builder.ToString();
        }
    }
}
