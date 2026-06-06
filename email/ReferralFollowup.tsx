interface ReferralFollowupProps {
  userFirstName: string;
  referredUserName: string;
  courseName: string;
  currency: string;
  referralValue: number;
  referralTrackingPageUrl: string;
  recipientEmail: string;
}

export function getReferralEmailHtml(props: ReferralFollowupProps): string {
  const {
    userFirstName,
    referredUserName,
    courseName,
    currency,
    referralValue,
    referralTrackingPageUrl,
    recipientEmail,
  } = props;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've earned a referral reward!</title>
        <style>
          body {
            background-color: #f6f9fc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px 0 48px;
            max-width: 600px;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            font-weight: 600;
            line-height: 1.25;
            margin: 30px 0;
            text-align: center;
          }
          p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
            margin: 16px 0;
          }
          .info-box {
            background-color: #f0fdf4;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: center;
          }
          .reward-text {
            font-size: 20px;
            color: #166534;
            margin: 0;
          }
          .button {
            background-color: #22c55e;
            border-radius: 8px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            padding: 12px 24px;
            margin: 24px 0;
          }
          hr {
            border-color: #e6ebf1;
            margin: 20px 0;
          }
          .footer {
            color: #8898aa;
            font-size: 12px;
            line-height: 1.5;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You've earned a referral reward! 🎉</h1>
          
          <p>Hi ${userFirstName},</p>
          
          <p>
            Great news! Your friend <strong>${referredUserName}</strong> just signed up for 
            <strong>${courseName}</strong> through your referral link.
          </p>
          
          <div class="info-box">
            <p class="reward-text">
              You've earned: <strong>${currency}${referralValue}</strong>
            </p>
          </div>
          
          <p>
            Track all your referrals and claim your rewards here:
          </p>
          
          <p style="text-align: center;">
            <a href="${referralTrackingPageUrl}" class="button">View Your Referrals</a>
          </p>
          
          <hr />
          
          <p class="footer">
            This notification was sent to ${recipientEmail}.<br />
            Medbuddy Africa — Helping you learn and earn.
          </p>
        </div>
      </body>
    </html>
  `;
}

export function getReferralEmailText(props: ReferralFollowupProps): string {
  const {
    userFirstName,
    referredUserName,
    courseName,
    currency,
    referralValue,
    referralTrackingPageUrl,
  } = props;

  return `
Hi ${userFirstName},

Great news! Your friend ${referredUserName} just signed up for ${courseName} through your referral link.

You've earned: ${currency}${referralValue}

Track all your referrals and claim your rewards here:
${referralTrackingPageUrl}

---
Medbuddy Africa — Helping you learn and earn.
  `.trim();
}
