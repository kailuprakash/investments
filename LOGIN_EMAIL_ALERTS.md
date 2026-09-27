# Login email alerts

The application can send a best-effort email security notification after a successful password setup or sign-in. The message includes the event, Eastern time, request IP, and device user-agent. Email delivery never blocks a successful login.

## Free provider: Resend

This app uses the [Resend Email API](https://resend.com/docs/api-reference/emails/send-email) directly through `fetch`, so no email package is required. Resend's free plan currently supports **100 emails per day** for low-volume security alerts.

Configure these server-side environment secrets:

```text
RESEND_API_KEY=re_your_sending_key
LOGIN_ALERT_EMAIL_TO=owner@example.com
LOGIN_ALERT_EMAIL_FROM=Portfolio Tracker <security@your-verified-domain.com>
```

Use an API key with sending permission only. Never commit the key to source control.

## Setup

1. Create a free Resend account.
2. Add and verify your sending domain in Resend by adding its DNS records.
3. Create a sending-only API key.
4. Add the three variables above as deployment/sandbox environment secrets.
5. Sign in to the portfolio to receive a security alert email.

`LOGIN_ALERT_EMAIL_FROM` must be an address on a verified Resend domain for normal delivery. Resend may provide a limited onboarding/test sender for development, but a verified domain is recommended for dependable production alerts.

## Behavior

- Missing Resend variables: no email is attempted.
- Provider errors or free-tier limits: logged server-side; sign-in still completes.
- This replaces the prior SMS and WhatsApp login-alert paths.
