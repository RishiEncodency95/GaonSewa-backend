import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const checkMalformedIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Find users with companyId or branchId that are not valid ObjectIds
        const users = await mongoose.connection.collection('users').find({}).toArray();
        let malformedCount = 0;

        for (const user of users) {
            let updateNeeded = false;
            const update = { $unset: {} };

            if (user.companyId && !mongoose.Types.ObjectId.isValid(user.companyId)) {
                console.log(`User ${user.name} (${user.email}) has invalid companyId: ${user.companyId}`);
                update.$unset.companyId = 1;
                updateNeeded = true;
            }

            if (user.branchId && !mongoose.Types.ObjectId.isValid(user.branchId)) {
                console.log(`User ${user.name} (${user.email}) has invalid branchId: ${user.branchId}`);
                update.$unset.branchId = 1;
                updateNeeded = true;
            }

            if (updateNeeded) {
                await mongoose.connection.collection('users').updateOne({ _id: user._id }, update);
                console.log(`Fixed user ${user.name}`);
                malformedCount++;
            }
        }

        console.log(`Finished fixing ${malformedCount} users with malformed IDs.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMalformedIds();
