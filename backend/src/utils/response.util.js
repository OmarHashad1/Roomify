export const successRes = ({
  res,
  message = "success",
  status = 200,
  data = null,
}) => {
  return data
    ? res.status(status).json({ message, data })
    : res.status(status).json({ message });
};

export const errorRes = ({
  res,
  message = "Something went wrong!",
  status = 400,
}) => {
  return res.status(status).json({ message });
};
