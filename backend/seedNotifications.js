const sequelize = require('./database/config');
const { User, Report, Notification } = require('./models');

async function seedNotifications() {
  try {
    await sequelize.sync();
    console.log('Database synced');

    // Get test user
    const testUser = await User.findOne({ where: { email: 'user@test.com' } });
    if (!testUser) {
      console.log('Test user not found. Please run seedReports.js first.');
      process.exit(1);
    }

    // Get a few reports
    const reports = await Report.findAll({ limit: 5, where: { user_id: testUser.id } });
    
    if (reports.length === 0) {
      console.log('No reports found for test user.');
      process.exit(1);
    }

    // Create sample notifications
    const notifications = [
      {
        user_id: testUser.id,
        message: `Ahmed Hassan commented on your report: "${reports[0]?.title}"`,
        type: 'comment',
        related_id: reports[0]?.id,
        is_read: false
      },
      {
        user_id: testUser.id,
        message: `Fatima Ali upvoted your report: "${reports[0]?.title}"`,
        type: 'vote',
        related_id: reports[0]?.id,
        is_read: false
      },
      {
        user_id: testUser.id,
        message: `Mohamed Saeed commented on your report: "${reports[1]?.title}"`,
        type: 'comment',
        related_id: reports[1]?.id,
        is_read: true
      },
      {
        user_id: testUser.id,
        message: `Omar Khaled downvoted your report: "${reports[1]?.title}"`,
        type: 'vote',
        related_id: reports[1]?.id,
        is_read: false
      },
      {
        user_id: testUser.id,
        message: `Sara Mahmoud commented on your report: "${reports[2]?.title}"`,
        type: 'comment',
        related_id: reports[2]?.id,
        is_read: true
      }
    ];

    for (const notif of notifications) {
      if (notif.related_id) {
        await Notification.create(notif);
      }
    }

    console.log(`✅ Created ${notifications.length} test notifications for user@test.com`);
    console.log('You can now view these in the profile page!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedNotifications();
