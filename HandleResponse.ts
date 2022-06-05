export const HandleResponse = (
    res,
    status,
    msg,
    data
) => res.status(status).json({
    message: msg,
    data
})