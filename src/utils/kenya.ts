// Kenya Localization & Market Utilities

export interface SubCounty {
  name: string;
  neighborhoods: string[];
}

export interface CountyData {
  name: string;
  subCounties: SubCounty[];
}

export const KENYA_COUNTIES: CountyData[] = [
  {
    name: "Nairobi",
    subCounties: [
      {
        name: "Westlands",
        neighborhoods: ["Kilimani", "Lavington", "Kileleshwa", "Parklands", "Spring Valley", "Riverside", "Highridge"]
      },
      {
        name: "Lang'ata",
        neighborhoods: ["Karen", "South C", "Dam Estate", "Nairobi West", "Madaraka"]
      },
      {
        name: "Starehe",
        neighborhoods: ["South B", "CBD", "Ngara", "Pangani"]
      },
      {
        name: "Dagoretti",
        neighborhoods: ["Riruta", "Satellite", "Kawangware", "Dagoretti Corner"]
      },
      {
        name: "Embakasi",
        neighborhoods: ["Fedha", "Donholm", "Imara Daima", "Nyayo Estate", "Pipelines"]
      },
      {
        name: "Kasarani",
        neighborhoods: ["Roysambu", "Mirema", "TRM Area", "Garden Estate", "Kasarani Town"]
      },
      {
        name: "Roysambu",
        neighborhoods: ["Kahawa West", "Zimmerman", "Roysambu"]
      }
    ]
  },
  {
    name: "Kiambu",
    subCounties: [
      {
        name: "Ruiru",
        neighborhoods: ["Kahawa Sukari", "Kahawa Wendani", "Kimbo", "Membley", "Ruiru Town"]
      },
      {
        name: "Thika",
        neighborhoods: ["Section 9", "Landless", "Thika Greens", "Nkurruman"]
      },
      {
        name: "Kiambu Town",
        neighborhoods: ["Indian Bazaar", "Ndumberi", "Kirae"]
      },
      {
        name: "Kikuyu",
        neighborhoods: ["Kikuyu Town", "Gitaru", "Regen", "Kidfarmaco"]
      }
    ]
  },
  {
    name: "Mombasa",
    subCounties: [
      {
        name: "Nyali",
        neighborhoods: ["Beach Road", "City Mall Area", "Cinemax", "Nyali Estate"]
      },
      {
        name: "Kisauni",
        neighborhoods: ["Bamburi", "Shanzu", "Mwakirunge"]
      },
      {
        name: "Mvita",
        neighborhoods: ["Tudor", "Ganjoni", "Old Town", "CBD"]
      }
    ]
  },
  {
    name: "Nakuru",
    subCounties: [
      {
        name: "Nakuru East",
        neighborhoods: ["Milimani", "Section 58", "Freehold", "Naka"]
      },
      {
        name: "Naivasha",
        neighborhoods: ["Lake Naivasha", "Moi South Lake", "Naivasha Town", "Karasani"]
      }
    ]
  },
  {
    name: "Kisumu",
    subCounties: [
      {
        name: "Kisumu Central",
        neighborhoods: ["Milimani", "Tom Mboya Estate", "Lolwe", "Riat Hills"]
      },
      {
        name: "Kisumu East",
        neighborhoods: ["Mamboleo", "Kibos", "Manyatta"]
      }
    ]
  },
  {
    name: "Machakos",
    subCounties: [
      {
        name: "Mavoko",
        neighborhoods: ["Syokimau", "Athi River", "Daystar Area", "Mlolongo"]
      },
      {
        name: "Machakos Town",
        neighborhoods: ["Machakos Town", "Katumani", "Miwani"]
      }
    ]
  },
  {
    name: "Kajiado",
    subCounties: [
      {
        name: "Kajiado East",
        neighborhoods: ["Kitengela", "Isinya"]
      },
      {
        name: "Kajiado North",
        neighborhoods: ["Ongata Rongai", "Ngong Town", "Nkoroi"]
      }
    ]
  },
  {
    name: "Uasin Gishu",
    subCounties: [
      {
        name: "Ainabkoi",
        neighborhoods: ["Elgon View", "Kapsoya", "Eldoret CBD"]
      }
    ]
  }
];

// Landmark tags common in Kenyan search queries
export const POPULAR_KENYA_LANDMARKS = [
  "Near Sarit Centre",
  "Near Yaya Centre",
  "Near TRM Mall",
  "Near Junction Mall",
  "Near Two Rivers Mall",
  "Near Garden City",
  "Near Westgate Mall",
  "Near City Mall Nyali",
  "Near JKIA Airport",
  "Near Nairobi Expressway",
  "Near Kenyatta University",
  "Near Strathmore University",
  "Near USIU Africa",
  "Near Karen Country Club"
];

/**
 * Format currency in Kenyan Shillings (KES / KSh)
 */
export function formatKES(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "KSh 0";
  }
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

/**
 * Validate Kenyan Mobile Phone Numbers
 * Accepts:
 * - Local format: 0712345678, 0110123456
 * - International format: +254712345678, +254110123456
 * - Raw country code format: 254712345678, 254110123456
 */
export function validateKenyanPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, normalized: "", error: "Phone number is required." };
  }

  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Regex pattern matching Kenya mobile numbers (07XX, 01XX, +2547XX, +2541XX)
  const localRegex = /^(07|01)\d{8}$/;
  const intlRegex = /^(\+?254)(7|1)\d{8}$/;

  if (localRegex.test(cleaned)) {
    const formatted = `+254${cleaned.substring(1)}`;
    return { isValid: true, normalized: formatted };
  }

  if (intlRegex.test(cleaned)) {
    const formatted = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
    return { isValid: true, normalized: formatted };
  }

  return {
    isValid: false,
    normalized: phone,
    error: "Invalid Kenya phone number. Use format: 0712345678, 0110000000, or +254712345678"
  };
}

/**
 * Display formatted Kenyan phone number
 */
export function formatKenyanPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+254") && cleaned.length === 13) {
    return `+254 ${cleaned.substring(4, 7)} ${cleaned.substring(7, 10)} ${cleaned.substring(10)}`;
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  return phone;
}

/**
 * Format Date in East Africa Time (EAT / UTC+3) and DD/MM/YYYY format
 */
export function formatEATDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Africa/Nairobi"
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format Full Date & Time in East Africa Time (EAT / UTC+3)
 */
export function formatEATDateTime(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Nairobi"
    }).format(date);

    return `${formattedDate} EAT`;
  } catch {
    return dateString;
  }
}
