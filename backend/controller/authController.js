import UserModel from '../model/usersModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;


        if (!password || password.length < 6 || password.length > 12
        ) {
            return res.status(400).json({
                message: "Password must be between 6 and 12 characaters"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const concordiaEmailPattern = /^[a-zA-Z0-9._%+-]+@live\.concordia\.ca$/;
        if (!concordiaEmailPattern.test(normalizedEmail)) {
            return res.status(400).json({ message: "Email must be a valid Concordia University email address" });
        }

        const existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const finalUsername = username || email.split('@')[0];


        const validRole = 'student'; // Default role assignment

        const newUser = new UserModel({
            email: normalizedEmail,
            password: hashPassword,
            username: finalUsername,
            role: validRole
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "SignUp failed", error: error.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase();
        const loggedInUser = await UserModel.findOne({ email: normalizedEmail });
        if (!loggedInUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isSamePassword = loggedInUser ? await bcrypt.compare(password, loggedInUser.password) : false;
        if (!isSamePassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
//JWT Token generation

const token=jwt.sign(
    {
        id:loggedInUser._id,
        email:loggedInUser.email,
        role:loggedInUser.role
    },
    process.env.JWT_SECRET,
    {expiresIn:'1h'}
);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: loggedInUser._id,
                email: loggedInUser.email,
                username: loggedInUser.username,
                role: loggedInUser.role
            }
        });

     
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const normalizedEmail = email.toLowerCase();
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!newPassword || newPassword.length < 6 || newPassword.length > 12) {
            return res.status(400).json({ message: "Password must be between 6 and 12 characters" });
        }


        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({
            message: "Password reset successful",
            user: { email: user.email, username: user.username }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Password reset failed", error: error.message });
    }
};
