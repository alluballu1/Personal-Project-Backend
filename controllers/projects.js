const projectRouter = require("express").Router();
const Project = require("../models/project");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

projectRouter.get("/", async (req, res, next) => {
  const projects = await Project.find({}).populate("user");
  res.json(projects.map((project) => project.toJSON())).status(200);
});

projectRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    console.log(req.body);
    const body = req.body;
    const decodedToken = req.user;

    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    const project = new Project(body);
    project.user = user._id;
    if (!project.projectName || !project.projectUrl || !project.description) {
      res.status(401).json("Some field is empty");
    }
    const newProject = await project.save();
    user.projects = user.projects.concat(newProject._id);
    console.log(user, newProject);
    user.save();
    res.json(newProject.toJSON()).status(200);
  } catch (err) {
    next(err);
  }
});
projectRouter.delete("/", userExtractor, async (req, res, next) => {
  try {
    const body = req.body.project;
    const decodedToken = req.user;
    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.json("Invalid token").status(400);
    }
    const deleted = await Project.findOneAndDelete(body);
    const index = user.projects.indexOf(deleted.id);
    user.projects.splice(index, 1);
    user.save();
    res.json("Project deleted.").status(200);
  } catch (err) {
    next(err);
  }
});

projectRouter.put("/", userExtractor, async (req, res, next) => {
  try {
    const body = req.body;
    const decodedToken = req.user;
    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.json("Invalid token").status(400);
    }
    await Project.findByIdAndUpdate(body.id, body, { new: true }).then((result) =>
    {console.log("success")
      res.status(200).json(result.toJSON()).end()
    }
    );
  } catch (err) {
    res.json(err).status(401);
  }
});

module.exports = projectRouter;
