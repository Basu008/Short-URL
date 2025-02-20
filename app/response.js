function successResponse(res, code, data){
    return res.status(code).json({
        success:true,
        payload:data
    })
}

function errorResponse(res, code, errMsg){
    return res.status(code).json({
        success:false,
        payload:errMsg
    })
}

function redirectResponse(res, url){
    res.redirect(url)
}

module.exports = {
    successResponse,
    errorResponse,
    redirectResponse
}