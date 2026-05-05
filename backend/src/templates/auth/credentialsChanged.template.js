const CREDENTIAL_COPY = {
  email: {
    eyebrow: "Email Updated",
    heading: "Your email was changed",
    intro: "The email address on your Roomify account has just been updated. From now on, use the address below to sign in.",
    detailLabel: "New sign-in email",
    icon: "✉️",
  },
  password: {
    eyebrow: "Password Updated",
    heading: "Your password was changed",
    intro: "The password on your Roomify account has just been updated. You'll need to use your new password the next time you sign in.",
    detailLabel: null,
    icon: "🔒",
  },
};

export const credentialsChangedEmailTemplate = ({ firstName, type, newEmail }) => {
  const copy = CREDENTIAL_COPY[type];
  const timestamp = new Date().toUTCString();

  const detailBlock =
    type === "email" && newEmail
      ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f8fd;border-radius:10px;margin-bottom:24px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#2297ce;letter-spacing:1.5px;text-transform:uppercase;">${copy.detailLabel}</p>
                      <p style="margin:0;font-size:16px;font-weight:600;color:#262626;word-break:break-all;">${newEmail}</p>
                    </td>
                  </tr>
                </table>`
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${copy.heading} — Roomify</title>
  </head>
  <body style="margin:0;padding:0;background-color:#eef2f5;font-family:Inter,'Helvetica Neue',Arial,sans-serif;color:#262626;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f5;padding:48px 0;">
      <tr>
        <td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#2297ce;padding:24px 36px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img
                        src="cid:roomify-logo"
                        alt="Roomify"
                        width="64"
                        height="64"
                        style="display:block;border-radius:10px;"
                      />
                    </td>
                    <td style="vertical-align:middle;padding-left:10px;">
                      <span style="font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1;">Roomify</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero Banner -->
            <tr>
              <td style="background-color:#2297ce;padding:40px 36px 48px;text-align:center;">
                <p style="margin:0 0 12px;font-size:38px;line-height:1;">${copy.icon}</p>
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">${copy.eyebrow}</p>
                <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.25;">${copy.heading}</h1>
              </td>
            </tr>

            <!-- Wave Divider -->
            <tr>
              <td style="background-color:#2297ce;line-height:0;font-size:0;">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 580 40'%3E%3Cpath fill='%23ffffff' d='M0,40 C145,0 435,0 580,40 L580,40 L0,40 Z'/%3E%3C/svg%3E" width="580" height="40" style="display:block;" alt="" />
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 36px 28px;">
                <p style="margin:0 0 16px;font-size:17px;font-weight:600;color:#262626;">Hi ${firstName},</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#595959;">${copy.intro}</p>
${detailBlock}
                <!-- Security Notice -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e6;border-left:4px solid #f5b400;border-radius:6px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#7a5a00;">Didn't make this change?</p>
                      <p style="margin:0;font-size:13px;line-height:1.5;color:#7a5a00;">If you don't recognise this activity, please contact our support team immediately to secure your account.</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:12px;color:#9ca3af;">Request made at ${timestamp}.</p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 36px;">
                <hr style="border:none;border-top:1px solid #eef0f2;margin:0;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 36px;text-align:center;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#2297ce;">Roomify</p>
                <p style="margin:0;font-size:11px;color:#9ca3af;">
                  &copy; ${new Date().getFullYear()} Roomify. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
