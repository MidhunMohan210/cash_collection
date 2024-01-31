/* eslint-disable react/no-unknown-property */

import { FaArrowDown } from "react-icons/fa6";
import "./outStanding.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import api from "../../api/api";
import { IoIosArrowRoundBack } from "react-icons/io";
import { setSelectedOrganization } from "../../../slices/PrimarySelectedOrgSlice";
import { useSelector } from "react-redux";
import Sidebar from "../../components/homePage/Sidebar";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import {prRemoveSettlementData} from '../../../slices/prSettlementDataSlice'


function Outstanding({ onTabChange }) {
  const [data, setData] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");

  const dispatch = useDispatch();
  const selectedOrgFromRedux = useSelector(
    (state) => state.setSelectedOrganization.selectedOrg
  );
  console.log(selectedOrgFromRedux);
  function formatAmount(amount) {
    return amount.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }


  const fetchOrganizations = async () => {
    try {
      const res = await api.get("/api/pUsers/getOrganizations", {
        withCredentials: true,
      });

      setOrganizations(res.data.organizationData);

      if (selectedOrgFromRedux) {
        console.log("haii");
        setSelectedOrg(selectedOrgFromRedux);
      } else {
        // If no organization is selected, set the first organization as selectedOrg
        setSelectedOrg(res.data.organizationData[0]._id);
        dispatch(setSelectedOrganization(res.data.organizationData[0]._id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchOrganizations();

    const fetchOutstanding = async () => {
      try {
        const res = await api.get("/api/pUsers/fetchOutstandingTotal", {
          withCredentials: true,
        });

        setData(res.data.outstandingData);

        dispatch(prRemoveSettlementData());
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchOutstanding();
  }, []);

  console.log(data);
  console.log(organizations);
  console.log(selectedOrg);

  const filterOutstanding = (data) => {
    return data.filter((item) => {
      const orgFilter = selectedOrg === "" || item.cmp_id === selectedOrg;

      const searchFilter = item.party_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return orgFilter && searchFilter;
    });
  };

  const finalData = filterOutstanding(data);

  return (


    <div className="flex">

<div className="" style={{ height: "100vh" }}>
        <Sidebar TAB={"outstanding"} />
      </div>

    <div className="  flex-1 lg:px-[110px] h-screen overflow-y-scroll  md:mt-4 pb-   ">
      <div className="sticky top-0 flex flex-col z-30 bg-white">
        <div className="bg-white"></div>
        <div className="bg-[#012a4a] shadow-lg px-4 py-3 pb-3 flex items-center gap-2  ">
          <IoIosArrowRoundBack
            onClick={() => {
              onTabChange("outstanding");
            }}
            className="text-3xl text-white"
          />
          <p className="text-white text-md   font-bold ">Parties</p>
        </div>
        <div className=" mt-0 shadow-lg p-2 md:p-0">
          <form>
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className=" bg-white shadow-lg">
          <button
            onClick={() => setShowDropDown(!showDropDown)}
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="text-black    font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
            type="button"
          >
            {organizations.find((el) => el._id === selectedOrg)?.name}{" "}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {showDropDown && (
            <div
              id="dropdown"
              className="z-10 absolute ml-3 mt-2 shadow-lg bg-white divide-y divide-gray-100 rounded-lg shadow w-44 "
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefaultButton"
              >
                {organizations.map((item, index) => (
                  <li key={index}>
                    <a
                      onClick={() => {
                        setShowDropDown(!showDropDown);
                        setSelectedOrg(item._id);
                        dispatch(setSelectedOrganization(item._id)); // Update the selectedOrg state
                      }}
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {item.name}
                    </a>
                    <a className="hidden">{item._id}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 text-center  ">
          {finalData.map((el, index) => (
            <Link
              key={index}
              to={`/pUsers/outstandingDetails/${el._id}/${selectedOrg}/${el.totalBillAmount}`}
            >
              <div
                // onClick={() => {
                //   onTabChange("outStandingDetails", el._id, el.totalBillAmount);
                // }}
                className="  bg-[#f8ffff] rounded-md shadow-xl border border-gray-100  flex flex-col px-4  transition-all duration-150 transform hover:scale-105 ease-in-out "
              >
                <div className="flex justify-between items-center">
                  <div className=" h-full px-2 py-8 lg:p-6 w-[150px] md:w-[180px] lg:w-[300px] flex justify-center items-start relative flex-col ">
                    <p className="font-bold md:font-semibold text-[11.3px] md:text-[15px] text-left ">
                      {el.party_name}
                    </p>
                    <p className="text-gray-400 text-sm ">Customer</p>
                  </div>
                  <div className=" h-full p-2 lg:p-6 w-[150px] md:w-[180px] lg:w-[300px] flex justify-end items-start relative flex-col">
                    <div className="flex-col justify-center  ">
                      <p className=" font-semibold text-green-600 ">
                        Total Amount
                      </p>
                      <div className="flex justify-center">
                        <p className="text-sm font-bold">
                          ₹{formatAmount(el.totalBillAmount)}
                        </p>
                        {/* <p className="text-sm font-bold">₹12,000</p> */}
                        <FaArrowDown className="ml-1 md:mt-[.1rem] text-green-700" />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <hr />
                <hr />
                <div className=" flex justify-end p-2 items-center gap-2 text-green-500">
                  <FaWhatsapp />
                  <p className="text-black">Share Payment Link </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </div>

    </div>

  );
}

export default Outstanding;
