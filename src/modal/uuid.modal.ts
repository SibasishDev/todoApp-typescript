import mongoose, { Document, Schema, Model } from "mongoose";


interface IUuid {
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

export const Uuid : Model<IUuid & Document> = mongoose.model<IUuid & Document>("Uuid",UuidSchema);