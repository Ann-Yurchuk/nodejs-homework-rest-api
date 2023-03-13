const ctrlWrapper = (fn) => {
  return async (reg, res, next) => {
    try {
      await fn(reg, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { ctrlWrapper };
