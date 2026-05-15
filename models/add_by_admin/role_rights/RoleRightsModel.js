import mongoose from "mongoose";

const roleRightsSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        permissions: [
            {
                type: Object,
            },
        ],
        created_by: {
            type: String,
            default: null,
        },
        updated_by: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("RoleRights", roleRightsSchema);