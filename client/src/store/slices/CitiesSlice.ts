import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TCities = {
  id: number;
  name: string;
}[];

type TCitiesState = {
  cities: TCities | null;
};

const initialState: TCitiesState = {
  cities: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<TCities>) => {
      state.cities = action.payload;
    },
  },
});

export const { setCities } = citiesSlice.actions;
export default citiesSlice.reducer;
