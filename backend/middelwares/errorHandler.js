const errorHandler = (req, res, err) => {
  console.log("Error:");
  res.status(500).json({ message: "Server Error" });
};

export default errorHandler;
