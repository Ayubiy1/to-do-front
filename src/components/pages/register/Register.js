import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newUser) => {
      console.log(newUser);

      const res = await axios.post(
        "https://to-do-backend-5w4r.onrender.com/api/users/register",
        newUser
      );
      return res.data;
    },
    onSuccess: () => {
      message.success("Ro‘yxatdan o‘tish muvaffaqiyatli!");
    },
    onError: (err) => {
      message.error(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto", marginTop: 50 }}
    >
      <Form.Item
        label="Ism"
        name="username"
        rules={[{ required: true, message: "Ismingizni kiriting!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email", message: "Email kiriting!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Parol"
        name="password"
        rules={[{ required: true, message: "Parol kiriting!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading} block>
        Ro‘yxatdan o‘tish
      </Button>
      <span
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => {
          navigate("/login");
        }}
      >
        Login qilish
      </span>
    </Form>
  );
};

export default Register;
