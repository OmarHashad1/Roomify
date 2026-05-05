export const signupEmailTemplate = ({ firstName }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Roomify</title>
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
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Account Created</p>
                <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Welcome aboard, ${firstName}!</h1>
                <p style="margin:14px 0 0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">Your Roomify account is ready. Start exploring hotels and making bookings today.</p>
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

                <!-- Feature Cards -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <td width="31%" style="background-color:#f0f8fd;border-radius:10px;padding:18px 14px;text-align:center;vertical-align:top;">
                      <p style="margin:0 0 6px;font-size:22px;">🏨</p>
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#262626;">Browse Hotels</p>
                      <p style="margin:0;font-size:12px;color:#595959;line-height:1.4;">Discover top-rated stays worldwide</p>
                    </td>
                    <td width="4%"></td>
                    <td width="31%" style="background-color:#f0f8fd;border-radius:10px;padding:18px 14px;text-align:center;vertical-align:top;">
                      <p style="margin:0 0 6px;font-size:22px;">📅</p>
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#262626;">Easy Booking</p>
                      <p style="margin:0;font-size:12px;color:#595959;line-height:1.4;">Reserve rooms in seconds</p>
                    </td>
                    <td width="4%"></td>
                    <td width="31%" style="background-color:#f0f8fd;border-radius:10px;padding:18px 14px;text-align:center;vertical-align:top;">
                      <p style="margin:0 0 6px;font-size:22px;">⭐</p>
                      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#262626;">Reviews</p>
                      <p style="margin:0;font-size:12px;color:#595959;line-height:1.4;">Read and share experiences</p>
                    </td>
                  </tr>
                </table>
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
