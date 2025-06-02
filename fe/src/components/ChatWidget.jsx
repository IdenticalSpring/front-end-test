import React, { useState } from "react";
import { Button, Input, Card } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { getFields } from "../services/api";

const API_KEY = "AIzaSyCXyctW1sW7Y2ip6U_pBRLv8VlmN_ob_SY"; // KHÔNG nên dùng ở frontend trong bản chính thức

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const fieldsRes = await getFields();
      const fields = fieldsRes.data;

      // Dạng: "Tên: ..., Địa chỉ: ..., Giá: ... VNĐ, Xem chi tiết [/rooms/field/{id}]"
      const fieldInfo = fields
        .map(
          (f) =>
            `Tên: ${f.name.replace(/\*/g, "")}, Địa chỉ: ${f.location.replace(
              /\*/g,
              ""
            )}, Giá: ${f.pricePerHour} VNĐ, Xem chi tiết [/rooms/field/${f.id}]`
        )
        .join("\n");

      const prompt = `
Dưới đây là danh sách các sân bóng:
${fieldInfo}

Câu hỏi của người dùng: ${userMessage}
Đầu tiên phải chào người dùng và hỏi người dùng cần tìm sân bóng ở đâu. Sau đó trả lời dựa trên danh sách sân bóng ở trên. Nếu cần hiển thị lại danh sách, hãy dùng định dạng, nếu không có sân nào phù hợp thì trả lời "Không tìm thấy sân bóng nào phù hợp.".:
Tên: ..., Địa chỉ: ..., Giá: ... VNĐ, Xem chi tiết [/rooms/field/{id}]
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI không hiểu câu hỏi.";
      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
    } catch (error) {
      console.error("Lỗi AI hoặc API fields:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Lỗi khi kết nối hoặc lấy dữ liệu phòng." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderBotMessage = (text) => {
    return text.split("\n").map((line, index) => {
      const match = line.match(
        /Tên: (.*?), Địa chỉ: (.*?), Giá: (.*?) VNĐ, Xem chi tiết \[(.*?)\]/
      );
      if (match) {
        const [, name, location, price, url] = match;
        return (
          <div key={index} style={{ marginBottom: 6 }}>
            <div>
              <strong>{name}</strong>
            </div>
            <div>{location}</div>
            <div>{price} VNĐ</div>
            <a
              href={url}
              target="_self"
              rel="noreferrer"
              style={{ color: "blue" }}
            >
              Xem chi tiết
            </a>
          </div>
        );
      } else {
        return <div key={index}>{line}</div>;
      }
    });
  };

  return (
    <>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
        {!visible && (
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageOutlined />}
            onClick={() => setVisible(true)}
          />
        )}
      </div>

      {visible && (
        <Card
          title="Chat với AI"
          extra={<CloseOutlined onClick={() => setVisible(false)} />}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 320,
            zIndex: 999,
          }}
        >
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ textAlign: msg.sender === "user" ? "right" : "left" }}
              >
                <div
                  style={{
                    background: msg.sender === "user" ? "#d3f0ff" : "#f1f1f1",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    margin: "5px 0",
                    display: "inline-block",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.sender === "user"
                    ? msg.text
                    : renderBotMessage(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ fontStyle: "italic", color: "#888" }}>
                AI đang trả lời...
              </div>
            )}
          </div>

          <Input.Search
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={handleSend}
            placeholder="Nhập tin nhắn..."
            enterButton="Gửi"
            disabled={loading}
          />
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
