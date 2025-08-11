const VerificationEmail = (username, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #4CAF50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #4CAF50;
      margin: 0;
      font-size: 24px;
    }
    .content {
      text-align: center;
      padding: 0 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 15px 0;
    }
    .otp-container {
      background: #f8f9fa;
      border: 2px dashed #4CAF50;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .otp {
      font-size: 28px;
      font-weight: bold;
      color: #4CAF50;
      letter-spacing: 3px;
      margin: 0;
    }
    .validity {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 10px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏟️ QuickCourt</h1>
      <p style="margin: 10px 0 0 0; color: #666;">Email Verification Required</p>
    </div>
    <div class="content">
      <p><strong>Hello ${username}!</strong></p>
      <p>Welcome to QuickCourt! To complete your registration and start booking sports venues, please verify your email address using the OTP below:</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
        <div class="validity">Valid for 10 minutes</div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important:</strong> This OTP is confidential. Do not share it with anyone.
      </div>
      
      <p>If you didn't create an account with QuickCourt, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 QuickCourt. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
};

module.exports = VerificationEmail;