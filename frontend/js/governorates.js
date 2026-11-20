// Egyptian Governorates Data
const egyptGovernorates = {
  'Cairo': {
    name_en: 'Cairo',
    name_ar: 'القاهرة',
    coordinates: [30.0444, 31.2357]
  },
  'Giza': {
    name_en: 'Giza',
    name_ar: 'الجيزة',
    coordinates: [30.0131, 31.2089]
  },
  'Alexandria': {
    name_en: 'Alexandria',
    name_ar: 'الإسكندرية',
    coordinates: [31.2001, 29.9187]
  },
  'Dakahlia': {
    name_en: 'Dakahlia',
    name_ar: 'الدقهلية',
    coordinates: [31.0409, 31.3785]
  },
  'Red Sea': {
    name_en: 'Red Sea',
    name_ar: 'البحر الأحمر',
    coordinates: [24.6826, 34.1532]
  },
  'Beheira': {
    name_en: 'Beheira',
    name_ar: 'البحيرة',
    coordinates: [30.8481, 30.3436]
  },
  'Fayoum': {
    name_en: 'Fayoum',
    name_ar: 'الفيوم',
    coordinates: [29.3084, 30.8428]
  },
  'Gharbia': {
    name_en: 'Gharbia',
    name_ar: 'الغربية',
    coordinates: [30.8754, 31.0335]
  },
  'Ismailia': {
    name_en: 'Ismailia',
    name_ar: 'الإسماعيلية',
    coordinates: [30.5833, 32.2667]
  },
  'Menofia': {
    name_en: 'Menofia',
    name_ar: 'المنوفية',
    coordinates: [30.5972, 30.9876]
  },
  'Minya': {
    name_en: 'Minya',
    name_ar: 'المنيا',
    coordinates: [28.0871, 30.7618]
  },
  'Qaliubiya': {
    name_en: 'Qaliubiya',
    name_ar: 'القليوبية',
    coordinates: [30.3213, 31.2118]
  },
  'New Valley': {
    name_en: 'New Valley',
    name_ar: 'الوادي الجديد',
    coordinates: [25.4524, 28.5503]
  },
  'Suez': {
    name_en: 'Suez',
    name_ar: 'السويس',
    coordinates: [29.9668, 32.5498]
  },
  'Aswan': {
    name_en: 'Aswan',
    name_ar: 'أسوان',
    coordinates: [24.0889, 32.8998]
  },
  'Assiut': {
    name_en: 'Assiut',
    name_ar: 'أسيوط',
    coordinates: [27.1809, 31.1837]
  },
  'Beni Suef': {
    name_en: 'Beni Suef',
    name_ar: 'بني سويف',
    coordinates: [29.0661, 31.0994]
  },
  'Port Said': {
    name_en: 'Port Said',
    name_ar: 'بورسعيد',
    coordinates: [31.2653, 32.3019]
  },
  'Damietta': {
    name_en: 'Damietta',
    name_ar: 'دمياط',
    coordinates: [31.4175, 31.8133]
  },
  'Sharqia': {
    name_en: 'Sharqia',
    name_ar: 'الشرقية',
    coordinates: [30.5965, 31.5041]
  },
  'South Sinai': {
    name_en: 'South Sinai',
    name_ar: 'جنوب سيناء',
    coordinates: [28.9681, 33.6176]
  },
  'Kafr El Sheikh': {
    name_en: 'Kafr El Sheikh',
    name_ar: 'كفر الشيخ',
    coordinates: [31.3047, 30.9408]
  },
  'Matrouh': {
    name_en: 'Matrouh',
    name_ar: 'مطروح',
    coordinates: [31.3543, 27.2373]
  },
  'Luxor': {
    name_en: 'Luxor',
    name_ar: 'الأقصر',
    coordinates: [25.6872, 32.6396]
  },
  'Qena': {
    name_en: 'Qena',
    name_ar: 'قنا',
    coordinates: [26.1551, 32.7160]
  },
  'North Sinai': {
    name_en: 'North Sinai',
    name_ar: 'شمال سيناء',
    coordinates: [31.1250, 33.7975]
  },
  'Sohag': {
    name_en: 'Sohag',
    name_ar: 'سوهاج',
    coordinates: [26.5569, 31.6948]
  }
};

// Get sorted governorate list for dropdowns
function getGovernoratesList() {
  return Object.keys(egyptGovernorates).sort();
}

// Get governorate name based on current language
function getGovernorateName(governorate, lang = 'en') {
  if (!egyptGovernorates[governorate]) return governorate;
  return lang === 'ar' ? egyptGovernorates[governorate].name_ar : egyptGovernorates[governorate].name_en;
}

// Get governorate coordinates
function getGovernorateCoordinates(governorate) {
  if (!egyptGovernorates[governorate]) return [30.0444, 31.2357]; // Default to Cairo
  return egyptGovernorates[governorate].coordinates;
}
