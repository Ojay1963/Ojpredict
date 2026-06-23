import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "tips@ojpredict.com"

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to OJ Predict!",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#0C0975;padding:32px;text-align:center;">
          <h1 style="color:#F4A500;margin:0;font-size:28px;">OJ PREDICT</h1>
          <p style="color:#fff;margin:8px 0 0;">Predict Smart. Win Big.</p>
        </div>
        <div style="padding:32px;">
          <h2>Welcome, ${name}!</h2>
          <p>You've successfully joined OJ Predict — Nigeria's most trusted AI-powered football prediction platform.</p>
          <p>Start exploring today's free tips and upgrade to VIP for our highest-confidence picks.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}"
             style="background:#F4A500;color:#0C0975;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-top:16px;">
            View Today's Tips
          </a>
        </div>
        <div style="background:#f8f8f8;padding:16px;text-align:center;color:#666;font-size:12px;">
          © 2026 OJ Predict | ojpredict.com
        </div>
      </div>
    `,
  })
}

export async function sendVIPTipAlert(
  to: string,
  name: string,
  tip: { homeTeam: string; awayTeam: string; prediction: string; odds?: number; kickoff: string }
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `[OJ VIP] New Tip: ${tip.homeTeam} vs ${tip.awayTeam}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#0C0975;padding:32px;text-align:center;">
          <h1 style="color:#F4A500;margin:0;font-size:28px;">OJ PREDICT VIP</h1>
        </div>
        <div style="padding:32px;">
          <h2>New VIP Tip, ${name}!</h2>
          <div style="background:#f0f0ff;border-left:4px solid #0C0975;padding:20px;border-radius:8px;margin:16px 0;">
            <p style="margin:0;font-size:18px;font-weight:700;">${tip.homeTeam} vs ${tip.awayTeam}</p>
            <p style="margin:8px 0;color:#0C0975;font-weight:600;">Prediction: ${tip.prediction}</p>
            ${tip.odds ? `<p style="margin:4px 0;">Odds: <strong>${tip.odds}</strong></p>` : ""}
            <p style="margin:4px 0;color:#666;">Kickoff: ${tip.kickoff}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background:#F4A500;color:#0C0975;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-top:16px;">
            View Full Analysis
          </a>
        </div>
        <div style="background:#f8f8f8;padding:16px;text-align:center;color:#666;font-size:12px;">
          © 2026 OJ Predict | You are receiving this as an OJ VIP subscriber
        </div>
      </div>
    `,
  })
}

export async function sendSubscriptionConfirmation(
  to: string,
  name: string,
  plan: string,
  endDate: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `OJ Predict VIP Subscription Confirmed!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
        <div style="background:#0C0975;padding:32px;text-align:center;">
          <h1 style="color:#F4A500;margin:0;font-size:28px;">OJ PREDICT</h1>
        </div>
        <div style="padding:32px;">
          <h2>Subscription Confirmed!</h2>
          <p>Hi ${name}, your <strong>${plan}</strong> subscription is now active.</p>
          <p>Your access expires on: <strong>${endDate}</strong></p>
          <p>You now have full access to all OJ VIP tips.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background:#F4A500;color:#0C0975;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;margin-top:16px;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `,
  })
}
