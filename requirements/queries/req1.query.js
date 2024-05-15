import client from "../../db.js";
import bcrypt from 'bcrypt';

export default class Req1Queries {
    static async getAllUsers() {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users");
        // console.log(queryResult);
        const allUsers = queryResult.rows;
        // console.log(allUsers);
        return allUsers;
    }

    // get the specific user
    // query that will help with user login process
    static async getSpecificUser(userEmail, userPassword) {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users WHERE email = $1", [userEmail]);
        // see if the user email is registered
        if (queryResult.rowCount === 0) {
            return {
                code: 404,
                message: "The email is not registered",
                user: undefined,
            }
        }
        const user = queryResult.rows[0];
        console.log(user);

        // see if the password is correct or not
        const validPassword = await bcrypt.compare(userPassword, user.password);
        
        // not valid password, return proper code and message 
        if (!validPassword) {
            return {
                code: 401,
                message: "The password is not correct",
                user: undefined,
            }
        }
        // console.log(user);

        return {
            code: 200,
            message: "The password is not correct",
            user: user,
        }
    }

    // query for registering user 
    static async postUser(userName, userEmail, userPassword) {
        if (await this.checkUserEmail(userEmail) || await this.checkUserName(userName)) {
            return {
                code: 409,
                message: "The user name or email is already registered",
            };
        }
        let queryResult;
        queryResult = await client.query("INSERT INTO users VALUES ($1, $2, $3)", [
            userName, 
            userEmail, 
            userPassword
        ]);
        console.log(queryResult);
        return {
            code: 200,
            message: "success",
        };
    }

    // helper to check if user name is valid
    // user name is not in users table is true
    // otherwise, false
    static async checkUserName(userName) {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users WHERE name = $1", [userName]);
        const userNameValid = (queryResult.rowCount !== 0);
        return userNameValid;
    }

    // helper to check if user email is valid
    // user email is not in users table is true
    // otherwise, false
    static async checkUserEmail(userEmail) {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users WHERE email = $1", [userEmail]);
        const userEmailValid = (queryResult.rowCount !== 0);
        return userEmailValid;
    }
}
