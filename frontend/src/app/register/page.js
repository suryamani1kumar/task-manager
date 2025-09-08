"use client";
import { FaLock, FaUser } from "react-icons/fa";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useState } from "react";
import { MdError } from "react-icons/md";
import Link from "next/link";
import axiosInstance from "@/api/axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router=useRouter();
  const [passwordHideShow, setPasswordHideShow] = useState(true);
  const [registerDetails, setRegisterDetails] = useState({
    password: "",
    email: "",
    fullName: "",
  });
  const [errorMessage, setErrorMessage] = useState({});
  const [laoding, setLoading] = useState(false);

  const handleregisterDetails = (e) => {
    const { value, name } = e.target;
    setRegisterDetails({
      ...registerDetails,
      [name]: value,
    });
    setErrorMessage({});
  };
  const preventCopyPaste = (e) => {
    e.preventDefault();
    return false;
  };
  const handlelogin = (e) => {
    e.preventDefault();
    if (
      !registerDetails.email &&
      !registerDetails.password &&
      !registerDetails.fullName
    ) {
      setErrorMessage({ password: "error", email: "error", fullName: "error" });
      return;
    } else if (!registerDetails.fullName) {
      setErrorMessage({
        fullName: "Please fill out fullName fields.",
      });
      return;
    }else if (!registerDetails.email) {
      setErrorMessage({
        email: "Please fill out email fields.",
      });
      return;
    }
    const body = {
      email: registerDetails.email,
      password: registerDetails.password,
      fullName: registerDetails.fullName,
    };
    setLoading(true);
    axiosInstance
      .post(`register`, body)
      .then((res) => {
        router.push("/dashboard");
        setLoading(false);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          alert("Access Denied!");
        } else if (err?.response?.status === 404) {
          alert(err.message);
        } else {
          console.log("error", err.message);
        }
        setLoading(false);
      });
  };
  return (
    <div className="loginconatiner">
      <div className="login">
        <div className="login_form-box ">
          <div className="login_header-form text-2xl py-2 text-gray-600 font-semibold">CREATE ACCOUNT</div>

          <form className="login-form" onSubmit={handlelogin}>
            {errorMessage.password &&
            errorMessage.email &&
            errorMessage.fullName ? (
              <div className="error error-style-1">
                <MdError /> Please fill out all required fields.
              </div>
            ) : errorMessage.fullName ? (
              <div className="error error-style-1">
                <MdError /> {errorMessage.fullName}
              </div>
            ) : errorMessage.email ? (
              <div className="error error-style-1">
                <MdError /> {errorMessage.email}
              </div>
            ) : errorMessage.password ? (
              <div className="error error-style-1">
                <MdError /> {errorMessage.password}
              </div>
            ) : null}
            <div className="login_input-group">
              <div className="login_input-group-prepend">
                <span className="login_input-group-text">
                  <FaUser />
                </span>
              </div>
              <input
                type="text"
                className="login_form-control"
                placeholder="Enter full Name"
                autoComplete="off"
                name="fullName"
                id="fullName"
                value={registerDetails.fullName}
                onChange={handleregisterDetails}
              />
            </div>
            <div className="login_input-group">
              <div className="login_input-group-prepend">
                <span className="login_input-group-text">
                  <FaUser />
                </span>
              </div>
              <input
                type="text"
                className="login_form-control"
                placeholder="Enter email"
                autoComplete="off"
                name="email"
                id="email"
                value={registerDetails.email}
                onChange={handleregisterDetails}
              />
            </div>
            <div className="login_input-group">
              <div className="login_input-group-prepend">
                <span className="login_input-group-text">
                  <FaLock />
                </span>
              </div>
              <input
                type={passwordHideShow ? "password" : "text"}
                placeholder="Enter password"
                className="login_form-control"
                name="password"
                id="password"
                autoComplete="off"
                value={registerDetails.password}
                onChange={handleregisterDetails}
                onPaste={preventCopyPaste}
                onCopy={preventCopyPaste}
              />
              <span
                className="passhidshow"
                onClick={() => setPasswordHideShow(!passwordHideShow)}
              >
                {passwordHideShow ? <BiSolidHide /> : <BiSolidShow />}
              </span>
            </div>
            <button type="submit" className="btn btn-secondary btn-block">
              Register
            </button>
            <div className="message">
              <div>
                Already have an account?
                <Link href="/"> Log in.</Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {laoding && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
