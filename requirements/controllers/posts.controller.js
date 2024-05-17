import PostsQueries from '../queries/posts.query.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import serviceAccount from '../../config/truemates-challenge-db-firebase-adminsdk.js';

dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

// Initialize Firebase Admin SDKjhsa
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://truemates-challenge-db.appspot.com'
});

// Initialize Firebase storage
const bucket = admin.storage().bucket(); // get the warning from over here

// Logged in users can create a post. Post has 2 attributes: description and a photo. Save photos to GCP database/ bucket. (DONE)
// 1. A post will have an attribute when it was created. (DONE)
// 2. Post returning api will calculate the time difference like 2s ago, 10d ago, 4w ago, 8m ago and 1yr ago. (DONE)
// 3. A post can have multiple photos but at most 5. (DONE)
// 4. A post’s description can be edited. (DONE)

// 1. Need to add pagination in the post.


export default class PostsController {
    // static async apiDoSmthProtected(req, res, next) {
    //     res.json({message: "Smth protected!!"});
    // }

    static async apiCreatePost(req, res, next) {
        try {
            // console.log(req.headers.authorization);
            // console.log(req.body);
            // console.log(req.files);
            // console.log(req.body.postDescription);

            const token = req.headers.authorization;

            const decodedToken = jwt.decode(token);

            // all things we need to pass to the sql query
            const postDescription = req.body.postDescription;
            // console.log(postDescription);
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
            
            const postPhotos = req.files; // make sure the photos can only be 5 element
            // console.log(postPhotos);
            if (!postPhotos || postPhotos.length > 5 ) {
                res.status(500).json({error: "Photos invalid (more than 5 or cannot be retrieved)"});
                return;
            }
            
            // make the promise object to upload the photos to the firebase storage
            const uploadPromises = postPhotos.map(async (file) => {
                // console.log(file);
                const filename = Date.now() + '-' + file.originalname;
                const fileUpload = bucket.file(filename);
                await fileUpload.save(file.buffer, {
                    metadata: {
                        contentType: file.mimetype,
                    },
                });
                const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
                return downloadUrl;
            })
            
            const postPhotosUrls = await Promise.all(uploadPromises);
            // console.log(postPhotosUrls);

            const fkUserId = decodedToken.userId;

            const createPostResponse = await PostsQueries.postPost(
                postDescription,
                postTimestamp,
                postPhotosUrls,
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
            res.status(500).json({message: `${e}`});
        }
    }

    static async apiGetPost(req, res, next) {
        // calculate the time difference with the queried time stamp
        try {
            const postId = req.params.postId;
            console.log(req.params.postId);
            
            const getPostResponse = await PostsQueries.getPost(postId);

            if (getPostResponse.rowCount !== 1) {
                res.status(500).send({
                    message: "Query failed - invalid post id",
                    post: undefined
                });
                return;
            }
            
            // convert time difference to seconds
            const timeDiff = (Date.now() - new Date(getPostResponse.rows[0].post_timestamp)) / 1000; 
            
            let timeDiffInStr = ''; 
            if (timeDiff >= 31556926) { // convert to year
                timeDiffInStr = Math.round(timeDiff / 31556926) + 'yr ago';
            }
            else if (timeDiff >= 2629744) { // convert to month
                timeDiffInStr = Math.round(timeDiff / 2629744) + 'mo ago';
            }
            else if (timeDiff >= 604800) { // convert to week
                timeDiffInStr = Math.round(timeDiff / 604800) + 'w ago';
            }
            else if (timeDiff >= 86400) { // convert to days
                timeDiffInStr = Math.round(timeDiff / 86400) + 'd ago';
            }
            else if (timeDiff >= 3600) { // convert to hour
                timeDiffInStr = Math.round(timeDiff / 3600) + 'h ago';
            }
            else if (timeDiff >= 60) { // convert to minute
                timeDiffInStr = Math.round(timeDiff / 60) + 'm ago';
            }
            else {
                timeDiffInStr = timeDiff + 's ago';
            }


            res.status(200).send({
                message: "Success",
                post: getPostResponse.rows[0],
                timeDiff: timeDiffInStr
            });
        } catch (e) {
            console.log(`API for user getting a post: ${e}`);
            res.status(500).json({message: `${e}`});
        }
    }

    static async apiUpdatePostDescription(req, res, next) {
        // update the description of a post
        try {
            console.log(req.body);
            console.log(req.params.postId);

            const updatedPostDescription = req.body.newPostDescription;
            const postId = req.params.postId;

            const updatePostDescriptionResponse = await PostsQueries.updatePostDescription(
                postId,
                updatedPostDescription
            );

            console.log(updatePostDescriptionResponse);

            if (updatePostDescriptionResponse.rowCount !== 1) {
                res.status(500).json({error: "update failed! post id not exist"});
                return;
            }

            res.status(200).send({
                message: "Success"
            });
        } catch (e) {
            console.log(`API for updating a post description: ${e}`);
            res.status(500).json({message: `${e}`});
        }
    }
}