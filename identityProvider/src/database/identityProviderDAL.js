const sql = require("mssql");
const config = require('config');

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

const dbConfig = config.identityProvider.dbConfig;

async function fetchUser(email, password) {
    try {
        await sql.connect(dbConfig);

        const query = `select Username, Email, Password from Users where Email = @email and Password = @password`;
        const request = new sql.Request();
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);

        const result = await request.query(query);
        await sql.close();
        if (result.recordset.length === 0) {
            return Promise.reject({code: 404, message: 'User does not exits'})
        }
        const user = new User(result.recordset[0].Username, result.recordset[0].Email, result.recordset[0].Password);

        return user;
    } catch (error) {
        throw error;
    }
}

async function fetchUserByUserName(username) {
    try {
        await sql.connect(dbConfig);

        const query = `select Username from Users where Username = @username`;
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);

        const result = await request.query(query);
        await sql.close();
        if (result.recordset.length === 0) {
            return Promise.reject({code: 404, message: 'User does not exits'})
        }
        return result.recordset[0].Username;
    } catch (error) {
        throw error;
    }
}

async function addUser(username, email, password) {
    try {
        await sql.connect(dbConfig);

        const query = `INSERT INTO Users (Username, Email, Password)
        OUTPUT inserted.Username, inserted.Email, inserted.Password
        VALUES (@username, @email, @password);`;
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);

        const insertResult = await request.query(query);
        const newUser = new User(insertResult.recordset[0].Username, insertResult.recordset[0].Email, insertResult.recordset[0].Password);

        await sql.close();

        return newUser;
    } catch (error) {
        throw error;
    }
}

async function addPlayer(username) {
    try {
        await sql.connect(config.resourceApi.dbConfig);
        let query;
        query = `INSERT INTO Players (username, email, password)
            OUTPUT inserted.username
            VALUES (@username, @email, @password);`
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('email', sql.VarChar, username);
        request.input('password', sql.VarChar, 'N/A');
  
        const result = await request.query(query);
        sql.close();
        return result.recordset[0]
    } catch (error) {
        throw error;
    }
}

module.exports = {
    fetchUser,
    addUser,
    fetchUserByUserName,
    addPlayer,
};