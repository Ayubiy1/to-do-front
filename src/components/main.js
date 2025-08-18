// src/layouts/MainComp.jsx
import { Button, Layout, Menu } from "antd";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorageState } from "ahooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import BoardEdit from "../BoardEdit";

const { Header, Content, Sider } = Layout;

const MainComp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const [collapsed, setCollapsed] = useLocalStorageState(
    "userLayoutCollapsed",
    {
      defaultValue: false,
    }
  );
  const [selectedKeys, setSelectedKeys] = useLocalStorageState(
    "userLayoutSelectedKeys",
    {
      defaultValue: 1,
    }
  );
  const [boardData, setBoardData] = useLocalStorageState("boardData", {
    defaultValue: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["user", location.pathname],
    queryFn: async () => await axios.get(`http://localhost:3000/api/boards`),
    onSuccess: (data) => {},
  });
  const { data: boardDataa } = useQuery({
    queryKey: ["board-data-one", location.pathname],
    queryFn: async () =>
      await axios.get(
        `http://localhost:3000/api/boards/${location.pathname.slice(1)}`
      ),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if (selectedBoardId === null && location.pathname === "/") {
      setSelectedKeys(1);
      navigate(`/${data?.data[0]._id}`);
      setBoardData(data?.data[0].name);
    }
  }, [selectedBoardId, location.pathname, data]);

  useEffect(() => {
    if (localStorage.getItem("token") && data?.data && data?.data.length > 0) {
      setSelectedBoardId(data?.data[0]._id); // birinchi board
      // navigate(`/${data?.data[0].name}`);
      setCollapsed(false);
      // setSelectedKeys(1);
    }
  }, [data]);

  const handleLogout = async () => {};

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsed={collapsed}>
        <div className="text-white text-center py-4 font-bold text-lg"></div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[`${selectedKeys}`]}
        >
          {!isLoading
            ? data?.data?.map((item, index) => {
                return (
                  <Menu.Item key={index + 1} style={{ padding: "0 5px" }}>
                    {!collapsed ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          color: "white",
                          gap: "10px",
                          width: "100%",
                        }}
                        onClick={() => {
                          navigate(`${item._id}`);
                          setBoardData(item.name);
                          setSelectedKeys(index + 1);
                        }}
                      >
                        <span
                          style={{
                            width: "100%",
                          }}
                        >
                          {item.name}
                        </span>
                        <BoardEdit boardId={item?._id} />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </Menu.Item>
                );
              })
            : "Loading..."}
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="bg-white px-4 shadow-sm flex items-center justify-between"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 20px 0 0",
          }}
        >
          <div
            className="flex bg-red-400 items-center gap-2 text-white"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
              gap: "10px",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "white",
              }}
            />
            <h1 className="text-lg font-semibold" style={{ margin: "0" }}>
              {boardDataa?.data?.name}
            </h1>
          </div>

          <Button
            type="primary"
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
            icon={<LogoutOutlined />}
          >
            Chiqish
          </Button>
        </Header>

        <Content className="m-4 bg-white p-6 rounded shadow-sm h-[30vh] overflow-y-scroll">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainComp;
