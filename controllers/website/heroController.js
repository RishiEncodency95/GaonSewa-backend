import Hero from "../../models/website/Hero.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";

export const getHero = async (req, res) => {
    try {
        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const heroes = await Hero.find(filter).sort({ createdAt: -1 });
        res.status(200).json(heroes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHeroById = async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: "Hero not found" });
        }
        res.status(200).json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createOrUpdateHero = async (req, res) => {
    const { title, subtitle, description, buttonName, buttonLink, status } = req.body;

    try {
        let imageData = null;
        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) {
                imageData = {
                    url: result.secure_url,
                    public_id: result.public_id
                };
                // Delete local file
                fs.unlinkSync(req.file.path);
            } else {
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }
        }

        const hero = await Hero.create({
            title,
            subtitle,
            description,
            buttonName,
            buttonLink,
            image: imageData,
            status
        });

        return res.status(201).json({ message: "Hero created successfully", hero });
    } catch (error) {
        // Cleanup local file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteHero = async (req, res) => {
    try {
        const hero = await Hero.findByIdAndDelete(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: "Hero not found" });
        }
        res.status(200).json({ message: "Hero deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateHero = async (req, res) => {
    const { title, subtitle, description, buttonName, buttonLink, status } = req.body;

    try {
        const updateData = {
            title,
            subtitle,
            description,
            buttonName,
            buttonLink,
            status
        };

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) delete updateData[key];
        });

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            if (result) {
                updateData.image = {
                    url: result.secure_url,
                    public_id: result.public_id
                };
                fs.unlinkSync(req.file.path);
            } else {
                return res.status(500).json({ message: "Cloudinary upload failed" });
            }
        }

        const hero = await Hero.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!hero) {
            return res.status(404).json({ message: "Hero not found" });
        }
        res.status(200).json(hero);
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};
