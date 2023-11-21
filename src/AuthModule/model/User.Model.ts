import { Schema, model, Document, HydratedDocument } from "mongoose";

export interface registerUser extends Document {
  firstname: string;
  lastname: string;
  number: number;
  email: string;
  password: string;
}
export interface User extends Document {
  firstname: string;
  lastname: string;
  number: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model<User>("User", userSchema);

export default UserModel;
