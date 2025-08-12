import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { postData } from '../utils/api';
import { MyContext } from '../App';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "user"
    })

    const context = useContext(MyContext)
    const history = useNavigate();

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (password.length === 0) return { strength: 'none', color: 'text-gray-400', text: '' };
        if (password.length < 6) return { strength: 'weak', color: 'text-red-500', text: 'Too short' };
        if (password.length >= 6 && password.length < 8) return { strength: 'weak', color: 'text-red-500', text: 'Weak' };
        if (password.length >= 8 && password.length < 10) return { strength: 'medium', color: 'text-yellow-500', text: 'Medium' };
        if (password.length >= 10) return { strength: 'strong', color: 'text-green-500', text: 'Strong' };
        return { strength: 'weak', color: 'text-red-500', text: 'Weak' };
    };

    const passwordStrength = getPasswordStrength(formFields.password);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }

    //  const valideValue = Object.values(formFields).every(el => el)

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if (formFields.fullName.trim() === "") {
            context.openAlertBox("error", "Please enter full name!");
            setIsLoading(false);
            return;
        }

        if (formFields.fullName.trim().length < 2) {
            context.openAlertBox("error", "Full name must be at least 2 characters long!");
            setIsLoading(false);
            return;
        }

        if (formFields.email.trim() === "") {
            context.openAlertBox("error", "Please enter email id!");
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formFields.email)) {
            context.openAlertBox("error", "Please enter a valid email address!");
            setIsLoading(false);
            return;
        }

        if (formFields.password.trim() === "") {
            context.openAlertBox("error", "Please add password!");
            setIsLoading(false);
            return;
        }

        if (formFields.password.length < 6) {
            context.openAlertBox("error", "Password must be at least 6 characters long!");
            setIsLoading(false);
            return;
        }

        if (formFields.password.length > 50) {
            context.openAlertBox("error", "Password must be less than 50 characters!");
            setIsLoading(false);
            return;
        }

        // Password strength validation
        if (!/(?=.*[a-zA-Z])/.test(formFields.password)) {
            context.openAlertBox("error", "Password must contain at least one letter!");
            setIsLoading(false);
            return;
        }

        if (!/(?=.*\d)/.test(formFields.password)) {
            context.openAlertBox("error", "Password must contain at least one number!");
            setIsLoading(false);
            return;
        }
        postData("/api/auth/register", formFields).then((res) => {
            if (res?.success === true) {
                setIsLoading(false);
                context.openAlertBox("success", res?.message);
                localStorage.setItem("userEmail", formFields.email)
                setFormFields({
                    fullName: "",
                    email: "",
                    password: "",
                    role: "user"
                })
                history("/verify")
            } else {
                context.openAlertBox("error", res?.message || "Registration failed");
                setIsLoading(false);
            }
        }).catch((error) => {
            console.error("Registration error:", error);
            context.openAlertBox("error", "An error occurred during registration");
            setIsLoading(false);
        })
    }

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10'>
                    <h3 className='text-center text-[18px] text-black font-[600]'>Create your account</h3>

                    <form className='w-full mt-5' onSubmit={handleSubmit}>

                        <div className='from-group w-full mb-5'>
                            <TextField type='text' id="name" name='fullName' value={formFields.fullName} label="Full Name" variant="outlined" className='w-full' onChange={onChangeInput} />
                        </div>


                        <div className='from-group w-full mb-5'>
                            <TextField type='email' id="email" name='email' value={formFields.email} label="Email Id" variant="outlined" className='w-full' onChange={onChangeInput} />
                        </div>

                        <div className='from-group w-full mb-5 relative'>
                            <TextField type={isShowPassword ? 'text' : 'password'} id="password" label="Password" name='password' value={formFields.password} variant="outlined" className='w-full' onChange={onChangeInput} />
                            <Button
                                className='!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black'
                                onClick={() => setIsShowPassword(!isShowPassword)}
                            >
                                {isShowPassword ? <IoMdEye className='text-[19px] opacity-75' /> : <IoIosEyeOff className='text-[19px] opacity-75' />}
                            </Button>
                            <p className="text-xs text-gray-500 mt-1">
                                Password must be at least 6 characters with letters and numbers
                            </p>
                            {formFields.password.length > 0 && (
                                <p className={`text-xs mt-1 ${passwordStrength.color}`}>
                                    Strength: {passwordStrength.text}
                                </p>
                            )}
                        </div>

                        <div className='from-group w-full mb-5'>
                            <TextField
                                select
                                id="role"
                                name='role'
                                value={formFields.role}
                                label="Role"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            >
                                <option value="user">User</option>
                                <option value="facility_owner">Facility Owner</option>
                            </TextField>
                        </div>

                        <div className='flex items-center w-full my-3'>
                            <Button type="submit" className='btn-Org w-full !text-[16px] !p-[5px] gap-3'>
                                {
                                    isLoading === true ? <CircularProgress color="inherit" /> : 'Sign Up'
                                }
                            </Button>
                        </div>

                        <p className='text-center'>Already have an account? <Link className='link text-[14px] font-[600]' to="/login">Login</Link></p>

                        <p className='text-center font-[500]'>Or continue with social account</p>

                        <Button className='flex gap-3 w-full !bg-[#f1f1f1] !text-[16px] !p-[5px] !mt-3 !text-black'>
                            <FcGoogle className='text-[25px]' />
                            Sign Up With Google
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
