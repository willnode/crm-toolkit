#!/usr/bin/env node

// Setup for SSR (which is opt-in)
// The only requirement is that you set
// CHROME_PATH to absolute path of Chrome,
// then SSR will be implemented during build.

if (process.env.CHROME_PATH) {
	process.env.PUPPETEER_EXECUTABLE_PATH = process.env.CHROME_PATH;
	var child = require('child_process').exec('react-snap')
	child.stdout.pipe(process.stdout)
	child.stderr.pipe(process.stderr)

	// Need to change .htaccess redirect from index.html to 200.html
	var fs = require('fs')
	fs.readFile('./build/.htaccess', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		var result = data.replace(/index\.html/g, '200.html');

		fs.writeFile('./build/.htaccess', result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}
