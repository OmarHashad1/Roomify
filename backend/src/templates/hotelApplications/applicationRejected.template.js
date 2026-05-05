export const applicationRejectedEmailTemplate = ({
  firstName,
  hotelName,
  rejectionReason,
}) => {
  const reasonBlock = rejectionReason
    ? `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background-color:#f7f8fa;border-radius:12px;">
                  <tr>
                    <td style="padding:20px 22px;">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;">Reason Provided</p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#262626;">${rejectionReason}</p>
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
    <title>Application update — Roomify</title>
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
                <p style="margin:0 0 12px;font-size:38px;line-height:1;">📨</p>
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Application Update</p>
                <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.25;">Thank you for applying, ${firstName}</h1>
                <p style="margin:14px 0 0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">We've finished reviewing your application for <strong style="color:#ffffff;">${hotelName}</strong>.</p>
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
                <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#595959;">After careful review, we're unable to move forward with your application at this time. We truly appreciate the time and effort you put into it.</p>
${reasonBlock}
                <!-- Next Steps -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#f0f8fd;border-radius:10px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#2297ce;">Can I apply again?</p>
                      <p style="margin:0;font-size:13px;line-height:1.6;color:#595959;">Absolutely. You're welcome to reapply once you've had a chance to address the feedback above. If anything is unclear, feel free to reach out to our team — we're happy to help.</p>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#595959;">Thanks again for considering Roomify. We wish you all the best.</p>
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
