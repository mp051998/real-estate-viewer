
export interface StateConfig {
  id: string,
  name: string,
  country: string
};

export interface PropertyTypeConfig {
  id: string,
  name: string
};

export interface RealEstateViewerConfig {
  id: string,
  data: {
    states: StateConfig[],
    propertyTypes: PropertyTypeConfig[]
  }
}
