export const HaveCountryCode = (phoneNumber: string): boolean => {
  const countryCodes = ["91", "971", "966", "974", "968", "965", "973"];

  if (phoneNumber.startsWith("91") && phoneNumber.length === 12) {
    return true;
  }
  const code = phoneNumber.slice(0, 3);
  return countryCodes.includes(code);
};

// India (91): 919876543210
// United Arab Emirates (971): 971501234567
// Saudi Arabia (966): 966551234567
// Qatar (974): 97433123456
// Oman (968): 96892123456
// Kuwait (965): 96550012345
// Bahrain (973): 97336001234
