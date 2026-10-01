const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
};

const validateName = (name) => {
  if (!name || name.length < 20 || name.length > 60) return false;
  return true;
};

const validateAddress = (address) => {
  if (address && address.length > 400) return false;
  return true;
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

module.exports = { validatePassword, validateName, validateAddress, validateEmail };
