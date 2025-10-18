# Email Templates for TETFund Performance Management System

This directory contains professional HTML email templates for the TETFund Performance Management System (PMS) backend service.

## Templates Included

### 1. Account Creation Email (`account-creation.html`)
- **Purpose**: Sent when a new user account is created
- **Design**: TETFund green gradient theme with professional branding
- **Features**: TETFund logo, account details display, security information, call-to-action button

### 2. Login Notification Email (`login-notification.html`)
- **Purpose**: Sent when a user logs into their account
- **Design**: TETFund green gradient theme for security notifications
- **Features**: TETFund logo, login details, security warnings, activity monitoring

## Template Variables

Both templates use placeholder variables that should be replaced with actual data in your backend service:

### Account Creation Template Variables
- `{{TETFUND_LOGO_URL}}` - URL to TETFund logo image
- `{{ONBOARDING_URL}}` - URL to complete onboarding process
- `{{SUPPORT_URL}}` - Support contact URL
- `{{HELP_URL}}` - Help center URL
- `{{PRIVACY_URL}}` - Privacy policy URL

### Login Notification Template Variables
- `{{TETFUND_LOGO_URL}}` - URL to TETFund logo image
- `{{USER_FULL_NAME}}` - User's full name
- `{{USER_EMAIL}}` - User's email address
- `{{LOGIN_TIME}}` - Login timestamp
- `{{LOGIN_IP}}` - IP address of login
- `{{LOGIN_LOCATION}}` - Geographic location of login
- `{{LOGIN_DEVICE}}` - Device information
- `{{LOGIN_BROWSER}}` - Browser information
- `{{DASHBOARD_URL}}` - URL to user dashboard
- `{{SUPPORT_URL}}` - Support contact URL
- `{{HELP_URL}}` - Help center URL
- `{{SECURITY_URL}}` - Security center URL

## Backend Integration

### Example Usage (Node.js/Express)

```javascript
const fs = require('fs');
const path = require('path');

// Load template
const accountCreationTemplate = fs.readFileSync(
    path.join(__dirname, 'email-templates/account-creation.html'), 
    'utf8'
);

// Replace variables
const personalizedEmail = accountCreationTemplate
    .replace(/{{TETFUND_LOGO_URL}}/g, process.env.TETFUND_LOGO_URL || '/pms/tetfund-logo.jpg')
    .replace(/{{ONBOARDING_URL}}/g, process.env.FRONTEND_URL + '/onboarding')
    .replace(/{{SUPPORT_URL}}/g, process.env.SUPPORT_URL)
    .replace(/{{HELP_URL}}/g, process.env.HELP_URL)
    .replace(/{{PRIVACY_URL}}/g, process.env.PRIVACY_URL);

// Send email using your email service (Nodemailer, SendGrid, etc.)
await sendEmail({
    to: user.email,
    subject: 'Welcome to Performance Management System - Account Created',
    html: personalizedEmail
});
```

### Example Usage (Python/Flask)

```python
import os
from datetime import datetime

def load_template(template_name):
    with open(f'email-templates/{template_name}.html', 'r', encoding='utf-8') as file:
        return file.read()

def send_account_creation_email(user):
    template = load_template('account-creation')
    
    # Replace variables
    email_content = template.replace('{{TETFUND_LOGO_URL}}', os.getenv('TETFUND_LOGO_URL', '/pms/tetfund-logo.jpg'))
    email_content = email_content.replace('{{ONBOARDING_URL}}', os.getenv('FRONTEND_URL') + '/onboarding')
    email_content = email_content.replace('{{SUPPORT_URL}}', os.getenv('SUPPORT_URL'))
    email_content = email_content.replace('{{HELP_URL}}', os.getenv('HELP_URL'))
    email_content = email_content.replace('{{PRIVACY_URL}}', os.getenv('PRIVACY_URL'))
    
    # Send email
    send_email(
        to=user.email,
        subject='Welcome to Performance Management System - Account Created',
        html=email_content
    )
```

## Design Features

### TETFund Branding
- Official TETFund logo integration
- TETFund green color scheme (#059669 to #10b981)
- Professional typography using Inter font family
- Consistent with TETFund PMS application design

### Responsive Design
- Mobile-friendly layouts
- Optimized for various email clients
- Fallback styles for older email clients

### Security Features
- Security warnings and information
- Clear call-to-action buttons
- Professional TETFund branding

### Accessibility
- High contrast colors
- Clear typography using Inter font
- Semantic HTML structure

## Email Client Compatibility

These templates are designed to work across major email clients:
- Gmail (Web, Mobile, Desktop)
- Outlook (2016, 2019, 365, Web)
- Apple Mail
- Yahoo Mail
- Thunderbird

## Customization

### Colors
The templates use TETFund's official color scheme:
- Primary green: `#059669` to `#10b981` (TETFund brand colors)
- Success green: `#059669` to `#10b981`
- Background: `#f8fafc`
- Text: `#334155`

### Logo
The templates use the TETFund logo via the `{{TETFUND_LOGO_URL}}` variable. Ensure this points to your TETFund logo image.

### Branding
The templates are pre-configured with TETFund branding and colors to match the PMS application design.

## Testing

Before deploying, test the templates with:
1. Email testing tools (Litmus, Email on Acid)
2. Multiple email clients
3. Different screen sizes
4. Various email providers

## Support

For questions or issues with these templates, please contact your development team or refer to the main TETFund PMS documentation.

## TETFund Branding Notes

- The templates use the official TETFund green color scheme (#059669 to #10b981)
- Inter font family is used throughout for consistency with the PMS application
- The TETFund logo should be hosted and accessible via the `{{TETFUND_LOGO_URL}}` variable
- All branding elements match the TETFund PMS application design system
