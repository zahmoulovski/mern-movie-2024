const respoonseWithData = (res, statusCode, data) => res.status(statusCode).json(data)

const error = (res) => respoonseWithData(res, 500, {
    status: 500,
    message : "Oops! Something went wrong"
})

const badRequest = (res, message) => respoonseWithData(res, 400, {
    status: 400,
    message 
})

const ok = (res) => respoonseWithData(res, 200, data)

const created = (res, data) => respoonseWithData(res, 201, data)    

const unauthorized = (res) => respoonseWithData(res, 401, {
    status: 401,
    message: "Unauthorized"
})

const notfound = (res) => respoonseWithData(res, 404, {
    status: 404,
    message: "Resource Not found"
})

export default {
    error,
    badRequest,
    ok,
    created,
    unauthorized,
    notfound
}
