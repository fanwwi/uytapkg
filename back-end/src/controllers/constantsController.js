import {
  REGIONS,
  BISHKEK_DISTRICTS,
  ISSYK_KUL_LOCATIONS,
  CHUY_LOCATIONS,
  OSH_CITY_DISTRICTS,
  OSH_REGION_LOCATIONS,
  JALAL_ABAD_LOCATIONS,
  NARYN_LOCATIONS,
  TALAS_LOCATIONS,
  BATKEN_LOCATIONS,
  TURKEY_LOCATIONS,
} from "../constants/locations.js";
import { RESORT_AMENITIES, GENERAL_AMENITIES } from "../constants/amenities.js";
import { PROPERTY_TYPES, DEAL_TYPES, RENT_PERIODS } from "../constants/propertyTypes.js";

export const getConstants = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        regions: REGIONS,
        locationsByRegion: {
          BISHKEK: BISHKEK_DISTRICTS,
          ISSYK_KUL: ISSYK_KUL_LOCATIONS,
          CHUY: CHUY_LOCATIONS,
          OSH_CITY: OSH_CITY_DISTRICTS,
          OSH_REGION: OSH_REGION_LOCATIONS,
          JALAL_ABAD: JALAL_ABAD_LOCATIONS,
          NARYN: NARYN_LOCATIONS,
          TALAS: TALAS_LOCATIONS,
          BATKEN: BATKEN_LOCATIONS,
          TURKEY: TURKEY_LOCATIONS,
        },
        amenities: {
          resort: RESORT_AMENITIES,
          general: GENERAL_AMENITIES,
        },
        propertyTypes: PROPERTY_TYPES,
        dealTypes: DEAL_TYPES,
        rentPeriods: RENT_PERIODS,
      },
    });
  } catch (error) {
    console.error("Error in getConstants controller:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка сервера при получении справочников.",
    });
  }
};
