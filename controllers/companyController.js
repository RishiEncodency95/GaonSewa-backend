import Company from "../models/superAdmin/Company.js";
import Branch from "../models/superAdmin/Branch.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";


// 🔥 CREATE COMPANY + MAIN BRANCH
export const createCompany = async (req, res) => {
    try {

        // 🔥 parse JSON fields
        const address = req.body.address
            ? JSON.parse(req.body.address)
            : {};

        const settings = req.body.settings
            ? JSON.parse(req.body.settings)
            : {};

        let logo = null;

        // 🔥 file upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "companies"
            });
            logo = result.secure_url;
            fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
        }

        const company = await Company.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,

            address,
            settings,

            gstNumber: req.body.gstNumber,
            panNumber: req.body.panNumber,
            category: req.body.category,
            businessNature: req.body.businessNature,

            plan: req.body.plan,
            description: req.body.description,
            status: req.body.status,

            logo
        });

        res.status(201).json({
            success: true,
            company
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 🔥 GET ALL COMPANIES
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 GET SINGLE COMPANY + BRANCHES
export const getCompanyWithBranches = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        const branches = await Branch.find({
            companyId: req.params.id
        });

        res.json({ company, branches });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// 🔥 CREATE BRANCH
export const createBranch = async (req, res) => {
    try {
        const { name, companyId, address, email, phone } = req.body;

        const branch = await Branch.create({
            name,
            companyId,
            address,
            email,
            phone
        });

        res.status(201).json({
            success: true,
            branch
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 🔥 DELETE BRANCH
export const deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        // ❌ main branch delete nahi kar sakte
        if (branch.isMainBranch) {
            return res.status(400).json({
                message: "Main branch cannot be deleted"
            });
        }

        await Branch.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Branch deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 UPDATE BRANCH
export const updateBranch = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const { name, address, email, phone } = req.body;

        if (name !== undefined) branch.name = name;
        if (address !== undefined) branch.address = address;
        if (email !== undefined) branch.email = email;
        if (phone !== undefined) branch.phone = phone;

        await branch.save();

        res.json({
            success: true,
            message: "Branch updated",
            branch
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 GET BRANCHES BY COMPANY
export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find({
            companyId: req.params.companyId
        });

        res.json(branches);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 UPDATE COMPANY
export const updateCompany = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is empty." });
        }

        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const {
            name, email, phone, website, gstNumber, panNumber, category, businessNature,
            plan, description, status
        } = req.body;

        // ✅ only update if value exists
        if (name !== undefined) company.name = name;
        if (email !== undefined) company.email = email;
        if (phone !== undefined) company.phone = phone;
        if (website !== undefined) company.website = website;

        // Handle address parsing for FormData strings
        if (req.body.address !== undefined) {
            company.address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
        } else if (req.body['address.street'] !== undefined || req.body['address[street]'] !== undefined) {
            company.address = {
                street: req.body['address.street'] || req.body['address[street]'],
                city: req.body['address.city'] || req.body['address[city]'],
                state: req.body['address.state'] || req.body['address[state]'],
                country: req.body['address.country'] || req.body['address[country]'],
                pincode: req.body['address.pincode'] || req.body['address[pincode]']
            };
        }

        // Handle settings parsing for FormData strings
        if (req.body.settings !== undefined) {
            company.settings = typeof req.body.settings === 'string' ? JSON.parse(req.body.settings) : req.body.settings;
        } else if (req.body['settings.allowCredit'] !== undefined || req.body['settings[allowCredit]'] !== undefined || req.body['settings.currency'] !== undefined || req.body['settings[currency]'] !== undefined) {
            company.settings = {
                allowCredit: req.body['settings.allowCredit'] === 'true' || req.body['settings[allowCredit]'] === 'true' || req.body['settings.allowCredit'] === true || req.body['settings[allowCredit]'] === true,
                currency: req.body['settings.currency'] || req.body['settings[currency]'] || company.settings?.currency || 'INR'
            };
        }

        if (gstNumber !== undefined) company.gstNumber = gstNumber;
        if (panNumber !== undefined) company.panNumber = panNumber;
        if (category !== undefined) company.category = category;
        if (businessNature !== undefined) company.businessNature = businessNature;
        if (plan !== undefined) company.plan = plan;
        if (description !== undefined) company.description = description;
        if (status !== undefined) company.status = status;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "companies"
            });
            company.logo = result.secure_url;
            fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
        }

        await company.save();

        res.json({
            success: true,
            message: "Company updated",
            company
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// 🔥 DELETE COMPANY
export const deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);

        // also delete branches
        await Branch.deleteMany({ companyId: req.params.id });

        res.json({ message: "Company & branches deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};