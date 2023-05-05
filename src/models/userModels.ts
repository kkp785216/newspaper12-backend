import mongoose, { Document } from "mongoose"; // Erase if already required
import bcrypt from "bcrypt";
import type {
  UserProfileRequestBody,
  UserProfileResponse,
} from "../constants/types";

type TypeAuthUser = Document &
  UserProfileResponse & {
    password: string;
    isPasswordMatched: (inputPassword: string) => Promise<boolean>;
  };

// Declare the Schema of the User model
const userSchema = new mongoose.Schema<UserProfileRequestBody>({
  firstName: {
    type: String,
    required: true,
    min: [3, "FirstName can't be less than 3 characters"],
  },
  lastName: {
    type: String,
    min: [3, "LastName can't be less than 3 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!value.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        throw new Error("Invalid email address");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!value.match(/^[0-9]{10}$/)) {
        throw new Error("Invalid mobile number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    min: [5, "Password must at least 5 characters long!"],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "role '{VALUE}' not supported!",
    },
    default: "user",
  },
});

// hash the password before save it to database
userSchema.pre("save", async function () {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// convert plain password to hash password and match it to already saved hash password
userSchema.methods.isPasswordMatched = async function (
  inputPassword: string
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

//Export the model
export default mongoose.model<TypeAuthUser>("User", userSchema);
