# Login email alerts

Portfolio Tracker sends best-effort email security notifications after a successful password setup, successful sign-in, and when repeated failed credential attempts are detected. Email delivery never blocks a login response.

## Free provider: Resend

This app uses the [Resend Email API](https://resend.com/docs/api-reference/emails/send-email) directly through `fetch`, so no email package is required. Resend's free plan currently supports **100 emails per day**, which is appropriate for low-volume login/security alerts.

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

`LOGIN_ALERT_EMAIL_FROM` must be an address on a verified Resend domain for reliable delivery. Resend may provide a limited onboarding/test sender for development, but a verified domain is recommended for production alerts.

## Successful-login email details

A successful password setup or sign-in email includes all information a normal browser/server request can safely expose:

- Event type and exact Eastern time
- Public client IP selected from Cloudflare, forwarded-for, or reverse-proxy headers
- Full forwarded IP chain when present
- Browser user-agent
- Browser Client Hints: brand, platform, and mobile indicator
- Accepted language and content preferences
- Requested host, forwarded host/protocol, origin, and referrer

A website **cannot access the client machine hostname or private LAN IP**. Modern browser security intentionally prevents that information from being sent to websites. The email reports those fields as unavailable rather than guessing or collecting hidden device data.

## Repeated failed-login lockout and alert

Every invalid password attempt is recorded as security metadata only; the submitted password is never stored or emailed.

- Attempts are counted per public IP address.
- The rolling detection window is **15 minutes**.
- On the **third failed attempt** from the same IP, the app sends a single email alert and immediately locks that IP for **15 minutes**.
- While locked, credential verification is skipped and the endpoint returns HTTP `429 Too Many Requests` with a `Retry-After` header.
- Further requests during the lock do not create additional audit records or repeated alert emails.
- A successful login from that IP clears its current failed-attempt and lockout records.
- Security audit records are automatically retained for up to seven days.

## Behavior

- Missing Resend variables: no email is attempted.
- Provider errors or free-tier limits: logged server-side; login behavior is unchanged.
- Password values are never stored in security audit records or email alerts.
