const User = require("../model/user")
const { successResponse, errorResponse} = require("./response")
const { signToken } = require("../server/auth/auth")
const Config = require("../server/config/config")

async function updateUser(req, res) {
    const userID = req.user_id
    const updateData = req.body
    const allowedPlans = Config.app.allowedPlans
    const updates = {};
    if (updateData.full_name) {
        updates.full_name = updateData.full_name;
    }
    if (updateData.plan) {
        if (!allowedPlans.includes(updateData.plan)) {
            return errorResponse(res, 400, `plan can be ${plansAsString()}`)
        }
        updates.plan = updateData.plan;
    }
    if (Object.keys(updates).length === 0) {
        return errorResponse(res, 400, "no valid fields provided to update.")
    }

    const updatedUser = await User.findByIdAndUpdate(
        userID,
        { $set: updates },
        { new: true, runValidators: true }
    );
    if (!updatedUser) {
        return errorResponse(res, 400, "no user found")
    }
    updatedUser._doc.token = signToken(updatedUser)
    successResponse(res, 200, {...updatedUser._doc, password:undefined, __v:undefined})
}

async function getUser(req, res) {
    const userID = req.user_id
    await User.findById(
        userID,
    ).then(user => {
        if (!user){
            return errorResponse(res, 400, "no user found")
        }
        user._doc.token = signToken(user)
        return successResponse(res, 200, {...user._doc, password:undefined, __v:undefined})
    }).catch(err => {
        errorResponse(res, 500, err.message)
    })
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
    getUser,
    updateUser
}