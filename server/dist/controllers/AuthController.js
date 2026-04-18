"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const result = await AuthService_1.AuthService.register(email, password);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            const result = await AuthService_1.AuthService.login(email, password);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
