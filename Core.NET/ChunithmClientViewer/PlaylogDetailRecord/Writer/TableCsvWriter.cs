using ChunithmClientLibrary.Writer;
using System.Text;

namespace ChunithmClientViewer.PlaylogDetailRecord
{
    public class TableCsvWriter : CsvWriter<Table>
    {
        public override string CreateCsv(Table data)
        {
            var parse = new StringBuilder();
            parse.Append(GetHeader());
            var recordUnits = data.RecordUnits;
            for (var i = 0; i < recordUnits.Count; i++)
            {
                parse.Append(ToStringRecordUnit(recordUnits[i]));
            }
            return parse.ToString();
        }

#if DEBUG
        public
#endif
            string GetHeader()
        {
            var header = new StringBuilder();
            Append(header, "番号");
            Append(header, "プレイ回数");
            Append(header, "楽曲名");
            Append(header, "難易度");
            Append(header, "スコア");
            Append(header, "JUSTICE CRITICAL");
            Append(header, "JUSTICE");
            Append(header, "ATTACK");
            Append(header, "MISS");
            Append(header, "MAX COMBO");
            Append(header, "TAP成功率");
            Append(header, "HOLD成功率");
            Append(header, "SLIDE成功率");
            Append(header, "AIR成功率");
            Append(header, "FLICK成功率");
            Append(header, "CLEAR");
            Append(header, "NEW RECORD");
            Append(header, "コンボステータス");
            Append(header, "チェインステータス");
            Append(header, "プレイ日時");
            Append(header, "トラック");
            Append(header, "キャラクター");
            Append(header, "スキル");
            Append(header, "スキルレベル");
            Append(header, "スキル結果");
            Append(header, "店舗");
            Append(header, "リンク", true);
            return header.ToString();
        }

#if DEBUG
        public
#endif
            string ToStringRecordUnit(TableUnit recordUnit)
        {
            var playlogDetail = recordUnit.PlaylogDetail;

            var row = new StringBuilder();
            Append(row, recordUnit.Number);
            Append(row, recordUnit.PlayCount);
            Append(row, playlogDetail.Name);
            Append(row, playlogDetail.Difficulty);
            Append(row, playlogDetail.Score);
            Append(row, playlogDetail.JusticeCriticalCount);
            Append(row, playlogDetail.JusticeCount);
            Append(row, playlogDetail.AttackCount);
            Append(row, playlogDetail.MissCount);
            Append(row, playlogDetail.MaxCombo);
            Append(row, playlogDetail.TapPercentage);
            Append(row, playlogDetail.HoldPercentage);
            Append(row, playlogDetail.SlidePercentage);
            Append(row, playlogDetail.AirPercentage);
            Append(row, playlogDetail.FlickPercentage);
            Append(row, playlogDetail.IsClear);
            Append(row, playlogDetail.IsNewRecord);
            Append(row, playlogDetail.ComboStatus);
            Append(row, playlogDetail.ChainStatus);
            Append(row, playlogDetail.PlayDate.ToString());
            Append(row, playlogDetail.Track);
            Append(row, playlogDetail.CharacterName);
            Append(row, playlogDetail.SkillName);
            Append(row, playlogDetail.SkillLevel);
            Append(row, playlogDetail.SkillResult);
            Append(row, playlogDetail.StoreName);
            Append(row, recordUnit.LinkNumber, true);

            return row.ToString();
        }
    }
}
