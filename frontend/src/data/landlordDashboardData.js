const landlordDashboardData = {
  landlord: {
    id: "LANDLORD-001",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
  },

  summary: {
    totalProperties: 8,
    approvedProperties: 5,
    pendingProperties: 2,
    occupiedProperties: 3,
    totalRevenue: 245000,
  },

  revenueOverview: [
    {
      month: "Mar",
      amount: 24000,
    },
    {
      month: "Apr",
      amount: 36000,
    },
    {
      month: "May",
      amount: 42000,
    },
    {
      month: "Jun",
      amount: 39000,
    },
    {
      month: "Jul",
      amount: 48000,
    },
    {
      month: "Aug",
      amount: 56000,
    },
  ],

  recentProperties: [
    {
      id: 1,
      title: "Luxury Apartment",
      city: "Mumbai",
      area: "Andheri West",
      type: "Apartment",
      rent: 28000,
      status: "APPROVED",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900",
    },

    {
      id: 2,
      title: "Premium PG",
      city: "Pune",
      area: "Hinjewadi",
      type: "PG",
      rent: 8500,
      status: "PENDING",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900",
    },

    {
      id: 3,
      title: "Skyline Studio",
      city: "Mumbai",
      area: "Powai",
      type: "Studio",
      rent: 18000,
      status: "APPROVED",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900",
    },
  ],

  bookingRequests: [
    {
      id: "REQ-1001",
      tenantName: "Aditi Verma",
      propertyTitle: "Luxury Apartment",
      requestedRent: 26000,
      moveInDate: "01 Sep 2026",
      status: "PENDING",
    },

    {
      id: "REQ-1002",
      tenantName: "Karan Shah",
      propertyTitle: "Premium PG",
      requestedRent: 8200,
      moveInDate: "15 Aug 2026",
      status: "PENDING",
    },

    {
      id: "REQ-1003",
      tenantName: "Simran Kaur",
      propertyTitle: "Skyline Studio",
      requestedRent: 17500,
      moveInDate: "20 Aug 2026",
      status: "ACCEPTED",
    },
  ],

  notifications: [
    {
      id: 1,
      type: "PROPERTY",
      title: "Property approved",
      message:
        "Luxury Apartment has been approved by the administrator.",
      time: "Today, 10:30 AM",
    },

    {
      id: 2,
      type: "BOOKING",
      title: "New booking request",
      message:
        "Aditi Verma submitted a booking request for Luxury Apartment.",
      time: "Today, 09:45 AM",
    },

    {
      id: 3,
      type: "PAYMENT",
      title: "Rent payment received",
      message:
        "₹28,000 was received for Luxury Apartment.",
      time: "Yesterday, 06:20 PM",
    },

    {
      id: 4,
      type: "MAINTENANCE",
      title: "Maintenance request",
      message:
        "A tenant reported a plumbing issue at Skyline Studio.",
      time: "Yesterday, 02:15 PM",
    },
  ],
};

export default landlordDashboardData;