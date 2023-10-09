import esbuildServe from 'esbuild-serve';

esbuildServe(
    {
        // esbuild options
        "entryPoints": ["main.js"],
        "bundle": true,
        "outfile": "docs/main.js",
        "sourcemap": true,
        "minify": true,
    },
    {
        // serve options (optional)
        port: 7000,
        root: 'docs',
        servedir: 'docs',
    }
);