# CRM Toolkit

<p align="center"><a href="https://dev.wellosoft.net/crm-toolkit/">Live Demo</a> &bullet; <a href="https://willnode.github.io/crm-toolkit/">Documentation</a></p>

<p align="center"><img src="./web/public/assets/splash.png" width="400px" alt=""></p>

CRM Toolkit is your starting template for bootstrapping any web application project!

Back in the hood, CRM Toolkit uses [CodeIgniter 4](https://codeigniter.com/), [React 16](https://reactjs.org/) and [Material-UI 4](https://material-ui.com/). We have opinions why you will love this mix:

+ `PHP` is one of the most popular language to write Server App. And while there are few frameworks to pick, `CodeIgniter` is a great option because it has minimum boilerplate and small learning curve. We optimize this further such that the PHP code only executes as a Server App that bridges between the Client and Database using AJAX requests.
+ `React` is the of the most popular `JavaScript` framework. Sure while you can deploy web app with just CodeIgniter, the separation between server and client in code has a clear benefit both in development time and user experience in the long run.
+ If you're fan of [Material Design](https://material.io/), you'll love `Material-UI`. It's a design system packed with lots of React components that follows Material Design principles. `Material-UI` is fairly easy to customize and we have improve this with lots of function that simplifies your development for most common cases mentioned in the docs.

Packed together, CRM Toolkit provides built-in tools and functions to make it easy for you to get started with.

## In Depth

**[You can see live server demo here.](https://dev.wellosoft.net/crm-toolkit)**

CRM Toolkit is packed with batteries included. We put login mechanism there so that you can learn how's each function get used and how you should expect to work with them.

If you have explored the live demo. You see that CRM Toolkit has mechanism to:

+ Performing AJAX request to Server API
+ Logging in users with Basic Authorization
+ Handle different roles of account in server
+ Reusing server endpoints using Model
+ Validate POST input in Server
+ Validate Form in live using JavaScript
+ REST-fully handle data requests
+ Perform SSR in Client App

And a lot more. You will get amazed how simple to extend those basic mechanism to suit your need.

## Usage

### Prequirements

+ PHP >= 7.2 (for running api)
+ MariaDB >= 5.5.3 (for storing data)
+ NodeJS >= v10 (for running web)

Additional notes before installing or running the scripts:
+ Make sure `php` and `npm` is available on your terminal
+ Make sure the SQL server is running (and [it's connection config](api/.env) is correct)
+ Make sure the PHP has sufficient extensions enabled (`intl`, `mbstring`, `json`, `xml`)

#### Installation

Open [the install script](scripts/install.bat)

The install script contains steps necessary before able to run the web in local environments. If you don't like running script you can run `php spark install` and `npm install` individually.

#### Running

Open [the run script](scripts/run.bat)

By default, the server runs on `localhost:4000` while the client runs on `localhost:3000`. If you don't like running script you can run `php spark serve` and `npm start` individually.


## More Reading

[See our documentation](https://willnode.github.io/crm-toolkit/) for implementation notes on various topics. (Basics, Design, Server, Client, Deploy, etc.)

+ CodeIgniter: [Website](https://codeigniter.com/) [Docs](https://codeigniter4.github.io/CodeIgniter4/)
+ React: [Website](https://reactjs.org/) [Docs](https://reactjs.org/docs/getting-started.html)
+ Material-UI: [Website](https://material-ui.com/) [Docs](https://material-ui.com/getting-started/installation/)

You also might want to read third parties that we also use:

+ [parcel](https://parceljs.org/)
+ [react-helmet](https://github.com/nfl/react-helmet)
+ [react-router-dom](https://reacttraining.com/react-router/web/)
+ [react-snap](https://github.com/stereobooster/react-snap)
+ [react-table](https://react-table.js.org/)

## Support Us

+ Give this repo a ⭐
+ Spread the word about CRM-Toolkit ✍

You can ask something in [issues](https://github.com/willnode/crm-toolkit/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) or [email me](mailto:willnode@wellosoft.net).

## License

[MIT](LICENSE)
