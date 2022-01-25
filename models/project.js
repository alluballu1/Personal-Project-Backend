const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  projectName: String,
  projectUrl: { unique: true, type: String },
  projectScreenshotUrl: String,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

projectSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });

const Project = mongoose.model("Project", projectSchema)

module.exports = Project