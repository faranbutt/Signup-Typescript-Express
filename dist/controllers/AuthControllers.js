"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.Logout = exports.Login = exports.SignUp = void 0;
const Users_1 = require("../models/Users");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            if (!(!name)) {
                return res.json({ data: "Name is Missing", status: "name-missing" });
            }
            else if (!(!email)) {
                return res.json({ data: "Email is Missing", status: "email-missing" });
            }
            else if (!(!password)) {
                return res.json({ data: "Password is Missing", status: "password-missing" });
            }
        }
        const data = yield Users_1.db.select().from(Users_1.userTable).where((0, drizzle_orm_1.eq)(Users_1.userTable.email, email));
        if (data.length) {
            return res.json({ data: "Email already registered with another account", status: "email-exists" });
        }
        else {
            const passHash = yield (0, bcrypt_1.hash)(password, 10);
            const data = yield Users_1.db.insert(Users_1.userTable).values({ name, email, password: passHash });
            if (data) {
                return res.json({ data: data, status: "email-registered" });
            }
            else {
                return res.json();
            }
        }
    }
    catch (error) {
        console.log("Error in sign up ", error.message);
    }
});
exports.SignUp = SignUp;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            if (!(!email)) {
                return res.json({ data: "Email is Missing", status: "email-missing" });
            }
            else if (!(!password)) {
                return res.json({ data: "Password is Missing", status: "password-missing" });
            }
        }
        else {
            const user = yield Users_1.db.select().from(Users_1.userTable).where((0, drizzle_orm_1.eq)(Users_1.userTable.email, email));
            if (!user) {
                return res.json({ data: "user dosen't exits.Signup first", status: "signup-first" });
            }
            const UserData = user[0];
            console.log("FFFFFF", UserData);
            const passwordStatus = yield (0, bcrypt_1.compare)(password, UserData.password);
            console.log("Password", passwordStatus);
            if (passwordStatus) {
                var token = jsonwebtoken_1.default.sign(UserData, process.env.SECERT_KEY, { expiresIn: "1d" });
                console.log(token);
                const response = res.json({ data: "Login Successfull", success: true });
                res.cookie("token", token, { httpOnly: true });
                return response;
            }
            else {
                return res.json({ message: "Password is incorrect", status: "incorrect-password" });
            }
        }
    }
    catch (error) {
        console.log("Error in sign up ", error.message);
    }
});
exports.Login = Login;
const Logout = (req, res, next) => {
    try {
        const response = res.json({ data: "Logout Successfull", success: true });
        res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
        return response;
    }
    catch (error) {
        console.log("Error in sign up ", error.message);
    }
};
exports.Logout = Logout;
const Auth = (req, res, next) => {
    const path = req.path;
    const isPublicPath = path === '/login' || path === '/signup' || path === '';
    const token = req.cookies.token;
    if (isPublicPath && token) {
        const pathUrl = new URL('/', 'http://localhost:3000');
        return res.json({ data: pathUrl.href });
    }
    if (!isPublicPath && !token) {
        const pathUrl = new URL('/login', 'http://localhost:3000');
        return res.json({ data: pathUrl.href });
    }
};
exports.Auth = Auth;
