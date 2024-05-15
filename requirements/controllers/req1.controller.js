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
            }

            const jsonResponse = {
                code: 200,
                message: "Success",
                allUsers: users
            }
            res.send(jsonResponse);
        }
        catch (e) {
            console.log(`API get all users: ${e}`);
            res.status(500).json({ error: e });
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
            if (specificUser.code !== 200) {
                res.status(specificUser.code).json({ error: `${specificUser.message}`});
            }
            res.send(specificUser);
        }
        catch (e) {
            console.log(`API get all users: ${e}`);
            res.status(500).json({ error: e });
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

            const checkoutResponse = await Req1Queries.postUser(
                userName,
                userEmail,
                userPassword
            );

            if (checkoutResponse.code !== 200) {
                res.status(checkoutResponse.code).json( {error: `${checkoutResponse.message}`} );
            }
            else {
                res.json({ status: "success" });
            }
        } catch (e) {
            console.log(`API register user: ${e}`);
            res.status(500).json({ error: e });
        }
    }
}