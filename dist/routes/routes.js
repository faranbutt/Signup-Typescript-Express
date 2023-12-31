"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AuthControllers_1 = require("../controllers/AuthControllers");
// router.post("/signup",SignUp);
router.post("/signup", AuthControllers_1.SignUp);
router.post("/login", AuthControllers_1.Login);
exports.default = router;
