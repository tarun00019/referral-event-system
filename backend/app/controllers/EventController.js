const slugify = require('slugify');
const { Event, Image, User } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

class EventController {

    // ✅ CREATE EVENT (with unique slug)
    static async createEvent(req, res) {
        try {
            const { title, description, meta_title, meta_description } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required'
                });
            }

            // 🔥 Generate unique slug
            const baseSlug = slugify(title, {
                lower: true,
                strict: true
            });

            let slug = baseSlug;
            let counter = 1;

            while (await Event.findOne({ where: { slug } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            const event = await Event.create({
                user_id: req.user.id,
                title,
                slug,
                description,
                meta_title,
                meta_description
            });

            // Save images
            if (req.files && req.files.length > 0) {
                const imagePromises = req.files.map(file =>
                    Image.create({
                        event_id: event.id,
                        image_url: file.filename
                    })
                );

                await Promise.all(imagePromises);
            }

            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: event
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ✅ UPDATE EVENT
    static async updateEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            if (event.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            await event.update(req.body);

            res.json({
                success: true,
                message: 'Event updated successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ✅ DELETE EVENT + DELETE FILES
    static async deleteEvent(req, res) {
        try {
            const event = await Event.findByPk(req.params.id, {
                include: [{ model: Image }]
            });

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            if (event.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            // Delete image files from disk
            for (const image of event.Images) {
                const filePath = path.join(__dirname, '../../public/uploads', image.image_url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await event.destroy();

            res.json({
                success: true,
                message: 'Event and images deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ✅ GET ALL EVENTS (with creator name + pagination + search)
    static async getAllEvents(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';

        const { count, rows } = await Event.findAndCountAll({
            where: search
                ? { title: { [Op.like]: `%${search}%` } }
                : {},
            include: [
                {
                    model: User,
                    attributes: ['id', 'name']
                },
                {
                    model: Image,
                    attributes: ['image_url']
                }
            ],
            limit,
            offset
        });

        res.json({
            success: true,
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            data: rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

    // ✅ GET EVENT BY SLUG (with images)
    static async getEventBySlug(req, res) {
        try {
            const event = await Event.findOne({
                where: { slug: req.params.slug },
                include: [
                    {
                        model: Image,
                        attributes: ['image_url']
                    },
                    {
                        model: User,
                        attributes: ['id', 'name']
                    }
                ]
            });

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }

            res.json({
                success: true,
                data: event
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = EventController;