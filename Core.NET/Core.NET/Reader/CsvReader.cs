using System;

namespace ChunithmClientLibrary.Reader
{
    public abstract class CsvReader<TResult> : IReader<string, TResult>
    {
        public abstract TResult Read(string source);

        protected T GetField<T>(string row, ref int startIndex, Func<string, T> parse)
        {
            if (startIndex < 0 || startIndex >= row.Length)
            {
                return default(T);
            }

            var fieldStartIndex = startIndex;
            var fieldEndIndex = row.IndexOf(',', fieldStartIndex) - 1;
            if (fieldEndIndex < -1)
            {
                fieldEndIndex = row.Length - 1;
            }

            var source = row.Substring(fieldStartIndex, fieldEndIndex - fieldStartIndex + 1);
            var value = parse(source);

            startIndex = fieldEndIndex + 2;

            return value;
        }

        protected string GetTextField(string row, ref int startIndex)
        {
            if (startIndex < 0 || startIndex >= row.Length)
            {
                return "";
            }

            var escaped = row[startIndex] == '"';
            if (!escaped)
            {
                return GetField(row, ref startIndex, str => str);
            }

            var fieldStartIndex = startIndex;
            var fieldEndIndex = fieldStartIndex + 1;
            while (fieldEndIndex < row.Length)
            {
                if (row[fieldEndIndex] != '"')
                {
                    fieldEndIndex++;
                    continue;
                }

                if (fieldEndIndex + 1 < row.Length)
                {
                    if (row[fieldEndIndex + 1] == '"')
                    {
                        fieldEndIndex += 2;
                    }
                    else
                    {
                        break;
                    }
                }
            }

            if (fieldEndIndex >= row.Length)
            {
                startIndex = row.Length;
                return row.Substring(fieldStartIndex + 1, (row.Length - 2) - (fieldStartIndex + 1) + 1);
            }

            var valueStartIndex = fieldStartIndex + 1;
            var valueEndIndex = fieldEndIndex - 1;
            var value = row.Substring(valueStartIndex, valueEndIndex - valueStartIndex + 1);
            value = value.Replace("\"\"", "\"");

            startIndex = fieldEndIndex + 2;

            return value;
        }
    }
}
