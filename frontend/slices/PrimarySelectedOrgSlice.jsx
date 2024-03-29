import { createSlice } from '@reduxjs/toolkit';

const storedSecOrg = localStorage.getItem('primaryOrg');
console.log(storedSecOrg);
const initialState = {
  selectedOrg: storedSecOrg ? JSON.parse(storedSecOrg) : null,
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

      removeSelectedOrganization:(state,action)=>{
        state.selectedOrg='';
        localStorage.removeItem('primaryOrg')
      }
    },
  });


  export const {setSelectedOrganization,removeSelectedOrganization}=selectedOrganizationSlice.actions
  export default selectedOrganizationSlice.reducer;