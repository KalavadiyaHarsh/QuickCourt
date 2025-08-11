import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress } from '@mui/material';
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';

const ForgotPassword = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPassword2, setIsShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: localStorage.getItem("userEmail") || "",
    newPassword: '',
    confirmPassword: ''
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple client-side validation
    if (!formFields.newPassword.trim()) {
      context.openAlertBox("error", "Please enter New Password!");
      setIsLoading(false);
      return;
    }

    if (!formFields.confirmPassword.trim()) {
      context.openAlertBox("error", "Please enter Confirm Password!");
      setIsLoading(false);
      return;
    }

    if (formFields.confirmPassword !== formFields.newPassword) {
      context.openAlertBox("error", "New Password and Confirm Password do not match!");
      setIsLoading(false);
      return;
    }

    // Simulated password change (no backend)
    setTimeout(() => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("actionType");
      context.openAlertBox("success", "Password changed successfully!");
      setIsLoading(false);
      history("/login");
    }, 1000);
  };

  return (
    <section className='section py-10'>
      <div className='container'>
        <div className='card shadow-md w-[400px] m-auto rounded-md bg-white p-5 px-10'>
          <h3 className='text-center text-[18px] text-black font-bold'>Reset your password</h3>

          <form className='w-full mt-5' onSubmit={handleSubmit}>
            {/* New Password Field */}
            <div className='from-group w-full mb-5 relative'>
              <TextField
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                label="New Password"
                variant="outlined"
                className='w-full'
                name="newPassword"
                value={formFields.newPassword}
                onChange={onChangeInput}
              />
              <Button
                type="button"
                className='!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black'
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? <IoMdEye className='text-[19px] opacity-75' /> : <IoIosEyeOff className='text-[19px] opacity-75' />}
              </Button>
            </div>

            {/* Confirm Password Field */}
            <div className='from-group w-full mb-5 relative'>
              <TextField
                type={isShowPassword2 ? 'text' : 'password'}
                id="confirm_password"
                label="Confirm Password"
                variant="outlined"
                className='w-full'
                name="confirmPassword"
                value={formFields.confirmPassword}
                onChange={onChangeInput}
              />
              <Button
                type="button"
                className='!absolute top-[10px] right-[10px] z-50 !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-black'
                onClick={() => setIsShowPassword2(!isShowPassword2)}
              >
                {isShowPassword2 ? <IoMdEye className='text-[19px] opacity-75' /> : <IoIosEyeOff className='text-[19px] opacity-75' />}
              </Button>
            </div>

            <div className='flex items-center w-full my-3'>
              <Button type='submit' className='btn-Org w-full !text-[16px] !p-[5px]'>
                {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
