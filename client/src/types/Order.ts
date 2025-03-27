export type TOrder = {
  id: number;
  name: string;
  status: {
    type: string;
    description: string;
  };
  locationInfo: {
    from: string;
    goingTo: string;
  };
};
