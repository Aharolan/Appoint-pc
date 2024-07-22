import React, { useState } from 'react';
import { Form, DatePicker, Select, Button, List, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/Layout'
import { showLoading, hideLoading } from '../redux/alertsSlice';

const { RangePicker } = DatePicker;
const { Option } = Select;

function RentComputer() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [availableComputers, setAvailableComputers] = useState([1, 2, 3,]);

  const onFinish = async (values) => {
    dispatch(showLoading());
    try {
      const response = await axios.post('/api/user/get-available-computers', values);
      if (response.data.success) {
        setAvailableComputers(response.data.computers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    dispatch(hideLoading());
  };

  const rentComputer = async (computerId) => {
    const values = form.getFieldsValue();
    dispatch(showLoading());
    try {
      const response = await axios.post('/api/user/rent-computer', {
        ...values,
        computerId,
      });
      if (response.data.success) {
        toast.success('Computer rented successfully');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    dispatch(hideLoading());
  };

  return (
    <Layout>
      <h1 className="page-title">Rent a Computer</h1>
      <hr />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="dateRange"
          label="Rental Period"
          rules={[{ required: true, message: 'Please select the rental period!' }]}
        >
          <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item
          name="rentalType"
          label="Rental Type"
          rules={[{ required: true, message: 'Please select the rental type!' }]}
        >
          <Select>
            <Option value="hourly">Hourly</Option>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Check Availability
          </Button>
        </Form.Item>
      </Form>

      {availableComputers.length > 0 && (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={availableComputers}
          renderItem={(computer) => (
            <List.Item>
              <Card
                title={`Computer ${computer.computerNumber}`}
                extra={
                  <Button type="primary" onClick={() => rentComputer(computer._id)}>
                    Rent
                  </Button>
                }
              >
                <p>Status: Available</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </Layout>
  );
}

export default RentComputer;