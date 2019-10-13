namespace ChunithmClientViewer
{
    partial class MainForm
    {
        /// <summary>
        /// 必要なデザイナー変数です。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージ リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows フォーム デザイナーで生成されたコード

        /// <summary>
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.FileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.dataManagerToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.楽曲更新ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.プラグインToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.chunithmRateAnalyzerToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.デバッグToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.playlogDetailRecordの更新ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.playlogToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.playlogDetailGet0ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.musicGenreGetAllMASTERToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.musicLevelGet13ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.musicDetailGet409ToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.worldsEndMusicGetToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.chunithmNetTab = new System.Windows.Forms.TabPage();
            this.dataManagerTab = new System.Windows.Forms.TabPage();
            this.worldsEndMusicDetailGetToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            this.tabControl1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.FileToolStripMenuItem,
            this.dataManagerToolStripMenuItem,
            this.プラグインToolStripMenuItem,
            this.デバッグToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1074, 24);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // FileToolStripMenuItem
            // 
            this.FileToolStripMenuItem.ForeColor = System.Drawing.Color.White;
            this.FileToolStripMenuItem.Name = "FileToolStripMenuItem";
            this.FileToolStripMenuItem.Size = new System.Drawing.Size(53, 20);
            this.FileToolStripMenuItem.Text = "ファイル";
            // 
            // dataManagerToolStripMenuItem
            // 
            this.dataManagerToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.楽曲更新ToolStripMenuItem});
            this.dataManagerToolStripMenuItem.ForeColor = System.Drawing.Color.White;
            this.dataManagerToolStripMenuItem.Name = "dataManagerToolStripMenuItem";
            this.dataManagerToolStripMenuItem.Size = new System.Drawing.Size(90, 20);
            this.dataManagerToolStripMenuItem.Text = "DataManager";
            // 
            // 楽曲更新ToolStripMenuItem
            // 
            this.楽曲更新ToolStripMenuItem.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.楽曲更新ToolStripMenuItem.ForeColor = System.Drawing.Color.White;
            this.楽曲更新ToolStripMenuItem.Name = "楽曲更新ToolStripMenuItem";
            this.楽曲更新ToolStripMenuItem.Size = new System.Drawing.Size(122, 22);
            this.楽曲更新ToolStripMenuItem.Text = "楽曲更新";
            this.楽曲更新ToolStripMenuItem.Click += new System.EventHandler(this.楽曲更新ToolStripMenuItem_Click);
            // 
            // プラグインToolStripMenuItem
            // 
            this.プラグインToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.chunithmRateAnalyzerToolStripMenuItem});
            this.プラグインToolStripMenuItem.ForeColor = System.Drawing.Color.White;
            this.プラグインToolStripMenuItem.Name = "プラグインToolStripMenuItem";
            this.プラグインToolStripMenuItem.Size = new System.Drawing.Size(63, 20);
            this.プラグインToolStripMenuItem.Text = "プラグイン";
            // 
            // chunithmRateAnalyzerToolStripMenuItem
            // 
            this.chunithmRateAnalyzerToolStripMenuItem.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.chunithmRateAnalyzerToolStripMenuItem.ForeColor = System.Drawing.Color.White;
            this.chunithmRateAnalyzerToolStripMenuItem.Name = "chunithmRateAnalyzerToolStripMenuItem";
            this.chunithmRateAnalyzerToolStripMenuItem.Size = new System.Drawing.Size(210, 22);
            this.chunithmRateAnalyzerToolStripMenuItem.Text = "CHUNITHM Rate Analyzer";
            this.chunithmRateAnalyzerToolStripMenuItem.Click += new System.EventHandler(this.ChunithmRateAnalyzerToolStripMenuItem_Click);
            // 
            // デバッグToolStripMenuItem
            // 
            this.デバッグToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.playlogDetailRecordの更新ToolStripMenuItem,
            this.playlogToolStripMenuItem,
            this.playlogDetailGet0ToolStripMenuItem,
            this.musicGenreGetAllMASTERToolStripMenuItem,
            this.musicLevelGet13ToolStripMenuItem,
            this.musicDetailGet409ToolStripMenuItem,
            this.worldsEndMusicGetToolStripMenuItem,
            this.worldsEndMusicDetailGetToolStripMenuItem});
            this.デバッグToolStripMenuItem.Name = "デバッグToolStripMenuItem";
            this.デバッグToolStripMenuItem.Size = new System.Drawing.Size(55, 20);
            this.デバッグToolStripMenuItem.Text = "デバッグ";
            // 
            // playlogDetailRecordの更新ToolStripMenuItem
            // 
            this.playlogDetailRecordの更新ToolStripMenuItem.Name = "playlogDetailRecordの更新ToolStripMenuItem";
            this.playlogDetailRecordの更新ToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.playlogDetailRecordの更新ToolStripMenuItem.Text = "PlaylogDetailRecord の更新";
            this.playlogDetailRecordの更新ToolStripMenuItem.Click += new System.EventHandler(this.playlogDetailRecordの更新ToolStripMenuItem_Click);
            // 
            // playlogToolStripMenuItem
            // 
            this.playlogToolStripMenuItem.Name = "playlogToolStripMenuItem";
            this.playlogToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.playlogToolStripMenuItem.Text = "PlaylogGet";
            this.playlogToolStripMenuItem.Click += new System.EventHandler(this.playlogToolStripMenuItem_Click);
            // 
            // playlogDetailGet0ToolStripMenuItem
            // 
            this.playlogDetailGet0ToolStripMenuItem.Name = "playlogDetailGet0ToolStripMenuItem";
            this.playlogDetailGet0ToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.playlogDetailGet0ToolStripMenuItem.Text = "PlaylogDetailGet(0)";
            this.playlogDetailGet0ToolStripMenuItem.Click += new System.EventHandler(this.playlogDetailGet0ToolStripMenuItem_Click);
            // 
            // musicGenreGetAllMASTERToolStripMenuItem
            // 
            this.musicGenreGetAllMASTERToolStripMenuItem.Name = "musicGenreGetAllMASTERToolStripMenuItem";
            this.musicGenreGetAllMASTERToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.musicGenreGetAllMASTERToolStripMenuItem.Text = "MusicGenreGet(All,MASTER)";
            this.musicGenreGetAllMASTERToolStripMenuItem.Click += new System.EventHandler(this.musicGenreGetAllMASTERToolStripMenuItem_Click);
            // 
            // musicLevelGet13ToolStripMenuItem
            // 
            this.musicLevelGet13ToolStripMenuItem.Name = "musicLevelGet13ToolStripMenuItem";
            this.musicLevelGet13ToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.musicLevelGet13ToolStripMenuItem.Text = "MusicLevelGet(13)";
            this.musicLevelGet13ToolStripMenuItem.Click += new System.EventHandler(this.musicLevelGet13ToolStripMenuItem_Click);
            // 
            // musicDetailGet409ToolStripMenuItem
            // 
            this.musicDetailGet409ToolStripMenuItem.Name = "musicDetailGet409ToolStripMenuItem";
            this.musicDetailGet409ToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.musicDetailGet409ToolStripMenuItem.Text = "MusicDetailGet(409)";
            this.musicDetailGet409ToolStripMenuItem.Click += new System.EventHandler(this.musicDetailGet409ToolStripMenuItem_Click);
            // 
            // worldsEndMusicGetToolStripMenuItem
            // 
            this.worldsEndMusicGetToolStripMenuItem.Name = "worldsEndMusicGetToolStripMenuItem";
            this.worldsEndMusicGetToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.worldsEndMusicGetToolStripMenuItem.Text = "WorldsEndMusicGet";
            this.worldsEndMusicGetToolStripMenuItem.Click += new System.EventHandler(this.worldsEndMusicGetToolStripMenuItem_Click);
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.chunithmNetTab);
            this.tabControl1.Controls.Add(this.dataManagerTab);
            this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl1.Location = new System.Drawing.Point(0, 24);
            this.tabControl1.Margin = new System.Windows.Forms.Padding(0);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.Padding = new System.Drawing.Point(0, 0);
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(1074, 630);
            this.tabControl1.TabIndex = 2;
            // 
            // chunithmNetTab
            // 
            this.chunithmNetTab.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.chunithmNetTab.Location = new System.Drawing.Point(4, 22);
            this.chunithmNetTab.Margin = new System.Windows.Forms.Padding(0);
            this.chunithmNetTab.Name = "chunithmNetTab";
            this.chunithmNetTab.Size = new System.Drawing.Size(1066, 604);
            this.chunithmNetTab.TabIndex = 0;
            this.chunithmNetTab.Text = "CHUNITHM-NET";
            // 
            // dataManagerTab
            // 
            this.dataManagerTab.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.dataManagerTab.Location = new System.Drawing.Point(4, 22);
            this.dataManagerTab.Name = "dataManagerTab";
            this.dataManagerTab.Padding = new System.Windows.Forms.Padding(3);
            this.dataManagerTab.Size = new System.Drawing.Size(1066, 604);
            this.dataManagerTab.TabIndex = 2;
            this.dataManagerTab.Text = "DataManager";
            // 
            // worldsEndMusicDetailGetToolStripMenuItem
            // 
            this.worldsEndMusicDetailGetToolStripMenuItem.Name = "worldsEndMusicDetailGetToolStripMenuItem";
            this.worldsEndMusicDetailGetToolStripMenuItem.Size = new System.Drawing.Size(243, 22);
            this.worldsEndMusicDetailGetToolStripMenuItem.Text = "WorldsEndMusicDetailGet(8108)";
            this.worldsEndMusicDetailGetToolStripMenuItem.Click += new System.EventHandler(this.worldsEndMusicDetailGetToolStripMenuItem_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(28)))), ((int)(((byte)(28)))), ((int)(((byte)(28)))));
            this.ClientSize = new System.Drawing.Size(1074, 654);
            this.Controls.Add(this.tabControl1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "MainForm";
            this.Text = "CHUNITHM Client Viewer";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_FormClosing);
            this.Load += new System.EventHandler(this.Form1_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.tabControl1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem FileToolStripMenuItem;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage dataManagerTab;
        private System.Windows.Forms.ToolStripMenuItem dataManagerToolStripMenuItem;
        private System.Windows.Forms.TabPage chunithmNetTab;
        private System.Windows.Forms.ToolStripMenuItem プラグインToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem 楽曲更新ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem chunithmRateAnalyzerToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem デバッグToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem playlogDetailRecordの更新ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem playlogToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem playlogDetailGet0ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem musicGenreGetAllMASTERToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem musicLevelGet13ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem musicDetailGet409ToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem worldsEndMusicGetToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem worldsEndMusicDetailGetToolStripMenuItem;
    }
}

