#!/usr/bin/env node

// Setup for SSR (which is opt-in)
// The only requirement is that you set
// CHROME_PATH to absolute path of Chrome,
// then SSR will be implemented during build.

const skipped = process.env.npm_config_puppeteer_skip_chromium_download;
const chrome = process.env.CHROME_PATH;
const firefox = process.env.FIREFOX_PATH;

if (!skipped) {
	// Better.
} else if (chrome) {
	process.env.PUPPETEER_EXECUTABLE_PATH = chrome;
	process.env.PUPPETEER_PRODUCT = 'chrome';
} else if (firefox) {
	process.env.PUPPETEER_EXECUTABLE_PATH = firefox;
	process.env.PUPPETEER_PRODUCT = 'firefox';
} else {
	return console.log("No Chrome/Firefox Path detected, skipping prerender.");
}

// Spawn react-snap
var child = require('child_process').exec('react-snap');
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

// Need to change .htaccess redirect from index.html to 200.html
var fs = require('fs')
fs.readFile('./dist/.htaccess', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	var result = data.replace(/index\.html/g, '200.html');

	fs.writeFile('./dist/.htaccess', result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});
