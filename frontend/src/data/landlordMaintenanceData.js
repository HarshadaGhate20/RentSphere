const landlordMaintenanceData = [
  {
    id: "MNT-1001",
    category: "PLUMBING",
    priority: "HIGH",
    status: "OPEN",
    title: "Water leakage under kitchen sink",
    description:
      "Water is continuously leaking from the pipe below the kitchen sink. The cabinet is becoming wet.",
    createdOn: "05 Aug 2026, 09:20 AM",
    updatedOn: "05 Aug 2026, 09:20 AM",
    preferredVisitDate: "07 Aug 2026",
    resolutionNote: "",

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
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900",
    },
  },

  {
    id: "MNT-1002",
    category: "ELECTRICAL",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    title: "Bedroom fan is not working",
    description:
      "The ceiling fan in the main bedroom stopped working yesterday evening.",
    createdOn: "03 Aug 2026, 06:45 PM",
    updatedOn: "04 Aug 2026, 11:30 AM",
    preferredVisitDate: "06 Aug 2026",
    resolutionNote:
      "Electrician assigned. Inspection is scheduled for 6 August.",

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
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900",
    },
  },

  {
    id: "MNT-1003",
    category: "APPLIANCE",
    priority: "LOW",
    status: "RESOLVED",
    title: "Refrigerator cooling problem",
    description:
      "The refrigerator was not cooling properly and food items were getting spoiled.",
    createdOn: "28 Jul 2026, 10:15 AM",
    updatedOn: "30 Jul 2026, 04:40 PM",
    preferredVisitDate: "29 Jul 2026",
    resolvedOn: "30 Jul 2026",
    resolutionNote:
      "The refrigerator gas was refilled and the cooling system was tested successfully.",

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
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900",
    },
  },

  {
    id: "MNT-1004",
    category: "SECURITY",
    priority: "URGENT",
    status: "OPEN",
    title: "Main door lock is damaged",
    description:
      "The main entrance door lock is loose and cannot be secured properly.",
    createdOn: "05 Aug 2026, 07:10 AM",
    updatedOn: "05 Aug 2026, 07:10 AM",
    preferredVisitDate: "05 Aug 2026",
    resolutionNote: "",

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
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900",
    },
  },
];

export default landlordMaintenanceData;