const authService = require('./auth.service');
const { formatAuthResponse, formatUser } = require('./auth.dto');

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: formatAuthResponse(user, accessToken, refreshToken),
      message: 'Account created successfully',
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      data: formatAuthResponse(user, accessToken, refreshToken),
      message: 'Logged in successfully',
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    res.status(200).json({
      success: true,
      data: formatAuthResponse(user, accessToken, refreshToken),
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: { user: formatUser(user) } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, getMe };