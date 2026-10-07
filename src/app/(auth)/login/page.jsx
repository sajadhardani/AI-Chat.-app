"use client";
import { passwordHasher } from "@/utils/passwordHasher";
import { Button, Card, Form, Input, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "@/utils/config";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const {user,login} = useAuth()
  const [form] = Form.useForm();
  return (
    <div className="flex h-screen text-center justify-center mt-5">
      {contextHolder}
      <Card className="h-auto login-card">
        <Form
          form={form}
          onFinish={async (value) => {
            // value.password = await passwordHasher(value.password);
            console.log(value);
            axios
              .post(`${BASE_URL}/login`, value)
              .then((res) => {
                console.log(res, "is response");
                login(res.data.token)
                form.resetFields();
                messageApi.open({
                  type: "success",
                  content: "احراز هویت با موفقیت انجام شد!",
                });
              })
              .catch((err) => {
                messageApi.open({
                  type: "error",
                  content: "مشکلی رخ داده است!",
                });
                form.resetFields();
                console.log(err);
              });
          }}
          onFinishFailed={(err) => {
            console.log(err);
            messageApi.open({
              type: "error",
              content: "مشکلی رخ داده است!",
            });
          }}
          layout="vertical"
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "نام کاربری خود را وارد کنید!",
              },
            ]}
            name={"username"}
            label="نام کاربری"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "رمزعبور خود را وارد کنید!",
              },
            ]}
            name={"password"}
            label="رمزعبور"
          >
            <Input.Password type="password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" block color="primary">
              ورود
            </Button>
          </Form.Item>
        </Form>
        <Link href={"/register"}>ثبت نام کنید</Link>
      </Card>
    </div>
  );
}
