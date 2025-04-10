const User = require("../model/user")
const { successResponse, errorResponse} = require("./response")
const { signToken } = require("../server/auth/auth")
const Config = require("../server/config/config")

async function createUser(req, res) {
    const {full_name, username, password, phone} = req.body
    User.create({
        username,
        password,
        full_name,
        phone
    }).then((result) => {
        return successResponse(res, 201, result._id)
    }).catch((err) => errorResponse(res, 500, err.message))
}

async function loginUser(req, res) {
    const {username, password} = req.body
    if (!username){
        return errorResponse(res, 400, "username is a required field")
    }
    if (!password){
        return errorResponse(res, 400, "password is a required field")
    }
    User.validateUser(username, password).then((user) => {
        user._doc.token = signToken(user)
        return successResponse(res, 200, {...user._doc, password:undefined, __v:undefined})
    }).catch((err) => errorResponse(res, 400, err.message))
}

async function updateUser(req, res) {
    const userID = req.user_id
    const allowedPlans = Config.app.allowedPlans
    const updates = {};
    if (updateData.full_name) {
        updates.full_name = updateData.full_name;
    }
    if (updateData.plan) {
        if (!allowedPlans.includes(updateData.plan)) {
            return errorResponse(res, 400, plansAsString())
        }
        updates.plan = updateData.plan;
    }
    if (Object.keys(updates).length === 0) {
        return errorResponse(res, 400, "no valid fields provided to update.")
    }

    const updatedUser = await User.findByIdAndUpdate(
        userID,
        { $set: updates },
        { new: true, runValidators: true } // new: true returns updated doc
    );
    if (!updatedUser) {
        throw errorResponse(res, 400, "no user found")
    }
    successResponse(res, 200, {...updatedUser._doc, password:undefined, __v:undefined})
}

function plansAsString() {
    const allowedPlans = Config.app.allowedPlans
    if (!Array.isArray(allowedPlans)) return '';
    if (allowedPlans.length === 0) return '';
    if (allowedPlans.length === 1) return allowedPlans[0];
    if (allowedPlans.length === 2) return `${allowedPlans[0]} or ${allowedPlans[1]}`;

    const lastItem = allowedPlans.pop();
    return `${allowedPlans.join(', ')} or ${lastItem}`;
}

module.exports = {
    createUser,
    loginUser
}