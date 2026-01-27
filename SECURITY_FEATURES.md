# Quizora Security Features Documentation

This document describes the security features implemented in Quizora-AI application.

## Overview

The application now includes three major security enhancements:

1. **Multi-Factor Authentication (2FA) with Email OTP**
2. **AES-256 Encryption for Sensitive Data**
3. **QR Code Generation for User Identity**

---

## 1. Multi-Factor Authentication (2FA)

### How It Works

When a user logs in, the system now requires two-factor authentication:

1. User enters email and password
2. System validates credentials
3. System generates a 6-digit OTP (One-Time Password)
4. OTP is sent to the user's email address
5. OTP expires after 5 minutes
6. User enters OTP to complete login
7. System issues JWT token for authenticated session

### Configuration

Before using 2FA, configure email settings in `application.properties`:

```properties
# Email Configuration (SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**For Gmail:**
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the App Password in `MAIL_PASSWORD` environment variable

### API Endpoints

- `POST /login` - Validates credentials and sends OTP
  - Request: `{ "username": "email", "password": "password" }`
  - Response: `{ "otpRequired": true, "message": "OTP sent to email", "email": "user@example.com" }`

- `POST /verify-otp` - Validates OTP and issues JWT token
  - Request: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: `{ "token": "jwt-token-here" }`

### Security Notes

- OTPs are stored in-memory (not suitable for production clustering)
- OTPs expire after 5 minutes
- OTPs are single-use (deleted after successful validation)
- For production, consider using Redis or database storage for OTPs

---

## 2. AES-256 Encryption

### How It Works

User email addresses are encrypted before storing in the database using AES-256-CBC encryption:

- **Algorithm**: AES (Advanced Encryption Standard)
- **Mode**: CBC (Cipher Block Chaining)
- **Key Size**: 256 bits (32 bytes)
- **Padding**: PKCS5Padding
- **IV**: Randomly generated for each encryption (16 bytes)

### Configuration

Set the encryption key in `application.properties`:

```properties
# AES Encryption Key (32 characters for AES-256)
app.encryption.key=${ENCRYPTION_KEY:QuizoraSecretKey1234567890123456}
```

**Important:**
- The encryption key MUST be exactly 32 characters (bytes)
- Store the key in environment variables in production
- Never commit the actual encryption key to version control
- If the key is lost, encrypted data cannot be recovered

### Usage

The encryption is automatically applied when:
- Registering a new user (email is encrypted before saving)
- Retrieving user profile (email is decrypted when displayed)

### API Endpoints

- `GET /api/user/profile` - Returns user profile with decrypted email
  - Requires: `Authorization: Bearer <jwt-token>` header
  - Response: `{ "id": 1, "username": "...", "name": "...", "email": "decrypted-email", "role": "..." }`

---

## 3. QR Code Generation

### How It Works

Each user can generate a QR code containing their unique user ID:

- QR code encodes: `USER_ID:<user-id>`
- Generated using ZXing library
- Returned as Base64-encoded PNG image
- Size: 300x300 pixels

### API Endpoints

- `GET /api/user/qr-code` - Generates and returns QR code
  - Requires: `Authorization: Bearer <jwt-token>` header
  - Response: `{ "qrCode": "base64-encoded-image-data" }`

### Frontend Integration

Users can view their QR code on the Profile page:

1. Navigate to Profile from the dashboard
2. QR code is automatically displayed
3. QR code can be scanned to retrieve the user ID

### Use Cases

- Identity verification
- Quick user lookup
- Attendance tracking
- Access control

---

## Environment Setup

### Development

1. Copy `application.properties.example` to `application.properties`
2. Set development values:
   ```properties
   MAIL_USERNAME=your-dev-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   ENCRYPTION_KEY=Your32CharacterSecretKeyHere!
   ```

### Production

Use environment variables for sensitive data:

```bash
export MAIL_USERNAME=production-email@company.com
export MAIL_PASSWORD=secure-password-here
export ENCRYPTION_KEY=your-secure-32-character-key
```

Or use application server configurations (e.g., Kubernetes Secrets, AWS Parameter Store)

---

## Security Best Practices

1. **Never expose OTPs in error messages or logs**
2. **Use strong, random encryption keys**
3. **Store secrets in environment variables, not in code**
4. **Rotate encryption keys periodically** (requires data re-encryption)
5. **Use HTTPS in production** to protect tokens and OTPs in transit
6. **Implement rate limiting** on OTP generation/validation endpoints
7. **Monitor for suspicious authentication attempts**
8. **Consider using Redis/database** for OTP storage in production
9. **Regularly update dependencies** for security patches
10. **Enable application logging** for security audits

---

## Troubleshooting

### Email Not Sending

- Verify SMTP credentials are correct
- Check if Gmail App Password is being used (not regular password)
- Ensure firewall allows outbound SMTP connections (port 587)
- Check application logs for specific error messages

### Encryption Errors

- Verify encryption key is exactly 32 characters
- Check if key contains special characters that might cause encoding issues
- Ensure the same key is used for encryption and decryption

### OTP Validation Fails

- Check if OTP has expired (5-minute window)
- Verify email address matches exactly
- Ensure OTP hasn't already been used
- Check for any whitespace in OTP input

---

## Future Enhancements

Potential improvements for future versions:

1. Support for additional 2FA methods (SMS, Authenticator apps)
2. Database-backed OTP storage for production scalability
3. Backup codes for account recovery
4. QR code customization options
5. Encryption for additional sensitive fields
6. Key rotation mechanism
7. Audit logging for security events
8. Session management improvements

---

## References

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [AES Encryption Standard](https://csrc.nist.gov/publications/detail/fips/197/final)
- [ZXing QR Code Library](https://github.com/zxing/zxing)
- [JavaMail API](https://javaee.github.io/javamail/)
