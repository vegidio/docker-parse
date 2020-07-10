# vegidio/parse

[![GitHub Actions](https://img.shields.io/github/workflow/status/vegidio-docker/parse/build)](https://github.com/vegidio-docker/parse/actions)
[![Docker Pulls](https://img.shields.io/docker/pulls/vegidio/parse.svg)](https://hub.docker.com/r/vegidio/parse)
[![ISC License](https://img.shields.io/npm/l/vimdb?color=important)](LICENSE.txt)

A Docker image for the [Parse Server](https://parseplatform.org/) with Dashboard pre-installed and a new feature to delete orphan files when an object associated with them is removed from the database.

It's based on [Express](https://expressjs.com) and supports single and multiple applications per instance.

## 🤖 Usage

The Parse Server can be configured to support single or multiple applications per instance:

### Single application

Run the container using the image **vegidio/parse**:

```
$ docker run -d \
    -e SERVER_URL=http://hostname \
    -e DB_URL=mongodb://db_host:27017 \
    -e MASTER_KEY=12345678 \
    -e APP_IDS=app1,app2 \
    -e LIVE_QUERIES='app1:Movie,Actor|app2:Post' \
    -e DELETE_ORPHANS='app1:Review|app2:Comment' \
    -e DASHBOARD_USERNAME=dashboard_username \
    -e DASHBOARD_PASSWORD=dashboard_password \
    -p 80:80 \
    --name parse vegidio/parse
```

The full list of environment variables and how they can be used to configure your Parse Server can be found in the [Parameters](#-parameters) section.

### Multiple Applications

If you want to run more than one application in the same instance then you just need to add them in the environment variable `APP_IDS`, in a single string separated by comma `,`.

For example, the environment variable `-e APP_ID=app1,app2,app3` will create 3 apps called `app1`, `app2` and `app3`.

### URLs

* __Apps:__ each app in the Parse Server can be accessed through the URL [server_url/app/`app_id`]().
* __GraphQL:__ each app can also be accessed through GraphQL with the URL [server_url/app/`app_id`/graphql]().
* __Dashboard:__ The Parse Dashboard can be accessed through the URL [server_url/dashboard]().

## ✨ Special Features

### Live Query

To enable **Live Queries** you must specify during the initialization of your Parse Server exactly what applications and classes should have this feature enabled. To do that, add the environment variable `LIVE_QUERIES` with a content with this format:

```
<appId1>:<ClassA>,<ClassB>|<appId2>:<ClassC>,<ClassD>
```

where:

- `<appId>`: is the unique ID of your parse application, followed by the colon sign (`:`).
- `<Class>`: is the name of the class where Live Query should be enabled. If you want to enable Live Queries in more than one class then each class must be separated by a comma (`,`).
- Each application and its classes must be separated by a pipe sign (`|`).

For example, the environment variable `-e LIVE_QUERIES='app1:Movie,Actor|app2:Post'` will enable Live Queries in the classes `Movie` and `Actor` that belong to `app1`; and it will also enable Live Queries in the class `Post` that belong to `app2`.

### Delete Orphan Files

By default, when a file is saved in the Parse Server and later deleted, only the file reference is actually removed from the database, but the file itself remains there. After some adding and removing files in the Parse Server, you will end up with many orphan files saved that are only occupying space.

To avoid this problem you can set the environment variable `DELETE_ORPHANS` with the names of the classes that must automatically removed any orphan files when an object is deleted or updated. This variable must have the following format:

```
<appId1>:<ClassA>,<ClassB>|<appId2>:<ClassC>,<ClassD>
```

where:

- `<appId>`: is the unique ID of your parse application, followed by the colon sign (`:`).
- `<Class>`: is the name of the class where the orphan files must be removed. If you want to remove orphan files from more than one class then each class must be separated by a comma (`,`).
- Each application and its classes must be separated by a pipe sign (`|`).

For example, the environment variable `-e DELETE_ORPHANS='app1:Movie,Actor|app2:Post'` will remove orphan files from the classes `Movie` and `Actor` that belong to `app1`; and it will also delete orphan files from the class `Post` that belong to `app2`.

## 🧩 Parameters

Here is the full list of parameters used by the Parse Server:

### Mandatory

- `SERVER_URL`: the remote URL to access your Parse Server. You **must** include the protocol here (`http://` or `https://`) and the port, if needed.
- `DB_URL`: the connection URL to the database. You **must** include here the protocol (`mongodb://` or `postgres://`) according to the database that you are using. If your database requires authentication, don't forget to include username and password as well. For example: `mongodb://username:password@localhost:27017`.
- `MASTER_KEY`: the key used to grant access to the users that want to access the Parse API.
- `APP_IDS`: one ore more unique IDs, separated by comma `,` to identify your apps. These IDs will also be used to form the URLs of your Parse apps.
- `DASHBOARD_USERNAME`: the username used to login in the Parse Dashboard.
- `DASHBOARD_PASSWORD`: the password used to login in the Parse Dashboard.

### Optional

- `LIVE_QUERIES`: please see [Live Query](#live-query) above.
- `DELETE_ORPHANS`: please see [Delete Orphan Files](#delete-orphan-files) above.

## 🛠 Build the image

If you prefer to build this image yourself, instead of using the pre-built image available on [Docker Hub](https://hub.docker.com/r/vegidio/parse), then enter the following command in terminal, in the project's root directory:

```
$ docker build -t vegidio/parse --build-arg VERSION=1.2.3 .
```

## 📝 License

**vegidio/parse** is released under the ISC License. See [LICENSE](LICENSE.txt) for details.

## 👨🏾‍💻 Author

Vinicius Egidio ([vinicius.io](http://vinicius.io))