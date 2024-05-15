import PostsQueries from '../queries/posts.query.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

// Logged in users can create a post. Post has 2 attributes: description and a photo. Save photos to GCP database/ bucket.
// 1. A post will have an attribute when it was created. (DONE)
// 2. Post returning api will calculate the time difference like 2s ago, 10d ago, 4w ago, 8m ago and 1yr ago.
// 3. A post can have multiple photos but at most 5.
// 4. A post’s description can be edited.


export default class PostsController {
    // static async apiDoSmthProtected(req, res, next) {
    //     res.json({message: "Smth protected!!"});
    // }

    static async apiCreatePost(req, res, next) {
        try {
            console.log(req.headers.authorization);
            const token = req.headers.authorization;

            const decodedToken = jwt.decode(token);

            // all things we need to pass to the sql query
            const postDescription = req.body.postDescription;
            console.log(postDescription);
            const currDate = new Date();

            // get individual components of the date and time
            const year = currDate.getFullYear();
            const month = String(currDate.getMonth() + 1).padStart(2, '0'); // Zero-padding month
            const day = String(currDate.getDate()).padStart(2, '0'); // Zero-padding day
            const hours = String(currDate.getHours()).padStart(2, '0'); // Zero-padding hours
            const minutes = String(currDate.getMinutes()).padStart(2, '0'); // Zero-padding minutes
            const seconds = String(currDate.getSeconds()).padStart(2, '0'); // Zero-padding seconds

            // convert the date gotten to be match of date data type format in sql query
            const postTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            
            const postPhotos = req.body.postPhotos; // make sure the photos can only be 5 element
            //////////////////////
            
            
            // make sure to address the database for photos


            //////////////////////
            const fkUserId = decodedToken.userId;

            const createPostResponse = await PostsQueries.postPost(
                postDescription,
                postTimestamp,
                fkUserId
            );

            
            if (createPostResponse.rowCount !== 1) {
                res.status(500).json({error: "Query failed"});
                return;
            }
            
            res.status(200).json({status: "Success"});
        }
        catch (e) {
            console.log(`API for user create a post: ${e}`);
            res.status(412).json({message: `${e}`});
        }
    }

    static async apiGetPost(req, res, next) {
        // calculate the time difference with the queried time stamp
    }

    static async apiUpdatePostDescription(req, res, next) {
        // update the description of a post
    }
}