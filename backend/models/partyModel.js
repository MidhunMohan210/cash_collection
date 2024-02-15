import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  Primary_user_id:{ type: String, required: true },
  cpm_id:{ type: String, required: true },
  accountGroup: { type: String, required: true },
  partyName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  emailID: { type: String, required: true },
  gstNo: { type: String, required: true },
  panNo: { type: String, required: true },
  billingAddress: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  creditPeriod:{ type: String, required: true },
  creditLimit:{ type: String, required: true },
  openingBalanceType:{ type: String, required: true },
  openingBalanceAmount: { type: String, required: true },
});


export default mongoose.model("Party", partySchema);
