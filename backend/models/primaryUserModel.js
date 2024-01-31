import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const primaryUserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String },
    mobile: { type: Number },
    password: { type: String },
    subscription: { type: String,default:"monthly"},
    sms: { type: Boolean, default: false },
    whatsApp: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

primaryUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)


});

export default mongoose.model("PrimaryUser", primaryUserSchema);
