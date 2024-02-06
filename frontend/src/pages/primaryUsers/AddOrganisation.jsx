import { useState } from "react";
import api from "../../api/api.js";
import { toast } from "react-toastify";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary.js";
import { HashLoader } from "react-spinners";
import Sidebar from "../../components/homePage/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { IoReorderThreeSharp } from "react-icons/io5";

const AddOrganisation = () => {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [pin, setPin] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [mobile, setMobile] = useState("");
  const [gst, setGst] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState("");
  const [loader, setLoader] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  console.log(showSidebar);

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(!showSidebar);
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    setLoader(true);
    const data = await uploadImageToCloudinary(file);

    setLoader(false);

    setLogo(data.url);
  };

  const submitHandler = async () => {
    if (
      !name ||
      !place ||
      !pin ||
      !mobile ||
      !gst ||
      !email ||
      !state ||
      !country
    ) {
      toast.error("All fields must be filled");
      return;
    }

    if (name.length > 30) {
      toast.error("Name must be at most 30 characters");
      return;
    }

    if (place.length > 30) {
      toast.error("Place must be at most 30 characters");
      return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    // / Additional PIN code validation
    const isPinValid = /^\d{6}$/.test(pin);
    if (!isPinValid) {
      toast.error("Please enter a valid 6-digit PIN code");
      return;
    }

    const gstRegex = /^[0-9A-Za-z]{15}$/;

    if (!gstRegex.test(gst)) {
      toast.error("Invalid GST number");
      return;
    }

    const formData = {
      name,
      place,
      pin,
      state,
      country,
      email,
      gst,
      mobile,
      logo,
    };

    // formData.append("logo",logo)

    try {
      const res = await api.post("/api/pUsers/addOrganizations", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setName("");

      setPin("");
      setPlace("");
      setState("");
      setEmail("");
      setMobile("");
      setGst("");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  return (
    <div className="flex ">
      <div className="" style={{ height: "100vh" }}>
        <Sidebar TAB={"addOrg"} showBar={showSidebar}  />
      </div>

      <div className=" ">
        <section className=" bg-blueGray-50 h-screen overflow-y-scroll">
          <div className="bg-[#201450] sticky top-0 p-3 z-100 text-white text-lg font-bold flex items-center gap-3 z-20">
            <IoReorderThreeSharp
              onClick={handleToggleSidebar}
              className="block md:hidden"
            />
            <p>Add organization</p>
          </div>
          <div className="w-full lg:w-8/12 px-4 mx-auto  pb-[30px]  ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
              <div className="rounded-t bg-white mb-0 px-6 py-2">
                <div className="text-center flex justify-between">
                  {/* <h6 className="text-blueGray-700 text-xl font-bold">
                    Organization Information
                  </h6> */}
                  {/* <button
                    className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 transform hover:scale-105"
                    type="button"
                    onClick={submitHandler}
                  >
                    Add
                  </button> */}
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form encType="multipart/form-data">
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Organization Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          value={name}
                          placeholder="Organization name"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Place
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setPlace(e.target.value);
                          }}
                          value={place}
                          placeholder="Add your place"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Organization Email
                        </label>
                        <input
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          value={email}
                          type="text"
                          placeholder="abc@gmail.com"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Official Mobile no.
                        </label>
                        <input
                          onChange={(e) => {
                            setMobile(e.target.value);
                          }}
                          value={mobile}
                          type="number"
                          placeholder="Mobile number"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Other Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      {/* <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                      />
                    </div> */}
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Pin
                        </label>
                        <input
                          type="number"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setPin(e.target.value);
                          }}
                          value={pin}
                          placeholder="Postal Code"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          GST no.
                        </label>
                        <input
                          type=""
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setGst(e.target.value);
                          }}
                          value={gst}
                          placeholder="Gst No"
                        />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Country
                        </label>
                        <select
                          className="border-0 px-3 mr-12 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setCountry(e.target.value);
                          }}
                          value={country}
                        >
                          <option value="India">India</option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          State
                        </label>
                        <select
                          className="border-0 px-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={(e) => {
                            setState(e.target.value);
                          }}
                          value={state}
                        >
                          <option value="" disabled>
                            Select a state
                          </option>
                          {indianStates.map((indianState) => (
                            <option key={indianState} value={indianState}>
                              {indianState}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-0 mt-4 m-4">
                      {logo && !loader && (
                        <figure className="  w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
                          <img
                            src={logo}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        </figure>
                      )}

                      {loader && (
                        <figure className="  w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
                          <HashLoader
                            color="#6056ec"
                            size={30}
                            speedMultiplier={1.6}
                          />
                        </figure>
                      )}

                      <div className="  mt-3  relative w-[160px] h-[50px] flex  justify-between  ">
                        <input
                          type="file"
                          name="photo"
                          id="photo"
                          onChange={(e) => {
                            handleFileInputChange(e);
                          }}
                          accept=".jpg,.png"
                          className="absolute top-0 left-0 h-full opacity-0 cursor-pointer"
                        />
                        <label
                          htmlFor="photo"
                          className="absolute top-0 left-0 w-full h-fullflex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor 
                           font-semibold rounded-lg truncate cursor-pointer flex justify-center "
                        >
                          Upload Your Logo
                        </label>
                      </div>
                   
                    </div>
                  </div>
                  <button
                        className="bg-pink-500 mt-4 ml-4 w-20 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 transform hover:scale-105"
                        type="button"
                        onClick={submitHandler}
                      >
                        Add
                      </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddOrganisation;
