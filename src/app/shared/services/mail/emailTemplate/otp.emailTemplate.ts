export const OTP_EMAIL_TEMPLATE = (otp: string, timestamp: string, ipAddress: string, deviceInfo: string, location: string) => {
	return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>CashFlow - Verification Code</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&display=swap');
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; display: block; }
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; }
      .mobile-pad { padding-left: 24px !important; padding-right: 24px !important; }
      .otp-td { width: 54px !important; height: 64px !important; font-size: 28px !important; }
      .otp-gap { width: 8px !important; }
      .hide-mobile { display: none !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">

  <!-- Preview text -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${otp} is your CashFlow verification code. Valid for 10 minutes.
    &#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;
  </div>

  <!-- Full-width background wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 16px 60px;">

        <!-- 520px container -->
        <table role="presentation" class="wrapper" width="520" cellpadding="0" cellspacing="0" style="max-width:520px; width:100%;">

          <!-- ── LOGO ── -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#10b981; border-radius:8px;">
                      <tr>
                        <td style="width:32px; height:32px; text-align:center; line-height:32px; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:16px; font-weight:700; color:#ffffff;">
                          C
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" style="font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:20px; font-weight:700; color:#18181b; letter-spacing:-0.3px;">
                    Cash<span style="color:#10b981;">Flow</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── MAIN CARD ── -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e4e4e7;">

                <!-- Top accent -->
                <tr>
                  <td style="height:4px; background-color:#10b981; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding:48px 40px 0;" class="mobile-pad">
                    <!-- Icon -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="width:56px; height:56px; text-align:center; line-height:56px; background-color:#ecfdf5; border-radius:50%; font-size:24px;">
                          &#128274;
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:22px; font-weight:700; color:#18181b; line-height:1.3;">
                      Verification Code
                    </p>
                    <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:15px; color:#71717a; line-height:1.5;">
                      Enter this code to verify your identity
                    </p>
                  </td>
                </tr>

                <!-- ── OTP DIGITS ── -->
                <tr>
                  <td align="center" style="padding:32px 40px 36px;" class="mobile-pad">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- D1 -->
                        <td class="otp-td" style="width:64px; height:76px; text-align:center; vertical-align:middle; font-family:'JetBrains Mono','Courier New',monospace; font-size:34px; padding:0 10px; font-weight:700; color:#10b981; background-color:#f9fafb; border:2px solid #e4e4e7; border-radius:50px;">
                          ${otp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Timer badge -->
                <tr>
                  <td align="center" style="padding:0 40px;" class="mobile-pad">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5; border-radius:100px;">
                      <tr>
                        <td style="padding:8px 20px; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:13px; font-weight:600; color:#059669; text-align:center;">
                          &#9201; Code expires in 10 minutes
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:32px 40px 0;" class="mobile-pad">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="height:1px; background-color:#f4f4f5; font-size:1px; line-height:1px;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>

                <!-- Security notice -->
                <tr>
                  <td style="padding:24px 40px 40px;" class="mobile-pad">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa; border-radius:10px; border:1px solid #f4f4f5;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 6px; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:13px; font-weight:600; color:#3f3f46;">
                            &#128737;&#65039; Security Notice
                          </p>
                          <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#71717a; line-height:1.65;">
                            Never share this code with anyone. CashFlow will never call, text, or email you asking for this code. If you didn't make this request, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ── REQUEST DETAILS CARD ── -->
          <tr>
            <td style="padding-top:16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; border:1px solid #e4e4e7;">
                <tr>
                  <td style="padding:16px 24px 6px;" class="mobile-pad">
                    <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; font-weight:600; color:#a1a1aa; text-transform:uppercase; letter-spacing:1px;">
                      Request Info
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 24px 0;" class="mobile-pad">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="height:1px; background-color:#f4f4f5; font-size:1px; line-height:1px;">&nbsp;</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 24px 16px;" class="mobile-pad">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#a1a1aa;">Time</td>
                        <td align="right" style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#52525b;">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#a1a1aa;">IP Address</td>
                        <td align="right" style="padding:6px 0; font-family:'JetBrains Mono','Courier New',monospace; font-size:12px; color:#52525b;">${ipAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#a1a1aa;">Device</td>
                        <td align="right" style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#52525b;">${deviceInfo}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#a1a1aa;">Location</td>
                        <td align="right" style="padding:6px 0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#52525b;">${location}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── HELP LINK ── -->
          <tr>
            <td align="center" style="padding:28px 20px 0;">
              <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:13px; color:#a1a1aa; line-height:1.6;">
                Having trouble? <a href="mailto:contact-cashflow@devaditya.dev" style="color:#10b981; text-decoration:none; font-weight:500;">Contact Support</a>
              </p>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:32px 20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px; background-color:#e4e4e7; font-size:1px; line-height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px 20px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:6px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#10b981; border-radius:5px;">
                      <tr>
                        <td style="width:20px; height:20px; text-align:center; line-height:20px; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; font-weight:700; color:#ffffff;">
                          C
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" style="font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:14px; font-weight:600; color:#52525b; letter-spacing:-0.2px;">
                    Cash<span style="color:#10b981;">Flow</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 20px 0;">
              <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:12px; color:#a1a1aa; line-height:1.6;">
                <a href="https://cashflow.devaditya.dev" style="color:#71717a; text-decoration:none;">cashflow.devaditya.dev</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:12px 20px 0;">
              <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; color:#d4d4d8; line-height:1.6;">
                You received this email because a verification was requested for your account.
                <br />This is an automated message &mdash; please do not reply.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 20px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://cashflow.devaditya.dev/privacy" style="font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; color:#a1a1aa; text-decoration:underline;">Privacy</a>
                  </td>
                  <td style="color:#d4d4d8; font-size:11px;">&#183;</td>
                  <td style="padding:0 8px;">
                    <a href="https://cashflow.devaditya.dev/terms" style="font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; color:#a1a1aa; text-decoration:underline;">Terms</a>
                  </td>
                  <td style="color:#d4d4d8; font-size:11px;">&#183;</td>
                  <td style="padding:0 8px;">
                    <a href="{{UNSUBSCRIBE_URL}}" style="font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:11px; color:#a1a1aa; text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 20px 0;">
              <p style="margin:0; font-family:'DM Sans',Helvetica,Arial,sans-serif; font-size:10px; color:#d4d4d8;">
                &copy; {{YEAR}} CashFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /container -->

      </td>
    </tr>
  </table>

</body>
</html>
        `;
};
