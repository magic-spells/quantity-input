import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';
import { transform, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const dev = process.env.ROLLUP_WATCH;
const name = 'quantity-input';

// Custom plugin to process CSS with Lightning CSS
function css({ src, outDir }) {
	return {
		name: 'lightningcss',
		buildStart() {
			const source = readFileSync(src, 'utf8');
			const targets = browserslistToTargets(browserslist());

			// Processed (not minified)
			const { code: processed } = transform({
				filename: src,
				code: Buffer.from(source),
				targets,
				minify: false,
			});

			// Minified
			const { code: minified } = transform({
				filename: src,
				code: Buffer.from(source),
				targets,
				minify: true,
			});

			mkdirSync(outDir, { recursive: true });
			writeFileSync(`${outDir}/${name}.css`, processed);
			writeFileSync(`${outDir}/${name}.min.css`, minified);
		},
	};
}

export default [
	// ESM build
	{
		input: 'src/quantity-input.js',
		output: {
			file: `dist/${name}.esm.js`,
			format: 'es',
			sourcemap: true,
		},
		plugins: [
			resolve(),
			css({ src: `src/${name}.css`, outDir: 'dist' }),
		],
	},
	// CommonJS build
	{
		input: 'src/quantity-input.js',
		output: {
			file: `dist/${name}.cjs.js`,
			format: 'cjs',
			sourcemap: true,
			exports: 'named',
		},
		plugins: [resolve()],
	},
	// UMD build
	{
		input: 'src/quantity-input.js',
		output: {
			file: `dist/${name}.js`,
			format: 'umd',
			name: 'QuantityInput',
			sourcemap: true,
		},
		plugins: [resolve()],
	},
	// Minified UMD for browsers
	{
		input: 'src/quantity-input.js',
		output: {
			file: `dist/${name}.min.js`,
			format: 'umd',
			name: 'QuantityInput',
			sourcemap: false,
		},
		plugins: [
			resolve(),
			terser({
				keep_classnames: true,
				format: {
					comments: false,
				},
			}),
		],
	},
	// Development build
	...(dev
		? [
				{
					input: 'src/quantity-input.js',
					output: {
						file: `dist/${name}.esm.js`,
						format: 'es',
						sourcemap: true,
					},
					plugins: [
						resolve(),
						serve({
							contentBase: ['src', 'dist', 'demo'],
							open: true,
							port: 3000,
						}),
						copy({
							targets: [
								{ src: `dist/${name}.esm.js`, dest: 'demo' },
								{ src: `dist/${name}.esm.js.map`, dest: 'demo' },
								{ src: `dist/${name}.css`, dest: 'demo' },
								{ src: `dist/${name}.min.css`, dest: 'demo' },
							],
							hook: 'writeBundle',
							copyOnce: false,
						}),
					],
				},
			]
		: []),
];
