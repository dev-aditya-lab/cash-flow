export const OTP_EMAIL_TEMPLATE = (
	otp: string,
	timestamp: string,
	ipAddress: string,
	deviceInfo: string,
	location: string,
	confirmEmailUrl: string,
	unsubscribeUrl = '#',
): string => {
	// ── Style shorthands (DRY) ─────────────────────────────────────────────
	const F  = `font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
	const FM = `font-family:'JetBrains Mono','Courier New',monospace`;
	const year = new Date().getFullYear();

	// ── Request detail rows ────────────────────────────────────────────────
	const rowDivider = `<tr><td colspan="2" style="height:1px;background-color:#f0f0f0;font-size:1px;line-height:1px;">&nbsp;</td></tr>`;
	const infoRows: { label: string; value: string; mono?: boolean }[] = [
		{ label: 'Time',       value: timestamp  },
		...(ipAddress ? [{ label: 'IP Address', value: ipAddress, mono: true }] : []),
		{ label: 'Device',     value: deviceInfo },
		{ label: 'Location',   value: location   },
	];
	const rows = infoRows
		.map(
			({ label, value, mono }) => `
      <tr>
        <td style="padding:9px 0;${F};font-size:13px;color:#909090;width:110px;">${label}</td>
        <td style="padding:9px 0;${mono ? FM : F};font-size:13px;color:#1c1c1c;text-align:right;">${value}</td>
      </tr>`,
		)
		.join(rowDivider);

	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>CashFlow &mdash; Verify Your Account</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@600;700&display=swap');
    body,table,td{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
    body{margin:0;padding:0;}
    table{border-spacing:0;border-collapse:collapse;}
    td{padding:0;}
    img{border:0;display:block;}
    a{text-decoration:none;}
    @media only screen and (max-width:600px){
      .wrapper{width:100%!important;}
      .mobile-pad{padding-left:24px!important;padding-right:24px!important;}
      .otp-cell{font-size:36px!important;letter-spacing:6px!important;padding:22px 16px!important;}
      .nav-btn{display:none!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;">

  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${otp} is your CashFlow verification code &mdash; valid for 10 minutes.
    &#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 16px 52px;">
        <table role="presentation" class="wrapper" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- ══════════════════════════════════════════
               MAIN CARD
          ══════════════════════════════════════════ -->
          <tr>
            <td style="background-color:#ffffff;border-radius:12px;border:1px solid #e4e4e4;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                <!-- Card nav: brand name + Go to CashFlow button -->
                <tr>
                  <td class="mobile-pad" style="padding:20px 28px;border-bottom:1px solid #f0f0f0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="${F};font-size:17px;font-weight:700;color:#1c1c1c;letter-spacing:-0.3px;">
                          Cash<span style="color:#10b981;">Flow</span>
                        </td>
                        <td valign="middle" align="right" class="nav-btn">
                          <table role="presentation" cellpadding="0" cellspacing="0" style="border:1.5px solid #d8d8d8;border-radius:7px;">
                            <tr>
                              <td style="padding:7px 15px;">
                                <a href="https://cashflow.devaditya.dev" style="${F};font-size:13px;font-weight:500;color:#1c1c1c;text-decoration:none;">
                                  Go to CashFlow
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Card body -->
                <tr>
                  <td class="mobile-pad" style="padding:40px 28px 38px;">

                    <!-- Heading -->
                    <p style="margin:0 0 14px;${F};font-size:28px;font-weight:700;color:#1c1c1c;line-height:1.2;letter-spacing:-0.5px;">
                      Complete your verification
                    </p>
                    <p style="margin:0 0 28px;${F};font-size:15px;color:#5c5c5c;line-height:1.65;">
                      Please enter this confirmation code in the window where
                      you started creating your account:
                    </p>

                    <!-- OTP box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td class="otp-cell" align="center"
                            style="padding:26px 20px;background-color:#f5f5f5;border-radius:8px;${FM};font-size:44px;font-weight:700;letter-spacing:10px;color:#1c1c1c;">
                          ${otp}
                        </td>
                      </tr>
                    </table>

                    <!-- Mobile hint -->
                    <p style="margin:0 0 20px;${F};font-size:14px;color:#5c5c5c;line-height:1.65;">
                      From your mobile device, use the code above to confirm your identity.
                      It expires in <strong style="color:#1c1c1c;">10 minutes</strong>.
                    </p>

                    <!-- CTA label -->
                    <p style="margin:0 0 14px;${F};font-size:14px;font-weight:600;color:#1c1c1c;">
                      Or click this button to confirm your email:
                    </p>

                    <!-- Primary CTA button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="background-color:#10b981;border-radius:7px;padding:14px 32px;">
                          <a href="${confirmEmailUrl}"
                             style="${F};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                            Confirm your email
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Ignore note -->
                    <p style="margin:0;${F};font-size:13px;color:#909090;line-height:1.7;">
                      If you didn&rsquo;t create an account with CashFlow, you can safely ignore
                      this email. The code will expire automatically and no action is needed.
                    </p>

                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ══════════════════════════════════════════
               REQUEST DETAILS CARD
          ══════════════════════════════════════════ -->
          <tr>
            <td style="padding-top:10px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="background-color:#ffffff;border-radius:10px;border:1px solid #e4e4e4;">

                <!-- Section label -->
                <tr>
                  <td class="mobile-pad" style="padding:14px 24px;border-bottom:1px solid #f0f0f0;">
                    <p style="margin:0;${F};font-size:11px;font-weight:700;color:#aaaaaa;text-transform:uppercase;letter-spacing:1.3px;">
                      Request Information
                    </p>
                  </td>
                </tr>

                <!-- Detail rows -->
                <tr>
                  <td class="mobile-pad" style="padding:6px 24px 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${rows}
                    </table>
                  </td>
                </tr>

                <!-- Security line -->
                <tr>
                  <td class="mobile-pad" style="padding:0 24px 18px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="height:1px;background-color:#f0f0f0;font-size:1px;line-height:1px;">&nbsp;</td></tr>
                    </table>
                    <p style="margin:12px 0 0;${F};font-size:12px;color:#aaaaaa;line-height:1.7;">
                      Never share this code with anyone. CashFlow will never call, text, or email
                      you to ask for this code.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ══════════════════════════════════════════
               FOOTER
          ══════════════════════════════════════════ -->
          <tr>
            <td align="center" style="padding:28px 20px 0;">
              <p style="margin:0 0 12px;${F};font-size:12px;color:#aaaaaa;line-height:1.65;text-align:center;">
                You received this notification because you signed up for a
                <a href="https://cashflow.devaditya.dev" style="color:#aaaaaa;text-decoration:underline;">CashFlow</a>
                account &mdash; endless personal finance management.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://cashflow.devaditya.dev/privacy"
                       style="${F};font-size:11px;color:#aaaaaa;text-decoration:underline;">Privacy Policy</a>
                  </td>
                  <td style="${F};font-size:11px;color:#cccccc;">&middot;</td>
                  <td style="padding:0 8px;">
                    <a href="https://cashflow.devaditya.dev/terms"
                       style="${F};font-size:11px;color:#aaaaaa;text-decoration:underline;">Terms of Service</a>
                  </td>
                  <td style="${F};font-size:11px;color:#cccccc;">&middot;</td>
                  <td style="padding:0 8px;">
                    <a href="${unsubscribeUrl}"
                       style="${F};font-size:11px;color:#aaaaaa;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>

              <p style="margin:12px 0 0;${F};font-size:11px;color:#cccccc;">
                &copy; ${year} CashFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};
