import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(401).json({
				message: "Something is missing , Please check",
				success: false,
			});
		}
		const user = await User.findOne({ email });
		if (user) {
			return res.status(401).json({
				message: "Try diffferent email",
				success: false,
			});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			username,
			email,
			password: hashedPassword,
		});
		return res.status(201).json({
			message: "Account created succesfully",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(401).json({
				message: "Something is missing , Please check",
				success: false,
			});
		}
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			});
		}

		const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1d",
		});

		// populate each post if in the posts array

		const populatedPosts = await Promise.all(
			user.posts.map(async (postId) => {
				const post = await Post.findById(postId);
				if (post.author.equals(user._id)) {
					return post;
				}
				return null;
			})
		)

		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			follower: user.follower,
			following: user.following,
			posts: populatedPosts,
		};

		return res.cookie("token", token, {
			httpOnly: true,
			secure: true,       // HTTPS only
			sameSite: "none",   // allow cross-site
			maxAge: 24 * 60 * 60 * 1000,
		})
		.json({
			message: `Welcome back ${user.username}`,
			success: true,
			user,
		});
	} catch (error) {
		console.log(error);
	}
};

export const logout = async (req, res) => {
	try {
		return res.cookie("token", "", { maxAge: 0 }).json({
			message: "Logged out successfully",
			success: true,
		});
	}
	catch (error) {
		console.log(error);
	}
};

export const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		let user = await User.findById(userId).populate({
			path: 'posts',
			createdAt: -1
		}).populate('bookmarks');


		if (!user) {
			return res.status(404).json({
				message: "User not found",
				success: false,
			});
		}
		return res.status(200).json({
			user,
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
};

export const editProfile = async (req, res) => {
	try {
		const userId = req.id;
		const { bio, gender } = req.body;
		const profilePicture = req.file;
		let cloudResponse;
		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}

		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
				success: false
			})
		}

		if (bio) {
			user.bio = bio;
		}
		if (gender) {
			user.gender = gender;
		}
		if (profilePicture) {
			user.profilePicture = cloudResponse.secure_url;
		}

		await user.save();

		return res.status(200).json({
			message: 'Profile Updated',
			success: true,
			user
		})
	}
	catch (error) {
		console.log(error);
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
		if (!suggestedUsers) {
			return res.status(400).json({
				message: 'Currently do not have any users',
				success: false
			})
		}
		return res.status(200).json({
			success: true,
			users: suggestedUsers
		})
	}
	catch (error) {
		console.log(error);
	}
};


export const followOrUnfollow = async (req, res) => {
	try {
		const personWhoWantsToFollow = req.id;
		const ToBeFollowed = req.params.id;
		if (personWhoWantsToFollow === ToBeFollowed) {
			return res.status(400).json({
				message: "You can't follow or unfollow yourself",
				success: false
			})
		}

		const user = await User.findById(personWhoWantsToFollow);
		const targetUser = await User.findById(ToBeFollowed);
		if (!user || !targetUser) {
			return res.status(400).json({
				message: "User not found",
				success: false
			})
		}
		// follow or unfollow
		const isFollowing = user.following.includes(ToBeFollowed);
		if (isFollowing) {
			//unfollow
			await Promise.all([
				User.updateOne({ _id: personWhoWantsToFollow }, { $pull: { following: ToBeFollowed } }),
				User.updateOne({ _id: ToBeFollowed }, { $pull: { followers: personWhoWantsToFollow } }),
			])
			return res.status(200).json({
				message: "Unfollowed successfully",
				success: true
			})
		}
		else {
			// follow
			await Promise.all([
				User.updateOne({ _id: personWhoWantsToFollow }, { $push: { following: ToBeFollowed } }),
				User.updateOne({ _id: ToBeFollowed }, { $push: { followers: personWhoWantsToFollow } }),
			])
			return res.status(200).json({
				message: "followed successfully",
				success: true
			})
		}
	}
	catch (error) {
		console.log(error);
	}
};


