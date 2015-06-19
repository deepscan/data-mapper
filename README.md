# data-mapper

- mybatis-like data mapper for javascript

## Installation

    npm install data-mapper

## Usage

### Settings

data-mapper-conf.json

```
    {
        "connectors": {
            "mysql": {
                "type": "mysql",
                "connectionLimit": 5,
                "host": "localhost",
                "user": "test",
                "password": "test",
                "database": "test",
                "default": true
            }
        },
        "mappers": {
            "user": "test/conf/mapper/user-mapper.json5",
            "group": "test/conf/mapper/group-mapper.json",
            ...
        }
    }
```

user-mapper.json5

```
    {
        "maps": {
            "default": {
                "table": "t_user",
                "columns": {
                    "id": { "key": true, "model": "userId" },
                    "name": "userName",
                    "phone": "userPhone",
                    "is_admin": { "model": "isAdmin" },
                    "create_time": { "model": "created", "type": "createTime" },
                    "update_time": { "model": "updated", "type": "updateTime" }
                }
            },
            "userDetail": {
                "table": "t_user",
                "columns": {
                    "id": { "key": true, "model": "userId" }
                }
            }
        },
        "queries": {
            "getUserById": "SELECT * FROM t_user WHERE id = {{id}}",
            "getUsers": "SELECT * FROM t_user",
            "modifyUser": "UPDATE t_user \
                {#set} \
                    {#if name} name = {{name}}, {/if} \
                    {#if phone} phone = {{phone}}, {/if} \
                {/set} \
                WHERE id = {{id}}",
            "deleteUserById": "DELETE FROM t_user WHERE id = {{id}}",
            "deleteAllUser": "DELETE FROM t_user",
            "addUser": "INSERT INTO t_user VALUES ({{id}}, {{name}}, {{phone}}, 0, now(), now())",
            "getUserByIds": "SELECT * FROM t_user \
            {#where} \
                {#if list} \
                    {#foreach item=it, collection=list, sep=',', open='id IN (', close=')' } \
                        {{it}} \
                    {/foreach} \
                {/if} \
            {/where}"
        }
    }
```

### Initialize

```
var dataMapperConf = require('./conf/data-mapper-conf.json');
var dataMapper = require('./../lib/data-mapper').init(dataMapperConf);

// get dao named 'user' from dataMapper
var userDao = dataMapper.dao('user');
```

### Use Default Methods of Dao

These some methods(similar to mongodb) are auto generated by default map configuration.


#### $findOne

```
...
userDao.$findOne({userId: 1000}, function(err, context) {
    if(err) {
        ...
    } else {
        var aUser = context.result();
        console.log(aUser.userName);
    }
});
```

#### $find

```
...
userDao.$find({isAdmin: 1}, function(err, context) {
    if(err) {
        ...
    } else {
        var adminList = context.result();
        ...
    }
});
```

#### $find

```
...
userDao.$count({isAdmin: 1}, function(err, context) {
    if(err) {
        ...
    } else {
        var numberOfAdmin = context.result();
        ...
    }
});
```

#### $save

```
...
userDao.$save({userId: 100001, name: 'new user name', isAdmin: 1, phone: 'phone number'}, function(err, context) {
    if(err) {
        ...
    } else {
        var savedResult = context.result();
        ...
    }
});
```

#### $update

```
...
userDao.$save({userId: 100001, $set: { name: 'updated user name', isAdmin: 0, phone: 'updated phone number'} }, function(err, context) {
    if(err) {
        ...
    } else {
        var updatedResult = context.result();
        ...
    }
});
```

#### $remove

```
...
userDao.$remove({userId: 100001}, function(err, context) {
    if(err) {
        ...
    } else {
        var removedResult = context.result();
        ...
    }
});
```

### Use custom methods

```
userDao.getUserByIds({list: [10000, 100001] }, function(err, context) {
    if(err) {
        ...
    } else {
        var userList = context.result();
        ...
    }
});
```

