export interface IconProperties {
  width?: number;
  height?: number;
  additionalClasses?: string;
}

export interface EyesProperties extends IconProperties {
  width: number;
  height: number;
  additionalClasses: string;
  type: "open" | "closed";
}