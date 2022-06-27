var models = require('../models');
var { errorResponse , successResponse } = require('../helpers/response');
var { countriesTransformer , countryTransformer } = require('../transformers/countriesTransformers')


const addCountry = async (req,res) => {
    const country_name = req.body.country_name
    const country = await models.countries.findOrCreate({
            where: {
                country_name
                }
    })
    if (country) {
        res.send(successResponse('Country created successfully' ,{country: countryTransformer(country)}))
    } else {
        res.send(errorResponse('Error'))
    }
}



const getCountries = async (req, res) => {
    const countries = await models.countries.findAll({})
        if (countries) {
            res.send(successResponse("Success", {countries: countriesTransformer(countries)}))
            return
        } else {
            res.send(errorResponse('Error'))
        }
}



const getCountry = async (req, res) => {
    const id  = req?.params?.id
    const country = await models.countries.findOne({
        where: {
            id
        }})
    if (country) {
        res.send(successResponse("Success", {country: countryTransformer(country)}))
    } else {
        res.send(errorResponse('There was an error'))
    }
}

const deleteCountry = async (req, res, next) => {
    const id = +req.params.id
    const deleted = await models.countries.destroy({
        where: {
            id
        }
    });
    if (deleted) {
        res.send(successResponse('Country has been deleted'))
    } else {
        res.send(errorResponse('error'))
    };
};


module.exports = {
    addCountry,
    getCountries,
    getCountry,
    deleteCountry
}