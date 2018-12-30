# Rest Api Node and Mysql

## Description
This is an Restful API for Node.js and Mysql.
Please configure the DB details and set CONFIG.app = dev in config.js table  will be automatically created 
when you run the project existing  users tables will be drop and create a new table for Enable and disabling the table deletions are handle in app.js by models.sequelize.sync.
For API information please refer the screen shots
##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport, JWT

## Installation

#### Download Code | Clone the Repo

```
git clone {repo_name}
```

#### Install Node Modules
```
npm install
```

#### Run the project

```
node app.js
```