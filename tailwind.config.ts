import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#100e0c", cream: "#f2ead8", amber: "#e8a33b", rust: "#a84f2b" }, fontFamily: { sans: ["var(--font-inter)"], display: ["var(--font-oswald)"], hero: ["var(--font-anton)"] } } }, plugins: [] } satisfies Config;
