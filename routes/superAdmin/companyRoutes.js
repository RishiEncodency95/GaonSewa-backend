import express from "express";
import {
    createCompany,
    getCompanies,
    getCompanyWithBranches,
    updateCompany,
    deleteCompany,

    createBranch,
    getBranches,
    updateBranch,
    deleteBranch
} from "../../controllers/companyController.js";

import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();


// ================= BRANCH =================

// create branch
router.post("/branches", createBranch);

// get branches by company
router.get("/branches/company/:companyId", getBranches);

// update branch
router.put("/branches/:id", updateBranch);

// delete branch
router.delete("/branches/:id", deleteBranch);



// ================= COMPANY =================

// create company (with logo upload)
router.post("/", upload.single("logo"), createCompany);

// get all companies
router.get("/", getCompanies);

// get single company
router.get("/:id", getCompanyWithBranches);

// update company (🔥 FIXED)
router.put("/:id", upload.single("logo"), updateCompany);

// delete company
router.delete("/:id", deleteCompany);


export default router;