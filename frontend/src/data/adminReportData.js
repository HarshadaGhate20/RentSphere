const adminReportData = {
  period: "Last 6 months",

  summary: {
    totalRevenue: 1245000,
    totalBookings: 126,
    activeProperties: 84,
    registeredUsers: 460,
  },

  monthlyRevenue: [
    { month: "Mar", amount: 145000 },
    { month: "Apr", amount: 168000 },
    { month: "May", amount: 181000 },
    { month: "Jun", amount: 204000 },
    { month: "Jul", amount: 248000 },
    { month: "Aug", amount: 299000 },
  ],

  monthlyBookings: [
    { month: "Mar", count: 12 },
    { month: "Apr", count: 17 },
    { month: "May", count: 19 },
    { month: "Jun", count: 22 },
    { month: "Jul", count: 26 },
    { month: "Aug", count: 30 },
  ],

  propertyStatus: [
    { label: "Approved", count: 84 },
    { label: "Pending", count: 18 },
    { label: "Rejected", count: 11 },
  ],

  paymentStatus: [
    { label: "Successful", count: 94 },
    { label: "Pending", count: 17 },
    { label: "Failed", count: 9 },
    { label: "Refunded", count: 6 },
  ],

  cityPerformance: [
    {
      city: "Mumbai",
      properties: 38,
      bookings: 48,
      revenue: 475000,
    },
    {
      city: "Pune",
      properties: 26,
      bookings: 34,
      revenue: 312000,
    },
    {
      city: "Navi Mumbai",
      properties: 14,
      bookings: 25,
      revenue: 286000,
    },
    {
      city: "Thane",
      properties: 6,
      bookings: 19,
      revenue: 172000,
    },
  ],

  userDistribution: {
    landlords: 128,
    tenants: 332,
  },

  recentActivity: [
    {
      id: 1,
      type: "PAYMENT",
      title: "Payment received",
      description: "Aditi Verma paid ₹28,000 for Luxury Apartment.",
      date: "05 Aug 2026, 11:15 AM",
    },
    {
      id: 2,
      type: "BOOKING",
      title: "Booking confirmed",
      description: "BOOK-1001 was confirmed successfully.",
      date: "05 Aug 2026, 10:40 AM",
    },
    {
      id: 3,
      type: "PROPERTY",
      title: "Property approved",
      description: "Premium PG was approved by the administrator.",
      date: "05 Aug 2026, 09:25 AM",
    },
    {
      id: 4,
      type: "USER",
      title: "New landlord registered",
      description: "Sneha Joshi created a landlord account.",
      date: "04 Aug 2026, 07:15 PM",
    },
  ],
};

export default adminReportData;