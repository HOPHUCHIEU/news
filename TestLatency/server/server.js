const express = require("express");
const mongoose = require("mongoose");
const News = require("./models/News");

const app = express();
const port = 3000;

// Kết nối tới MongoDB
const connectionString =
  "mongodb+srv://admin:1@cluster0.yae41.mongodb.net/News?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(connectionString)
  .then(() => console.log("Đã kết nối thành công tới MongoDB"))
  .catch((err) => console.log("Lỗi kết nối MongoDB:", err));

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

// API tìm kiếm với phân trang và xác thực
app.get("/api/news/search", async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query; // Lấy từ khóa tìm kiếm và thông tin phân trang

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
  }

  try {
    const regexQuery = { $regex: query, $options: "i" }; // Không phân biệt chữ hoa/thường

    // Tạo truy vấn và phân trang
    const results = await News.find({
      $or: [
        { title: regexQuery }, // Tìm trong tiêu đề
        { description: regexQuery }, // Tìm trong mô tả
        { content: regexQuery }, // Tìm trong nội dung
      ],
    })
      .skip((page - 1) * limit) // Bỏ qua các bản ghi của trang trước
      .limit(parseInt(limit)); // Giới hạn số bản ghi trả về

    const totalResults = await News.countDocuments({
      $or: [
        { title: regexQuery },
        { description: regexQuery },
        { content: regexQuery },
      ],
    });

    res.status(200).json({
      totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / limit),
      results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi tìm kiếm", error: error.message });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
