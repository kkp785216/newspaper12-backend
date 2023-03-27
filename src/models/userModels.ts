import mongoose from 'mongoose'; // Erase if already required
import bcrypt from 'bcrypt';
import type { UserProfileResponse } from 'constants/types';

type TypeAuthUser = UserProfileResponse & {
    isPasswordMatched: (inputPassword: string) => Promise<boolean>;
}

// Declare the Schema of the User model
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type:  String,
        enum: ['user', 'admin'],
        default: "user",
    }
});

// hash the password before save it to database
userSchema.pre("save", async function () {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
});

// convert plain password to hash password and match it to already saved hash password
userSchema.methods.isPasswordMatched = async function (inputPassword: string) {
    return await bcrypt.compare(inputPassword, this.password);
}

//Export the model
export default mongoose.model<TypeAuthUser>('User', userSchema);