const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

// 必要なディレクトリを作成
const distDir = path.join(__dirname, 'dist');
const packageDir = path.join(__dirname, 'package-for-store');
const distPackageDir = path.join(packageDir, 'dist');
const iconsPackageDir = path.join(packageDir, 'icons');

// 古いパッケージディレクトリがあれば削除
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}

// パッケージディレクトリとサブディレクトリを作成
fs.mkdirSync(packageDir, { recursive: true });
fs.mkdirSync(distPackageDir, { recursive: true });
fs.mkdirSync(iconsPackageDir, { recursive: true });

// ビルドを実行
console.log('TypeScriptコードをビルドしています...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('ビルドに失敗しました:', error);
  process.exit(1);
}

// 必要なファイルをコピー
console.log('ファイルをパッケージディレクトリにコピーしています...');

// manifest.jsonをコピー
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(packageDir, 'manifest.json')
);

// popup.htmlをコピー
fs.copyFileSync(
  path.join(__dirname, 'popup.html'),
  path.join(packageDir, 'popup.html')
);

// distディレクトリ内のすべてのファイルをコピー
if (fs.existsSync(distDir)) {
  const distFiles = fs.readdirSync(distDir);
  for (const file of distFiles) {
    fs.copyFileSync(
      path.join(distDir, file),
      path.join(distPackageDir, file)
    );
  }
}

// iconsディレクトリ内のすべてのファイルをコピー
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
  const iconFiles = fs.readdirSync(iconsDir);
  for (const file of iconFiles) {
    fs.copyFileSync(
      path.join(iconsDir, file),
      path.join(iconsPackageDir, file)
    );
  }
}

// ZIPファイルを作成
console.log('ZIPファイルを作成しています...');
const output = fs.createWriteStream(path.join(__dirname, 'extension-auto-close-tabs.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // 最大圧縮レベル
});

archive.pipe(output);

// パッケージディレクトリ内のすべてのファイルを追加
archive.directory(packageDir, false);

// 完了イベントを登録
output.on('close', () => {
  console.log(`パッケージ化が完了しました: ${archive.pointer()} バイト`);
  console.log('ZIPファイル:', path.join(__dirname, 'extension-auto-close-tabs.zip'));
});

archive.on('error', (err) => {
  console.error('アーカイブに失敗しました:', err);
  process.exit(1);
});

// アーカイブを終了
archive.finalize();