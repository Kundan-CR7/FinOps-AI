import { Router } from "express";
import { AlertController } from "../controllers/AlertController";
import { AlertRepository } from "../repositories/AlertRepository";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

// Dependency Injection
const alertRepo = new AlertRepository();
const alertController = new AlertController(alertRepo);

router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get("/", (req, res) => (
    alertController.getAlerts(req, res)
));

router.patch("/:id/resolve", (req, res) => (
    alertController.resolveAlert(req, res)
));

export default router;
