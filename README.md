# CRM Toolkit

<p align="center"><img src="./web/public/assets/splash.png" width="300px" alt=""></p>

CRM Toolkit is your starting template for bootstrapping any web application project!

Back in the hood, CRM Toolkit uses [CodeIgniter 4](https://codeigniter.com/), [React 16](https://reactjs.org/) and [Material-UI 4](https://material-ui.com/). We have opinions why you will love this mix:

+ `PHP` is one of the most popular language to write backend. And while there are few frameworks to pick, `CodeIgniter` is great option because it has minimum boilerplate and small learning curve.
+ `React` is the of the most popular `JavaScript` framework. Sure while you can deploy web app with just CodeIgniter, the separation between front-end and back-end has a clear benefit. For instance, your app can load fast and still run even user disconnected, thanks to [Progressive Web Apps](https://web.dev/progressive-web-apps/). You can implement PWA in your web app fairly easy if you choose to separate back-end and front-end, like we did in CRM Toolkit.
+ If you're fan of [Material Design](https://material.io/), you'll love `Material-UI`. It's a design system packed with lots of React components that follows Material Design principles.

Packed together, CRM Toolkit provides built-in tools and functions to make it easy for you to get started with.

## Install

Prequirements during development:
1. A running PHP and MariaDB/MySQL server.
2. Node.JS.

Production server requirement:
+ Any Apache hosting server running atleast PHP 7.2.

Development installation:
1. Clone this repo
2. Run `cd web` then `npm install`
3. Create database `crmtoolkit`, run `cd api` then `php spark migrate`

## Run

+ For backend: `php spark serve`
+ For frontend: `npm start`

In you're in windows, `start.bat` provides convenient shortcut to run both in a click.
