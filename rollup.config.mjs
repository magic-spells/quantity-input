import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';

const dev = process.env.ROLLUP_WATCH;
const name = 'quantity-input';

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
			copy({ targets: [{ src: 'src/quantity-input.css', dest: 'dist' }] }),
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
								{ src: `src/${name}.css`, dest: 'demo' },
								{ src: `src/${name}.css`, dest: 'dist' },
							],
							hook: 'writeBundle',
							copyOnce: false,
						}),
					],
				},
			]
		: []),
];
