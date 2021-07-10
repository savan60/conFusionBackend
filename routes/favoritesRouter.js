const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorite = require('../models/favorites');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
favoriteRouter.use(bodyParser.json());
const cors = require('./cors');

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ 'user': req.user._id }).populate('user').populate('dishes').then((fav) => {
            if (fav) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end("No Favourite item found");
            }
        }).catch((err) => next(err));;
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ 'user': req.user._id }).then((fav) => {
            if (fav == null) {
                console.log("Null in post fav");
                fav = new Favorite({ user: req.user._id.toString() });
            }
            for (var i = 0; i < req.body.length; i++) {
                if (fav.dishes.indexOf(req.body[i]._id) === -1) {
                    fav.dishes.push(req.body[i]._id);
                }
            }
            console.log("fav is added");
            fav.save((err, favourite) => {
                if (err) {
                    next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }, (err) => next(err));
        }).catch((err) => next(err));;
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorites");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndRemove({ 'user': req.user._id }).then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));;
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200 })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("GET operation not supported on /favorites/" + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ 'user': req.user._id }).then((fav) => {
            console.log("here");
            if (fav == null) {
                fav = new Favorite({ user: req.user._id.toString() });
                fav.dishes.push(req.params.dishId);
                fav.save((err, favourite) => {
                    if (err) {
                        next(err);
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }, (err) => next(err));
            }
            else {
                if (fav.dishes.indexOf(req.params.dishId) !== -1) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end("The dish " + req.params.dishId + " is already present in favorite");
                }
                else {
                    fav.dishes.push(req.params.dishId);
                    fav.save().then((err, favourite) => {
                        if (err) {
                            next(err);
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    }, (err) => next(err));
                }
            }
        }).catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /favorites/" + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ 'user': req.user._id }).then((fav) => {
            if(fav){
                var index = fav.dishes.indexOf(req.params.dishId);

                if(index>=0){
                    fav.dishes.splice(index,1);
                    fav.save().then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    }, (err) => next(err));
                }
                else{
                    err = new Error('Favorites item not found');
                    err.status = 404;
                    return next(err);
                }
            }
            else{
                err = new Error('Favorites item not found');
                err.status = 404;
                return next(err);
            }
        }).catch((err) => next(err));
    });

module.exports = favoriteRouter;