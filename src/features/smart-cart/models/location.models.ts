export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SelectedLocation extends Coordinates, CityLocation {
  address: string;
}

export interface AddressResult extends Coordinates, CityLocation {
  id: string;
  displayName: string;
}

export interface CityLocation extends Coordinates {
  city: string;
  state: string;
}

 