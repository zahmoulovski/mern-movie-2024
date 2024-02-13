import userModel from "./../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (res, req) => {
    try {
        const { username, password, displayName } = req.body;
        const chekcUser = await userModel.findOne({ username });
        if (chekcUser) return responseHandler.badRequest(res, "Username already in use");
        const user = new userModel();
        user.displayName = displayName;
        user.username = username;
        user.setPassword(password);
        await user.save()
        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expires: "24h" }
        );
        responseHandler.created(res, {
            token,
            ...user_doc,
            id: user.id
        });
    }
    catch (err) {
        responseHandler.error(res);
    }
};

const signin = async (req, res) => { 
    try { 
        const { username, password } = req.body
        const user = await userModel.findOne({ username }).select("username passwrord sald id displayName")
        if (!user) return responseHandler.badRequest(res, "Uesr not exist");

        if (!user.validPassword(password)) return responseHandler.badRequest(res, "Wrong password") 
        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expires: "24h" }
        );

        user.password = undefined;
        user.salt = undefined;

        responseHandler.created(res, {
            token,
            ...user_doc,
            id: user.id
        });
    }
    catch {
        responseHandler.error(res)
    }
}


const updatePassword = async (req, res) => {
    try { 
        const { password, newPassword } = req.body;
        const user = await userModel.findById(req.user.id).select("password id salt")
        if (!user) return responseHandler.unauthorized(res);
        if (!user.validPassword(password)) return responseHandler.badRequest(res, "wrong Password")
        user.setPassword(newPassword)
        await user.save()
        responseHandler.ok(res);
    }
    catch {
        responseHandler.error(res)
    }
}


const getInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) return responseHandler.notfound(res, 'user not found');
        responseHandler.ok(res, user);
    }
    catch {
        responseHandler.error(res)
    }
}


export default {
    signup, signin, getInfo,
    updatePassword
};