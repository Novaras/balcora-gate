import preprocess from 'svelte-preprocess';
import sass from 'sass';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		sass
	}),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		files: {
			assets: `static`
		},
		vite: {
			resolve: {
				alias: {
					$src: path.resolve(`./src`),
					$components: path.resolve(`./src/components`),
					$routes: path.resolve(`./src/routes`),
					$styles: path.resolve(`./src/styles`)
				}
			}
		}
	}
};

export default config;
