const validation = (schema) => {
  return (reg, res, next) => {
    const { error } = schema.validate(reg.body);
    if (error) {
      error.status = 400;
      next(error);
      return;
    }
    next();
  };
};

module.exports = { validation };
