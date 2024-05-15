import client from "../../db.js";

export default class PostsQueries {
    static async postPost( postDescription, postTimestamp, fkUserId ) {
        let queryResult;
        queryResult = await client.query("INSERT INTO posts VALUES ($1, $2, $3)", [
            postDescription,
            postTimestamp,
            fkUserId
        ]);
        return queryResult;
    }
}