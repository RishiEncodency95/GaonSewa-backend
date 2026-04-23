import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    description: {
        type: String,
    },
    buttonName: {
        type: String,
    },
    buttonLink: {
        type: String,
    },
    image: {
        url: String,
        public_id: String
    }
}, { timestamps: true });

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;
