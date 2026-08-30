"use client";

import ApartmentFilters from "../ApartmentFilters/ApartmentFilters";
import HouseFilters from "../HouseFilters/HouseFilters";
import LandFilters from "../LandFilters/LandFilters";
import RoomFilters from "../RoomFilters/RoomFilters";
import CommercialFilters from "../CommercialFilters/CommercialFilters";
import ParkingFilters from "../ParkingFilters/ParkingFilters";

export default function CategoryFilters({ category, filters, updateFilter }) {
  switch (category) {
    case "Квартира":
      return <ApartmentFilters filters={filters} updateFilter={updateFilter} />;

    case "Дом":
      return <HouseFilters filters={filters} updateFilter={updateFilter} />;

    case "Коттедж":
      return (
        <HouseFilters filters={filters} updateFilter={updateFilter} cottage />
      );

    case "Участок":
      return <LandFilters filters={filters} updateFilter={updateFilter} />;

    case "Комнаты":
      return <RoomFilters filters={filters} updateFilter={updateFilter} />;

    case "Коммерция":
      return (
        <CommercialFilters filters={filters} updateFilter={updateFilter} />
      );

    case "Паркинг/гараж":
      return <ParkingFilters filters={filters} updateFilter={updateFilter} />;

    default:
      return null;
  }
}
