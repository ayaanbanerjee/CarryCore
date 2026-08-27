import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const hashed = await bcrypt.hash('ayan1234567', 10);
const existing = await User.findOne({ email: 'ayan@gmail.com' });

if (existing) {
    await User.updateOne({ email: 'ayan@gmail.com' }, { $set: { password: hashed, role: 'admin' } });
    console.log('✅ Admin updated successfully!');
} else {
    await User.create({ name: 'Ayan', email: 'ayan@gmail.com', password: hashed, role: 'admin' });
    console.log('✅ Admin created successfully!');
}

await mongoose.disconnect();
