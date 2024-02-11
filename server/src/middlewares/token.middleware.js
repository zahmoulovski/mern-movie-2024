import jsonwebtoken from 'jsonwebtoken';
import responseHandler from './../handlers/response.handler';
import userModel from '../../models/user.model';

const tokenDecode = (req) => {
    try {
        const BearerHandler = req.headers['authorization'];

        if (BearerHandler) {
            const token = BearerHeader.split("")[1]

            return jsonwebtoken.verify(token,
            process.env.TOKEN_SECRET
            )
        } return false
    } catch {
        return false
    }
}

const auth = async (res, req, next) => {
    const tokenDecoded = tokenDecode(req)
    if (!tokenDecoded) return responseHandler.unauthorized(res)

    const user = await userModel.findById(tokenDecoded.data)

    if (!user) return responseHandler.unauthorized(res)

    req.user = user
    next ()
}


export default {auth, tokenDecode}