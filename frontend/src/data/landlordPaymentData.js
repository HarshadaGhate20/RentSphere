const landlordPaymentData = [
  {
    id: "PAY-2001",
    transactionId: "pay_RSP10001",
    razorpayOrderId: "order_RSP90001",
    bookingId: "BOOK-1001",
    type: "MONTHLY_RENT",
    status: "SUCCESS",
    amount: 28000,
    paymentMethod: "UPI",
    paidOn: "05 Aug 2026, 11:15 AM",

    tenant: {
      id: "TEN-201",
      name: "Aditi Verma",
      email: "aditi@gmail.com",
      phone: "9876543210",
    },

    property: {
      id: 101,
      title: "Luxury Apartment",
      locality: "Andheri West",
      city: "Mumbai",
    },
  },

  {
    id: "PAY-2002",
    transactionId: "pay_RSP10002",
    razorpayOrderId: "order_RSP90002",
    bookingId: "BOOK-1001",
    type: "SECURITY_DEPOSIT",
    status: "SUCCESS",
    amount: 56000,
    paymentMethod: "CARD",
    paidOn: "03 Aug 2026, 10:30 AM",

    tenant: {
      id: "TEN-201",
      name: "Aditi Verma",
      email: "aditi@gmail.com",
      phone: "9876543210",
    },

    property: {
      id: 101,
      title: "Luxury Apartment",
      locality: "Andheri West",
      city: "Mumbai",
    },
  },

  {
    id: "PAY-2003",
    transactionId: null,
    razorpayOrderId: "order_RSP90003",
    bookingId: "BOOK-1002",
    type: "BOOKING_AMOUNT",
    status: "PENDING",
    amount: 8200,
    paymentMethod: "UPI",
    paidOn: null,

    tenant: {
      id: "TEN-202",
      name: "Karan Shah",
      email: "karan@gmail.com",
      phone: "9911223344",
    },

    property: {
      id: 102,
      title: "Premium PG",
      locality: "Hinjewadi",
      city: "Pune",
    },
  },

  {
    id: "PAY-2004",
    transactionId: "pay_RSP10004",
    razorpayOrderId: "order_RSP90004",
    bookingId: "BOOK-1003",
    type: "MONTHLY_RENT",
    status: "FAILED",
    amount: 17500,
    paymentMethod: "NET_BANKING",
    paidOn: "02 Aug 2026, 05:20 PM",
    failureReason: "Payment gateway timeout",

    tenant: {
      id: "TEN-203",
      name: "Simran Kaur",
      email: "simran@gmail.com",
      phone: "9001122334",
    },

    property: {
      id: 103,
      title: "Skyline Studio",
      locality: "Powai",
      city: "Mumbai",
    },
  },

  {
    id: "PAY-2005",
    transactionId: "pay_RSP10005",
    razorpayOrderId: "order_RSP90005",
    bookingId: "BOOK-1004",
    type: "SECURITY_DEPOSIT",
    status: "REFUNDED",
    amount: 44000,
    paymentMethod: "CARD",
    paidOn: "20 Jul 2026, 01:10 PM",
    refundedAmount: 44000,
    refundedOn: "04 Aug 2026, 04:45 PM",
    refundReference: "rfnd_RSP5001",

    tenant: {
      id: "TEN-204",
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      phone: "9898989898",
    },

    property: {
      id: 104,
      title: "Palm Residency",
      locality: "College Road",
      city: "Nashik",
    },
  },
];

export default landlordPaymentData;