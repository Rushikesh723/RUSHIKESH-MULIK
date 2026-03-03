import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coverLetterData: "",
};

export const coverLetterSlice = createSlice({
  name: "editCoverLetter",
  initialState,
  reducers: {
    addCoverLetterData: (state, action) => {
      state.coverLetterData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCoverLetterData } = coverLetterSlice.actions;

export default coverLetterSlice.reducer;
