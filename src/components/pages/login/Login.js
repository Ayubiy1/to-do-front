import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const res = await axios.post(
        "http://localhost:3000/api/users/login",
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token); // Tokenni saqlaymiz
      navigate("/"); // Muvaffaqiyatli kirgandan so'ng asosiy sahifaga o'tamiz
      message.success("Tizimga muvaffaqiyatli kirdingiz!");
    },
    onError: (err) => {
      message.error(err.response?.data?.message || "Login xatosi");
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 400, margin: "0 auto", marginTop: 50 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Email kiriting!" },
          ]}
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
          Kirish
        </Button>
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => {
            navigate("/register");
          }}
        >
          Royhatdan o'tish
        </span>
      </Form>
    </>
  );
};

export default Login;
