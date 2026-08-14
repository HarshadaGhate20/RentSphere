const rentInquiryData = [
  {
    id: "INQ-1001",
    status: "ACTIVE",
    createdOn: "03 Aug 2026",
    lastUpdated: "05 Aug 2026",

    tenant: {
      name: "Aditi Verma",
      email: "aditi@gmail.com",
      phone: "9876543210",
    },

    landlord: {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9823456789",
    },

    property: {
      id: 1,
      title: "Luxury Apartment",
      type: "Apartment",
      city: "Mumbai",
      area: "Andheri West",
      rent: 28000,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    },

    tenantOffer: 25000,
    landlordOffer: 27000,
    finalRent: null,

    message:
      "I am interested in renting this apartment for at least 12 months.",

    negotiations: [
      {
        id: 1,
        sender: "TENANT",
        senderName: "Aditi Verma",
        amount: 25000,
        message: "Can the monthly rent be reduced to ₹25,000?",
        time: "03 Aug 2026, 11:20 AM",
      },
      {
        id: 2,
        sender: "LANDLORD",
        senderName: "Rahul Sharma",
        amount: 27500,
        message: "I can reduce the rent to ₹27,500.",
        time: "03 Aug 2026, 04:30 PM",
      },
      {
        id: 3,
        sender: "TENANT",
        senderName: "Aditi Verma",
        amount: 26000,
        message: "My final offer is ₹26,000.",
        time: "04 Aug 2026, 10:15 AM",
      },
      {
        id: 4,
        sender: "LANDLORD",
        senderName: "Rahul Sharma",
        amount: 27000,
        message: "₹27,000 is the lowest possible monthly rent.",
        time: "05 Aug 2026, 09:10 AM",
      },
    ],
  },

  {
    id: "INQ-1002",
    status: "ACTIVE",
    createdOn: "04 Aug 2026",
    lastUpdated: "04 Aug 2026",

    tenant: {
      name: "Karan Shah",
      email: "karan@gmail.com",
      phone: "9911223344",
    },

    landlord: {
      name: "Sneha Joshi",
      email: "sneha@gmail.com",
      phone: "9988776655",
    },

    property: {
      id: 4,
      title: "Skyline Studio",
      type: "Studio",
      city: "Mumbai",
      area: "Powai",
      rent: 18000,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    },

    tenantOffer: 16500,
    landlordOffer: 17500,
    finalRent: null,

    message:
      "I need this studio from September for a long-term stay.",

    negotiations: [
      {
        id: 1,
        sender: "TENANT",
        senderName: "Karan Shah",
        amount: 16500,
        message: "Can you offer this property for ₹16,500?",
        time: "04 Aug 2026, 02:00 PM",
      },
      {
        id: 2,
        sender: "LANDLORD",
        senderName: "Sneha Joshi",
        amount: 17500,
        message: "I can offer it for ₹17,500.",
        time: "04 Aug 2026, 06:20 PM",
      },
    ],
  },

  {
    id: "INQ-1003",
    status: "CANCELLED",
    createdOn: "29 Jul 2026",
    lastUpdated: "01 Aug 2026",

    tenant: {
      name: "Simran Kaur",
      email: "simran@gmail.com",
      phone: "9001122334",
    },

    landlord: {
      name: "Amit Deshmukh",
      email: "amit@gmail.com",
      phone: "9877001122",
    },

    property: {
      id: 3,
      title: "Palm Residency Villa",
      type: "Villa",
      city: "Navi Mumbai",
      area: "Kharghar",
      rent: 45000,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    },

    tenantOffer: 40000,
    landlordOffer: 44000,
    finalRent: null,

    message:
      "I was considering this villa for my family.",

    cancellationReason:
      "Tenant selected another property closer to the workplace.",

    negotiations: [
      {
        id: 1,
        sender: "TENANT",
        senderName: "Simran Kaur",
        amount: 40000,
        message: "Would ₹40,000 per month be acceptable?",
        time: "29 Jul 2026, 12:40 PM",
      },
      {
        id: 2,
        sender: "LANDLORD",
        senderName: "Amit Deshmukh",
        amount: 44000,
        message: "The minimum possible rent is ₹44,000.",
        time: "30 Jul 2026, 10:30 AM",
      },
    ],
  },

  {
    id: "INQ-1004",
    status: "CLOSED",
    createdOn: "25 Jul 2026",
    lastUpdated: "30 Jul 2026",

    tenant: {
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      phone: "9898989898",
    },

    landlord: {
      name: "Priya Patil",
      email: "priya@gmail.com",
      phone: "9123456780",
    },

    property: {
      id: 2,
      title: "Premium PG",
      type: "PG",
      city: "Pune",
      area: "Hinjewadi",
      rent: 8500,
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    },

    tenantOffer: 8000,
    landlordOffer: 8200,
    finalRent: 8200,

    message:
      "I need a furnished PG near the IT park.",

    negotiations: [
      {
        id: 1,
        sender: "TENANT",
        senderName: "Rohan Mehta",
        amount: 8000,
        message: "Can the rent be reduced to ₹8,000?",
        time: "25 Jul 2026, 09:30 AM",
      },
      {
        id: 2,
        sender: "LANDLORD",
        senderName: "Priya Patil",
        amount: 8200,
        message: "I can finalize it for ₹8,200.",
        time: "26 Jul 2026, 01:10 PM",
      },
      {
        id: 3,
        sender: "TENANT",
        senderName: "Rohan Mehta",
        amount: 8200,
        message: "Accepted.",
        time: "30 Jul 2026, 11:00 AM",
      },
    ],
  },
];

export default rentInquiryData;