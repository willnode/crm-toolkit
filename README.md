# CRM Toolkit

CRM Toolkit is a full MVC-based web application starter kit that includes:
+ CodeIgniter 4 for the *Model*
+ React for the *Controller*
+ Material-UI for the *View*

## How?

We use CodeIgniter as the base framework for backend. PHP is most popular language to running backend programs.

The communication between React and CodeIgniter is fully done with AJAX. We also use Material-UI as the base template for the design, along with CRA to create Single Page Web Application.  

## Install

Prequirements during development:
1. XAMPP or preinstalled PHP, MariaDB and SQL Client (HeidiSQL / PhpMyAdmin)
2. Node.JS

Production server requirement:
+ Any Apache hosting server running atleast PHP 7.2.

Development installation:
1. Clone this repo
2. Run `cd web` then `npm install`
3. Create database `crmtoolkit`, run `cd api` then `php spark migrate` 

## Run

+ For backend: `php spark serve`
+ For frontend: `npm start`
