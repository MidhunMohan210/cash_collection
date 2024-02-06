import express from 'express';
const router = express.Router();
import { authPrimary } from '../middlewares/authPrimaryUsers.js';
import { registerPrimaryUser,login,addOrganizations,
  primaryUserLogout ,getPrimaryUserData,getOrganizations,
  addSecUsers,fetchSecondaryUsers,
  fetchOutstandingTotal,fetchOutstandingDetails,confirmCollection,
  transactions,cancelTransaction,fetchBanks,bankList,sendOtp,submitOtp,resetPassword} from '../controllers/primaryUserController.js';
import { singleUpload } from '../multer/multer.js';
import { primaryIsBlocked } from '../middlewares/isBlocked.js';

router.post('/register', registerPrimaryUser);
router.post('/login', login);
router.post('/addOrganizations', authPrimary,primaryIsBlocked,addOrganizations);
router.post('/primaryUserLogout', authPrimary,primaryIsBlocked,primaryUserLogout);
router.get('/getPrimaryUserData', authPrimary,primaryIsBlocked,getPrimaryUserData);
router.get('/getOrganizations', authPrimary,primaryIsBlocked,singleUpload,getOrganizations);
router.post('/addSecUsers', authPrimary,primaryIsBlocked,addSecUsers);
router.get('/fetchSecondaryUsers', authPrimary,primaryIsBlocked,fetchSecondaryUsers);
router.get('/fetchOutstandingTotal', authPrimary,primaryIsBlocked,fetchOutstandingTotal);
router.get('/fetchOutstandingDetails/:id/:cmp_id', authPrimary,primaryIsBlocked,fetchOutstandingDetails);
router.get('/fetchOutstandingDetails/:id', authPrimary,primaryIsBlocked,fetchOutstandingDetails);
router.post('/confirmCollection',authPrimary,primaryIsBlocked,confirmCollection)
router.get('/transactions',authPrimary,primaryIsBlocked,transactions)
router.post('/cancelTransaction/:id',authPrimary,primaryIsBlocked,cancelTransaction)
router.get('/fetchBanks/:cmp_id',authPrimary,primaryIsBlocked,fetchBanks)
router.get('/bankList',authPrimary,primaryIsBlocked,bankList)
router.post('/sendOtp',sendOtp)
router.post('/submitOtp',submitOtp)
router.post('/resetPassword',resetPassword)




export default router;
