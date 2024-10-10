import { defineConfig } from "vite";
import { resolve } from "path";
import fg from "fast-glob";
import path from "path";

function generateEntries() {
	const entries = {};
	const scriptFiles = fg.sync("src/scripts/**/*.ts");
	const styleFiles = fg.sync("src/styles/**/*.scss");

	scriptFiles.forEach((file) => {
		const name = path.basename(file, ".ts");
		entries[`js_${name}`] = resolve(__dirname, file);
	});

	styleFiles.forEach((file) => {
		const name = path.basename(file, ".scss");
		if (!name.startsWith("_")) {
			entries[`css_${name}`] = resolve(__dirname, file);
		}
	});

	return entries;
}

export default defineConfig({
	build: {
		outDir: "assets",
		emptyOutDir: false,
		rollupOptions: {
			treeshake: false,
			input: generateEntries(),
			output: {
				entryFileNames: (chunkInfo) => {
					const name = chunkInfo.name.replace(/^js_/, "");
					return `${name}.js`;
				},
				assetFileNames: (assetInfo) => {
					const extType = path.extname(assetInfo.name).substring(1);
					const name = path
						.basename(assetInfo.name, path.extname(assetInfo.name))
						.replace(/^(js|css)_/, "");
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						return `${name}.[ext]`;
					}
					return `${name}.css`;
				},
			},
		},
	},
});
