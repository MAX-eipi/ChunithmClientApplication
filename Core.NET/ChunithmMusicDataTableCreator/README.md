<h1>ChunithmMusicDataTableCreator</h1>

執筆途中

楽曲リストをDataManagerに送信するプログラム  
楽曲リストの生成には次の二つの方法がある  
+ CHUNITHM-NETにアクセスして楽曲リストをDLして作成する(利用権必須)
+ CHUNITHM-NETのレコードページのHTMLから作成する

各種オプション

+ --sega_id  
CHUNITHM-NETにアクセスする際に必要  
SEGA IDを指定
+ --password  
上記 --sega_id を指定する場合、こちらも必要  
パスワードを指定
+ --aime_id  
上記 --sega_id を指定する場合、こちらも必要  
使用するAIMEの番号を指定(上から順に0スタート)
+ --local_mode  
レコードページのHTMLから楽曲リストを作成する場合はこのオプションを指定する  
これを指定した場合、--sega_id,--password,--aime_idの指定は無視される
+ --source_path(=./Source)  
上記 --local_mode を指定する場合、こちらも必要  
HTMLが保存されているディレクトリのパスを指定  
+ --source_file_name_format(=music_source_{0}.html)  
上記 --local_mode を指定する場合、こちらも必要  
HTMLのファイル名フォーマット
+ --output_xml  
楽曲リストをExcelファイルで出力
+ --output_directory_path(=./Outputs)  
上記 --output_xml を指定する場合、こちらも必要  
Excelファイルの出力先ディレクトリを指定
+ --max_level(=20)  
最大レベルを指定  
7,7+,8,8+⇒7,8,9,10という割り振りになっていることに注意
