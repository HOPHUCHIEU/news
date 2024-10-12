const mongoose = require("mongoose")

const newsShema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        decription: {
            type: String,
        },
        content: {
            type: String,
        },
    },
        {
          timestamps: true,
          versionKey: false,
        }
)

module.exports = mongoose.model("News", newsShema);
