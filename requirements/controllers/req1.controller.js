import Req1Queries from "../queries/req1.query.js";
import bcrypt from 'bcrypt';

export default class Req1Controller {
    static async apiRootRouter(req, res, next) {
        console.log("Hello from get all users route");
        return res.send("Hello from default router for truemates/");
    }

    static async apiGetAllUsers(req, res, next) {
        try {
            let users = await Req1Queries.getAllUsers();

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


    static async apiGetSpecificUser(req, res, next) {
        // get specific user by using just their email and password
        // this will later be used for user login process
        try {
            const userEmail = req.body.email;
            const userPassword = req.body.password;

            let specificUser = await Req1Queries.getSpecificUser(userEmail, userPassword);
            
            // console.log(specificUser);
            // see if the user email is registered
            if (specificUser.length === 0) {
                res.status(404).send({
                    message: "The email is not registered",
                    user: undefined,
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
                    user: undefined,
                });
                return;
            }

            // valid password and email combination
            // code 200, request valid
            res.status(200).send({
                message: "Success",
                user: user
            });
        }
        catch (e) {
            console.log(`API get specific users: ${e}`);
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

            await Req1Queries.postUser(
                userName,
                userEmail,
                userPassword
            );
            
            res.status(200).json({status: "Success"});
        } catch (e) {
            console.log(`API register user: ${e}`);
            res.status(412).json({message: `${e}`});
        }
    }
}