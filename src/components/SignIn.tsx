import type { FC } from "react";
import { useState } from "react";
import { Cross } from "./Cross";
import { Eyes } from "./icons/Eyes";
import Button from "./Button";
import { signInProperties } from "@/types/signIn";
import { useUserStore } from "../stores/userStore";

const Signin: FC<signInProperties> = ({ onClose, onSuccessfulLogin }) => {
  const { setUser } = useUserStore();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = inputValues;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const {
      user: { id, username },
    } = await response.json();
    if (id && username) {
      setUser({
        id,
          username,
      });
    }

    onClose();
    handleLoginSuccess();
  };

  const handleLoginSuccess = () => {
    if (onSuccessfulLogin) {
      onSuccessfulLogin();
    } else {
      onClose();
    }
  };


  return (
    <>
      <div className="bg-white w-[450px] h-[500px] rounded-[10px] max-md:rounded-none overflow-hidden max-md:w-full">
        <div className="flex items-center justify-between px-6 max-md:px-3 py-4 h-[70px] w-full bg-white border-b border-outline-primary">
          <h3 className="font-medium w-[calc(50%+(126.53px/2))]">Sign in to Ortelius</h3>
          <div className="">
            <Cross onClick={onClose} />
          </div>
        </div>
        <div className="px-6 max-md:px-3 py-4 w-full flex justify-center items-center mt-5">
          <img src="ortelius.png" className="w-[150px]" />
        </div>
        <div className="mt-5 px-6">
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
            <div className="w-full mt-5">
              <label className="text-sm text-text-primary font-medium text-chat-text-primary">Email address</label>
              <input
                type="email"
                name="email"
                value={inputValues.email}
                onChange={handleInputChange}
                placeholder="alan.turing@gmail.com"
                className="w-full h-[40px] border outline-none border-outline-primary rounded-[5px] px-3 mt-1 bg-whitish text-sm placeholder:text-placeholder-primary transition-colors duration-300  focus:border-button-primary"
              />
            </div>
            <div className="w-full mt-5">
              <label className="text-sm text-text-primary font-medium text-chat-text-primary">Password</label>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={inputValues.password}
                  onChange={handleInputChange}
                  placeholder="•••••••••••"
                  className="w-full h-[40px] border outline-none border-outline-primary mt-1 rounded-[5px] px-3 bg-whitish text-sm placeholder:text-placeholder-primary focus:border-button-primary"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-[40px]"
                  onClick={handlePasswordVisibility}>
                  <Eyes
                    additionalClasses="text-chat-text-primary relative top-0.5"
                    width={20}
                    height={20}
                    type={passwordVisible ? "open" : "closed"}
                  />
                </button>
              </div>
            </div>
            <Button
              type="submit"
              additionalClasses="w-full mt-5 h-[40px] rounded-[5px] font-bold transition-colors duration-300"
              label="Sign in"
              variant="default"></Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
