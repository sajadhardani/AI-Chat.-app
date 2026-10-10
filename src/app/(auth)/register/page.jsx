"use client";
import { Button, Card, Form, Input, message } from "antd";
import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { passwordHasher } from "@/utils/passwordHasher";

export default function RegisterPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  return (
    <div className="flex h-screen text-center justify-center mt-5">
      {contextHolder}
      <Card className="h-auto login-card">
        <Form
          form={form}
          onFinish={async (value) => {
            value.password = await passwordHasher(value.password);
            console.log(value);
            axios
              .post(`${BASE_URL}/register`, value)
              .then((res) => {
                console.log(res, "is response");
                form.resetFields();
                messageApi.open({
                  type: "success",
                  content: "کاربر با موفقیت ثبت نام شد!",
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
                message: "نام و نام خانوادگی را وارد کنید!",
              },
            ]}
            name={"name"}
            label="نام و نام خانوادگی"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "پست الکترونیکی خود را وارد کنید!",
              },
            ]}
            name={"email"}
            label="پست الکترونیکی"
          >
            <Input type="email" />
          </Form.Item>
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
              ثبت نام
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
