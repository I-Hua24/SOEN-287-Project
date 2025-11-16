import UserModel from '../model/usersModel.js';

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// GET USER BY ID
export const getuserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id, '-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error: error.message });
    }
};

// DELETE USER
export const deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
};

// CHANGE ROLE
export const changeRoleByEmail = async (req, res) => {
    try {
        const { email, newRole } = req.body;
        const normalizedEmail = email.toLowerCase();

        const validRoles = ['student', 'admin'];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: { email: user.email, role: user.role }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update user role",
            error: error.message
        });
    }
};

import bcrypt from "bcrypt";

export const updateUserInfo = async (req, res) => {
    try {
        const { username, language, notifications, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // ---- UPDATE USERNAME ----
        if (username) {
            currentUser.username = username;
        }

        // ---- UPDATE LANGUAGE ----
        if (language) {
            currentUser.language = language;
        }

        // ---- UPDATE NOTIFICATIONS ----
        if (notifications !== undefined) {
            currentUser.notifications = notifications;
        }

        // ---- UPDATE PASSWORD ----
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required" });
            }

            const isCorrect = await bcrypt.compare(currentPassword, currentUser.password);
            if (!isCorrect) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }

            if (newPassword.length < 6 || newPassword.length > 12) {
                return res.status(400).json({ message: "New password must be 6–12 characters." });
            }

            currentUser.password = await bcrypt.hash(newPassword, 10);
        }

        await currentUser.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                username: currentUser.username,
                email: currentUser.email,
                language: currentUser.language,
                notifications: currentUser.notifications
            }
        });

    } catch (error) {
        console.error("Update user info error:", error);
        return res.status(500).json({
            message: "Failed to update user info",
            error: error.message
        });
    }
};
