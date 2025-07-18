const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

// GET overall statistics
router.get('/overview', async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();
    const totalMinutesAgg = await Log.aggregate([
      { $group: { _id: null, total: { $sum: '$minutes' } } }
    ]);
    const totalMinutes = totalMinutesAgg[0]?.total || 0;

    const uniqueActivities = await Log.distinct('activity');

    // Activity summary (all time)
    const activitySummary = await Log.aggregate([
      {
        $group: {
          _id: '$activity',
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalMinutes: -1 } }
    ]);

    // Most productive day (by total minutes)
    const mostProductiveDayAgg = await Log.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalMinutes: -1 } },
      { $limit: 1 }
    ]);
    const mostProductiveDay = mostProductiveDayAgg[0] || null;

    // Longest session (single log with max minutes)
    const longestSession = await Log.findOne().sort({ minutes: -1 });

    // Weekly average (average per day for the last 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);
    const weekStats = await Log.aggregate([
      {
        $match: {
          date: { $gte: weekAgo, $lte: now }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      }
    ]);
    const weekAverage = weekStats.length > 0 ? Math.round(weekStats.reduce((sum, d) => sum + d.totalMinutes, 0) / weekStats.length) : 0;

    res.json({
      activitySummary,
      mostProductiveDay,
      longestSession: longestSession ? {
        activity: longestSession.activity,
        minutes: longestSession.minutes,
        date: longestSession.date
      } : null,
      weekAverage,
      totalMinutes,
      totalEntries: totalLogs,
      uniqueActivities: uniqueActivities.length,
      averageMinutesPerLog: totalLogs > 0 ? Math.round(totalMinutes / totalLogs) : 0
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