export const adminStats = [
  {
    id: 1,
    title: "Total Properties",
    value: "2,500",
    change: "+12%",
    changeText: "from last month",
    type: "properties",
  },
  {
    id: 2,
    title: "Pending Reviews",
    value: "28",
    change: "+6",
    changeText: "new submissions",
    type: "pending",
  },
  {
    id: 3,
    title: "Total Landlords",
    value: "1,200",
    change: "+5%",
    changeText: "from last month",
    type: "landlords",
  },
  {
    id: 4,
    title: "Total Tenants",
    value: "5,400",
    change: "+18%",
    changeText: "from last month",
    type: "tenants",
  },
];

export const recentProperties = [
  {
    id: 101,
    name: "Skyline Premium Apartment",
    location: "Andheri West, Mumbai",
    landlord: "Rahul Sharma",
    rent: 28000,
    type: "Apartment",
    status: "PENDING",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  },
  {
    id: 102,
    name: "Urban Nest PG",
    location: "Hinjewadi, Pune",
    landlord: "Priya Patil",
    rent: 9500,
    type: "PG",
    status: "APPROVED",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
  },
  {
    id: 103,
    name: "Palm Residency Villa",
    location: "Kharghar, Navi Mumbai",
    landlord: "Amit Deshmukh",
    rent: 48000,
    type: "Villa",
    status: "REJECTED",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "New property submitted",
    description: "Rahul Sharma submitted Skyline Premium Apartment.",
    time: "10 minutes ago",
    type: "property",
  },
  {
    id: 2,
    title: "Booking approved",
    description: "PG room booking for tenant Aditi was approved.",
    time: "35 minutes ago",
    type: "booking",
  },
  {
    id: 3,
    title: "Payment received",
    description: "Monthly rent payment of ₹28,000 was completed.",
    time: "1 hour ago",
    type: "payment",
  },
  {
    id: 4,
    title: "New landlord registered",
    description: "Neha Kulkarni registered as a landlord.",
    time: "2 hours ago",
    type: "user",
  },
];

export const recentPayments = [
  {
    id: "PAY-1001",
    tenant: "Aditi Verma",
    property: "Skyline Premium Apartment",
    amount: 28000,
    date: "04 Aug 2026",
    status: "PAID",
  },
  {
    id: "PAY-1002",
    tenant: "Karan Shah",
    property: "Urban Nest PG",
    amount: 9500,
    date: "03 Aug 2026",
    status: "PENDING",
  },
  {
    id: "PAY-1003",
    tenant: "Simran Kaur",
    property: "Lake View Studio",
    amount: 18000,
    date: "03 Aug 2026",
    status: "PAID",
  },
];