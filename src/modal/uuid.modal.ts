import mongoose, { Document, Schema, Model, Types } from "mongoose";


interface IUuid extends Document {
    userId : string,
    uuid : any,
}

const UuidSchema = new Schema<IUuid>({
    userId : {
        type : String,
        required : true,
        unique : true
    },
    uuid : [{
        _id : String,
        token : String,
        createdAt : {
            type : Number
        },
        expireAt : {
            type : Number
        }
    }]
});

export const Uuid : Model<IUuid> = mongoose.model<IUuid>("Uuid",UuidSchema);