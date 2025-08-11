import React, { useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { MyContext } from '../App'; // Assuming MyContext is exported from App.jsx
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../utils/api';

const Register = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: ''
    })

    const context = useContext(MyContext);
    const history = useNavigate();



    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }

    const forgotPassword = () => {

        if (formFields.email === "") {
            context.openAlertBox('error', 'Please enter email id');
            return false;
        }
        else {
            context.openAlertBox('success', `OTP send to ${formFields.email}`)
            localStorage.setItem("userEmail", formFields.email)
            localStorage.setItem("actionType", 'forgot-password')

            postData("/api/user/forgot-password", {
                email: localStorage.getItem("userEmail"),
            }).then((res) => {
                if (res?.error === false) {
                    context.openAlertBox("success", res?.message);
                    history('/verify');
                } else {
                    context.openAlertBox("error", res?.message);
                }
            })


        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if (formFields.email.trim() === "") {
            context.openAlertBox("error", "Please enter email id!");
            setIsLoading(false);
            return;
        }

        if (formFields.password.trim() === "") {
            context.openAlertBox("error", "Please add password!");
            setIsLoading(false);
            return;
        }
        postData("/api/user/login", formFields).then((res) => {
            if (res?.error !== true) {
                setIsLoading(false);
                context.openAlertBox("success", res?.message);
                // localStorage.setItem("userEmail",formFields.email)
                setFormFields({
                    name: "",
                    email: "",
                    password: ""
                })

                localStorage.setItem("accesstoken", res?.data?.accesstoken);
                localStorage.setItem("refreshToken", res?.data?.refreshToken);

                history("/")
                context.setIsLogin(true)
            } else {
                context.openAlertBox("error", res?.message);
                setIsLoading(false);
            }
        })
    }

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10'>
                    <h3 className='text-center text-[18px] text-black'>Log in to your account</h3>

                    <form className='w-full mt-5' onSubmit={handleSubmit}>
                        <div className='from-group w-full mb-5'>
                            <TextField
                                type='email'
                                id="email"
                                label="Email Id"
                                variant="outlined"
                                className='w-full'
                                name="email"
                                value={formFields.email}
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='from-group w-full mb-5 relative'>
                            <TextField
                                type={isShowPassword === false ? 'password' : 'text'}
                                id="password"
                                label="Password"
                                variant="outlined"
                                className='w-full'
                                name="password"
                                value={formFields.password}
                                onChange={onChangeInput}
                            />
                            <Button className='!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black ' onClick={() => setIsShowPassword(!isShowPassword)}>

                                {
                                    isShowPassword === false ? <IoIosEyeOff className='text-[19px] opacity-75' /> : <IoMdEye className='text-[19px] opacity-75' />
                                }

                            </Button>
                        </div>

                        <a className='link cursor-pointer text-[14px] font-[600]' onClick={forgotPassword}>Forgot Password?</a>

                        <div className='flex items-center w-full my-3'>
                            <Button type="submit" className='btn-Org w-full !text-[16px] !p-[5px] gap-3'>
                                {
                                    isLoading === true ? <CircularProgress color="inherit" /> : 'Login'
                                }
                            </Button>
                        </div>

                        <p className='text-center'>Not Registered? <Link className='link text-[14px] font-[600]' to="/register">Sign Up</Link></p>

                        <p className='text-center font-[500]'>Or continue with social account</p>

                        <Button className='flex gap-3 w-full !bg-[#f1f1f1] !text-[16px] !p-[5px] !mt-3 !text-black'><FcGoogle className='text-[25px]' /> Login In With Google</Button>
                    </form>

                </div>

            </div>
        </section>
    );
}

export default Register;
