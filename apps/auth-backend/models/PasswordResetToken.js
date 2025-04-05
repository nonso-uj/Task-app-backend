import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
        required: true
    },
    token: {type: String, required: true, unique: true},
    token_expiry: {type: Date, required: true},
},{
    timestamps: true,
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken;