import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
  
    name: { type: String, required: true },
    place: { type: String },
    email:{type:String},
    mobile:{ type: Number },
    pin: { type: Number },
    gstNum:{ type: Number },
    country: { type: String },
    logo: { type: String },
    state: { type: String },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"PrimaryUser"}
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Organization", organizationSchema);
