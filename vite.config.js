import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A relative base path means the built site works no matter what your
// GitHub repo is named, or what subfolder it's served from — no manual
// editing needed here, ever, regardless of what you name the repo.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
