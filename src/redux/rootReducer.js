import { createSlice } from '@reduxjs/toolkit'
export const rootSlice = createSlice({
  name: 'root',
  initialState: {
    signed_in: false,
    refresh_navbar: false,
    refresh_notification: false,
    cat_parent_ids: [],
    category_bar_empty: true,
  },
  reducers: {
    setSignedIn: (state, action) => {
      state.signed_in = action.payload
    },
    refreshNavbar: (state) => {
      state.refresh_navbar = !state.refresh_navbar
    },
    refreshNotification: (state) => {
      state.refresh_notification = !state.refresh_notification
    },
    setCatParentIds: (state, action) => {
      state.cat_parent_ids = action.payload
    },
    setCategoryBarEmpty: (state, action) => {
      state.category_bar_empty = action.payload
    },
  }
})

export const { setSignedIn, refreshNavbar, refreshNotification, setCatParentIds, setCategoryBarEmpty, } = rootSlice.actions

export default rootSlice.reducer