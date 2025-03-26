const { build } = require("esbuild");
const { existsSync, mkdirSync } = require("node:fs");

if (!existsSync("./dist")) {
	mkdirSync("./dist", { recursive: true });
}

const entryPoints = ["src/service_worker.ts", "src/popup.ts"];

Promise.all(
	entryPoints.map((entryPoint) =>
		build({
			entryPoints: [entryPoint],
			bundle: true,
			outfile: `dist/${entryPoint.split("/").pop().replace(".ts", ".js")}`,
			minify: true,
			platform: "browser",
			target: ["chrome90"],
			format: "esm",
			sourcemap: false,
		}),
	),
)
	.then(() => console.log("Build completed successfully!"))
	.catch((err) => {
		console.error("Build failed:", err);
		process.exit(1);
	});
