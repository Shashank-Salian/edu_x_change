import { resolve } from "path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	root: "src",
	base: "/static/vite/",
	server: {
		port: 3000,
	},
	build: {
		manifest: true,
		outDir: "./dist/vite",
		rollupOptions: {
			input: {
				main: "./src/main",
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@/components": resolve(__dirname, "src", "components"),
			"@/assets": resolve(__dirname, "src", "assets"),
			"@/utils": resolve(__dirname, "src", "utils"),
		},
	},
});
