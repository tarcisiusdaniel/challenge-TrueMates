import client from "../../db.js";

export default class UsersQueries {
    static async getAllUsers() {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users");
        const allUsers = queryResult.rows;
        return allUsers;
    }

    // get the specific user
    // query that will help with user login process
    static async getSpecificUser(userEmail, userPassword) {
        let queryResult;
        queryResult = await client.query("SELECT * FROM users WHERE email = $1", [userEmail]);
        const specificUser = queryResult.rows;
        return specificUser;
    }

    // query for registering user 
    static async postUser(userName, userEmail, userPassword) {
        let queryResult;
        queryResult = await client.query("INSERT INTO users VALUES ($1, $2, $3)", [
            userName, 
            userEmail, 
            userPassword
        ]);
        return queryResult;
    }
}
