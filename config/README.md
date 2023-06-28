# Config file

Create a `default.json` file in the config folder and use your db credentials for both databases.

This file will not be pushed to the repo.


```json
{
  "identityProvider" : {
    "port": 8080,
    "dbConfig" : {
      "dbUser": "",
      "dbPassword": "",
      "dbName": "",
      "server": ""
    }
  },
  "resourceApi" : {
    "port": 4040,
    "dbConfig" : {
      "dbUser": "",
      "dbPassword": "",
      "dbName": "",
      "server": ""
    }
  }
}
```