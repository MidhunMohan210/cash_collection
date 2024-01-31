import PrimaryUser from "../models/primaryUserModel.js";
import Organization from "../models/OragnizationModel.js";
import SecondaryUser from "../models/secondaryUserModel.js";
import generatePrimaryUserToken from "../utils/generatePrimaryToken.js";
import TallyData from '../models/TallyData.js'
import TransactionModel from "../models/TransactionModel.js";
import  BankDetails from '../models/bankModel.js'
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// @desc Register Primary user
// route POST/api/pUsers/register

export const registerPrimaryUser = async (req, res) => {
  try {
    const { userName, mobile, email, password } = req.body;

    const userExists = await PrimaryUser.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = new PrimaryUser({
      userName,
      mobile,
      email,
      password,
    });

    const result = await user.save();

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "User registration is successful" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User registration failed" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};

// @desc Login Primary user
// route POST/api/pUsers/login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const primaryUser = await PrimaryUser.findOne({ email });

    if (!primaryUser) {
      return res.status(404).json({ message: "Invalid User" });
    }

    if (!primaryUser.isApproved) {
      return res.status(401).json({ message: "User approval is pending" });
    }

    if (primaryUser.isBlocked) {
      return res.status(401).json({ message: "User is blocked" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      primaryUser.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { userName,_id } = primaryUser._doc;
    const token = generatePrimaryUserToken(res, primaryUser._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      data: { email, userName,_id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Failed to login!" });
  }
};

// @desc Logout Primary user
// route POST/api/pUsers/logout

export const primaryUserLogout = async (req, res) => {
  try {
    res.cookie("jwt_primary", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      message: "Logged out",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Failed to login!" });
  }
};

// @desc get Primary user data for sidebar
// route GET/api/pUsers/getPrimaryUserData

export const getPrimaryUserData = async (req, res) => {
  const userId = req.pUserId;
  try {
    const userData = await PrimaryUser.findById(userId);
    if (userData) {
      return res
        .status(200)
        .json({ message: "primaryUSerData fetched", data: { userData } });
    } else {
      return res
        .status(404)
        .json({ message: "primaryUSerData not found", data: { userData } });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "internal sever error" });
  }
};

// @desc Adding organizations by primary users
// route POST/api/pUsers/addOrganizations
export const addOrganizations = async (req, res) => {
  const { name, place, pin, state, country, email, mobile, gst,logo} = req.body;
  console.log(req.file);
  console.log(req.body);
  const owner = req.pUserId;
  try {
    const organization = await Organization.create({
      name,
      place,
      pin,
      state,
      country,
      owner,
      email,
      mobile,
      logo,
      gstNum: gst,
    });

    if (organization) {
      return res
        .status(200)
        .json({ success: true, message: "Organization added successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Adding organization failed" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};

// @desc get Primary user organization list
// route GET/api/pUsers/getOrganizations

export const getOrganizations = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.pUserId);
  console.log(userId);
  try {
    const organizations = await Organization.find({ owner: userId })
    if (organizations) {
      return res.status(200).json({
        organizationData: organizations,
        message: "Organization fetched",
      });
    } else {
      return res
        .status(404)
        .json({ message: "No organization were found for user" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};

// @desc adding secondary users
// route GET/api/pUsers/addSecUsers
export const addSecUsers = async (req, res) => {
  try {
    const { name, mobile, email, password,selectedOrg } = req.body;
    const pUserId=req.pUserId

    const userExists = await SecondaryUser.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = new SecondaryUser({
      name,
      mobile,
      email,
      password,
      organization:selectedOrg,
      primaryUser:pUserId,
    });

    const result = await user.save();

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Secondary user registration is successful" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Secondary user registration failed" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};


// @desc get secondary users list
// route GET/api/pUsers/fetchSecondaryUsers

export const fetchSecondaryUsers = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.pUserId);
  console.log(userId);
  try {
    const secondaryUsers = await SecondaryUser.find({ primaryUser: userId }).populate('organization').exec();
    if (secondaryUsers) {
      return res.status(200).json({
        secondaryUsers: secondaryUsers,
        message: "secondaryUsers fetched",
      });
    } else {
      return res
        .status(404)
        .json({ message: "No secondaryUsers were found for user" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};


// @desc get outstanding data from tally
// route GET/api/pUsers/fetchOutstanding

export const fetchOutstandingTotal = async (req, res) => {
  const userId = req.pUserId
  try {
    // const tallyData = await TallyData.find({ Primary_user_id: userId });
    const outstandingData=await TallyData.aggregate([
      {$match:{ Primary_user_id:userId}},
      {
        $group:{
          _id:"$party_id",
          totalBillAmount:{$sum:"$bill_pending_amt"},
          party_name:{$first:"$party_name"},
          cmp_id: { $first: "$cmp_id" }, 

        }
      }
    ])

    if (outstandingData) {
      return res.status(200).json({
        outstandingData: outstandingData,
        message: "tallyData fetched",
      });
    } else {
      return res
        .status(404)
        .json({ message: "No outstandingData were found for user" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};

// @desc get outstanding data from tally
// route GET/api/pUsers/fetchOutstandingDetails 

export const fetchOutstandingDetails = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.pUserId);
  const partyId=req.params.id;
  const cmp_id=req.params.cmp_id;
  console.log("cmp_id",cmp_id);
  console.log("partyId",partyId);
  console.log(userId);
  try {
    const outstandings = await TallyData.find({ Primary_user_id: userId,party_id:partyId,cmp_id:cmp_id });
    if (outstandings) {
      return res.status(200).json({
        outstandings: outstandings,
        message: "outstandings fetched",
      });
    } else {
      return res
        .status(404)
        .json({ message: "No outstandings were found for user" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};



// @desc confirm collection and alter db
// route GET/api/pUsers/confirmCollection

export const confirmCollection = async (req, res) => {
  const {
    collectionDetails,
    PaymentMethod,
    paymentDetails,
    agentName,
    agentId,
  } = req.body;
  const paymentMethod = PaymentMethod;

  // console.log("PaymentMethod", PaymentMethod);
  // console.log("paymentDetails", paymentDetails);
  // console.log("agentName", agentName);
  // console.log("agentId", agentId);

  const {
    party_id,
    party_name,
    totalBillAmount,
    cmp_id,
    billData,
    enteredAmount,
  } = collectionDetails;

  console.log("collectionDetails", collectionDetails);

  try {
    const outstandingData = await TallyData.find({
      cmp_id: collectionDetails.cmp_id,
      bill_no: { $in: collectionDetails.billData.map((bill) => bill.billNo) },
    });

    if (outstandingData.length > 0) {
      const bulkUpdateOperations = outstandingData.map((doc, index) => ({
        updateOne: {
          filter: {
            _id: doc._id,
          },
          update: {
            $set: {
              bill_pending_amt:
                collectionDetails.billData[index].remainingAmount,
            },
          },
        },
      }));

      await TallyData.bulkWrite(bulkUpdateOperations);

      const transaction = new TransactionModel({
        party_id,
        party_name,
        totalBillAmount,
        cmp_id,
        billData,
        paymentMethod,
        enteredAmount,
        paymentDetails,
        agentName,
        agentId,
      });

      await transaction.save();

      console.log("Documents updated successfully");
    } else {
      console.log("No matching documents found for the given criteria");
    }

    // // Add your logic to handle PaymentMethod, paymentDetails, agentName, agentId

    res.status(200).json({ message: "Your Collection is confirmed" });
  } catch (error) {
    console.error("Error updating documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// @desc for getting transactions
// route GET/api/pUsers/transactions

export const transactions = async (req, res) => {
  const userId = req.pUserId;

  try {
    const transactions = await TransactionModel.aggregate([
      { $match: { agentId: userId } },
      {
        $project: {
          _id: 1,
          party_id: 1,
          party_name: 1,
          enteredAmount: 1,
          isCancelled:1,
          createdAt:1
          // totalBillAmount: 1,
          // cmp_id: 1,
          // billNo: "$billData.billNo",
          // settledAmount: "$billData.settledAmount",
          // remainingAmount: "$billData.remainingAmount",
          // paymentMethod: 1,
          // paymentDetails: 1,
          // agentName: 1,
          // agentId: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (transactions.length > 0) {
      return res.status(200).json({
        message: "Transactions fetched",
        data: { transactions },
      });
    } else {
      return res.status(404).json({ message: "Transactions not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


// @desc for cancelling transactions
// route GET/api/pUsers/cancelTransaction

export const cancelTransaction = async (req, res) => {
  try {
    const transactionId = new mongoose.Types.ObjectId(req.params.id);
    

    const transactions = await TransactionModel.aggregate([
      { $match: { _id: transactionId } },
      { $unwind: "$billData" },
      {
        $project: {
          _id: 0,
          billNo: "$billData.billNo",
          currentAmount: { $sum: ["$billData.settledAmount", "$billData.remainingAmount"] }
        }
      },
    ]);

    console.log("Transactions to update:", transactions);

    for (const { billNo, currentAmount } of transactions) {
      await TallyData.updateOne({ bill_no: billNo }, { $set: { bill_pending_amt: currentAmount } });
      console.log(`Updated bill_pending_amt for ${billNo}`);
    }

    await TransactionModel.updateOne({ _id: transactionId }, { $set: { isCancelled: true } });


    

    res.status(200).json({ success: true, message: "Transaction canceled successfully" });
  } catch (error) {
    console.error("Error canceling transaction:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// @desc fetch banks for payment page 
// route GET/api/sUsers/fetchBanks/:cmp_id

export const fetchBanks = async (req, res) => {
  const bankId = req.params.cmp_id;
  try {
    const bankData = await BankDetails.aggregate([
      { $match: { cmp_id: bankId } },
      {
        $project: {
          bank_ledname: 1,
        },
      },
    ]);

    if (bankData.length > 0) {
      return res.status(200).json({ message: "bankData fetched", data: bankData });
    } else {
      return res.status(404).json({ message: "Bank data not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};
