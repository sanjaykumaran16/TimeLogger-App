const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  activity: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true,
    maxlength: [100, 'Activity name cannot exceed 100 characters']
  },
  minutes: {
    type: Number,
    required: [true, 'Minutes spent is required'],
    min: [1, 'Minutes must be at least 1'],
    max: [1440, 'Minutes cannot exceed 1440 (24 hours)']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
logSchema.index({ date: -1 });
logSchema.index({ activity: 1 });
logSchema.index({ category: 1 });
logSchema.index({ createdAt: -1 });

// Virtual for formatted date
logSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for hours and minutes
logSchema.virtual('hours').get(function() {
  return Math.floor(this.minutes / 60);
});

logSchema.virtual('remainingMinutes').get(function() {
  return this.minutes % 60;
});

// Pre-save middleware to ensure date is set to start of day
logSchema.pre('save', function(next) {
  if (this.date) {
    this.date = new Date(this.date.setHours(0, 0, 0, 0));
  }
  next();
});

// Static method to get daily total
logSchema.statics.getDailyTotal = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: '$minutes' },
        totalEntries: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get activity summary
logSchema.statics.getActivitySummary = function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $group: {
        _id: '$activity',
        totalMinutes: { $sum: '$minutes' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalMinutes: -1 }
    }
  ]);
};

module.exports = mongoose.model('Log', logSchema); 