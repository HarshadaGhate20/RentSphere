const propertyDetailsData = [
  {
    id: 1,
    title: "Luxury 2 BHK Apartment",
    category: "Apartment",
    description:
      "A spacious fully furnished apartment in Andheri West with modern interiors, excellent connectivity and essential facilities nearby.",

    city: "Mumbai",
    locality: "Andheri West",
    address: "Veera Desai Road, Andheri West, Mumbai",
    pincode: "400053",

    rent: 28000,
    securityDeposit: 56000,
    maintenanceCharge: 2500,

    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    areaSqft: 1100,
    floorNumber: 7,
    totalFloors: 15,

    furnishingStatus: "Fully Furnished",
    availableFrom: "Immediately Available",
    parkingAvailable: true,
    preferredTenants: "Family or Working Professionals",

    rating: 4.8,
    reviewCount: 24,

    amenities: [
      "Lift",
      "Parking",
      "CCTV",
      "Security",
      "Power Backup",
      "Water Supply",
      "Modular Kitchen",
      "Air Conditioning",
      "Wi-Fi",
      "Garden",
    ],

    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1400",
    ],

    landlord: {
      id: 301,
      name: "Rahul Sharma",
      verified: true,
      city: "Mumbai",
      memberSince: "January 2024",
      approvedProperties: 6,
      responseRate: "96%",
      responseTime: "Usually within 2 hours",
    },
  },

  {
    id: 2,
    title: "Premium PG for Girls",
    category: "PG",
    description:
      "A secure and fully furnished PG near Hinjewadi IT Park with meals, Wi-Fi, housekeeping and twenty-four-hour security.",

    city: "Pune",
    locality: "Hinjewadi",
    address: "Phase 1, Hinjewadi, Pune",
    pincode: "411057",

    rent: 8500,
    securityDeposit: 15000,
    maintenanceCharge: 0,

    bedrooms: 1,
    bathrooms: 1,
    balconies: 0,
    areaSqft: 420,
    floorNumber: 3,
    totalFloors: 6,

    furnishingStatus: "Fully Furnished",
    availableFrom: "Immediately Available",
    parkingAvailable: false,
    preferredTenants: "Female Students or Professionals",

    rating: 4.5,
    reviewCount: 18,

    amenities: [
      "Wi-Fi",
      "Meals",
      "CCTV",
      "Security",
      "Housekeeping",
      "Power Backup",
      "Laundry",
      "Water Supply",
    ],

    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1400",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400",
    ],

    landlord: {
      id: 302,
      name: "Priya Patil",
      verified: true,
      city: "Pune",
      memberSince: "June 2024",
      approvedProperties: 4,
      responseRate: "92%",
      responseTime: "Usually within 3 hours",
    },
  },

  {
    id: 3,
    title: "Modern Villa",
    category: "Villa",
    description:
      "A premium four-bedroom villa in Kharghar featuring spacious rooms, private parking, landscaped outdoor space and modern architecture.",

    city: "Navi Mumbai",
    locality: "Kharghar",
    address: "Sector 35, Kharghar, Navi Mumbai",
    pincode: "410210",

    rent: 45000,
    securityDeposit: 90000,
    maintenanceCharge: 4000,

    bedrooms: 4,
    bathrooms: 3,
    balconies: 2,
    areaSqft: 2600,
    floorNumber: 0,
    totalFloors: 2,

    furnishingStatus: "Semi Furnished",
    availableFrom: "01 Sep 2026",
    parkingAvailable: true,
    preferredTenants: "Family",

    rating: 4.9,
    reviewCount: 31,

    amenities: [
      "Private Parking",
      "Garden",
      "CCTV",
      "Security",
      "Power Backup",
      "Water Supply",
      "Modular Kitchen",
      "Pet Friendly",
    ],

    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400",
    ],

    landlord: {
      id: 303,
      name: "Amit Deshmukh",
      verified: true,
      city: "Navi Mumbai",
      memberSince: "March 2023",
      approvedProperties: 9,
      responseRate: "98%",
      responseTime: "Usually within 1 hour",
    },
  },
];

export default propertyDetailsData;