# vegidio/parse

[![Apache 2.0](https://img.shields.io/badge/license-Apache_License_2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

A Docker image for the Parse Server with Dashboard pre-installed. It's based on [Express](https://expressjs.com) and supports single and multiple applications per instance.

## Usage

The Parse Server can be configured to support single or multiple applications per instance:

### Single application

Run the container using the image **vegidio/parse**:

```
$ docker run -d \
    -e DB_USERNAME='root' \
    -e DB_PASSWORD='root' \
    -e DB_HOST='hostname:27017' \
    -e MASTER_KEY='d2d58468' \
    -e APP_ID='app1' \
    -e DASHBOARD_USERNAME='username' \
    -e DASHBOARD_PASSWORD='password' \
    -p 1337:1337 \
    --name parse vegidio/parse
```

The full list of environment variables and how they can be used to configure your Parse Server can be found in the [Configuration](#configuration) section.

### Multiple applications

When you want to run than one application in the same instance then you must use the file **config.json** (in the folder `express/`) to configure your Parse Server.

The **config.json** has the same variables that are used when you run the Parse Server with environment variables, but here they are presented in the JSON format:

```javascript
{
    "DB_USERNAME": "root",
    "DB_PASSWORD": "root",
    "DB_HOST": "localhost:27017",

    "MASTER_KEY": "d2d58468",
    "APP_IDS": ["app1", "app2"],

    "DASHBOARD_USERNAME": "username",
    "DASHBOARD_PASSWORD": "password"
}
```

## Configuration

When you configure your Parse Server, either through environment variables or a JSON file, the usage of the first two parameters, `DB_USERNAME` and `DB_PASSWORD` are optional.

It means that if the database that you will use to save your Parse data doesn't require any authentication, then you can remove these parameters (**Important:** you have to *literally remove* the parameters if they won't be used -- simply leaving them with an empty content `''` won't work).

### Parameters

Here is the full list of parameters used by the Parse Server:

#### Optional

- `DB_USERNAME`: the username used to login in the database. This user must have access to create new schemas.
- `DB_PASSWORD`: the password used to login in the database.

#### Mandatory

- `MASTER_KEY`: the key used to grant access to the users that want to access the Parse API.
- `API_ID` *(use only in single application)*: an ID to identify your app. This ID will also be used to form the URL of your Parse APIs.
- `API_IDS` *(use only in multiple applications)*: a list of unique IDs to identify your apps. This IDs will also be used to form the URLs of your Parse APIs.
- `DASHBOARD_USERNAME`: the username used to login in the Parse Dashboard.
- `DASHBOARD_PASSWORD`: the password used to login in the Parse Dashboard.

## License

**vegidio/parse** is released under the Apache License. See <a href="LICENSE.txt">LICENSE</a> for details.

## Author

Vinicius Egidio (<a href="http://vinicius.io">vinicius.io</a>)
