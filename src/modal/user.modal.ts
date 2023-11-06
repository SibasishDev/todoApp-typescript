import mongoose, { Document, Schema, Model } from "mongoose";

interface UserDocument extends Document {
  email: string;
  name: string;
  username : string;
  password: string;
  phoneNo: number;
  role : number;
  profileImage : string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
  },
  role: {
    type: Number,
    enum: [1,2,3],
    default: 'user',
    description: 'User role: 1 for admin, 2 for user, 3 for seller'
  },
  profileImage: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({ name: 1, email: 1 }, { unique: true });

 export const User : Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

//  export default User;
