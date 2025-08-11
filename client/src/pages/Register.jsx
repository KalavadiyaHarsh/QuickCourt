import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import CircularProgress from '@mui/material/CircularProgress';

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Just log data instead of backend call
        console.log("SignUp Data:", formFields);

        setTimeout(() => {
            setIsLoading(false);
            alert("Sign up simulated! (No backend connected)");
            setFormFields({ name: "", email: "", password: "" });
        }, 1000);
    };

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10'>
                    <h3 className='text-center text-[18px] text-black font-[600]'>Create your account</h3>

                    <form className='w-full mt-5' onSubmit={handleSubmit}>
                        <div className='from-group w-full mb-5'>
                            <TextField
                                type='text'
                                id="name"
                                name='name'
                                value={formFields.name}
                                label="Full Name"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='from-group w-full mb-5'>
                            <TextField
                                type='email'
                                id="email"
                                name='email'
                                value={formFields.email}
                                label="Email Id"
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='from-group w-full mb-5 relative'>
                            <TextField
                                type={isShowPassword ? 'text' : 'password'}
                                id="password"
                                label="Password"
                                name='password'
                                value={formFields.password}
                                variant="outlined"
                                className='w-full'
                                onChange={onChangeInput}
                            />
                            <Button
                                className='!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black'
                                onClick={() => setIsShowPassword(!isShowPassword)}
                                type="button"
                            >
                                {isShowPassword
                                    ? <IoMdEye className='text-[19px] opacity-75' />
                                    : <IoIosEyeOff className='text-[19px] opacity-75' />
                                }
                            </Button>
                        </div>

                        <div className='flex items-center w-full my-3'>
                            <Button type="submit" className='btn-Org w-full !text-[16px] !p-[5px] gap-3'>
                                {isLoading ? <CircularProgress color="inherit" /> : 'Sign Up'}
                            </Button>
                        </div>

                        <p className='text-center'>
                            Already have an account?{" "}
                            <Link className='link text-[14px] font-[600]' to="/login">
                                Login
                            </Link>
                        </p>

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
