const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

// GET overall statistics
router.get('/overview', async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();
    const totalMinutes = await Log.aggregate([
      { $group: { _id: null, total: { $sum: '$minutes' } } }
    ]);

    const uniqueActivities = await Log.distinct('activity');
    const uniqueCategories = await Log.distinct('category');

    const firstLog = await Log.findOne().sort({ createdAt: 1 });
    const lastLog = await Log.findOne().sort({ createdAt: -1 });

    res.json({
      totalLogs,
      totalMinutes: totalMinutes[0]?.total || 0,
      uniqueActivities: uniqueActivities.length,
      uniqueCategories: uniqueCategories.length,
      firstLogDate: firstLog?.createdAt,
      lastLogDate: lastLog?.createdAt,
      averageMinutesPerLog: totalLogs > 0 ? Math.round(totalMinutes[0]?.total / totalLogs) : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overview statistics' });
  }
});

// GET weekly statistics
router.get('/weekly', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const weeklyStats = await Log.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({ weeklyStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly statistics' });
  }
});

// GET activity statistics
router.get('/activities', async (req, res) => {
  try {
    const { limit = 10, period } = req.query;
    let matchStage = {};

    if (period === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchStage = { date: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      matchStage = { date: { $gte: monthAgo } };
    }

    const activityStats = await Log.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$activity',
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 },
          averageMinutes: { $avg: '$minutes' }
        }
      },
      {
        $sort: { totalMinutes: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({ activityStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity statistics' });
  }
});

// GET category statistics
router.get('/categories', async (req, res) => {
  try {
    const categoryStats = await Log.aggregate([
      {
        $group: {
          _id: '$category',
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 },
          averageMinutes: { $avg: '$minutes' }
        }
      },
      {
        $sort: { totalMinutes: -1 }
      }
    ]);

    res.json({ categoryStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

// GET productivity trends
router.get('/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await Log.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch productivity trends' });
  }
});

module.exports = router; 