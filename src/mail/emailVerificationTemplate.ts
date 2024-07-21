export const emailVerificationTemplate = (email: string, token: string) => {
  return (
    `<html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

      <div style="padding: 20px;">
        <h2 style="color: #333333;">Verify Your Email!</h2>
        <p style="color: #666666;">Please click the button below to verify your email address.</p>
        <a href="${process.env.BASE_URL_FRONT_END}/verify?token=${token}" target="_blank" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p style="color: #666666;">Clicking the button will open a new tab where you can complete a verified sign-in. Thank you!</p>
        <p style="color: #666666;">If you did not create an account, please ignore this email.</p>
      </div>
    </div>
    </body>
    </html>`
  )
}