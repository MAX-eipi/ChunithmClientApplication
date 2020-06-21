namespace ChunithmClientLibrary
{
    public enum ComboStatus
    {
        None,
        FullCombo,
        AllJustice,
    }

    public static partial class Utility
    {
        public static readonly string COMBO_STATUS_NONE_TEXT = "NONE";
        public static readonly string COMBO_STATUS_FULL_COMBO_TEXT = "FULL COMBO";
        public static readonly string COMBO_STATUS_ALL_JUSTICE_TEXT = "ALL JUSTICE";

        public static ComboStatus ToComboStatus(string comboStatusText)
        {
            if (comboStatusText == COMBO_STATUS_ALL_JUSTICE_TEXT)
            {
                return ComboStatus.AllJustice;
            }

            if (comboStatusText == COMBO_STATUS_FULL_COMBO_TEXT)
            {
                return ComboStatus.FullCombo;
            }

            return ComboStatus.None;
        }

        public static string ToComboStatusText(ComboStatus comboStatus)
        {
            switch (comboStatus)
            {
                case ComboStatus.AllJustice:
                    return COMBO_STATUS_ALL_JUSTICE_TEXT;
                case ComboStatus.FullCombo:
                    return COMBO_STATUS_FULL_COMBO_TEXT;
            }

            return COMBO_STATUS_NONE_TEXT;
        }
    }
}
