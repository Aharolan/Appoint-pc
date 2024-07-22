import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Button, Col, Form, Input, Row } from "antd";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Computers() {
  //   const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [computerNumber, setComputerNumber] = useState("");
  const handleInputChange = (e) => {
    setComputerNumber(e.target.value);
  };
  const onFinish = async (values) => {
    try {
      console.log("Received values of form:", values);
      dispatch(showLoading());
      const response = await axios.post("/api/user/add-new-computer", values, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("New computer added successfully");
        toast("Redirecting to home page...");
        navigate("/");
        console.log("Computer added successfully");
      } else {
        toast.error("Error adding computer");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error occurred while adding computer");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Computers</h1>
      <hr />
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={20}>
          <Col span={8} xs={24} sm={24}>
            <Form.Item
              required
              label="Computernumber"
              name="computerNumber"
              rules={[{ required: true }]}
            >
              <Input
                type="number"
                placeholder="Computer-number"
                value={computerNumber}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button className="primary-button" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

export default Computers;
