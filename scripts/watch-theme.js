require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const fg = require('fast-glob');
const { exec } = require('child_process');

const srcDir = path.resolve(__dirname, '../src');
const rootDir = path.resolve(__dirname, '..');

const SHOULD_LOG = false;

function copyFile(src, dest) {
	fs.copySync(src, dest);
	if (SHOULD_LOG) console.log(`Skopiowano: ${src} -> ${dest}`);
}

function cleanupCssFiles() {
	const assetsDir = path.join(rootDir, 'assets');
	fs.readdir(assetsDir, (err, files) => {
		if (err) {
			console.error('Błąd podczas odczytywania katalogu assets:', err);
			return;
		}

		files.forEach((file) => {
			if (file.startsWith('css_')) {
				const filePath = path.join(assetsDir, file);
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Błąd podczas usuwania pliku ${file}:`, err);
					} else if (SHOULD_LOG) {
						console.log(`Usunięto plik ${file}`);
					}
				});
			}
		});
	});
}

function copyLiquidFiles() {
	const liquidFiles = fg.sync('src/liquid/**/*.liquid');
	liquidFiles.forEach((file) => {
		const relativePath = path.relative(path.join(srcDir, 'liquid'), file);
		const pathParts = relativePath.split(path.sep);
		let destPath;

		if (pathParts[0] === 'sections') {
			destPath = path.join(rootDir, 'sections', path.basename(file));
		} else if (pathParts[0] === 'snippets') {
			destPath = path.join(rootDir, 'snippets', path.basename(file));
		} else if (pathParts[0] === 'templates') {
			destPath = path.join(rootDir, 'templates', path.basename(file));
		} else if (pathParts[0] === 'layout') {
			destPath = path.join(rootDir, 'layout', path.basename(file));
		} else {
			destPath = path.join(rootDir, relativePath);
		}

		copyFile(file, destPath);
	});
}

function copyOtherFiles() {
	['config', 'locales'].forEach((dir) => {
		const srcPath = path.join(srcDir, 'liquid', dir);
		const destPath = path.join(rootDir, dir);
		if (fs.existsSync(srcPath)) {
			fs.copySync(srcPath, destPath);
			if (SHOULD_LOG)
				console.log(`Skopiowano katalog: ${srcPath} -> ${destPath}`);
		}
	});
}

function watchFiles() {
	const watcher = chokidar.watch(['src/**/*'], {
		ignored: /(^|[\/\\])\../,
		persistent: true,
	});

	watcher
		.on('add', handleFileChange)
		.on('change', handleFileChange)
		.on('unlink', removeOnChange);

	if (SHOULD_LOG) console.log('Obserwowanie zmian w folderze src...');
}

function handleFileChange(filePath) {
	const relativePath = path.relative(srcDir, filePath);
	const pathParts = relativePath.split(path.sep);
	const isLiquidPathname = pathParts[0] === 'liquid';
	const isTsFile = filePath.endsWith('.ts');
	const isScssFile = filePath.endsWith('.scss');
	const doesNameStartWithUnderscore = path.basename(filePath).startsWith('_');
	const isOnlyScssFile = isScssFile && !doesNameStartWithUnderscore;

	if (isLiquidPathname) copyOnChange(filePath);

	if (isTsFile || isOnlyScssFile) {
		if (SHOULD_LOG) console.log(`Wykryto zmianę w pliku: ${filePath}`);
		rebuildAssets();
		setTimeout(cleanupCssFiles, 1333);
	}

	// Obsługa usuwania plików .scss zaczynających się od podkreślnika
	if (isScssFile && doesNameStartWithUnderscore) {
		const fileName = path.basename(filePath, '.scss').substring(1); // Usuwamy podkreślnik
		const cssFile = path.join(rootDir, 'assets', `${fileName}.css`);
		if (fs.existsSync(cssFile)) {
			fs.removeSync(cssFile);
			if (SHOULD_LOG) console.log(`Usunięto plik CSS: ${cssFile}`);
		}
	}
}

function copyOnChange(filePath) {
	const relativePath = path.relative(path.join(srcDir, 'liquid'), filePath);
	const pathParts = relativePath.split(path.sep);
	let destPath;

	if (pathParts[0] === 'sections') {
		destPath = path.join(rootDir, 'sections', path.basename(filePath));
	} else if (pathParts[0] === 'snippets') {
		destPath = path.join(rootDir, 'snippets', path.basename(filePath));
	} else if (pathParts[0] === 'templates') {
		destPath = path.join(rootDir, 'templates', path.basename(filePath));
	} else if (pathParts[0] === 'layout') {
		destPath = path.join(rootDir, 'layout', path.basename(filePath));
	} else {
		destPath = path.join(rootDir, relativePath);
	}

	copyFile(filePath, destPath);
}

function removeOnChange(filePath) {
	const relativePath = path.relative(srcDir, filePath);
	const pathParts = relativePath.split(path.sep);

	if (pathParts[0] === 'liquid') {
		const relativeLiquidPath = pathParts.slice(1).join(path.sep);
		let destPath;

		if (pathParts[1] === 'sections') {
			destPath = path.join(rootDir, 'sections', path.basename(filePath));
		} else if (pathParts[1] === 'snippets') {
			destPath = path.join(rootDir, 'snippets', path.basename(filePath));
		} else if (pathParts[1] === 'templates') {
			destPath = path.join(rootDir, 'templates', path.basename(filePath));
		} else if (pathParts[1] === 'layout') {
			destPath = path.join(rootDir, 'layout', path.basename(filePath));
		} else {
			destPath = path.join(rootDir, relativeLiquidPath);
		}

		fs.removeSync(destPath);
		if (SHOULD_LOG) console.log(`Usunięto: ${destPath}`);
	} else if (filePath.endsWith('.ts') || filePath.endsWith('.scss')) {
		const fileName = path.basename(filePath, path.extname(filePath));
		const jsFile = path.join(rootDir, 'assets', `${fileName}.js`);
		const cssFile = path.join(rootDir, 'assets', `${fileName}.css`);

		if (fs.existsSync(jsFile)) {
			fs.removeSync(jsFile);
			if (SHOULD_LOG) console.log(`Usunięto plik JS: ${jsFile}`);
		}
		if (fs.existsSync(cssFile)) {
			fs.removeSync(cssFile);
			if (SHOULD_LOG) console.log(`Usunięto plik CSS: ${cssFile}`);
		}

		// Przebudowanie assetów po usunięciu pliku
		rebuildAssets();
	}
}

function rebuildAssets() {
	if (SHOULD_LOG) console.log('Przebudowywanie wszystkich assetów...');
	exec('npx vite build', (error, stdout, stderr) => {
		if (error) {
			if (SHOULD_LOG) console.error(`Błąd podczas przebudowy: ${error}`);
			return;
		}
		if (SHOULD_LOG) console.log(`Przebudowa zakończona: ${stdout}`);
	});
}

function runCopyProcess() {
	copyLiquidFiles();
	copyOtherFiles();
	if (SHOULD_LOG) console.log('Kopiowanie plików zakończone.');
}

if (require.main === module) {
	if (process.argv.includes('--watch')) {
		watchFiles();
	} else {
		runCopyProcess();
	}
}

module.exports = { runCopyProcess, watchFiles };
