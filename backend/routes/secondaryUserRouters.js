import express from 'express'
const router = express.Router();
import {login,getSecUserData,fetchOutstandingTotal,
    fetchOutstandingDetails,confirmCollection,logout,transactions,cancelTransaction,fetchBanks} from "../controllers/secondaryUserController.js"
import { authSecondary } from '../middlewares/authSecUsers.js';


router.post('/login',login)
router.post('/logout',authSecondary,logout)
router.get('/getSecUserData',authSecondary,getSecUserData)
router.get('/fetchOutstandingTotal/:cmp_id',authSecondary,fetchOutstandingTotal)
router.get('/fetchOutstandingDetails/:party_id/:cmp_id',authSecondary,fetchOutstandingDetails)
router.post('/confirmCollection',authSecondary,confirmCollection)
router.get('/transactions',authSecondary,transactions)
router.post('/cancelTransaction/:id',authSecondary,cancelTransaction)
router.get('/fetchBanks/:cmp_id',authSecondary,fetchBanks)



export default router