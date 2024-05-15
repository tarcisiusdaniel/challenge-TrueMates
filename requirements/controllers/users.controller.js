import UsersQueries from "../queries/users.query.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_TOKEN;

export default class UsersController {
    
    static async apiRootRouter(req, res, next) {
        console.log("Hello from get all users route");
        return res.send("Hello from default router for truemates/");
    }

    static async apiGetAllUsers(req, res, next) {
        try {
            let users = await UsersQueries.getAllUsers();

            if (!users) {
                res.status(404).json({ error: "not found"});
                return;
            }

            const jsonResponse = {
                message: "Success",
                allUsers: users
            }
            res.status(200).send(jsonResponse);
        }
        catch (e) {
            console.log(`API get all users: ${e}`);
            res.status(500).json({ message: `${e}` });
        }   
    }

    static async apiRegisterUser(req, res, next) {
        // to register, required to have
        // name, email, password
        try {
            // console.log(req.body);
            const userName = req.body.name;
            const userEmail = req.body.email;
            const userPassword = await bcrypt.hash(req.body.password, 10);

            const regUserResponse = await UsersQueries.postUser(
                userName,
                userEmail,
                userPassword
            );

            if (regUserResponse.rowCount !== 1) {
                res.status(500).json({error: "Query failed"});
                return;
            }
            
            res.status(200).json({status: "Success"});
        } catch (e) {
            console.log(`API register user: ${e}`);
            res.status(412).json({message: `${e}`});
        }
    }

    // LOGIN
    static async apiGetSpecificUser(req, res, next) {
        // get specific user by using just their email and password
        // this will later be used for user login process
        try {
            const userEmail = req.body.email;
            const userPassword = req.body.password;

            let specificUser = await UsersQueries.getSpecificUser(userEmail, userPassword);
            
            // console.log(specificUser);
            // see if the user email is registered
            if (specificUser.length === 0) {
                res.status(404).send({
                    message: "The email is not registered",
                    userToken: undefined,
                });
                return;
            }

            // get the user
            // see if the password is correct or not
            const user = specificUser[0];
            // console.log(user);
            const validPassword = await bcrypt.compare(userPassword, user.password);
            
            // not valid password, return proper code and message 
            if (!validPassword) {
                res.status(401).send({
                    message: "The password is not correct",
                    userToken: undefined,
                });
                return;
            }

            // valid password and email combination
            // generate the JWT token
            const token = jwt.sign({
                userId: user.id,
                email: user.email
            }, 
            secretKey, 
            {expiresIn: '24h'});

            // code 200, request valid
            res.status(200).send({
                message: "Success",
                userToken: token
            });
        }
        catch (e) {
            console.log(`API get specific users: ${e}`);
            res.status(500).json({ message: `${e}` });
        }   
    }
}