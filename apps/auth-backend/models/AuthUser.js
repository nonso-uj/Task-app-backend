import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const authUserSchema = new mongoose.Schema({
    googleId: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},{
    timestamps: true,
});

authUserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const AuthUser = mongoose.model('AuthUser', authUserSchema);

export default AuthUser;