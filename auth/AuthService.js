// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// var express = require('express');
// var userService = require('../mongo/UserService');

// exports.isAuthenticated = () => {
//     return (req, res, next) => {
//         var userObject = req.body.params.authUser;
//         userService.UserSchemaService.GetVerified(userObject, (userErr, userModel)=>{
//             if(userErr || !userModel){
//                 return res.status(401).json({ failed: "Missing or invalid user" });
//             }
//             return next();
//         });
//     };
// };

// exports.isRequirePassword = () => {
//     return (req, res, next) => {
//         var userObject = req.body.params.authUser;
//         userService.UserSchemaService.GetVerified(userObject, (userErr, userModel)=>{
//             if(userErr || !userModel){
//                 return res.status(200).json({ failed: "Invalid Credentials" });
//             }
//             return next();
//         });
//     };
// };
