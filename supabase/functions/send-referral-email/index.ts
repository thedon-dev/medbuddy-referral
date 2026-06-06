// @ts-ignore - Deno environment
import { Resend } from "npm:resend@2.0.0";
// @ts-ignore - Deno environment
import { createClient } from "jsr:@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

function getReferralEmailHtml(props: {
  userFirstName: string;
  referredUserName: string;
  courseName: string;
  currency: string;
  referralValue: number;
  referralTrackingPageUrl: string;
  recipientEmail: string;
}): string {
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

function getReferralEmailText(props: {
  userFirstName: string;
  referredUserName: string;
  courseName: string;
  currency: string;
  referralValue: number;
  referralTrackingPageUrl: string;
  recipientEmail: string;
}): string {
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

Deno.serve(async (req: Request) => {
  try {
    const body = await req.json();
    const {
      userName,
      userEmail,
      referredUserName,
      courseName,
      currency,
      referralAmount,
    } = body;

    const userFirstName = userName.split(" ")[0];
    const referralTrackingPageUrl = `${Deno.env.get("APP_URL")}/app/referrals`;

    const trackingId = crypto.randomUUID();
    const fullTrackingUrl = `${referralTrackingPageUrl}?ref=${trackingId}`;

    const { data: referralData, error: dbError } = await supabase
      .from("referrals")
      .insert({
        user_name: userName,
        user_email: userEmail,
        referred_user_name: referredUserName,
        course_name: courseName,
        currency: currency,
        referral_amount: referralAmount,
        referral_tracking_url: fullTrackingUrl,
        email_sent: false,
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const emailHtml = getReferralEmailHtml({
      userFirstName,
      referredUserName,
      courseName,
      currency,
      referralValue: referralAmount,
      referralTrackingPageUrl: fullTrackingUrl,
      recipientEmail: userEmail,
    });

    const emailText = getReferralEmailText({
      userFirstName,
      referredUserName,
      courseName,
      currency,
      referralValue: referralAmount,
      referralTrackingPageUrl: fullTrackingUrl,
      recipientEmail: userEmail,
    });

    const emailResult = await resend.emails.send({
      from: "Medbuddy <info@medbuddyafrica.com>",
      to: userEmail,
      subject: "Your referral just earned you a reward!",
      html: emailHtml,
      text: emailText,
    });

    if (emailResult.error) {
      throw new Error(`Email error: ${emailResult.error.message}`);
    }

    await supabase
      .from("referrals")
      .update({
        email_sent: true,
        sent_at: new Date().toISOString(),
      })
      .eq("id", referralData.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        data: {
          referral_id: referralData.id,
          email_id: emailResult.data?.id,
          tracking_url: fullTrackingUrl,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
