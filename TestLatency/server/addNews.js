const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const News = require("./News");

// Kết nối tới MongoDB
const connectionString =
  "mongodb+srv://admin:1@cluster0.yae41.mongodb.net/News?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(connectionString)
  .then(() => console.log("Đã kết nối thành công tới MongoDB"))
  .catch((err) => console.log("Lỗi kết nối MongoDB:", err));

// Hàm để tạo nhiều bản tin
const insertBulkNews = async (numberOfNews, batchSize = 1000) => {
  try {
    console.time("Time to insert");

    for (let i = 0; i < numberOfNews; i += batchSize) {
      const batch = [];

      for (let j = 0; j < Math.min(batchSize, numberOfNews - i); j++) {
        batch.push({
          title: faker.lorem.sentence(), // Tạo một câu cho tiêu đề
          decription: faker.lorem.paragraph(), // Tạo một đoạn văn cho mô tả
          content: faker.lorem.paragraphs(), // Tạo nhiều đoạn văn cho nội dung
        });
      }

      // Chèn dữ liệu theo lô
      await News.insertMany(batch);
      console.log(`Đã chèn thành công ${i + batch.length} news.`);
    }

    console.timeEnd("Time to insert");
  } catch (error) {
    console.error("Có lỗi khi chèn dữ liệu:", error.message);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
  }
};

insertBulkNews(20000);

module.exports = News;
