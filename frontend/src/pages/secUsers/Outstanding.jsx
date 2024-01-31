/* eslint-disable react/no-unknown-property */
import SidebarSec from "../../components/secUsers/SidebarSec";
import { FaArrowDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeSettlementData } from "../../../slices/settlementDataSlice";
import { FaWhatsapp } from "react-icons/fa";
import { PiDotsThreeOutline } from "react-icons/pi";



function Outstanding() {
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  function formatAmount(amount) {
    return amount.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  const selectedOrgFromRedux = useSelector(
    (state) => state.secSelectedOrganization.secSelectedOrg
  );
  console.log(selectedOrgFromRedux);

  useEffect(() => {
    const fetchOutstanding = async () => {
      try {
        const res = await api.get(
          `/api/sUsers/fetchOutstandingTotal/${selectedOrgFromRedux._id}`,
          {
            withCredentials: true,
          }
        );

        setData(res.data.outstandingData);

        dispatch(removeSettlementData());
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchOutstanding();
  }, [selectedOrgFromRedux]);

  console.log(data);

  const filterOutstanding = (data) => {
    return data.filter((item) => {
      const searchFilter = item.party_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return searchFilter;
    });
  };

  const finalData = filterOutstanding(data);

  return (
    <div className="flex">
      <SidebarSec TAB={"outstanding"}  />

      <div className=" flex-1  lg:px-[110px] h-screen overflow-y-scroll  md:mt-4 pb-   ">
        <div className="sticky top-0 flex flex-col z-30 bg-white">
          <div className="bg-white"></div>
          <div className="bg-[#012a4a] shadow-lg px-4 py-3 pb-3 flex justify-between items-center gap-2  ">
           
            <p className="text-white text-md   font-bold ">Outstandings</p>
            <PiDotsThreeOutline
            onClick={()=>{handleToggleSidebar()}}
             className="text-white text-lg block md:hidden"/>
          </div>
          <div className=" mt-0 shadow-lg p-2 md:p-0">
            <form>
              <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only"
              >
                Search
              </label>
              <div className="relative ">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
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
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-t-none rounded-b-lg border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 text-center  ">
          {finalData.map((el, index) => (
            <Link
              key={index}
              to={`/sUsers/outstandingDetails/${el._id}/${selectedOrgFromRedux._id}/${el.totalBillAmount}`}
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
