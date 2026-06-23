import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'ReviewPilot <noreply@veridexa.cloud>'

export async function sendOTPEmail({ to, otp, purpose }) {
  const isReset   = purpose === 'password-reset'
  const subject   = isReset ? 'Reset Your ReviewPilot Password' : 'Verify Your ReviewPilot Account'
  const heading   = isReset ? 'Password Reset OTP' : 'Email Verification OTP'
  const bodyLine  = isReset
    ? 'Use the OTP below to reset your password.'
    : 'Use the OTP below to verify your email address.'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
                   style="background:#fff;border-radius:12px;overflow:hidden;
                          box-shadow:0 1px 4px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#2563EB;padding:28px 32px;">
                  <p style="margin:0;color:#fff;font-size:22px;font-weight:bold;
                             letter-spacing:-0.5px;">ReviewPilot</p>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
                    AI review suggestions for local businesses
                  </p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#111;">
                    ${heading}
                  </p>
                  <p style="margin:0 0 28px;font-size:14px;color:#555;line-height:1.6;">
                    ${bodyLine}
                  </p>
                  <!-- OTP Box -->
                  <div style="background:#EFF6FF;border:2px solid #2563EB;border-radius:10px;
                              padding:24px;text-align:center;margin-bottom:28px;">
                    <p style="margin:0 0 6px;font-size:12px;color:#666;letter-spacing:1px;
                                text-transform:uppercase;">Your OTP</p>
                    <p style="margin:0;font-size:40px;font-weight:700;color:#2563EB;
                                letter-spacing:10px;font-family:monospace;">${otp}</p>
                    <p style="margin:10px 0 0;font-size:12px;color:#888;">
                      Valid for <strong>10 minutes</strong>
                    </p>
                  </div>
                  <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                    If you did not request this, you can safely ignore this email.
                    Do not share this OTP with anyone.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #eee;">
                  <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                    © ${new Date().getFullYear()} ReviewPilot · veridexa.cloud
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  await resend.emails.send({ from: FROM, to, subject, html })
}
