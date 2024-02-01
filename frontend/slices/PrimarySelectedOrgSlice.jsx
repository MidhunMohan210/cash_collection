import { createSlice } from '@reduxjs/toolkit';

const storedSecOrg = localStorage.getItem('primaryOrg');
console.log(storedSecOrg);
const initialState = {
  secSelectedOrg: storedSecOrg ? JSON.parse(storedSecOrg) : null,
};

const selectedOrganizationSlice = createSlice({
    name: 'selectedOrganization',
    initialState,
    reducers: {
      setSelectedOrganization: (state, action) => {

        console.log(action.payload);
        state.selectedOrg=action.payload
        const org=JSON.stringify(action.payload)
        localStorage.setItem('primaryOrg',org)
      },
    },
  });


  export const {setSelectedOrganization}=selectedOrganizationSlice.actions
  export default selectedOrganizationSlice.reducer;