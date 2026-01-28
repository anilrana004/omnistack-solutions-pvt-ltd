# Contact Form Integration Setup Guide

This guide explains how to set up email and phone notifications for the contact form.

## Overview

The contact form sends real-time notifications via:
- **Email**: Using Resend API (recommended) or SMTP
- **Phone**: Using Twilio for SMS/WhatsApp notifications

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
COMPANY_EMAIL=admin@omnistack.co.in

# Phone/SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
COMPANY_PHONE=+917579143847
```

## Email Setup (Resend)

1. **Sign up for Resend**: https://resend.com
2. **Get API Key**:
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Copy the key (starts with `re_`)
3. **Add to `.env.local`**:
   ```
   RESEND_API_KEY=re_your_key_here
   COMPANY_EMAIL=admin@omnistack.co.in
   ```

### Alternative: Using SMTP (Nodemailer)

If you prefer SMTP, you can modify `app/api/contact/route.ts` to use Nodemailer:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

Then update the `sendEmail` function to use SMTP credentials.

## Phone Setup (Twilio)

1. **Sign up for Twilio**: https://www.twilio.com/try-twilio
2. **Get Credentials**:
   - Go to https://console.twilio.com/
   - Find your Account SID and Auth Token
   - Get a phone number (or use WhatsApp sandbox)
3. **Add to `.env.local`**:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   COMPANY_PHONE=+917579143847
   ```

### WhatsApp Setup (Optional)

For WhatsApp notifications:
1. Enable WhatsApp in Twilio Console
2. Use WhatsApp sandbox number or approved business number
3. Set `COMPANY_PHONE` to: `whatsapp:+917579143847`

## Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Submit a test form** at `/contact`

3. **Check**:
   - Email should arrive at `COMPANY_EMAIL`
   - SMS/WhatsApp should arrive at `COMPANY_PHONE`

## Production Deployment

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from `.env.local`
4. Redeploy

### Other Platforms
Add environment variables in your hosting platform's dashboard.

## Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use environment variables for all secrets
- ✅ API keys are server-side only (never exposed to frontend)
- ✅ Form includes basic spam prevention

## Troubleshooting

### Email not sending
- Check `RESEND_API_KEY` is correct
- Verify `COMPANY_EMAIL` is valid
- Check Resend dashboard for delivery status

### Phone notifications not working
- Verify Twilio credentials
- Check phone number format (include country code)
- For WhatsApp, ensure number is registered in Twilio sandbox
- Check Twilio console for error logs

### Form submission fails
- Check browser console for errors
- Verify API route is accessible
- Check server logs for detailed errors

## Support

For issues with:
- **Resend**: https://resend.com/docs
- **Twilio**: https://www.twilio.com/docs

