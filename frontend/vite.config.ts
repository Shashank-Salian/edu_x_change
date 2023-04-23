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
});
