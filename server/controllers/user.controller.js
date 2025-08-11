import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from '../config/sendEmail.js';
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";



cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
    secure: true
});


export async function registerUserController(req, res) {
    try {
        let user;
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'provide email, name, password',
                error: true,
                success: false
            })
        }

        user = await UserModel.findOne({ email: email });

        if (user) {
            return res.json({
                message: 'User already Registered withn this Email',
                error: true,
                success: false
            })
        }


        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);


        user = new UserModel({
            email: email,
            password: hashPassword,
            name: name,
            otp: verifyCode,
            otpExpires: Date.now() + 600000
        })

        await user.save();

        await sendEmailFun(
            email, // sendTo
            "Verify email from Ecommerce App", // subject
            "", // plain text fallback (optional)
            VerificationEmail(name, verifyCode) // correct usage
        );

        // await sendEmailFun({
        //     sendTo: email,
        //     subject: "Verify email from Ecoomerce App",
        //     text: "",
        //     html: VerificationEmail(name, verifyCode)
        // })

        const token = jwt.sign(
            {
                email: user.email,
                id: user.id
            },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        return res.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully! Please verify your email.",
            token: token,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}


export async function verifyEmailController(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({ error: true, success: false, message: "User not found" });

        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(200).json({
                error: false,
                success: true,
                message: "Email verified successfully"
            });
        }
        else if (!isCodeValid) {
            return res.status(400).json({ error: true, success: false, message: "Invalid OTP" });

        }
        else {
            return res.status(400).json({ error: true, success: false, message: "OTP Expired" });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}


export async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                message: "User not register",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact to admin",
                error: true,
                success: false
            })
        }

        if (user.verify_email !== true) {
            return res.status(400).json({
                message: "Your Email not verify yet plaese verify your email first",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        // const updateUser = await UserModel.findByIdAndDelete(user?._id, {
        //     last_login_date: new Date()
        // })

        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        });

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accesstoken', accesstoken, cookiesOption);
        res.cookie('refreshToken', refreshToken, cookiesOption);


        return res.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}


export async function logoutController(req, res) {
    try {
        const userid = req.userId

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.clearCookie("accesstoken", cookiesOption)
        res.clearCookie("refreshToken", cookiesOption)

        // const removeRefreshToken = await UserModel.findByIdAndDelete(userid, {
        //     refresh_token: ""
        // })

        await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        });

        return res.json({
            message: "Logout successfully",
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// Image upload
var imagesArr = [];
export async function userAvatarController(req, res) {
    try {
        imagesArr = [];

        const userId = req.userId;
        const image = req.files;

        const user = await UserModel.findOne({ _id: userId })

        if (!user) {
            return response.status(400).json({ error: true, success: false, message: "User not found" });

        }


        //remove old image from cloudinary or first remove image from cloudinary
        const imageUrl = user.avatar;
        const urlArr = imageUrl.split("/");  //urlSegments 
        const avatar_image = urlArr[urlArr.length - 1];  //filenameWithExtension
        const imageName = avatar_image.split(".")[0];

        if (imageName) {
            await cloudinary.uploader.destroy(imageName);
        }



        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (let i = 0; i < image?.length; i++) {

            // const img = await cloudinary.uploader.upload(
            //     image[i].path,
            //     options,
            //     function(error, result){
            //         imagesArr.push(result.secure_url);
            //         fs.unlinkSync(`uploads/${image[i].filename}`);
            //         console.log(image[i].filename)
            //     }
            // );

            try {
                const result = await cloudinary.uploader.upload(image[i].path, options);
                imagesArr.push(result.secure_url);

                // Delete the local file after successful upload
                fs.unlinkSync(`uploads/${image[i].filename}`);
                console.log(`Deleted: ${image[i].filename}`);
            } catch (error) {
                console.error(`Error uploading ${image[i].filename}:`, error);
            }
        }

        user.avatar = imagesArr[0];
        await user.save();

        return res.status(200).json({
            _id: userId,
            avatar: imagesArr[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// export async function removeImageFromCloudinary(req,res) {
//     const imgUrl = req.query.img;

//     const urlArr = imgUrl.split("/");
//     const image = urlArr[urlArr.length - 1];

//     const imageName = image.split(".")[0];

//     if(imageName){
//         const resu = await cloudinary.uploader.destroy(
//             imageName,
//             (error, result) => {

//             }
//         );

//         if(resu)
//         {
//             res.status(200).send(resu);
//         }
//     }
// }

export async function removeImageFromCloudinary(req, res) {
    try {
        const imageUrl = req.query.img;

        if (!imageUrl) {
            return res.status(400).json({ error: "Image URL is required" });
        }

        const urlArr = imageUrl.split("/");  //urlSegments 
        const image = urlArr[urlArr.length - 1];  //filenameWithExtension
        const imageName = image.split(".")[0];

        const cloudinaryresult = await cloudinary.uploader.destroy(imageName);

        if (cloudinaryresult.result === "ok") {
            return res.status(200).json({
                message: "Image deleted successfully",
                data: cloudinaryresult
            });
        } else {
            return res.status(404).json({
                error: "Image not found or already deleted",
                data: cloudinaryresult
            });
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
}


//update user details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const { name, email, mobile, password } = req.body;

        const userExist = await UserModel.findById(userId);

        if (!userExist) {
            return res.status(400).send('The user cannot be Updated!');
        }

        let verifyCode = "";
        let otpExpires = null;

        if (email !== userExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes later
        }

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        } else {
            hashPassword = userExist.password;
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                mobile: mobile,
                email: email,
                verify_email: email !== userExist.email ? false : true,
                password: hashPassword,
                otp: verifyCode || userExist.otp,
                otpExpires: otpExpires || userExist.otpExpires
            },
            { new: true }
        )

        if (email !== userExist.email) {
            await sendEmailFun(
                email, // sendTo
                "Verify email from Ecommerce App", // subject
                "", // plain text fallback (optional)
                VerificationEmail(name, verifyCode) // correct usage
            )
        }

        return res.json({
            message: "User Updated successfully",
            error: false,
            success: true,
            user: updateUser
        })



    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


// forgot password
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        // Generate 6-digit OTP
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const updateUser = await UserModel.findByIdAndUpdate(
            user?._id,
            {
                otp: verifyCode,
                otpExpires: Date.now() + 600000 // 10 minutes
            },
            { new: true }
        );

        // Send email with OTP
        await sendEmailFun(
            email, // sendTo
            "Verify email from Ecommerce App", // subject
            "", // plain text fallback (optional)
            VerificationEmail(user?.name, verifyCode) // correct usage
        )

        // Respond to frontend
        return res.json({
            message: "Check your email",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide required fields: email and otp.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        const currentTime = Date.now();

        if (user.otpExpires < currentTime) {
            return res.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            });
        }

        // Clear OTP after successful verification
        user.otp = "";
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
}


//reset password
export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Provide required fields: email, newPassword, confirmPassword",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "newPassword and confirmPassword must be the same.",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        });

        if (!update) {
            return res.status(500).json({
                message: "Failed to update password",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
}


//refresh-token controler
export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not provided",
                error: true,
                success: false
            });
        }

        let verifyToken;
        try {
            verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired refresh token",
                error: true,
                success: false
            });
        }

        const userId = verifyToken?._id;

        const newAccessToken = generatedAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        res.cookie('accessToken', newAccessToken, cookiesOption);

        return res.json({
            message: "New access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
}



export async function userDetails(req, res) {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: userId not provided",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId).select('-password -refresh_token');

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "User details fetched successfully",
            data: user,
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true,
            success: false
        });
    }
}
