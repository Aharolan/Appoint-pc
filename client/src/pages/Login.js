import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    try {
      console.log("values", values);
      console.log("values " + values)
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("User logged successfully");
        toast("Redirecting to home page...");
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        toast.error("Error login user");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error occurred while login user");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcom Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2" htmlType="submit">
            Login
          </Button>

          
        </Form><Link to="/register" className="anchor">
            Link here to register
          </Link>
      </div>
    </div>
  );
}

export default Login;
