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
