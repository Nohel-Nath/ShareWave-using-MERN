const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  // options for cookie

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE);
  if (isNaN(cookieExpireDays)) {
    return res.status(500).json({
      success: false,
      message: "Invalid cookie expiration value",
    });
  }

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, options);

  return token;
};

module.exports = sendToken;
