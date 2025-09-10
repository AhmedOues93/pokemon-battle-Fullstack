const notFound = (req, res) => {
  res.status(404).json({ message: "URL not found" });
};

export default notFound;
