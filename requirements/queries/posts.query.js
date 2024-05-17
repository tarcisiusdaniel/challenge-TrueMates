import client from "../../db.js";

export default class PostsQueries {
    static async postPost( postDescription, postTimestamp, postPhotosUrls, fkUserId ) {
        let queryResult;
        queryResult = await client.query("INSERT INTO posts \
            (post_description, post_timestamp, post_photos, user_id) \
            VALUES ($1, $2, $3, $4)", [
                postDescription,
                postTimestamp,
                postPhotosUrls,
                fkUserId
            ]);
        return queryResult;
    }

    static async getPost(postId) {
        let queryResult;
        queryResult = await client.query("SELECT * FROM posts WHERE ID = $1", [
            postId
        ]);
        return queryResult;
    }

    static async updatePostDescription(postId, updatedPostDescription) {
        let queryResult;
        queryResult = await client.query('UPDATE posts \
            SET post_description = $1 \
            WHERE ID = $2', [
                updatedPostDescription,
                postId
            ]);
        return queryResult;
    }
}