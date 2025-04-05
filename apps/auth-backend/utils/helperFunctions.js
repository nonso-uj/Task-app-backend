import crypto from 'crypto';


export const generateResetToken = async () => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 3600000);
    return  { resetToken, hashedToken, resetExpires }
}


// export const generateResetToken = async () => {
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const salt = await bcrypt.genSalt(10);
//     const hashedToken = await bcrypt.hash(resetToken, salt);
//     const resetExpires = new Date(Date.now() + 3600000);
//     return  { resetToken, hashedToken, resetExpires }
// }