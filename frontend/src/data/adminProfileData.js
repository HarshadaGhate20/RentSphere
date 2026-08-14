const adminProfileData = {
  id: "ADMIN-001",
  role: "ADMIN",
  name: "RentSphere Administrator",
  email: "admin@rentsphere.com",
  phone: "9876543210",
  city: "Mumbai",
  address: "Mumbai, Maharashtra, India",
  avatar: "",
  accountStatus: "ACTIVE",
  verificationStatus: "VERIFIED",
  joinedOn: "01 Jan 2026",
  lastLogin: "05 Aug 2026, 12:45 PM",

  security: {
    twoFactorEnabled: false,
    passwordLastChanged: "15 Jul 2026",
    activeSessions: 1,
  },

  loginActivity: [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Mumbai, India",
      ipAddress: "192.168.1.10",
      loginTime: "05 Aug 2026, 12:45 PM",
      current: true,
    },
    {
      id: 2,
      device: "Firefox on Ubuntu",
      location: "Mumbai, India",
      ipAddress: "192.168.1.12",
      loginTime: "04 Aug 2026, 08:10 PM",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Android",
      location: "Pune, India",
      ipAddress: "192.168.1.20",
      loginTime: "02 Aug 2026, 09:30 AM",
      current: false,
    },
  ],
};

export default adminProfileData;