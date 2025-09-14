const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

const objectId = Joi.string().hex().length(24).required().messages({
  "string.hex": "ID must be a hexadecimal value",
  "string.length": "ID must be 24 characters long",
  "any.required": "ID is  required",
});

const validateItemIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({ itemId: objectId }),
});

const validateUserIdParam = celebrate({
  [Segments.PARAMS]: Joi.object({ userId: objectId }),
});

const validateURL = (value, helpers) => {
  const ok = validator.isURL(value, {
    protocols: ["http", "https"],
    require_protocol: true,
    disallow_auth: true,
  });
  return ok ? value : helpers.error("string.uri");
};

const validateClothingItemBody = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be fulled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }).unknown(false),
});

const validateUserInfoBody = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'The "email" field must be a valid email',
      }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
  }).unknown(false),
});

const validateAuthentication = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'The "email" field must be a valid email',
      }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
  }).unknown(false),
});

// const ValidateUserAndClothingItemIds = celebrate({
//   [Segments.BODY: Joi.object({})]
// })

module.exports = {
  validateClothingItemBody,
  validateUserInfoBody,
  validateAuthentication,
  validateURL,
  validateItemIdParam,
  validateUserIdParam,
};
