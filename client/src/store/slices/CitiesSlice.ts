import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TCity = {
  id: number;
  name: string;
}[];

type TCitiesState = {
  city: TCity | null;
};

const initialState: TCitiesState = {
  city: null,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<TCity>) => {
      state.city = action.payload;
    },
  },
});

export const { setCities } = citiesSlice.actions;
export default citiesSlice.reducer;
