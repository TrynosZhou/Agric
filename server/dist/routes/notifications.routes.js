"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Notification_1 = require("../entities/Notification");
const router = (0, express_1.Router)();
const notifRepo = () => data_source_1.AppDataSource.getRepository(Notification_1.Notification);
router.get("/", async (_req, res) => {
    const notifications = await notifRepo().find({ order: { createdAt: "DESC" } });
    res.json(notifications);
});
router.get("/unread-count", async (_req, res) => {
    const count = await notifRepo().count({ where: { status: "unread" } });
    res.json({ unreadCount: count });
});
router.put("/:id/read", async (req, res) => {
    const notification = await notifRepo().findOne({ where: { id: req.params.id } });
    if (!notification) {
        res.status(404).json({ message: "Notification not found" });
        return;
    }
    notification.status = "read";
    notification.isRead = true;
    await notifRepo().save(notification);
    res.json(notification);
});
router.put("/mark-all-read", async (_req, res) => {
    await notifRepo()
        .createQueryBuilder()
        .update(Notification_1.Notification)
        .set({ status: "read", isRead: true })
        .where("status = :status", { status: "unread" })
        .execute();
    res.json({ ok: true });
});
router.post("/", async (req, res) => {
    const title = String(req.body?.title ?? "").trim();
    const message = String(req.body?.message ?? "").trim();
    const module = String(req.body?.module ?? "general").trim();
    const priority = String(req.body?.priority ?? "reminder").trim().toLowerCase();
    const status = String(req.body?.status ?? "unread").trim().toLowerCase();
    if (!title || !message) {
        res.status(400).json({ message: "title and message are required" });
        return;
    }
    if (!Notification_1.notificationPriorities.includes(priority)) {
        res.status(400).json({ message: "Invalid priority" });
        return;
    }
    if (!Notification_1.notificationStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
    }
    const n = notifRepo().create({
        title,
        message,
        module,
        priority: priority,
        status: status,
        isRead: status === "read"
    });
    await notifRepo().save(n);
    res.status(201).json(n);
});
exports.default = router;
