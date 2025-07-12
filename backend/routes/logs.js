const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Log = require('../models/Log');
const router = express.Router();

// Validation middleware
const validateLogEntry = [
  body('activity').trim().isLength({ min: 1, max: 100 }),
  body('minutes').isInt({ min: 1, max: 1440 }),
  body('date').optional().isISO8601(),
  body('notes').optional().isLength({ max: 500 }),
  body('category').optional().isLength({ max: 50 }),
  body('tags').optional().isArray()
];

// GET all logs with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, activity, category, date } = req.query;
    const filter = {};
    
    if (activity) filter.activity = { $regex: activity, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const logs = await Log.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments(filter);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalLogs: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET logs for specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await Log.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });

    const dailyTotal = await Log.getDailyTotal(date);
    const activitySummary = await Log.getActivitySummary(date);

    res.json({
      logs,
      dailyTotal: dailyTotal[0]?.totalMinutes || 0,
      totalEntries: dailyTotal[0]?.totalEntries || 0,
      activitySummary
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs for date' });
  }
});

// POST create new log
router.post('/', validateLogEntry, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { activity, minutes, date, notes, category, tags } = req.body;
    
    const newLog = new Log({
      activity,
      minutes: parseInt(minutes),
      date: date ? new Date(date) : new Date(),
      notes,
      category: category || 'General',
      tags: tags || []
    });

    const savedLog = await newLog.save();
    res.status(201).json({
      message: 'Log entry created successfully',
      log: savedLog
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log entry' });
  }
});

// PUT update log
router.put('/:id', [
  param('id').isMongoId(),
  ...validateLogEntry
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updatedLog = await Log.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedLog) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    res.json({
      message: 'Log entry updated successfully',
      log: updatedLog
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update log entry' });
  }
});

// DELETE log
router.delete('/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await Log.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({ error: 'Log entry not found' });
    }

    res.json({
      message: 'Log entry deleted successfully',
      deletedLog
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete log entry' });
  }
});

module.exports = router; 