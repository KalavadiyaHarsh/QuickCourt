import React, { useContext, useState } from 'react';
import OtpBox from '../components/OtpBox';
import { Button } from '@mui/material';
import { postData } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';

const Verify = () => {

    const [otp, setOtp] = useState('');
    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const context = useContext(MyContext)
    const history = useNavigate();

    const verifyOTP = (e) => {
        e.preventDefault();

        const actionType = localStorage.getItem("actionType")

        if(actionType !== 'forgot-password'){
            // Regular email verification
             postData("/api/auth/verify-email",{
                 email:localStorage.getItem("userEmail"),
                 otp:otp
             }).then((res)=>{
                 if(res?.success === true){
                     context.openAlertBox("success", res?.message);
                     
                     // Store user data and tokens
                     if (res.data?.user && res.data?.accessToken) {
                         localStorage.setItem("accessToken", res.data.accessToken);
                         localStorage.setItem("refreshToken", res.data.refreshToken);
                         localStorage.setItem("userData", JSON.stringify(res.data.user));
                         
                         // Update context with user data
                         context.setUserData && context.setUserData(res.data.user);
                         context.setIsLogin && context.setIsLogin(true);
                     }
                     
                     localStorage.removeItem("userEmail")
                     history("/")
                 }else{
                     context.openAlertBox("error", res?.message || "Verification failed");
                 }
             }).catch((error) => {
                 console.error("Verification error:", error);
                 context.openAlertBox("error", "An error occurred during verification");
             })
        }
        else{
            // Forgot password verification - use the same endpoint for now
            // TODO: Implement proper forgot password verification endpoint
             postData("/api/auth/verify-email",{
                 email:localStorage.getItem("userEmail"),
                 otp:otp
             }).then((res)=>{
                 if(res?.success === true){
                     context.openAlertBox("success", "OTP verified successfully! You can now reset your password.");
                     history("/forgot-password")
                 }else{
                     context.openAlertBox("error", res?.message || "Verification failed");
                 }
             }).catch((error) => {
                 console.error("Verification error:", error);
                 context.openAlertBox("error", "An error occurred during verification");
             })
        }

    }

    return (
        <section className='section py-10'>
            <div className='container'>
                <div className='card shadow-md w-[405px] m-auto rounded-md bg-white p-5 px-10'>
                    <div className='text-center flex justify-center items-center '>
                        <img src="verify.png" alt="" width='80' />
                    </div>
                    <h3 className='text-center text-[18px] text-black my-4 mb-1'>Verify OTP</h3>

                    <p className='text-center mt-0 mb-4'>
                        OTP send to 
                        <span className='text-primary font-bold'> {localStorage.getItem("userEmail")}</span>
                    </p>

                    <form onSubmit={verifyOTP}>
                        <OtpBox length={6} onChange={handleOtpChange} />

                        <div className='flex justify-center items-center px-3'>
                            <Button type='submit' className='btn-Org w-full !mt-4'>Verify OTP</Button>
                        </div>

                    </form>



                </div>

            </div>
        </section>
    );
}

export default Verify;


