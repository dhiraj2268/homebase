const Joi=require("joi");

module.exports.propertySchema=Joi.object({
    property:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        bedrooms:Joi.number().required(),
        bathrooms:Joi.number().required(),
        squrefeet:Joi.number().required(),
        sellername:Joi.string().required(),
        sellercontact:Joi.string().required(),
        image:Joi.string().allow("",null),
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});