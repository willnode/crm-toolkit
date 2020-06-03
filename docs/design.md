# Designing the App

In previous section you're able to run CRM-Toolkit on your local computer. Now it's time to bring your app idea alive without getting burden by common developer mistakes.

When developing an application, it's very recommended that you really take care **code consistency** and **reusability**. And to avoid common pitfalls, I discuss them in this specific order:

## Database

The database is the heart of your application. Nothing bugs developer more than a poorly designed database.

The good news is, CRM-Toolkit already includes login mechanism. That's the most basic stuff any web application must have. The rest of application content is up to you, the designer.

For completeness, we'll creating a web application that enables blogging for the rest of this article. Other web apps, even the most complex platform you can imagine, usually uses similar principle.

When you're migrating with `php spark migrate`, it creates `login` like this:

```sql
CREATE TABLE `login` (
	`login_id` INT(11)
		NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255)
		NOT NULL,
	`email` VARCHAR(255)
		NOT NULL,
	`password` CHAR(60)
		NULL DEFAULT NULL,
	`otp` CHAR(6)
		NULL DEFAULT NULL,
	`name` VARCHAR(255)
		NOT NULL DEFAULT '',
	`avatar` VARCHAR(255)
		NOT NULL DEFAULT '',
	`role` ENUM('admin','user')
		NOT NULL DEFAULT 'user',
	`created_at` TIMESTAMP
		NOT NULL DEFAULT current_timestamp(),
	`updated_at` TIMESTAMP
		NOT NULL DEFAULT current_timestamp()
		ON UPDATE current_timestamp(),
	PRIMARY KEY (`login_id`),
	UNIQUE INDEX `username` (`username`),
	UNIQUE INDEX `email` (`email`)
);
```

You can read more about them [later]() as we'll only covers what's necessary to discuss.

For a table that hold articles, I would create a table like this:

```sql
CREATE TABLE `article` (
	`article_id` INT(11)
		NOT NULL AUTO_INCREMENT,
	`article_login` INT(11)
		NOT NULL,
	`article_title` VARCHAR(255)
		NOT NULL DEFAULT '',
	`article_body` MEDIUMTEXT
		NOT NULL DEFAULT '',
	`article_permalink` VARCHAR(255)
		NULL DEFAULT NULL,
	`created_at` TIMESTAMP
		NOT NULL DEFAULT current_timestamp(),
	`updated_at` TIMESTAMP
		NOT NULL DEFAULT current_timestamp()
		ON UPDATE current_timestamp(),
	PRIMARY KEY (`article_id`),
	UNIQUE INDEX (`article_permalink`),
	INDEX (`article_login`),
	CONSTRAINT FOREIGN KEY (`article_login`)
		REFERENCES `login` (`login_id`)
		ON UPDATE RESTRICT ON DELETE CASCADE
);
```

Now here's some keypoints:

+ The table name is singular.
+ All column (field) names uses `snake_case`.
+ The table's `PRIMARY KEY` should be  `table_name + "_id"`, also this field must be `AUTO_INCREMENT` hence should **never** be modified after creation.
+ All other fields (except `created_at`/`updated_at`) are prefixed with `table_name` (the `login` table is **only** an exception as you'll reference it more often than rest of table in the database).
+ `FOREIGN KEY` fields should named like `table_name + constraint_table_name` 
+ `UNIQUE` and `FOREIGN KEY` fields should always be `nullable`
+ Unconstrained (attribute) fields should never be `nullable`, as long as it companied with a default value (empty string, 0, default enum, etc).
+ All fields that references other field must be constrained using `FOREIGN KEY` to retain Referential Integrity.
+ All constraints should be `RESTRICT` on `UPDATE` (for `DELETE` it depends on the context).
+ For `INT` and `VARCHAR` length, use common number (11 and 255). For a longer string you may use `TEXT` (64 KB) or `MEDIUMTEXT` (16 MB) instead.

Also when designing relations. You should never have a table that holds `one-to-one` relationship. For instance, if you wanted profile customization like user description or website, you can just append them to login table like this:

```sql
ALTER TABLE `login`
	ADD COLUMN `description` TEXT
		NOT NULL DEFAULT '' AFTER `avatar`,
	ADD COLUMN `website` VARCHAR(255)
		NOT NULL DEFAULT '' AFTER `description`;
```

And for tables that holds `many-to-many` relationship, like between articles and tags, you should make **both** constraints as a combined `PRIMARY KEY`. The naming convention also bit debated among developers, but I stick with `single_plural` convention, where the `single` belongs to the table that commonly have more rows (or in other word, the `plural` goes to a table which referred as `common groups`). This ends up following table:

```sql
-- Tags table
CREATE TABLE `tag` (
	`tag_id` INT(11)
		NOT NULL AUTO_INCREMENT,
	`tag_title` VARCHAR(255)
		NULL DEFAULT NULL,
	PRIMARY KEY (`tag_id`),
	UNIQUE INDEX (`tag_title`)
);

-- Article <=> Tags relation table
CREATE TABLE `article_tags` (
	`article_id` INT(11)
		NOT NULL,
	`tag_id` INT(11)
		NOT NULL,
	`created_at` TIMESTAMP
		NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`article_id`, `tag_id`),
	INDEX (`article_id`),
	INDEX (`tag_id`),
	CONSTRAINT FOREIGN KEY (`article_id`)
		REFERENCES `article` (`article_id`)
		ON UPDATE RESTRICT ON DELETE CASCADE,
	CONSTRAINT FOREIGN KEY (`tag_id`)
		REFERENCES `tag` (`tag_id`)
		ON UPDATE RESTRICT ON DELETE CASCADE
);
```

That's being said, database convention is mostly opinionated, but these rules works for me pretty well and it will definitely helps you to create a consistent database model. You can [read here]() if you curious the benefit and caveats of using these principles.

## Server

The server is the entry gate to your database. To make the server secure, you have to validate and sanitize every input comes from the web.

Luckily, CodeIgniter 4 are packed with lots of tools to make our server secure. And CRM-Toolkit can make this feels really seamless.

In `/api/app/Controllers/`, there are 3 public controllers defined:

```
+ api/app/Controllers/
|--+ Admin.php
|--+ Home.php
|--+ User.php
```

`Home.php` is the "default" controller for every unauthenticated requests. By default it includes endpoints for `/login`, `/register` and  `/forgot`. The other files `Admin.php` and `User.php` are controllers for authenticated request (We call this "room"). The authentication is done using `Basic Auth` matching corresponding `username` and `password` in `login` table. If you wonder how to differentiate between `admin` and `user` login, that's done using `role` field in the table:

```sql
CREATE TABLE `login` (
	...
	`role` ENUM('admin','user')
		NOT NULL DEFAULT 'user',
	...
);
```

Now the interesting thing is that, each `role` is mutually exclusive each other. For instance, `admin` cannot accessing `/user` room (otherwise it'll get `401 Unauthorized`). You might think that this against code reusability but actually it isn't, because most controllers are the defined this way:

```php
class Admin extends BaseController
{
	public function user($id = NULL)
	{
		return (new UserModel())->execute($id);
	}
}
```

*Yes, a single line of code for whole `/admin/user` endpoint.*

You can find these Models in `/api/app/Models/`:

```
+ Models/
|--+ LoginModel.php
|--+ ProfileModel.php
|--+ UserModel.php
```

Why we have to design controllers this way? Because most CRUD models have the same principle. We're abstracting away those in form of models. This way, two endpoints like `/admin/profile` and `/user/profile` can share the same model `ProfileModel.php`.

This is not the only the great thing here. Another example, if we want to create new endpoints for our blogging platform where `/user/article` gives access to articles which belongs to currently logged-in account, while `/admin/article` gives access to all available articles. We can create our model like:

```php
class ArticleModel extends BaseModel
{
	// More options actually available
	// We only show things that essential here
	protected $table = 'article';
	protected $primaryKey = 'article_id';
	protected $select = [
		'article_id', 'article_login',
		'article_title', 'article_body'
	];
	protected $allowedFields = [
		'article_login',
		'article_title',
		'article_body'
	];
}
```

Then on admin controller...

```php
class Admin extends BaseController
{
	public function article($id = NULL)
	{
		return (new ArticleModel())->execute($id);
	}
}
```

While in user controller...

```php
class Admin extends BaseController
{
	public function article($id = NULL)
	{
		return (new ArticleModel())->setWhere([
			'article_login' => $this->login->current_id
		])->execute($id);
	}
}
```

You might wonder *What's on earth `execute($id)` is doing?* You will discover more in the next page, where we discuss more about `BaseModel` in more complex scenario.

## Client

Aside from developing the server -- let's be honest, creating a consistent yet interactive web application is still hard and most time-consuming task. So how CRM-Toolkit improves development in Client App?

The first thing that we need to consider is the page layout. I found out that most web layout is mostly divided into these sections:

![](images/client-layout.png)

As you see in `web/widget/layout.js`, the layout is separated like this:

```jsx
export default function Layout({ roles }) {
  return (
    <div className="layout-root">
      <RouteByRole component="top" roles={roles} />
      <div className="layout-side">
        <RouteByRole component="left" roles={roles} />
        <main className="layout-content">
          <Notification />
          <RouteByRole component="main" roles={roles} />
          <RouteByRole component="bottom" roles={roles} />
        </main>
        <RouteByRole component="right" roles={roles} />
      </div>
    </div>
  )
}
```

What is `roles`? You may ask.

In CRM Toolkit, every user within different roles is placed under independent directories under the `web/src/`, we call this *room* and what's included in `roles` is simply each `index.js` file under each room:

```
+ web/src/
|--+ admin/
|  |--- index.js
|--+ static/
|  |--- index.js
|--+ user/
   |--- index.js
```

Each `index.js` file above have a similar structure like this:

```js
function Main() { /* Main content */ }
function LeftBar() { /* Left sidebar */ }
function RightBar() { /* Right sidebar */ }
function TopBar() { /* Header component */ }
function BottomBar() { /* Footer component */ }

export default {
  role: 'user', // used for URL routing
  main: Main,
  top: TopBar,
  left: LeftBar,
  right: RightBar,
  bottom: BottomBar,
}
```

Each room contains unique role, so if the first URL segment matches the role string, it will use that role for the rest of layout. This is an exception for `static` room, as it's used for pages that don't need authentication (e.g. homepage, login page, etc.),  it's `role` is simply an empy string and must be evaluated last. The matching code is done using `react-router-dom`.

Now, what about nested routes? In admin room, you can see that CRM Toolkit has an endpoint `admin/user` for managing user accounts. This can be used as a starting point for creating another endpoint (e.g. `admin/article`). Let's take a deeper look for `admin/user`:

```
+ web/src/admin/
|--+ user/
|  |--- detail.js
|  |--- edit.js
|  |--- index.js
|  |--- list.js
|--- index.js
```

So, in `admin/index.js`, this is how `admin/user/index.js` get referenced:

```jsx
// ... other imports ...
import User from './user';

function Main() {
  return (
    <CheckRole role='admin'>
      <Switch>
        <Route path="/admin/user/" component={User} />
        {/* other routes... */}
      </Switch>
    </CheckRole>
  )
}
// ... other exports ...
```

And then in `admin/user/index.js`:

```jsx
// ... other imports ...
import Edit from './edit';
import Detail from './detail';
import List from './list';

export default ({ match }) => (
	<Switch>
		<Route exact path={match.url+'/'} component={List}/>
		<Route exact path={match.url+'/create'}  component={Edit} />
		<Route exact path={match.url+'/edit/:id'} component={Edit} />
		<Route exact path={match.url+'/detail/:id'} component={Detail} />
	</Switch>
)
```

Then, as you expect, the `list.js` contains a table for displaying data, `detail.js` contains a detailed view of specific user and `edit.js` contains a form for creating or editing user accounts. If you have seen them, you can see that they follow specific pattern like this:

```jsx
// list.js
export default function () {
  return <RemoteTable
    options={ /* Table options */ }
    columns={ /* Table columns */ } />
}
```

```jsx
// detail.js
export default function () {
  const id = useParams().id;
  return (
    <Page className="paper" src={'room/model/' + id}>
      {({ data }) => (
        <div> {/* Data View */} </div>
      )}
    </Page>
  )
}
```

```jsx
// edit.js
export default function () {
  const id = useParams().id || 0;
  const validators = { /* form requirements */ }
  return (
    <Page className="paper" src={'room/model/' + id}>
      {({ data }) => (
        <Form action={'role/model/' + id} redirect={
          /* function to call after a successive submit */
          }>
          {/* Input components (use widget/controls.js) */}
          <Submit disabled={!checkAllValidators(validators)} />
          <BackButton />
        </Form>)}
    </Page>)
}
```

So, this is the pattern to create endpoint pages in CRM Toolkit. As you create more pages and functionality it's helpful to stick with this pattern in order to create high code maintability and reusability. We provide more info in the next page to help you cover more advanced or complex cases when developing web apps using CRM Toolkit.

## Next

+ Read [Building a Server App](server.md)
+ Back to the [Main Page](index.md)