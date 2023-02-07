import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boundsWaypoint:null,
  origin: null,
  destination: null,
  travelTimeInformation: null,
  waypoints: null,
  locationPermission: false,
  startNavigation: false,
  selectedRide: null,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, actions) => {
      state.origin = actions.payload;
    },
    setBoundsWaypoint: (state, actions) => {
      state.boundsWaypoint = actions.payload;
    },
    setDestination: (state, actions) => {
      state.destination = actions.payload;
    },
    setTravelTimeInformation: (state, actions) => {
      state.travelTimeInformation = actions.payload;
    },
    setWaypoints: (state, actions) => {
      state.waypoints = actions.payload;
    },
    setLocationPermission: (state, actions) => {
      state.locationPermission = actions.payload;
    },
    setStartNavigation: (state, actions) => {
      state.startNavigation = actions.payload;
    },
    setSelectedRide: (state, actions) => {
      state.selectedRide = actions.payload;
    },
  },
});

export const {
  setBoundsWaypoint,
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setWaypoints,
  setLocationPermission,
  setStartNavigation,
  setSelectedRide,
} = navSlice.actions;

// Selectors
export const selectBoundsWaypoint = (state) => state.nav.boundsWaypoint;
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation;
export const selectWaypoints = (state) => state.nav.waypoints;
export const selectLocationPermission = (state) => state.nav.locationPermission;
export const selectStartNavigation = (state) => state.nav.startNavigation;
export const selectSelectedRide = (state) => state.nav.selectedRide;

export default navSlice.reducer;
