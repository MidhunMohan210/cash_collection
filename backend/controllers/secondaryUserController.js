import SecondaryUser from "../models/secondaryUserModel.js";
import generateSecToken from "../utils/generateSecondaryToken.js";
import TallyData from "../models/TallyData.js";
import TransactionModel from "../models/TransactionModel.js";
import  BankDetails from '../models/bankModel.js'

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// @desc Login secondary user
// route POST/api/sUsers/login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const secUser = await SecondaryUser.findOne({ email });

    if (!secUser) {
      return res.status(404).json({ message: "Invalid User" });
    }

    if (!secUser.isApproved) {
      return res.status(401).json({ message: "User approval is pending" });
    }

    if (secUser.isBlocked) {
      return res.status(401).json({ message: "User is blocked" });
    }

    const isPasswordMatch = await bcrypt.compare(password, secUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { name, _id } = secUser._doc;
    const token = generateSecToken(res, secUser._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      data: { email, name, _id },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Failed to login!" });
  }
};

// @desc get secuser user data for sidebar
// route GET/api/sUsers/getSecUserData

export const getSecUserData = async (req, res) => {
  const userId = req.sUserId;
  try {
    const userData = await SecondaryUser.findById(userId).populate({
      path: "organization",
      select: "_id name",
    });
    if (userData) {
      return res
        .status(200)
        .json({ message: "secondaryUSerData fetched", data: { userData } });
    } else {
      return res
        .status(404)
        .json({ message: "secondaryUSerData not found", data: { userData } });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "internal sever error" });
  }
};

// @desc get outstanding data from tally
// route GET/api/sUsers/fetchOutstanding

export const fetchOutstandingTotal = async (req, res) => {
  const cmp_id = req.params.cmp_id;
  console.log("cmp_id", cmp_id);
  try {
    // const tallyData = await TallyData.find({ Primary_user_id: userId });
    const outstandingData = await TallyData.aggregate([
      { $match: { cmp_id: cmp_id } },
      {
        $group: {
          _id: "$party_id",
          totalBillAmount: { $sum: "$bill_pending_amt" },
          party_name: { $first: "$party_name" },
          cmp_id: { $first: "$cmp_id" },
        },
      },
    ]);

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
// route GET/api/sUsers/fetchOutstandingDetails

export const fetchOutstandingDetails = async (req, res) => {
  const partyId = req.params.party_id;
  const cmp_id = req.params.cmp_id;
  console.log("cmp_id", cmp_id);
  console.log("partyId", partyId);
  try {
    const outstandings = await TallyData.find({
      party_id: partyId,
      cmp_id: cmp_id,
    });
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
// route GET/api/sUsers/confirmCollection

export const confirmCollection = async (req, res) => {
  const {
    collectionDetails,
    PaymentMethod,
    paymentDetails,
    agentName,
    agentId,
  } = req.body;
  const paymentMethod = PaymentMethod;

  console.log("PaymentMethod", PaymentMethod);
  console.log("paymentDetails", paymentDetails);
  console.log("agentName", agentName);
  console.log("agentId", agentId);

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

// @desc logout
// route GET/api/sUsers/logout

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt_secondary", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    // Send a response indicating successful logout
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    // Handle errors
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc get transactions
// route GET/api/sUsers/transactions

export const transactions = async (req, res) => {
  const userId = req.sUserId;

  try {
    const transactions = await TransactionModel.aggregate([
      { $match: { agentId: userId } },
      // { $unwind: "$billData" }, // Unwind the billData array
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
// route GET/api/sUsers/cancelTransaction

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
