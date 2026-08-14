const landlordBookingData = [
  {
    id: "REQ-1001",
    status: "PENDING",
    createdOn: "05 Aug 2026",
    moveInDate: "01 Sep 2026",
    durationMonths: 12,
    requestedRent: 26000,
    listedRent: 28000,
    counterOffer: null,
    rejectionReason: "",

    tenant: {
      id: "TEN-201",
      name: "Aditi Verma",
      email: "aditi@gmail.com",
      phone: "9876543210",
      city: "Mumbai",
    },

    property: {
      id: 101,
      title: "Luxury Apartment",
      type: "Apartment",
      locality: "Andheri West",
      city: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900",
    },

    message:
      "I am interested in renting this apartment for twelve months. I can move in from 1 September.",
  },

  {
    id: "REQ-1002",
    status: "PENDING",
    createdOn: "04 Aug 2026",
    moveInDate: "15 Aug 2026",
    durationMonths: 6,
    requestedRent: 8000,
    listedRent: 8500,
    counterOffer: 8200,
    rejectionReason: "",

    tenant: {
      id: "TEN-202",
      name: "Karan Shah",
      email: "karan@gmail.com",
      phone: "9911223344",
      city: "Pune",
    },

    property: {
      id: 102,
      title: "Premium PG",
      type: "PG",
      locality: "Hinjewadi",
      city: "Pune",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900",
    },

    message:
      "I need a furnished PG close to the IT park for six months.",
  },

  {
    id: "REQ-1003",
    status: "ACCEPTED",
    createdOn: "01 Aug 2026",
    moveInDate: "20 Aug 2026",
    durationMonths: 11,
    requestedRent: 17500,
    listedRent: 18000,
    counterOffer: 17500,
    rejectionReason: "",

    tenant: {
      id: "TEN-203",
      name: "Simran Kaur",
      email: "simran@gmail.com",
      phone: "9001122334",
      city: "Mumbai",
    },

    property: {
      id: 103,
      title: "Skyline Studio",
      type: "Studio",
      locality: "Powai",
      city: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900",
    },

    message:
      "I have accepted the final rent and would like to continue with the booking.",
  },

  {
    id: "REQ-1004",
    status: "REJECTED",
    createdOn: "29 Jul 2026",
    moveInDate: "10 Aug 2026",
    durationMonths: 3,
    requestedRent: 19000,
    listedRent: 22000,
    counterOffer: null,
    rejectionReason:
      "The requested rental duration is shorter than the minimum lease period.",

    tenant: {
      id: "TEN-204",
      name: "Rohan Mehta",
      email: "rohan@gmail.com",
      phone: "9898989898",
      city: "Nashik",
    },

    property: {
      id: 104,
      title: "Palm Residency",
      type: "Apartment",
      locality: "College Road",
      city: "Nashik",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900",
    },

    message:
      "I require the property for approximately three months.",
  },

  {
    id: "REQ-1005",
    status: "CANCELLED",
    createdOn: "25 Jul 2026",
    moveInDate: "05 Aug 2026",
    durationMonths: 12,
    requestedRent: 27500,
    listedRent: 28000,
    counterOffer: null,
    rejectionReason: "",

    tenant: {
      id: "TEN-205",
      name: "Neha Singh",
      email: "neha@gmail.com",
      phone: "9887766554",
      city: "Mumbai",
    },

    property: {
      id: 101,
      title: "Luxury Apartment",
      type: "Apartment",
      locality: "Andheri West",
      city: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900",
    },

    message:
      "The tenant cancelled this request before confirmation.",
  },
];

export default landlordBookingData;