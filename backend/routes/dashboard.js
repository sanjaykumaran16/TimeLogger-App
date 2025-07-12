const express = require('express');
const Log = require('../models/Log');
const router = express.Router();

// GET dashboard data
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Today's data
    const todayLogs = await Log.find({
      date: { $gte: today }
    }).sort({ createdAt: -1 });

    const todayTotal = await Log.getDailyTotal(today);
    const todayActivitySummary = await Log.getActivitySummary(today);

    // Yesterday's data
    const yesterdayTotal = await Log.getDailyTotal(yesterday);

    // This week's data
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekStats = await Log.aggregate([
      {
        $match: {
          date: { $gte: weekStart }
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

    // Recent activities
    const recentActivities = await Log.aggregate([
      {
        $group: {
          _id: '$activity',
          lastUsed: { $max: '$createdAt' },
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { lastUsed: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Top categories
    const topCategories = await Log.aggregate([
      {
        $group: {
          _id: '$category',
          totalMinutes: { $sum: '$minutes' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalMinutes: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      today: {
        logs: todayLogs,
        totalMinutes: todayTotal[0]?.totalMinutes || 0,
        totalEntries: todayTotal[0]?.totalEntries || 0,
        activitySummary: todayActivitySummary
      },
      yesterday: {
        totalMinutes: yesterdayTotal[0]?.totalMinutes || 0
      },
      weekStats,
      recentActivities,
      topCategories
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET productivity insights
router.get('/insights', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Average daily minutes this week
    const weekAverage = await Log.aggregate([
      {
        $match: {
          date: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          dailyMinutes: { $sum: '$minutes' }
        }
      },
      {
        $group: {
          _id: null,
          averageDailyMinutes: { $avg: '$dailyMinutes' }
        }
      }
    ]);

    // Most productive day
    const mostProductiveDay = await Log.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalMinutes: { $sum: '$minutes' }
        }
      },
      {
        $sort: { totalMinutes: -1 }
      },
      {
        $limit: 1
      }
    ]);

    // Longest activity session
    const longestSession = await Log.findOne().sort({ minutes: -1 });

    // Activity consistency
    const activityConsistency = await Log.aggregate([
      {
        $group: {
          _id: '$activity',
          count: { $sum: 1 },
          totalMinutes: { $sum: '$minutes' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      }
    ]);

    res.json({
      weekAverage: weekAverage[0]?.averageDailyMinutes || 0,
      mostProductiveDay: mostProductiveDay[0] || null,
      longestSession,
      activityConsistency
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

module.exports = router; 