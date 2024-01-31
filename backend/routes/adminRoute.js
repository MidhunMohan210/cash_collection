import express from 'express'
const router = express.Router();
import { adminLogin ,getAdminData,getPrimaryUsers,
    handlePrimaryApprove,handlePrimaryBlock,handleSecondaryBlock,
    getOrganizationsAdmin,getOrganizations,fetchSecondaryUsers,
    handleSubscription,handleSms,handleWhatsApp,handleOrganizationApprove} from '../controllers/adminController.js';
import { authAdmin } from '../middlewares/authAdmin.js';

router.post('/adminLogin',adminLogin);
router.get('/getAdminData',authAdmin,getAdminData);
router.get('/getPrimaryUsers',authAdmin,getPrimaryUsers);
router.post('/handlePrimaryApprove/:id',authAdmin,handlePrimaryApprove);
router.post('/handlePrimaryBlock/:id',authAdmin,handlePrimaryBlock);
router.post('/handleSecondaryBlock/:id',authAdmin,handleSecondaryBlock);
router.get('/getOrganizationsAdmin',authAdmin,getOrganizationsAdmin);
router.get('/getOrganizations',authAdmin,getOrganizations);
router.get('/fetchSecondaryUsers',authAdmin,fetchSecondaryUsers);
router.post('/handleSubscription/:id',authAdmin,handleSubscription);
router.post('/handleSms/:id',authAdmin,handleSms);
router.post('/handleWhatsApp/:id',authAdmin,handleWhatsApp);
router.post('/handleOrganizationApprove/:id',authAdmin,handleOrganizationApprove);



export default router