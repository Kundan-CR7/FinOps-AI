"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'finops-super-secret-key-123';
class AuthService {
    static async register(email, password, role = 'ADMIN') {
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email is already registered');
        }
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                role,
                isActive: true,
            }
        });
        return this.generateAuthResponse(user);
    }
    static async login(email, password) {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        if (!user.isActive) {
            throw new Error('Account is inactive');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        return this.generateAuthResponse(user);
    }
    static generateAuthResponse(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}
exports.AuthService = AuthService;
