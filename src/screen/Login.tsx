import React, { useState } from "react";
import Auth from "../Layout/Auth";
import { Button } from "../components/Button/Button";
import { FormControl } from "../components/Form/FormControl";
import { Form } from "antd";
import {
  useChangePasswordMutation,
  useLoginMutation,
} from "../utils/apis/auth";
import { login } from "../utils/models";
import { ToastRender } from "../utils/toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/auth.slice";
import WithPublicRoute from "../components/HOC/WithPublicRoute";
// const electron = window.require("electron");
interface formValues {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const initialValues: formValues = { username: "", password: "" };
  const [mode, setMode] = useState("login");
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [changePassword, { isLoading: changePasswordLoading }] =
    useChangePasswordMutation();
  const validationSchema = {
    username: {
      required: true,
      message: "Invalid username",
    },
    password: {
      required: true,
      message: "Invalid Password",
    },
  };

  const forgotPasswordHandler = () => {
    setMode("change-password");
  };

  const cancelHandler = () => {
    setMode("login");
  };

  const onFinishedLogin = async (values: login) => {
    if (mode !== "login") {
      try {
        const result = await changePassword(values).unwrap();
        const { message } = result;
        form.resetFields();
        ToastRender(message);
      } catch (error: any) {
        const { message } = error.data;
        ToastRender(message, true);
      }
    } else {
      try {
        const result = await login(values).unwrap();
        const { message, payload } = result;
        dispatch(setCredentials({ token: payload.token }));
        ToastRender(message);
      } catch (error: any) {
        const { message } = error.data;
        ToastRender(message, true);
      }
    }
  };
  return (
    <Auth>
      <>
        <h1 className="text-3xl font-bold mb-2">
          {mode !== "login" ? "Change Password" : "Sign In"}
        </h1>
        <div className="mt-8">
          <Form
            layout="vertical"
            initialValues={initialValues}
            autoComplete="off"
            form={form}
            onFinish={onFinishedLogin}
          >
            <FormControl
              type="text"
              element="input"
              name="username"
              label="Username"
              placeholder="joker"
              classes={[]}
              rules={[validationSchema.username]}
            />

            <FormControl
              type="password"
              element="input"
              name="password"
              label="Password"
              placeholder="password"
              classes={[]}
              rules={[validationSchema.password]}
            />
            <div className="flex justify-between items-center">
              {mode !== "login" ? (
                <>
                  <Button
                    type="button"
                    classes="bg-secondary text-primary transition duration-[150ms] ease-in-out"
                    onClick={cancelHandler}
                  >
                    <>
                      <p>Cancel</p>
                    </>
                  </Button>
                  <Button
                    type="submit"
                    classes="bg-secondary text-primary transition duration-[150ms] ease-in-out"
                  >
                    <>
                      <p>Submit</p>
                      {changePasswordLoading && (
                        <svg
                          className="animate-spin ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                          ></path>
                        </svg>
                      )}
                    </>
                  </Button>
                </>
              ) : (
                <>
                  <p
                    className="text-secondary cursor-pointer"
                    onClick={forgotPasswordHandler}
                  >
                    Forgot password?
                  </p>
                  <Button
                    type="submit"
                    classes="bg-secondary text-primary transition duration-[150ms] ease-in-out"
                  >
                    <>
                      <p>Login</p>
                      {loginLoading && (
                        <svg
                          className="animate-spin ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                          ></path>
                        </svg>
                      )}
                    </>
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>
      </>
    </Auth>
  );
};

export default WithPublicRoute(Login);
