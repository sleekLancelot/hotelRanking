import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface HotelProp {
    name: string
    city: string
    country: string
    address: string
    brand?: string
    rank?: number
    id: string
}

interface InitialStateProp {
    hotels: Array<HotelProp>
    brands: Array<string>
}

const initialState: InitialStateProp = {
    hotels: [],
    brands: [],
}

export const hotelSlice = createSlice({
    name: 'hotels',
    initialState,
    reducers: {
        setHotels: (state, action) => {
            state.hotels = action.payload
        },
        setHotelBrands: (state, action) => {
            state.brands = action.payload
        },
    },
})

export const hotelSelector = ( state: RootState ) => state.hotel;

export const {setHotels, setHotelBrands} = hotelSlice.actions

export const hotelReducer = hotelSlice.reducer