---
nav_order: 4
---

# Building a Server App

From the previous articles we mention that CRM Toolkit uses CodeIgniter 4 as the base framework to bridge the connection between a client app and a database.

## Installing

The install script runs `php spark install` which checks the database connection (or attempting to create one if it's not exist) then using migrations to add a `login` table there. You may run it once or any time after changing the database config.

## Setup

Most setup are configurable inside `.env` file inside the `api` directory. This is the default settings:

```ini
CI_ENVIRONMENT = 'development'
app.baseURL = 'http://localhost:4000/'
app.frontURL = 'http://localhost:3000'

database.default.hostname = 'localhost'
database.default.database = 'crmtoolkit'
database.default.username = 'root'
database.default.password = ''
database.default.DBDriver = 'MySQLi'

email.fromEmail = 'noreply@example.com'
email.fromName = 'CRM Toolkit'
email.SMTPHost = ''
email.SMTPUser = ''
email.SMTPPass = ''
email.SMTPPort = 465
```

Some tweaks you can found here are:

#### Environment

The `CI_ENVIRONMENT` default is `development`. Any time you want to send your app at live server, don't forget to change this attribute to `production`. This way, errors won't logged out to users, the debugger page will be turned off, and routes list won't be served. This to ensure that server specific information won't leak out.

#### Base URL

The base URL is the server URL base location. Only used during development for debugger page.

#### Front URL

The front URL is the live client app URL location. This is used to handle CORS. You can use array if your app live on multiple URLs.

If you have problems dealing with CORS, you can set `app.frontUrl` to `*`. Although, you'll face security issue if you leave it that way (use this technique as a last resort).

#### Database

The default config is provided for local MySQL connection (e.g. XAMPP or MariaDB). You might want to adjust some especially when the app run on live server.

#### Email

By default, the email is configured for STMP (most CPanel powered hosting provider using SMTP). If you're planning to send emails, you can change email config here and use `sendSimpleEmail()` to send emails.

## Controllers

In previous article, we have discussed these controllers:

```
+ api/app/Controllers/
|--+ Admin.php
|--+ Home.php
|--+ User.php
```

By default, `Admin.php` and `User.php` is an authenticated area protected with `Auth.php` from Filters. `Home.php` is the "Home" for endpoints which no needs authentication (.i.e. `/login`, `/register` and `/forgot`).  If you want to add more Home endpoints, you also need to configure routes in `api/app/Config/Routes.php`:

```php
$routes->get('/', 'Home::index');
$routes->get('/login', 'Home::login');
$routes->post('/forgot', 'Home::forgot');
$routes->post('/register', 'Home::register');
```

All controllers inherits from `BaseController.php` and it contains `$this->login` for accessing `LoginModel`. The `BackEnd_helper.php` utility is also loaded for convenience.

## Filters

There are two built-in Filters used thorough the system

#### Auth.php

This filter initializes `LoginModel` and checks whether the `Authorization` header value is correct. If the user key is available in the database and its password matches, and the client accessing the correct "room" for given user role, then the filter will go pass thorough, otherwise it returns `401 Unauthorized`.

If you change the controller name, you need to configure Filters in `api/app/Config/Filters.php`:

```php
public $filters = [
    'auth' => ['before' => [
        'login', 'forgot',
        'admin/*', 'admin',
        'user/*', 'user',
    ]],
];
```

>  Note: You can see that we also include `login` and `forgot` endpoints; this is a special behaviour defined in `Filters.php`  as they shouldn't return `401` on incomplete password.

All authentication is done using `Basic` auth.

#### CORS.php

This filters detect AJAX requests then assigns proper CORS headers for all routes in the system. Note that in CodeIgniter, AJAX detection is done by checking whether `X-Requested-With: xmlhttprequest` is present in HTTP Header.

If you have problems dealing with CORS, then either you haven't set `X-Requested-With` (in Javascript `fetch()`) or you have set wrong URL in `app.frontUrl` config.

## Models

In previous article, we know that every endpoint is controlled using explicit models to keep the controller file clean and tidy:

```php
class Admin extends BaseController {
	public function profile() {
		return (new ProfileModel())->execute($this->login->current_id);
	}
	public function user($id = NULL) {
		return (new UserModel())->execute($id);
	}
}
```

To help you get started, CRM Toolkit includes several built-in Models:

```
+ api/app/Models/
|--+ ForgotModel.php
|--+ LoginModel.php
|--+ ProfileModel.php
|--+ RegisterModel.php
|--+ UserModel.php
```

| Model Name          | What it is for?                                              |
| ------------------- | ------------------------------------------------------------ |
| `ForgotModel.php`   | Help users change password in case they forgot               |
| `LoginModel.php`    | Used across the system for identifying users through `Authorization` header |
| `ProfileModel.php`  | Change currently logged in user data (e.g. email/name/avatar) |
| `RegisterModel.php` | Allows self-registering new accounts                         |
| `UserModel.php`     | Help admin manage user accounts                              |

All models (except `LoginModel`) inherits `BaseModel.php` which provides the main logic for the `execute()` method.

You can follow the next section for a guide to create your own model.

## Writing Custom Model

To use `BaseModel.php` you don't need to override or define your own `execute()`, rather than you need to give clues on what to read and what to change, by overriding either attributes or event functions. This is the list of things you can override in `BaseModel.php` :

```php
class CustomModel extends BaseModel
{
    // Required attributes
	protected $table;
	protected $primaryKey;
    // Query options
	protected $select = [];
	protected $searchable = [];
	protected $indexable = [];
	protected $columnsOnQuery = [];
	protected $enforcedPaginations = [];
	// Modification options
	protected $allowedFields = [];
	protected $fileUploadRules = [];
	protected $validationRules = [];
    // Constraint options
	protected $join = NULL;
	protected $only = NULL;
	protected $where = NULL;
    // Subquery options
	protected $lookUp = [];
	protected $lookDown = [];
	protected $compositeKey = NULL;
	protected $compositeValue = NULL;
	protected $compositeWrap = FALSE;
	// Event hooks
	protected function executeBeforeExecute($event) { return $event; }
	protected function executeBeforeChange($event) { return $event; }
	protected function executeAfterChange($event) {	return $event; }
	protected function executeAfterFind($event) { return $event; }
	protected function executeAfterExecute($result) { return $result; }
}
```

You might be confused by how much things can be overridden but actually you just need to specify only few of them to get it working:

```php
class ArticleModel extends BaseModel
{
    // The table name
	protected $table = 'article';
    // Table's primary key
	protected $primaryKey = 'article_id';
    // Table attributes that can be read
	protected $select = [
		'article_id', 'article_login',
		'article_title', 'article_body'
	];
    // Table attributes that can be written
	protected $allowedFields = [
		'article_login', 'article_title',
        'article_body'
	];
}
```

Assume this lives on admin controller:

```php
class Admin extends BaseController{
	public function article($id = NULL)	{
		return (new ArticleModel())->execute($id);
	}
}
```

This is how you do operations on the model:

| HTTP Header               | Meaning                                                  | Term     |
| ------------------------- | -------------------------------------------------------- | -------- |
| `GET /admin/article/`     | Read all articles (paginated)                            | `SELECT` |
| `GET /admin/article/2`    | Read an article with ID 2                                | `SELECT` |
| `POST /admin/article/`    | Insert a new article (the ID is automatically generated) | `CREATE` |
| `POST /admin/article/2`   | Update some or all fields in article with ID 2           | `UPDATE` |
| `DELETE /admin/article/2` | Delete an article with ID 2                              | `DELETE` |

While getting the CRUD works using few options seems really awesome, most of the time you  do need more additional options to constrain user input or add some additional business logic. This is where most of the overridable attributes comes in.

Let's take a deep look how they work.

#### Querying Items with GET

Configurable options:

```php
// Table attributes that get returned
// {default is '*'}
protected $select = [];
// Which columns can be partially searched
protected $searchable = [];
// Which columns can be filtered (exact match)
protected $indexable = [];
// If not empty, apply whitelists during GET query
protected $columnsOnQuery = [];
// Pagination size available options
// {default is [100, 50, 25, 20, 10, 5]}
protected $enforcedPaginations = [];
```

Getting list of articles by using `GET /admin/article/` is simply not enough. For more options, you can use query parameters, like this:

```
GET /admin/article/?page=2&pageSize=20
```

Which results in this SQL query:

```sql
SELECT * FROM `article` LIMIT 20 OFFSET 40
```

Complete GET query parameter options:

| Query                         | Default | Behavior                                                     |
| ----------------------------- | ------- | ------------------------------------------------------------ |
| `page`                        | `0`     | Pagination offset (zero is the first page)                   |
| `pageSize`                    | depends | Pagination size to be returned. This values must match within the value of `enforcedPaginations`. If not matching, then it will fallback to first value of `enforcedPaginations`.<br /><br />Note: if you set `enforcedPaginations` to `NULL` then paginations is turned off (not recommended) |
| `groupBy`                     | `null`  | If specified, and `groupBy` is in one of `indexable`, then SQL `GROUP BY` will be applied. |
| `orderBy`                     | `null`  | If specified, and `orderBy` is in one of `select`, then SQL `ORDER BY` will be applied.<br /><br />Note: if you ignore `select` to it's default value `*`, then this parameter is simply ignored (for security reason). |
| `orderDirection`              | `asc`   | If set to `desc`, then `orderBy` will evaluates descending.  |
| `search`                      | `null`  | If specified, and `searchable` is not empty, then it will considered as additional `WHERE LIKE` clause for each column in `searchable`.<br /><br />Note: try to use few columns as possible since `LIKE` wildcard query is known to be really slow. |
| Other values<br />`key=value` |         | If `key` is specified as one of `indexable` then it will considered as additional `WHERE` query based on `key` and it's pair `value`. |

#### Create or Update an Item with POST

Configurable options:

```php
// Table attributes that writable from POST body
protected $allowedFields = [];
// Rules to set validate data uploads
protected $fileUploadRules = [];
// Rules used to validate POST data
protected $validationRules = [];
```

The `allowedFields` is a must. If you omit it then the model will not accepting `POST` for `CREATE` or `UPDATE` operation.

> Setting this attribute empty does not prevent `DELETE`  and other special operations like subquerying and state reducers using actions. If you want to make the model truly read-only, set `$only` to `[SELECT]`.

The `validationRules` attribute follows CodeIgniter documentation on [validating models](https://codeigniter4.github.io/userguide/models/model.html#validating-data). If a user violates one of validation during `CREATE` or `UPDATE` then the model simply rejects the whole request.

```php
protected $validationRules = [
    'name' => 'required|min_length[3]|alpha_numeric_space',
    'email' => 'required|valid_email',
];
```

For files however, you might want to use `fileUploadRules`. Example usage:

```php
protected $fileUploadRules = [
    'avatar' => ['types' => ['jpg', 'png', 'bmp']]
];
```

List of default file options:

```php
[
    // Specify destination folder under `api/writables/uploads`
    'folder' => null, // This defaults to the rule name (key)
    // Specify whitelists of allowed upload extension types (array)
    // Under the hood it checks using $file->guessExtension()
    'types' => '*',
    // Is the file is required? Under the hood, this config also
    // checks whether the user already uploaded the file to database
    // so user is not required to reupload the file during UPDATE.
    'required' => false,
    // In case of file name conflict, overwrite existing file?
    // If unset or false, let CodeIgniter rename the file.
    // (If set true, Usually accompanied by `custom_file_name`)
    'overwrite' => false,
    // A callable function for determining custom name for a given file.
    // parameters: ($file, $name, $option, $input_data, $existing_row)
    // (you might want to pass this thing as a string
    //         then put the function in a helper file)
    'custom_file_name' => null,
]
```

#### Constraint Usage

```php
protected $join = null;
protected $only = null;
protected $where = null;
```
#### Nested Query

```php
protected $lookUp = [];
protected $lookDown = [];
protected $compositeKey = NULL;
protected $compositeValue = NULL;
protected $compositeWrap = FALSE;
```

#### Event Hooks

```php
protected function executeBeforeExecute($event) { return $event; }
protected function executeBeforeChange($event) { return $event; }
protected function executeAfterChange($event) {	return $event; }
protected function executeAfterFind($event) { return $event; }
protected function executeAfterExecute($result) { return $result; }
```

## Next

+ Read [Developing a Client App](client.md)
+ Back to the [Main Page](index.md)

