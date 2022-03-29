require("esbuild")
  .build({
    entryPoints: ["index.tsx"],
    outdir: "lib",
    bundle: true,
    sourcemap: true,
    minify: true,
  })
  .catch(() => process.exit(1));
