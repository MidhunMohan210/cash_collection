import express from 'express';
const router = express.Router();
import { authPrimary } from '../middlewares/authPrimaryUsers.js';
import { registerPrimaryUser,login,addOrganizations,
  primaryUserLogout ,getPrimaryUserData,getOrganizations,
  addSecUsers,fetchSecondaryUsers,
  fetchOutstandingTotal,fetchOutstandingDetails,confirmCollection,
  transactions,cancelTransaction,fetchBanks} from '../controllers/primaryUserController.js';
import { singleUpload } from '../multer/multer.js';
router.post('/register', registerPrimaryUser);
router.post('/login', login);
router.post('/addOrganizations', authPrimary,addOrganizations);
router.post('/primaryUserLogout', authPrimary,primaryUserLogout);
router.get('/getPrimaryUserData', authPrimary,getPrimaryUserData);
router.get('/getOrganizations', authPrimary,singleUpload,getOrganizations);
router.post('/addSecUsers', authPrimary,addSecUsers);
router.get('/fetchSecondaryUsers', authPrimary,fetchSecondaryUsers);
router.get('/fetchOutstandingTotal', authPrimary,fetchOutstandingTotal);
router.get('/fetchOutstandingDetails/:id/:cmp_id', authPrimary,fetchOutstandingDetails);
router.get('/fetchOutstandingDetails/:id', authPrimary,fetchOutstandingDetails);
router.post('/confirmCollection',authPrimary,confirmCollection)
router.get('/transactions',authPrimary,transactions)
router.post('/cancelTransaction/:id',authPrimary,cancelTransaction)
router.get('/fetchBanks/:cmp_id',authPrimary,fetchBanks)




export default router;
