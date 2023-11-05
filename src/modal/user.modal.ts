import mongoose, { Document, Schema, Model } from "mongoose";

interface UserDocument extends Document {
  email: string;
  name: string;
  username : string;
  password: string;
  phoneNo: number;
  role : string;
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
    type: String,
    enum: ['user', 'admin', 'seller'],
    default: 'user'
  },
  profileImage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({ name: 1, email: 1 }, { unique: true });

 export const User : Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

//  export default User;
