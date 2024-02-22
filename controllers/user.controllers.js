const Users = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const payload = req.body;

    const user = await Users.findOne({ email: payload.email });

    if (user) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedValue = bcrypt.hashSync(payload.password, 10);
    payload.hashedPassword = hashedValue;
    delete payload.password;
    newUser = new Users(payload);

    newUser
      .save()
      .then((user) => {
        console.log("User saved");
        return res.status(201).send({
          message: "Account created successfully",
          user: user,
        });
      })
      .catch((error) => {
        res.status(409).send({
          message: "Error creating the user",
          Error: error,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await Users.findOne({ email: email });

    if (!userExist) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    if (bcrypt.compareSync(password, userExist.hashedPassword)) {
      let token = jwt.sign({ _id: userExist._id }, process.env.SECRET_KEY);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 86400000),
      });
      return res.status(200).send({
        message: "User Logged-in Successfully",
      });
    }
    return res.status(400).send({
      message: "Incorrect Password!!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("accessToken");
    res.status(200).send({
      message: "User Logged-Out Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error,
    });
  }
};
