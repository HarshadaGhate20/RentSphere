const bookingData = [
  {
    id: "BOOK-1001",
    bookingType: "PROPERTY",
    status: "CONFIRMED",
    createdOn: "02 Aug 2026",
    moveInDate: "01 Sep 2026",
    durationMonths: 12,
    monthlyRent: 28000,
    securityDeposit: 56000,
    flagged: false,

    property: {
      id: 1,
      title: "Luxury Apartment",
      type: "Apartment",
      city: "Mumbai",
      area: "Andheri West",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900",
    },

    tenant: {
      id: 201,
      name: "Aditi Verma",
      email: "aditi@gmail.com",
      phone: "9876543210",
    },

    landlord: {
      id: 301,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9823456789",
    },

    payment: {
      status: "PAID",
      transactionId: "TXN-RS-9001",
      amount: 84000,
      paidOn: "03 Aug 2026",
    },

    lease: {
      status: "ACTIVE",
      startDate: "01 Sep 2026",
      endDate: "31 Aug 2027",
    },
  },

  {
    id: "BOOK-1002",
    bookingType: "PG",
    status: "PENDING",
    createdOn: "04 Aug 2026",
    moveInDate: "15 Aug 2026",
    durationMonths: 6,
    monthlyRent: 8500,
    securityDeposit: 15000,
    flagged: false,

    property: {
      id: 2,
      title: "Premium PG",
      type: "PG",
      city: "Pune",
      area: "Hinjewadi",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900",
    },

    tenant: {
      id: 202,
      name: "Karan Shah",
      email: "karan@gmail.com",
      phone: "9911223344",
    },

    landlord: {
      id: 302,
      name: "Priya Patil",
      email: "priya@gmail.com",
      phone: "9123456780",
    },

    payment: {
      status: "PENDING",
      transactionId: null,
      amount: 23500,
      paidOn: null,
    },

    lease: {
      status: "NOT_CREATED",
      startDate: null,
      endDate: null,
    },
  },

  {
    id: "BOOK-1003",
    bookingType: "PROPERTY",
    status: "CANCELLED",
    createdOn: "28 Jul 2026",
    moveInDate: "10 Aug 2026",
    durationMonths: 11,
    monthlyRent: 18000,
    securityDeposit: 36000,
    cancellationReason:
      "Tenant cancelled before completing payment.",
    flagged: false,

    property: {
      id: 4,
      title: "Skyline Studio",
      type: "Studio",
      city: "Mumbai",
      area: "Powai",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900",
    },

    tenant: {
      id: 203,
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      phone: "9898989898",
    },

    landlord: {
      id: 303,
      name: "Sneha Joshi",
      email: "sneha@gmail.com",
      phone: "9876501234",
    },

    payment: {
      status: "FAILED",
      transactionId: null,
      amount: 54000,
      paidOn: null,
    },

    lease: {
      status: "CANCELLED",
      startDate: null,
      endDate: null,
    },
  },

  {
    id: "BOOK-1004",
    bookingType: "PROPERTY",
    status: "COMPLETED",
    createdOn: "05 Jul 2025",
    moveInDate: "01 Aug 2025",
    durationMonths: 12,
    monthlyRent: 45000,
    securityDeposit: 90000,
    flagged: true,

    property: {
      id: 3,
      title: "Palm Residency Villa",
      type: "Villa",
      city: "Navi Mumbai",
      area: "Kharghar",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
    },

    tenant: {
      id: 204,
      name: "Simran Kaur",
      email: "simran@gmail.com",
      phone: "9001122334",
    },

    landlord: {
      id: 304,
      name: "Amit Deshmukh",
      email: "amit@gmail.com",
      phone: "9988776655",
    },

    payment: {
      status: "PAID",
      transactionId: "TXN-RS-7654",
      amount: 135000,
      paidOn: "07 Jul 2025",
    },

    lease: {
      status: "COMPLETED",
      startDate: "01 Aug 2025",
      endDate: "31 Jul 2026",
    },
  },
];

export default bookingData;