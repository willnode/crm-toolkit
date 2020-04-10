# CRM Toolkit

<p align="center"><img src="./web/public/assets/splash.png" width="400px" alt=""></p>

CRM Toolkit is your starting template for bootstrapping any web application project!

Back in the hood, CRM Toolkit uses [CodeIgniter 4](https://codeigniter.com/), [React 16](https://reactjs.org/) and [Material-UI 4](https://material-ui.com/). We have opinions why you will love this mix:

+ `PHP` is one of the most popular language to write backend. And while there are few frameworks to pick, `CodeIgniter` is great option because it has minimum boilerplate and small learning curve.
+ `React` is the of the most popular `JavaScript` framework. Sure while you can deploy web app with just CodeIgniter, the separation between front-end and back-end has a clear benefit. For instance, your app can load fast and still run even user disconnected, thanks to [Progressive Web Apps](https://web.dev/progressive-web-apps/). You can implement PWA in your web app fairly easy if you choose to separate back-end and front-end, like we did in CRM Toolkit.
+ If you're fan of [Material Design](https://material.io/), you'll love `Material-UI`. It's a design system packed with lots of React components that follows Material Design principles.

Packed together, CRM Toolkit provides built-in tools and functions to make it easy for you to get started with.

## In Depth

**[You can see live server demo here.](https://dev.wellosoft.net/crm-toolkit)**

CRM Toolkit is packed with batteries included. We put login mechanism there so that you can learn how's each function get used and how you should expect to work with them.

If you have explored the live demo. You see that CRM Toolkit has mechanism to:

+ Login and manage different type accounts
+ Performing AJAX request with remote page or table data
+ Live Form Validation done in JavaScript
+ REST-fully handle data requests

And a lot more. You will get amazed how simple to extend those basic mechanism to suit your need.

## Install

Prequirements:
+ PHP atleast 7.2 or more (for running CI)
+ MariaDB/MySQL (for storing application data)
+ NodeJS atleast v10 (for running CRA)


Server setup:
+ Create empty database `crmtoolkit` in your MySQL
+ Spin up the terminal, Go to `cd api`
+ Execute database migration: `php spark migrate`

Website setup:
+ Spin up the terminal, Go to `cd web`
+ Wait until installation finishes

## Run

+ For backend: `php spark serve`
+ For frontend: `npm start`

## More Reading

+ CodeIgniter: [Website](https://codeigniter.com/) [Docs](https://codeigniter4.github.io/CodeIgniter4/)
+ React: [Website](https://reactjs.org/) [Docs](https://reactjs.org/docs/getting-started.html)
+ Material-UI: [Website](https://material-ui.com/) [Docs](https://material-ui.com/getting-started/installation/)

You also might want to read third parties that we also use:

+ [react-helmet](https://github.com/nfl/react-helmet)
+ [react-router-dom](https://reacttraining.com/react-router/web/)
+ [material-table](https://material-table.com/)
+ [create-react-app](https://create-react-app.dev/)

