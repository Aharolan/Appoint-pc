import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("User registered successfully");
        toast("Redirecting to login page...");
        navigate("/login");
      } else {
        toast.error("Error registering user");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error occurred while registering user");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Register</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2" htmlType="submit">
            REGISTER
          </Button>

          <Link to="/login" className="anchor">
            Link here to login
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
