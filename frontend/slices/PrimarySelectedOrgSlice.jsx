import { createSlice } from '@reduxjs/toolkit';

const initialState={
    selectedOrg:null
}

const selectedOrganizationSlice = createSlice({
    name: 'selectedOrganization',
    initialState,
    reducers: {
      setSelectedOrganization: (state, action) => {

        console.log(action.payload);
        state.selectedOrg=action.payload
      },
    },
  });


  export const {setSelectedOrganization}=selectedOrganizationSlice.actions
  export default selectedOrganizationSlice.reducer;