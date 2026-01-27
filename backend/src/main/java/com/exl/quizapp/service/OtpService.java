package com.exl.quizapp.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final SecureRandom random = new SecureRandom();

    // Store OTP with expiry time: key = email, value = OtpData
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    /**
     * Generate a 6-digit OTP
     */
    public String generateOtp(String email) {
        // Generate 6-digit OTP
        int otp = 100000 + random.nextInt(900000);
        String otpString = String.valueOf(otp);

        // Store OTP with expiry time
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        otpStorage.put(email, new OtpData(otpString, expiryTime));

        return otpString;
    }

    /**
     * Validate OTP
     */
    public boolean validateOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false;
        }

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otpData.getExpiryTime())) {
            otpStorage.remove(email);
            return false;
        }

        // Check if OTP matches
        boolean isValid = otpData.getOtp().equals(otp);

        // Remove OTP after successful validation
        if (isValid) {
            otpStorage.remove(email);
        }

        return isValid;
    }

    /**
     * Inner class to store OTP data
     */
    private static class OtpData {
        private final String otp;
        private final LocalDateTime expiryTime;

        public OtpData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }
}
