const tenantDashboardData = {
  tenant: {
    id: "TEN-201",
    name: "Harshada Ghate",
    email: "harshada@gmail.com",
  },

  summary: {
    activeBookings: 1,
    pendingRent: 18500,
    maintenanceRequests: 2,
    savedProperties: 8,
  },

  currentRental: {
    bookingId: "BOOK-2001",
    propertyId: 101,
    title: "Luxury Apartment",
    category: "Apartment",
    locality: "Andheri West",
    city: "Mumbai",
    monthlyRent: 18500,
    securityDeposit: 37000,
    leaseStart: "01 Mar 2026",
    leaseEnd: "28 Feb 2027",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000",

    landlord: {
      id: "LANDLORD-001",
      name: "Rahul Sharma",
      verified: true,
      phone: "9823456789",
    },
  },

  upcomingPayment: {
    id: "PAY-DUE-1001",
    bookingId: "BOOK-2001",
    propertyTitle: "Luxury Apartment",
    amount: 18500,
    dueDate: "10 Aug 2026",
    daysRemaining: 5,
    status: "PENDING",
    paymentType: "MONTHLY_RENT",
  },

  activities: [
    {
      id: 1,
      type: "BOOKING",
      title: "Booking confirmed",
      description:
        "Your booking for Luxury Apartment was confirmed.",
      date: "Yesterday",
    },
    {
      id: 2,
      type: "PAYMENT",
      title: "Rent payment completed",
      description:
        "Your July rent payment of ₹18,500 was successful.",
      date: "2 days ago",
    },
    {
      id: 3,
      type: "MAINTENANCE",
      title: "Maintenance request submitted",
      description:
        "Kitchen sink leakage was reported to the landlord.",
      date: "5 days ago",
    },
    {
      id: 4,
      type: "WISHLIST",
      title: "Property saved",
      description:
        "Premium PG was added to your wishlist.",
      date: "1 week ago",
    },
  ],

  maintenance: [
    {
      id: "MNT-2001",
      title: "Kitchen sink leakage",
      category: "PLUMBING",
      status: "IN_PROGRESS",
      priority: "HIGH",
      expectedVisit: "Tomorrow, 11:00 AM",
      updatedOn: "05 Aug 2026",
    },
    {
      id: "MNT-2002",
      title: "Bedroom fan repair",
      category: "ELECTRICAL",
      status: "RESOLVED",
      priority: "MEDIUM",
      resolvedOn: "04 Aug 2026",
      updatedOn: "04 Aug 2026",
    },
  ],

  recentPayments: [
    {
      id: "PAY-3001",
      month: "July 2026",
      amount: 18500,
      paidOn: "10 Jul 2026",
      method: "UPI",
      status: "SUCCESS",
    },
    {
      id: "PAY-3002",
      month: "June 2026",
      amount: 18500,
      paidOn: "09 Jun 2026",
      method: "CARD",
      status: "SUCCESS",
    },
    {
      id: "PAY-3003",
      month: "May 2026",
      amount: 18500,
      paidOn: "10 May 2026",
      method: "UPI",
      status: "SUCCESS",
    },
  ],
};

export default tenantDashboardData;