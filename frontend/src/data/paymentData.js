const paymentData = [
  {
    id: "PAY-1001",
    transactionId: "TXN-RS-9001",
    bookingId: "BOOK-1001",
    type: "SECURITY_DEPOSIT",
    status: "SUCCESS",
    amount: 56000,
    paymentMethod: "UPI",
    paidOn: "03 Aug 2026, 10:30 AM",
    refundedAmount: 0,
    flagged: false,

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
    },

    property: {
      id: 1,
      title: "Luxury Apartment",
      city: "Mumbai",
      area: "Andheri West",
    },
  },

  {
    id: "PAY-1002",
    transactionId: "TXN-RS-9002",
    bookingId: "BOOK-1001",
    type: "MONTHLY_RENT",
    status: "SUCCESS",
    amount: 28000,
    paymentMethod: "CARD",
    paidOn: "03 Aug 2026, 11:15 AM",
    refundedAmount: 0,
    flagged: false,

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
    },

    property: {
      id: 1,
      title: "Luxury Apartment",
      city: "Mumbai",
      area: "Andheri West",
    },
  },

  {
    id: "PAY-1003",
    transactionId: null,
    bookingId: "BOOK-1002",
    type: "BOOKING_AMOUNT",
    status: "PENDING",
    amount: 23500,
    paymentMethod: "UPI",
    paidOn: null,
    refundedAmount: 0,
    flagged: false,

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
    },

    property: {
      id: 2,
      title: "Premium PG",
      city: "Pune",
      area: "Hinjewadi",
    },
  },

  {
    id: "PAY-1004",
    transactionId: "TXN-RS-9004",
    bookingId: "BOOK-1003",
    type: "BOOKING_AMOUNT",
    status: "FAILED",
    amount: 54000,
    paymentMethod: "NET_BANKING",
    paidOn: "28 Jul 2026, 05:20 PM",
    failureReason: "Payment gateway timeout",
    refundedAmount: 0,
    flagged: true,

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
    },

    property: {
      id: 4,
      title: "Skyline Studio",
      city: "Mumbai",
      area: "Powai",
    },
  },

  {
    id: "PAY-1005",
    transactionId: "TXN-RS-9005",
    bookingId: "BOOK-1004",
    type: "SECURITY_DEPOSIT",
    status: "REFUNDED",
    amount: 90000,
    paymentMethod: "CARD",
    paidOn: "07 Jul 2025, 01:10 PM",
    refundedAmount: 90000,
    refundedOn: "02 Aug 2026, 04:45 PM",
    refundReference: "REF-RS-501",
    flagged: false,

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
    },

    property: {
      id: 3,
      title: "Palm Residency Villa",
      city: "Navi Mumbai",
      area: "Kharghar",
    },
  },
];

export default paymentData;