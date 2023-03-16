var game = (function() {
	const PRICE_GROWTH = 1.15;
  const MAXIMUM_CHATS = 8;
  const MAXIMUM_ACQUISITION_MAIL = 10;
	const SAVE_FILE = 'business_sim_save';
  const HOVER_DELAY = 200
  const HOVER_HIDE_DELAY = 50
	//const PRICE_GROWTH = 1.25;
	
		var unitCount = new Stat('Employees Employed', 0);
	  var upgradeCount = new Stat('Upgrades Owned', 0);
	  var totalCash = new Stat('Cash Earned in Total', 0, '$', null, true);
	  var totalCashAllTime = new Stat('Cash Earned in Total (All Time)', 0, '$', null, true);
	  var earnedWhileIdle = new Stat('Idle Bonus Cash Earned', 0, '$', null, true);
	  var currentCash = new Stat('Cash in Hand', 0, '$', null, true);
    var employeeDiscount = new Stat('Employee Discount', 0, null, '%');

    var totalCashSlowed = new Stat('Cash Earned in Total', ko.computed(function() {
      return totalCash.val();
    }, this).extend({ rateLimit: 500 }));
	  
	  // Manual Click Stats
    var manualClicks = new Stat('Manual Clicks', 0);
    var manualClicksAllTime = new Stat('Manual Clicks (All Time)', 0);
    var earnedFromManualClicks = new Stat('Cash Earned by Clicking', 0, '$');
	  var manualClickMultiplier = new Stat('Manual Click Multiplier', 0);
	  var manualClickDPSPercentage = new Stat('Manual Click Percentage', 0, null, '%');
    var windfallCount = new Stat('Total Windfalls', 0);
    var windfallCountAllTime = new Stat('Total Windfalls (All Businesses)', 0);
    var windfallDuration = new Stat('Duration Per Windfall', 10, null, ' seconds'); 
    var earnedFromWindfalls = new Stat('Cash Earned During Windfalls', 0, '$');
    var windfallChance = new Stat('Chance of Windfall', 1);
    var windfallMultiplier = new Stat('Windfall Multiplier', 10);
    var windfallProgress = new Stat('Windfall Progress', 0, null, '%');
    var windfallGrowthMultiplier = new Stat('Windfall Growth Rate Multiplier', 1);

    var windfallGuaranteeRate = new Stat('Windfall Guarantee Rate', ko.computed(function() {
      return 0.2 * windfallGrowthMultiplier.val();
    }, this));

	  // Overall DPS modifiers
	  var overallDPSPercentage = new Stat('Base Mod to Cash Per Second', 0, null, '%');
	  var overallDPSMultiplier = new Stat('DPS Multiplier Bonus', 1, null, '%');
	  var achievementBonusRate = new Stat('Bonus Per Achievement', 0, null, '%');
	  var unitCountBonusRate = new Stat('Bonus Per Employee', 0, null, '%');
	  var allEmployeeMod = new Stat('Employee-Wide Modifier', 0);
    var timePlayedBonusRate = new Stat('Bonus for Time Played', 0, null, '%');

    // Other DPS modifiers
    var awayEarningRate = new Stat('Earning Rate While Away', 15, null, '%');
    var earnedWhileAway = new Stat('Earned While Away', 0, '$');
    var idleBonusRate = new Stat('Idle Bonus Rate', 0.001);
    var timeSpentIdle = new TimeStat('Time Spent Idle', 0);
    var timeSpentIdleAllBusinesses = new TimeStat('Time Spent Idle (All Businesses)', 0);
	  
	  // Email Stats
  	var baseMailChance = new Stat('Base Email Chance', 0.01); // Chance out of 100
  	var mailChanceMultiplier = new Stat('Email Chance Multiplier', 1);
  	var mailAnswered = new Stat('Emails Answered', 0);
  	var mailAnsweredAllTime = new Stat('Emails Answered (All Businesses)', 0);
  	var specialMailAnswered = new Stat('Urgent Emails Answered', 0);
    var specialMailAnsweredAllTime = new Stat('Urgent Emails Answered (All Businesses)', 0);
  	var specialMailEarned = new Stat('Cash Earned From Urgent Emails', 0, '$');
  	var specialMailBonus = new Stat('Urgent Email Bonus', 1000, null, '%');
  	var specialMailChance = new Stat('Chance to Receive Urgent Emails', 5);
  	var timeToAnswerMail = new Stat('Email Freshness Timer', 60, null, ' seconds');
  	var totalEarnedFromEmails = new Stat('Cash Earned From Emails', 0, '$');
    var freshEmailEarned = new Stat('Cash Earned From Fresh Emails', 0, '$');
    var expiredEmailEarned = new Stat('Cash Earned From Expired Emails', 0, '$');
  	var wordsReplied = new Stat('Smart Words Replied (All Businesses)', 0);
  	var inboxMax = new Stat('Inbox Maximum', 10);
    var emailCashBonus = new Stat('Bonus to Email Payout', 0, null, '%');
    var timeBonusMinimum = new Stat('Minimum Email Value', 0.1);
    var expiredEmailsAnswered = new Stat('Expired Emails Answered', 0); 
    var freshEmailsAnswered = new Stat('Fresh Emails Answered', 0);
    var baseEmailTextMultiplier = new Stat('Email Text Bonus Multiplier', 1);
  	
  	// Investment Stats
  	var interestRate = new Stat('Interest Rate (Per Minute)', 50, null, '%'); 
  	var completedInvestments = new Stat('Successful Investments', 0);
  	var completedInvestmentsAllTime = new Stat('Successful Investments (All Businesses)', 0);
    var shortInvestments = new Stat('Short Investments (Under 1 Hour)', 0);
    var shortInvestmentBonus = new Stat('Short Investment Bonus', 0, null, '%');
    var longInvestments = new Stat('Long Investments (1 Hour or Over)', 0);
  	var earnedFromInvestments = new Stat('Cash Earned From Investments', 0, '$');
    var earnedFromLongInvestments = new Stat('Cash Earned From Long Investments', 0, '$');
    var earnedFromShortInvestments = new Stat('Cash Earned From Short Investments', 0, '$');
  	var simultaneousInvestments = new Stat('Simultaneous Investments Allowed', 1);
    var timeInvested = new TimeStat('Time Dedicated to Investments', 0); // Actual value is in ms
    var timeInvestedAllTime = new TimeStat('Time Dedicated to Investments (All Businesses)', 0);
    var canceledInvestments = new Stat('Canceled Investments', 0);
    var timeBonusRate = new Stat('Time Bonus Rate (Hourly)', 15, null, '%');

    // R&D Stats
    var patentsSold = new Stat('Patents Sold (All Businesses)', 0);
    var earnedFromResearch = new Stat('Earned from Research', 0, '$');
    var employeesKilled = new Stat('Employees Who Couldn\'t Hack it', 0);
    var riskReduction = new Stat('Risk Reduction', 0, null, '%');
    var speedBoost = new Stat('Speed Bonus', 0, null, '%');
    var valueBoost = new Stat('Value Bonus', 0, null, '%');
    var researchBonus = new Stat('R&D Bonus', 0, null, '%');

    // Career Dev Stats
    var crypticEmailsReceived = new Stat('Cryptic Emails Received', 0);
    var crypticEmailsReceivedAllTime = new Stat('Cryptic Emails Received (All Businesses)', 0);
    var crypticEmailEarnings = new Stat('Cryptic Email Earnings', 0);
    var crypticEmailBonus = new Stat('Cryptic Email Bonus', 0, null, '%');

    var timeTraining = new TimeStat('Time Spent Training', 0);
    var timeTrainingAllBusinesses = new TimeStat('Time Spent Training (All Businesses)', 0);
    var trainingBonus = new Stat('Training Bonus', 0, null, '%');
    var seminarsUsed = new Stat('Training Seminars Attended (All Businesses)', 0);
    // nextBankruptcySeminars

    // Outgoing Email stats
    var overallTimeBoosted = new TimeStat('Overall Time Boosted (All Businesses)', 0);
    var outgoingEmails = new Stat('Outgoing Emails Sent (All Businesses)', 0);
    var investmentTimeBoosted = new TimeStat('Investment Time Boosted', 0);
    var researchTimeBoosted = new TimeStat('R&D Time Boosted', 0);
    var acquisitionTimeBoosted = new TimeStat('Acquisition Time Boosted', 0);
    var trainingTimeBoosted = new TimeStat('Training Time Boosted', 0);
    var stressReduced = new Stat('Stress Reduced Manually', 0, null, '%');
    var investmentBoostBonus = new Stat('Investment Boost Bonus', 0, null, '%');
    var researchBoostBonus = new Stat('Research Boost Bonus', 0, null, '%');
    var acquisitionBoostBonus = new Stat('Acquisition Boost Bonus', 0, null, '%');
    var trainingBoostBonus = new Stat('Training Boost Bonus', 0, null, '%');
    var stressReductionMultiplier = new Stat('Stress Reduction Multiplier', 1);

    var stressReduction = new Stat('Stress Reduction Bonus', ko.computed(function() {
        var value = (overallTimeBoosted.val() / 1000 / 60 / 60) * 1.5;
        return value < 500 ? value : 500;
    }, this), null, '%', null, null, 'The <b>Stress Reduction Bonus</b> is derived from the total time boosted across all departments. It is not reset after bankruptcy.');

    // Acquisition Stats
    var simultaneousAcquisitions = new Stat('Simultaneous Acquisitions Allowed', 1);
    var completedAcquisitions = new Stat('Acquisitions Sold', 0);
    var completedAcquisitionsAllTime = new Stat('Acquisitions Sold (All Businesses)', 0);
    var earnedFromAcquisitions = new Stat('Cash Earned From Acquisitions', 0, '$');
    var acquisitionValueMultiplier = new Stat('Acquisition Value Multiplier', 2);
    var acquisitionsWorkerDiscount = new Stat('Discount For Acquisition Workers', 0, null, '%');
    var defaultExecutives = new Stat('Default Acquisitions Executives', 0);

    var chatsCompleted = new Stat('Chats Completed (All Businesses)', 0);
    var wordsChatted = new Stat('Words Chatted', 0);
    var policiesAccepted = new Stat('Policies Accepted (All Businesses)', 0);
    var layoffsConducted = new Stat('Massive Layoffs Conducted (All Businesses)', 0);
    var fudgedNumberSessions = new Stat('Number Fudgings Occurred (All Businesses)', 0);

    // Election Stats
    var electionsWon = new Stat('Elections Won (All Businesses)', 0); 
    var electionsLost = new Stat('Elections Lost (All Businesses)', 0);
    var earnedFromElections = new Stat('Earned from Elections', 0, '$');
    var donatedToCandidates = new Stat('Donated to Candidates', 0, '$');
    var netElectionEarnings = new Stat('Net Election Earnings', ko.computed(function() {
      return earnedFromElections.val() - donatedToCandidates.val();
    }, this), '$');
    var gaffesExperienced = new Stat('Gaffes Experienced (All Businesses)', 0);
    var gaffeBuffer = new Stat('Buffer to Gaffe Risk', 0, null, '%');
    var prChance = new Stat('Chance for PR Spin', 0, null, '%');
    var electionPayoutBonus = new Stat('Election Payout Bonus', 0, null, '%');
    var electionSupportRate = new Stat('Donation Efficacy Rate', 2);
    var winStreak = new Stat('Win Streak', 0);
    var winStreakCap = new Stat('Win Streak Cap', 5);
  	
  	// Bankruptcy Stats
  	var bankruptcyBonus = new Stat('Bankruptcy Multiplier', 1, null, null, null, null, 'The <b>Bankruptcy Multiplier</b> is a direct multiplier to your overall per-second cash earnings.');
    var additionalBankruptcyBonus = new Stat('Additional Bankruptcy Bonus', 0);
  	var bankruptcies = new Stat('Bankruptcies Declared', 0);
    var trainingSeminars = new Stat('Training Seminars', 0);
  	
  	// Utility Stats
    var emailAway = new Stat('Email Away Unlocked', 0);
    var policyAway = new Stat('Policy Away Unlocked', 0);
    var chatAway = new Stat('Chat Away Unlocked', 0);
    var windfallGuarantee = new Stat('Windfall Guarantee', 0);
    var electionNotifications = new Stat('Election Notifications Unlocked', 0);

    var policyAwayToggled = ko.observable(false);
    var chatAwayToggled = ko.observable(false);
  	var mediumIntervalCounter = ko.observable(0);
    var isTrainingView = ko.observable(false);
    var hoursInMilliseconds = 60 * 60 * 1000;
    var hoursPlayed = ko.computed(function() {
      mediumIntervalCounter();
      return startTime ? Math.floor((Date.now() - new Date(startTime.val())) / 1000 / 60 / 60) : 0;
    }, this);

    var hoursPlayedAllTime = ko.computed(function() {
      mediumIntervalCounter();
      return startTimeAllTime ? Math.floor((Date.now() - new Date(startTimeAllTime.val())) / 1000 / 60 / 60) : 0;
    }, this);

    // Notifies less frequently to avoid excess computation
    var currentCashSlowed = ko.computed(function() {
      return currentCash.val();
    }, this).extend({ rateLimit: 100 });

	  // Other stats
	  var startTime = new DateStat('Start Time (This Business)', Date.now());
	  var startTimeAllTime = new DateStat('Start Time (All Businesses)', Date.now());
	  var lastClick = new DateStat('Last Time Active', Date.now());
    var saveFileSize = new Stat('Save File Size', 0, null, 'kb');
	  var version = new Stat('Version', '0.7.11');
    var statsTabViews = new Stat('Stats Tab Views', 0);
    var achievementTabViews = new Stat('Upgrades/Achievements Tab Views', 0);
    var viewingTab = ko.observable('store');
    var viewingModal = ko.observable(null);
    
    var idleLevel = ko.computed(function() {
        mediumIntervalCounter();
        var timeSinceLastClick = lastClick.val() ? Date.now() - lastClick.val() : 0;
        var level = 0;
        if (timeSinceLastClick > 60000 * 60) {
            level = 3;
        } else if (timeSinceLastClick > 60000 * 10) {
            level = 2;
        } else if (timeSinceLastClick > 60000) {
            level = 1;
        }

        if (level > 0 && timeSpentIdle) {
           timeSpentIdle.add(2500);
           timeSpentIdleAllBusinesses.add(2500);
        }
        
        return level;
    }, this);
    
    var idleBonus = new Stat('Idle Bonus Multiplier', ko.computed(function() {        
        return 1 + (idleLevel() * idleBonusRate.val());
    }, this), null, null, null, true);
	  
	  // User-selected variables
	  var buyRate = ko.observable(1);
    var trainingHours = ko.observable(1);
	  var isWindfall = ko.observable(false);
	  
	  // Settings
	  var bankruptcyModalViewed = ko.observable(false);
    var enableCharts = ko.observable(true);
    var enableHover = ko.observable(true);
    var enableNotifications = ko.observable(true);
    var enableEmptyUpgradesAndAchievements = ko.observable(true);
    var enableDarkMode = ko.observable(false);
    var enableFixedNavTabs = ko.observable(false);
    var enableWindfallGuarantee = ko.observable(true);
    var maxType = ko.observable('default');
    var maxIncrement = ko.observable(1);
    var targetIncrement = ko.observable(1);
    var twoColumnEmployees = ko.observable(false);

    var handleDarkMode = ko.computed(function() {
      if (enableDarkMode()) {
        $('link[title="dark"]').attr('href', 'business-simulator/darkly-bootswatch.css');
      } else {
        $('link[title="dark"]').attr('href', '');
      }
    }, this);

    // Arrays to be filled
    var activeInvestments = ko.observableArray([]);
    var activeAcquisitions = ko.observableArray([]);
    var units = ko.observableArray([]);
    var mail = ko.observableArray([]);

    var regularInbox = ko.observable(true);
    var viewingInbox = ko.computed(function() {
      if (regularInbox()) {
        return mail()
      } else {
        return viewingAcquisition() && viewingAcquisition().mail();
      }
    }, this);

  var internBoost = new PermStatBoost('i1', 0, 'accessibility', 10, 'Management Shadowing', 'Add a <b>%percent</b> bonus to the earnings of your <b>Interns</b>.', 'I must be loyle to my capo.');
  var textBoost = new PermStatBoost('i2', 0, 'accessibility', 10, 'Pain Tolerance Training', 'Add a <b>%percent</b> bonus to your <b>Email Text Bonus</b>.', 'Kiri, kiri, kiri...');
  var wageSlaveBoost = new PermStatBoost('w1', 1, 'work', 10, 'Thrift Reeducation', 'Add a <b>%percent</b> bonus to the earnings of your <b>Wage Slaves</b>.', 'I already am eating from the trash can all the time.');
  var rdBoost = new PermStatBoost('w2', 1, 'work', 5, 'Risk-Inclination Conditioning', 'Add a <b>%percent</b> bonus to the value of your <b>Research</b>.', 'Desperation sometimes drives innovation.');
  var salesBoost = new PermStatBoost('s1', 2, 'record_voice_over', 10, 'Creativity Webinars', 'Add a <b>%percent</b> bonus to the earnings of your <b>Sales Hotshots</b>.', 'I love titration, yeah, that’s not a problem.');
  var emailBoost = new PermStatBoost('s2', 2, 'record_voice_over', 5, 'Inbox Immersion Inculcation', 'Add a <b>%percent</b> bonus to the value of your <b>Emails</b>.', 'Th- This is my hole! It was made for me!');
  var managerBoost = new PermStatBoost('m1', 3, 'trending_down', 10, 'Dunning-Kruger Seminars', 'Add a <b>%percent</b> bonus to the earnings of your <b>Middle Managers</b>.', 'Every manager is a baffled dictator.');
  var electionBoost = new PermStatBoost('m2', 3, 'trending_down', 5, 'Leadership Coaching', 'Add a <b>%percent</b> bonus to the value of all <b>Elections</b>, win or lose.', 'Stiffen up, you ornery duffer.');
  //var acqWorkerBoost = new PermStatBoost('m2', 3, 'trending_down', 5, 'Leadership Coaching', 'Add a <b>%percent</b> bonus to the value of all <b>Elections</b>, win or lose.', 'Stiffen up, you ornery duffer.');
  var cLevelBoost = new PermStatBoost('c1', 4, 'lightbulb_outline', 10, 'Vision Symposiums', 'Add a <b>%percent</b> bonus to the earnings of your <b>C-Levels</b>.', 'They have worked their way to the top by their own abilities...');
  var investmentBoost = new PermStatBoost('c2', 4, 'lightbulb_outline', 5, 'Messianic Exercises', 'Add a <b>%percent</b> bonus to the value of your <b>Investments</b>.', 'WHEN COFFEEE MAN RUN!?!?');
  var blueBloodBost = new PermStatBoost('b1', 5, 'local_bar', 10, 'Inspirational Mentoring', 'Add a <b>%percent</b> bonus to the earnings of your <b>Blue Bloods</b>.', 'Showing average people how to do the work of superior people.');
  var acquisitionBoost = new PermStatBoost('b2', 5, 'local_bar', 5, 'Elite Supervisory Education', 'Add a <b>%percent</b> bonus to the value of your <b>Acquisitions</b>.', 'I can hire one half of the working class to kill the other half.');
  var copBoost = new PermStatBoost('cop1', 6, 'security', 10, 'Tueller Drills', 'Add a <b>%percent</b> bonus to the earnings of your <b>Privatized Cops</b>.', 'I support our boots stamping on a human face &mdash; forever.');
  var outgoingBoost = new PermStatBoost('cop2', 6, 'security', 5, 'Escalation Tactics', 'Add a <b>%percent</b> bonus to the value of your <b>Outgoing Emails</b>.', "I... shot a kid.");
  var politicianBoost = new PermStatBoost('pol1', 7, 'account_balance', 10, 'Community Outreach', 'Add a <b>%percent</b> bonus to the earnings of your <b>Pocket Politicians</b>.', 'Streets don\'t fail me now.');
  var achievementBoost = new PermStatBoost('pol2', 7, 'account_balance', 1, 'Relatability Exercises', 'Add a <b>%percent</b> bonus to the value of your <b>Achievements</b>.', 'The amazing thing is, that basketball ring in Indiana...');
  var mercenaryBoost = new PermStatBoost('merc1', 8, 'my_location', 10, 'Last Stand Tactics', 'Add a <b>%percent</b> bonus to the earnings of your <b>Mercenary Groups</b>.', 'Well, nobody died in Watergate.');
  var clickBoost = new PermStatBoost('merc2', 8, 'my_location', 5, 'Killology Reorientation', 'Add a <b>%percent</b> bonus to the value of your <b>Manual Clicks</b>.', 'No hope, just folded flags.');
  var clientStateBoost = new PermStatBoost('cl1', 9, 'location_city', 10, 'Privatization Workshops', 'Add a <b>%percent</b> bonus to the earnings of your <b>Client States</b>.', 'In this way and only this way are new worlds born.');
  var trainingBoost = new PermStatBoost('cl2', 9, 'location_city', 1, 'American Schooling', 'Add a <b>%percent</b> bonus the <b>Next Training Bonus</b> of every employee.', 'Libertad, Paz y Fraternidad.');
  var shadowGovernmentBoost = new PermStatBoost('sh1', 10, 'visibility', 10, 'Dark Cosmic Guidance', 'Add a <b>%percent</b> bonus to the earnings of your <b>Shadow Governments</b>.', 'Behold a pale horse...');
  var nextBankruptcyBoost = new PermStatBoost('sh2', 10, 'visibility', 1, 'New Chronology Instruction', 'Add a <b>%percent</b> bonus to your <b>Next Bankruptcy Bonus</b>.', 'And with stranger aeons, even death may die.');
  var puppetmasterBoost = new PermStatBoost('pm1', 11, 'whatshot', 10, 'Ominous Mystagogy', 'Add a <b>%percent</b> bonus to the earnings of your <b>Puppetmasters</b>.', 'This is the second death.');
  var mysteryBoost = new PermStatBoost('pm2', 11, 'whatshot', 10, 'Down the Rabbit Hole', 'Send a <b>%percent</b> bonus straight into an unknowable void.', 'Where we go one, we go all');

  var careerUpgrades = ko.observableArray([
    internBoost,
    textBoost,
    wageSlaveBoost,
    rdBoost,
    salesBoost,
    emailBoost,
    managerBoost,
    electionBoost,
    cLevelBoost,
    investmentBoost,
    blueBloodBost,
    acquisitionBoost,
    copBoost,
    outgoingBoost,
    politicianBoost,
    achievementBoost,
    mercenaryBoost,
    clickBoost,
    clientStateBoost,
    trainingBoost,
    shadowGovernmentBoost,
    nextBankruptcyBoost,
    puppetmasterBoost,
    mysteryBoost
  ]);

    var mysteryBoostResults = new MysteryBoostHandler();

  function MysteryBoostHandler() {
    this.crypticEmailsUnlocked = ko.observable(false);
    this.extraInvestmentUnlocked = ko.observable(false);

    this.results = ko.computed(function() {
      if (mysteryBoost.level() >= 5) { this.extraInvestmentUnlocked(true); }
      if (mysteryBoost.level() >= 10) { this.crypticEmailsUnlocked(true); } 
    }, this);
  }

  var totalSimultaneousInvestmentsAllowed = new Stat('Simultaneous Investments Allowed', ko.computed(function() {
      return simultaneousInvestments.val() + (mysteryBoostResults.extraInvestmentUnlocked() ? 1 : 0);
  }, this));
	  
	  var baseDPSMod = new Stat('Total Mod to Cash Per Second', ko.computed(function() {
      var achievementDPSPercentage = (achievementCount ? achievementCount.val() : 0) * achievementBonusRate.val();
      achievementDPSPercentage += achievementDPSPercentage * (achievementBoost.total.val() / 100);
      var unitCountDPSPercentage = unitCount.val() * unitCountBonusRate.val();
      var timePlayedPercentage = hoursPlayedAllTime() * (timePlayedBonusRate.val());
      return overallDPSPercentage.val() + achievementDPSPercentage + unitCountDPSPercentage + timePlayedPercentage + mysteryBoost.total.val();
    }, this), null, '%');
    
    var pendingInvestmentCount = new Stat('Investments Waiting to Cash Out', ko.computed(function() {
      return activeInvestments().filter(function(investment) {
        return !investment.active();
      }).length;
    }, this));

    var pendingAcquisitionCount = new Stat('Acquisitions Waiting to Cash Out', ko.computed(function() {
      return activeAcquisitions().filter(function(acquisition) {
        return !acquisition.active();
      }).length;
    }, this));

  /**
   * Base price is generally previous unit times 12
   * Base click is generally previous unit times 6
   **/
  var internDescription = "<p>The humble <b>Intern</b> forms the backbone of any savvy business, paid in experience and eager to please as they pad their resumes in hopes of a better tomorrow.</p><p>With the exploitable pliability of youth glistening in their eyes, they scurry through the hallowed halls of your business, wearing multiple hats and incurring minimal expenses.</p>";
	var wageDescription = "<p>The solemn <b>Wage Slave</b> is essential to the success of any growing business, dedicated to their work and trapped in an unbreakable cycle of poverty and obligation.</p><p>Through long nights and lonely weekends, they drag their ragged claws through offices and factory floors, each day hoping to be blessed with a coveted merit increase.</p>";
  var salesDescription = "<p>The confident <b>Sales Hotshot</b> is the engine of your business, bringing your valuable product(s) to your cash-laden customer(s), whether they want them or not.</p><p>Knee-deep in the pipeline and eyes locked on the quarterly numbers, they know that your business is dog-eat-dog, and dogs just don't live that long.</p>";
  var managerDescription = "<p>The ambitious <b>Middle Manager</b> is loyal to your business, striving each day to dominate your lower employees, lest they wither from a lack of motivating leadership.</p><p>Good old-fashioned common sense is their bread and butter, and they always know when it's time to tighten belts, roll up sleeves, and do less with more.</p>";
  var clevelDescription = "<p>The wise <b>C-Level</b> is the conductor of your business, always thinking of innovative and inspiring ways to appear to meet shareholder expectations or inflate valuations.</p><p>With a keen eye and a strict sense of discipline, they approach each new day as a chance to trim the fat and bring value to their investors.</p>";
  var blueDescription = "<p>The noble <b>Blue Blood</b> is the soul of your business, investing in your continued growth, filling your boardrooms, and concentrating the wealth you create.</p><p>Self-made and determined, they watch for your ticker symbol as the markets climb, a sense of benevolent pride pouring over them as the dividends trickle down.</p>";
  var copDescription = "<p>The brave <b>Privatized Cop</b> is the defender of your business, decked out in riot gear and gas masks as the last line of defense between bricks and your windows.</p><p>Armed and ready to protect and serve, they patrol your employees' neighborhoods, upholding a fraternal code of ethics that ensures they only open fire when unnerved.</p>";
  var politicianDescription = "<p>The dignified <b>Pocket Politician</b> allows your business to thrive unburdened by Byzantine regulations, which would otherwise choke the life from it like a clumsy child in a textile mill.</p><p>Moderate and charismatic, they work hard for their constituents, ensuring with every vote that the most basic of needs is met: regular GDP growth.</p>";
  var mercDescription = "<p>The valorous <b>Mercenary Group</b> protects the interests of your business abroad, burning villages and salting the earth anywhere a government begins to lean left.</p><p>Stalwart and ready to just follow orders, they move from city to city, drone's-eye-view overhead, guns trained on the nearest target as they wait for the order to liberate.</p>";
  var clientDescription = "<p>The burgeoning <b>Client State</b> provides the life-blood of your business, supplying labor and resources at prices your own borders could never match.</p><p>There may be death squads in power, but that's the price you have to pay for a business-friendly environment that doesn't frown upon the execution of political agitators</p>";
  var shadowDescription = "<p>The mysterious <b>Shadow Government</b> is the secret benefactor of your business, encouraging social discord and diminishing cultures as they please.</p><p>While not all believe they exist, true leaders such as yourself know that a once-great populace disarmed and hamstrung by political correctness is ripe for exploitation.</p>";
  var puppetDescription = "<p>The omniscient <b>Puppetmaster</b> is the primordial lizard-brain of your business, unspeakably powerful, hailing from a time beyond memory.</p><p>They may look and sound like any of us, but they travel in elite circles: tycoons and magnates, dignitaries and politicians, all gathered in hoods and masks to perform unspeakable horrors in the hidden basements of pizza parlors.</p>";
  
  units.push(new Unit("0", "Interns", "accessibility", 15, 0.1, internDescription, "They have nothing to lose but their chains.", internBoost));
  units.push(new Unit("1", "Wage Slaves", "work", 100, 1, wageDescription, "Once when I was a child, I almost drowned. It's just like that feeling.", wageSlaveBoost));
  units.push(new Unit("2", "Sales Hotshots", "record_voice_over", 1200, 6, salesDescription, "If a man's not a success, he's got no one to blame but himself.", salesBoost));
  units.push(new Unit("3", "Middle Managers", "trending_down", 14400, 36, managerDescription, "More gods, more masters.", managerBoost));
  units.push(new Unit("4", "C-Levels", "lightbulb_outline", 172800, 216, clevelDescription, "A million dollars isn't cool. You know what's cool? A billion dollars.", cLevelBoost));
  units.push(new Unit("5", "Blue Bloods", "local_bar", 2073600, 1296, blueDescription, "Every war but class war.", blueBloodBost));
  units.push(new Unit("6", "Privatized Cops", "security", 24883200, 7776, copDescription, "Did you say, 'Officer, I am not resisting you?'", copBoost));
  units.push(new Unit("7", "Pocket Politicians", "account_balance", 298598400, 46656, politicianDescription, "It merely required no character.", politicianBoost));
  units.push(new Unit("8", "Mercenary Groups", "my_location", 3583180800, 279936, mercDescription, "Q. And Babies? A. And Babies.", mercenaryBoost));
  units.push(new Unit("9", "Client States", "location_city", 42998169600, 1679616, clientDescription, "Nutmeg is not the question.", clientStateBoost));
  units.push( new Unit("10", "Shadow Governments", "visibility", 515978035200, 10077696, shadowDescription, "Now, we can see a new world coming into view.", shadowGovernmentBoost));
  units.push(new Unit("11", "Puppetmasters", "whatshot", 6191736422400, 60466176, puppetDescription, "Hear ye, the doctor has seen Nautulius.", puppetmasterBoost));
    
    var totalDPS = new Stat('Cash Earned Per Second', ko.computed(function() {
	    var cps = 0;
    	for (var i = 0; i < units().length; i++) {
    	  cps += units()[i].cps.val();
    	}
    	
    	// Just here to trigger recalculation
    	unitCount.val();
    	upgradeCount.val();
  		
  		return cps;
	  }, this), '$', null, true);

    var accessibleDPS = new Stat('Cash Earned Per Second (Minus Investments)', ko.computed(function() {
      var investmentPenalty = 0;
      if (activeInvestments && activeInvestments().length > 0) {
        for (var j = 0; j < activeInvestments().length; j++) {
          if (activeInvestments()[j].active()) {
            investmentPenalty += activeInvestments()[j].baseInvestment.val();
          }
        }
      }
      
      var val = totalDPS.val() - investmentPenalty;
      return val > 0 ? val : 0;
    }, this), '$', null, true);
	  
	  
    var totalDPM = new Stat('Cash Earned Per Minute', ko.computed(function() {
      return accessibleDPS.val() * 60;
    }, this), '$');
    
    var totalDPH = new Stat('Cash Earned Per Hour', ko.computed(function() {
      return accessibleDPS.val() * 60 * 60;
    }, this), '$');
    
    var earnedPerClick = new Stat('Cash Earned Per Click', ko.computed(function() {
      var baseVal = 1 + ((manualClickDPSPercentage.val() / 100) * totalDPS.val());
      var currentWindfallMult = isWindfall() ? windfallMultiplier.val() : 1;
      var total = (baseVal * Math.pow(2, manualClickMultiplier.val())) * currentWindfallMult;
      return total + (total * (clickBoost.total.val() / 100));
    }, this), '$');
    
    var unitsUnlocked = new Stat('Employee Types Available', ko.computed(function() {
      return units().filter(function(unit) {
        return unit.available();
      }).length;
    }, this));
    
    var unitsOwned = new Stat('Employee Types Employed', ko.computed(function() {
      return units().filter(function(unit) {
        return unit.num.val() > 0;
      }).length;
    }, this));

    var trainingsCanAfford = ko.computed(function() {
      if (viewingTab() === 'store' && isTrainingView()) {
        var sorted = units.slice().sort(function(left, right) {
          return left.trainingCost.val() === right.trainingCost.val() ? 0
            : left.trainingCost.val() < right.trainingCost.val() ? -1
            : 1;
        });

        var total = 0;
        var affordable = [];
        for (var i = 0; i < sorted.length; i++) {
          if (!sorted[i].trainingActive() && !sorted[i].trainingFinished() && sorted[i].available()) {
            total += sorted[i].trainingCost.val();
            if (total <= currentCashSlowed()) {
              affordable.push(sorted[i].id);
            }
          }
        }

        return affordable;
      } else {
        return 0;
      }
    }, this);

    var multiTrain = function() {
      var list = trainingsCanAfford().slice();
      for (var i = 0; i < list.length; i++) {
        getUnit(list[i]).train();
      }
    }

    var finishAllTrainings = function() {
      for (var j = 0; j < units().length; j++) {
        if (units()[j].trainingFinished()) {
          units()[j].finishTraining();
        }
      }
    }

    var baseNextBankruptcyBonus = ko.computed(function() {
      return (Math.pow(totalCashSlowed.val(), (1 / 5)) / 100) - 2.1;
    }, this);

    var nextBankruptcyBonus = new Stat('Next Bankruptcy Multiplier', ko.computed(function() {
      var val = baseNextBankruptcyBonus();
      var total = (val > 0 ? val : 0) + additionalBankruptcyBonus.val();
      return total + (total * (nextBankruptcyBoost.total.val() / 100));
    }, this), null, null, true, null, 'The <b>Next Bankruptcy Multiplier</b> will be added to your current <b>Bankruptcy Multiplier</b> when you declare bankruptcy.');

    var nextBankruptcySeminars = new Stat('Seminars Earned at Next Bankruptcy', ko.computed(function() {
      return Math.floor(nextBankruptcyBonus.val() / 100);
    }, this), null, null, true, null, 'The <b>Seminars Earned at Next Bankruptcy</b> will be added to your current <b>Training Seminars</b> when you declare bankruptcy.');

    var crypticMailChance = new Stat('Cryptic Mail Chance', ko.computed(function() {
      var base = 2 + mysteryBoost.total.val() / 200;
      return base < 5 ? base : 5;
    }, this), null, '%');

    var locked = ko.computed(function() {
      return {
        mail: totalDPS.val() < 100,
        investments: totalCashSlowed.val() < 100000000, // 100 million
        research: totalCashSlowed.val() < 100000000000, // 100 billion
        acquisitions: totalCashSlowed.val() < 1000000000000000000, // 1 quintillion
        bankruptcy: totalCashSlowed.val() < 1000000000000, // 1 trillion
        outgoingMail: totalCashSlowed.val() < 1000000000000000000000, // 1 sextillion
        elections: totalCashSlowed.val() < 1000000000000000000000000000, // 1 octillion
        emailAway: emailAway.val() > 0,
        policyAway: policyAway.val() > 0,
        chatAway: chatAway.val() > 0,
        windfallGuarantee: !enableWindfallGuarantee() || windfallGuarantee.val() <= 0,
        electionNotifications: electionNotifications.val() > 0,
        careerDev: trainingSeminars.val() === 0 && seminarsUsed.val() === 0
      }
    }, this);
    
    // Empty objects to be populated when opening modals
    var selectedUnit = ko.observable();
    var selectedUpgrade = ko.observable();
    var selectedAcquisitionWorker = ko.observable();
	
    /**
     * Price for unit upgrades = (Math.pow(1.15, 99) * UNIT_BASE_PRICE) * 25
     * Upgrades include the following types:
     * Unit upgrades - add a modifier to unit CPS
     * Manual click upgrades - add a modifier (multiplier or percentage) to each manual click
     * Count upgrades - add a modifier (multiplier or percentage) to the overall CPS interval
     * awardCount upgrades - unlock an additional percentage of the achievement modifier
     **/
	var upgrades = ko.observableArray([

        // INTERN
        new UnitUpgrade('u00', 'Name Tags', 0, 100, "We're like a family here."), // 1
        new UnitUpgrade('u01', 'Free Lunches', 0, 1000, "There ain't no such thing..."), // 10
        new UnitUpgrade('u02', 'Useless Degrees', 0, 10000, "Are you better off than you were four years ago?"), // 25
        new UnitUpgrade('u03', 'Midnight Oil', 0, 350000, "Money never sleeps, pal."), // 50
        new UnitUpgrade('u04', 'Locked Doors', 0, 14000000, "Accident-free since March 25, 1911!"),// 75
        new UnitUpgrade('u05', 'Anti-Union Literature', 0, 400000000, "Bolshevist! Socialist! Communist! Union man!"), // 100
        new UnitUpgrade('u06', 'Company Scrip', 0, 15000000000, "I owe my soul to the company store."), // 125
        new UnitUpgrade('u07', 'Out-of-Town Scabs', 0, 415000000000, "And to you, solidarity's a four-letter word."), // 150
        new UnitUpgrade('u08', 'Pinkerton Reinforcements', 0, 16000000000000, "They never sleep."), // 175
        new UnitUpgrade('u09', '168-Hour Work Weeks', 0, 450000000000000, "Think of the economic possibilities for our grandchildren."), // 200
        new UnitUpgrade('u09.1', 'Burnt Tent Camps', 0, 490000000000000000, "We are getting along friendly enough here in this mine."), // 250
        new UnitUpgrade('u09.2', 'Execution of Agitators', 0, 5.8e+23, "Don\'t organize, mourn!"), // 350
        new UnitUpgrade('u010', 'The Death Special', 0, 620000000000000000000000000, "Courtesy of the Colorado Fuel & Iron Company."), // 400
        new UnitUpgrade('u011', 'Improvised Bombs', 0, 6.7e+29, "Thank you to the Logan County Coal Operators Association."), // 450
        new UnitUpgrade('u012', 'Strong Constitutions', 0, 7.3e+32, "In the end, bayonets always win."), // 500

        // WAGE SLAVE
        new UnitUpgrade('u10', 'Family Photos', 1, 1000, "Do it for her."), // 1
        new UnitUpgrade('u11', 'Casual Fridays', 1, 10000, "Beware of all enterprises that require new clothes."), // 10
        new UnitUpgrade('u12', 'Shortened Vacations', 1, 75000, "I got no time for livin', yes, I'm workin' all the time."), // 25
        new UnitUpgrade('u13', 'Smaller Cubicles', 1, 2500000, "Any four walls are a prison to me."), // 50
        new UnitUpgrade('u14', 'Non-Competes', 1, 90000000, "Only covers 6 of 7 continents for the next 100 years."), // 75
        new UnitUpgrade('u15', 'Systematic Downsizing', 1, 2500000000, "Spend a lifetime working for these people..."), // 100
        new UnitUpgrade('u16', 'Comprehensive Outsourcing', 1, 100000000000, "Don\'t worry, the Invisible Hand creates a \'home bias.\'"), // 125
        new UnitUpgrade('u17', 'Massive Layoffs', 1, 2750000000000, "I hope your firings go really, really well."), // 150
        new UnitUpgrade('u18', 'Frozen Pensions', 1, 105000000000000, "These phantom stocks are truly ethereal."), // 175
        new UnitUpgrade('u19', 'Suicide Nets', 1, 3000000000000000, "Don't forget the Standard Perpetuity Clause."), // 200
        new UnitUpgrade('u19.1', 'Stress Management', 1, 3200000000000000000, "Management calls this technique 'Karōshi.'"), // 250
        new UnitUpgrade('u19.2', 'Mental Breakdowns', 1, 3.8e+24, "I got some bad ideas in my head."), // 350
        new UnitUpgrade('u120', 'The People\'s Stick', 1, 4.1e+27, "A firm reminder to remain gainfully employed."), // 400
        new UnitUpgrade('u121', 'Diminished Opportunities', 1, 4.5e+30, "...the things are behind the bars, and the man is outside."), // 450
        new UnitUpgrade('u122', 'Defeated Resignation', 1, 4.9e+33, "See you, either in Hell, or at work."), // 500

        // SALES HOTSHOT
        new UnitUpgrade('u20', 'Extra Phones', 2, 30000, "The phone, the phone, where's the fucking phone?"),
        new UnitUpgrade('u21', 'Discount Leads', 2, 100000, "The leads aren't weak. You're weak."),
        new UnitUpgrade('u22', 'Reduced Bonuses', 2, 900000, "Doesn't Gil get a lick?"),
        new UnitUpgrade('u23', 'Overnight Conferences', 2, 28000000, "The key to this business is personal relationships."),
        new UnitUpgrade('u24', 'Divorce Papers', 2, 30000000000, "Not great, Bob."),
        new UnitUpgrade('u25', 'Liver Failure', 2, 33000000000000, "I got that grave plot - it's right off the highway."),
        new UnitUpgrade('u26', 'Sincere Condolences', 2, 35000000000000000, "We're free and clear. We're Free."),
        new UnitUpgrade('u27', 'Life Insurance Payouts', 2, 39000000000000000000, "Hoping for a high CLV."),
        new UnitUpgrade('u28', 'The Coldest Calls', 2, 4.6e+25, "When all the leads have gone dark."),

        // MIDDLE MANAGER
        new UnitUpgrade('u30', "Team-Building Exercises", 3, 360000, "Teamwork. It keeps our employees gruntled."),
        new UnitUpgrade('u31', "Motivational Speeches", 3, 1250000, "In my book, we're gonna be winners! OK?"),
        new UnitUpgrade('u32', "Detailed Spreadsheets", 3, 10500000, "To track the Weekly Estimated Net Usage System"),
        new UnitUpgrade('u33', "Unachievable Metrics", 3, 340000000, "The stats won't juke themselves."),
        new UnitUpgrade('u34', "Tense & Silent Meetings", 3, 365000000000, "I want people to be afraid of how much they love me."),
        new UnitUpgrade('u35', "Screaming Sessions", 3, 400000000000000, "You call yourselves junior executives?"),
        new UnitUpgrade('u36', "Public Shaming", 3, 430000000000000000, "It's just the work of a few bad apples."),
        new UnitUpgrade('u37', "Upward Ambition", 3, 470000000000000000000, "Somewhere there was something better for him..."),
        new UnitUpgrade('u38', "Sharpened Saws", 3, 5.5e+26, "Efficiency in climbing the ladder of success."),
        
        // C-LEVEL
        new UnitUpgrade('u40', "More Vision", 4, 4250000, "Last time, last year - not so good. But now, this is the truth."),
        new UnitUpgrade('u41', "Business Cards", 4, 15000000, "Look at that subtle off-white coloring..."),
        new UnitUpgrade('u42', "Fresh Suits", 4, 125000000, "Nothing suits you like a suit."),
        new UnitUpgrade('u43', "Creative Accounting", 4, 4000000000, "Eight is great!"),
        new UnitUpgrade('u44', "Overcooked Books", 4, 4500000000000, "Straight from the WorldCom School of Record-Keeping."),
        new UnitUpgrade('u45', "Catastrophic Bailouts", 4, 4750000000000000, "It's a TARP!"),
        new UnitUpgrade('u46', "Golden Parachutes", 4, 5200000000000000000, "The captain never goes down with the ship."),
        new UnitUpgrade('u47', "Reductions in Force", 4, 5.6e+21, "Things have gone south. It won't end well."),
        new UnitUpgrade('u48', "Corporate Dissolution", 4, 6.6e+27, "An executive rises like a phoenix from the ashes."),
        
        // BLUE BLOOD
        new UnitUpgrade('u50', "Inheritance", 5, 52000000, "What do you mean, 'you didn't build that?'"),
        new UnitUpgrade('u51', "Gratuitous Nepotism", 5, 182000000, "What makes you think they'll promote the wrong man?"),
        new UnitUpgrade('u52', "Diverse Investments", 5, 1500000000, "Pork belly prices have been dropping all morning..."),
        new UnitUpgrade('u53', "Vast Real Estate Acquisitions", 5, 50000000000, "It's all in the art of the deal."),
        new UnitUpgrade('u54', "Absentee Landlordism", 5, 5300000000000, "ATTENTION ANTI-RENTERS! AWAKE! AROUSE!"),
        new UnitUpgrade('u55', "Aggressive Debt Collection", 5, 57000000000000000, "Standing strong against the murderous, thieving hordes of peasants."),
        new UnitUpgrade('u56', "Vicious Litigation", 5, 62000000000000000000, "My judgement was that Mr. Hogan deserved to have his day in court."),
        new UnitUpgrade('u57', "Massive Trust Funds", 5, 6.7e+22, "You can rely on the old man's money."),
        new UnitUpgrade('u58', "Pure Bloodlines", 5, 7.9e+28, "This is our CEO, Charles the Bewitched."),
        
        // PRIVATIZED COP
        new UnitUpgrade('u60', "Community Policing", 6, 625000000, "Can we all get along?"),
        new UnitUpgrade('u61', "Army Surplus Gear", 6, 2200000000, "I'd buy that for a dollar."),
        new UnitUpgrade('u62', "Targeted Surveillance", 6, 18000000000, "Don't worry, they're COINTELPROs."),
        new UnitUpgrade('u63', "Looser Cannons", 6, 585000000000, "Do I feel lucky?"),
        new UnitUpgrade('u64', "Extra-Judicial Killings", 6, 635000000000000, "...it looks like a demon, that’s how angry he looked."),
        new UnitUpgrade('u65', "All-White Juries", 6, 690000000000000000, "The smell of marijuana made him fear for his life."),
        new UnitUpgrade('u66', "Universal Acquittal", 6, 745000000000000000000, "The guilty don't feel guilty, they learn not to."),
        new UnitUpgrade('u67', "Rougher Rides", 6, 8.1e+23, "They had him folded up like he was a crab..."),
        new UnitUpgrade('u68', "Reliable Witnesses", 6, 9.5e+29, "They found a flaw in me and then they made up a nexus."),
        
        // POCKET POLITICIAN
        new UnitUpgrade('u70', "Attack Ads", 7, 75000000000, "Sponsored by the Swift Boat Veterans for Truth."),
        new UnitUpgrade('u71', "Extra Charisma", 7, 26500000000, "Just chillin' in Cedar Rapids."),
        new UnitUpgrade('u72', "Campaign Contributions", 7, 215000000000, "If the citizens are united, then we'll never be divided."),
        new UnitUpgrade('u73', "Voter Suppression", 7, 7000000000000, "3 million illegal voters can't be wrong."),
        new UnitUpgrade('u74', "Trickle-Down Economics", 7, 7500000000000000, "All boats will be lifted by rapidly rising sea levels."),
        new UnitUpgrade('u75', "Mass Incarceration", 7, 8250000000000000000, "They're trying to build a prison for you and me to live in."),
        new UnitUpgrade('u76', "Complete Deregulation", 7, 9e+21, "A much more urgent problem is to protect the consumer from the government."),
        new UnitUpgrade('u77', "Flag Lapel Pins", 7, 9.7e+24, "Don't fly those stripes, those stars-and-stripes for me."),
        new UnitUpgrade('u78', "Teflon-Coated Candidates", 7, 1.15e+31, "He sees to it that nothing sticks to him."),
        
        // MERCENARY GROUP
        new UnitUpgrade('u80', "Postcards Home", 8, 90000000000, "Greetings from Nisour Square!"),
        new UnitUpgrade('u81', "Western Values", 8, 300000000000, "These people are brutal. They - they're the exact opposite of Americans."),
        new UnitUpgrade('u82', "Propaganda Machines", 8, 2500000000000, "They took the babies out of the incubators, took the incubators and left..."),
        new UnitUpgrade('u83', "Enhanced Interrogations", 8, 85000000000000, "The Geneva Convention is only for Lawful Enemy Combatants."),
        new UnitUpgrade('u84', "Collateral Damage", 8, 90000000000000000, "Life is plentiful. Life is cheap in the Orient."),
        new UnitUpgrade('u85', "Whiter Phosphorous", 8, 100000000000000000000, "Don't worry, it's only for signaling and smoke screening."),
        new UnitUpgrade('u86', "Scorched Earth Policies", 8, 1.07e+23, "Nuke the site from orbit. It's the only way to be sure."),
        new UnitUpgrade('u87', "Indiscriminate Firebombing", 8, 1.2e+26, "There are no civilians in Japan."),
        new UnitUpgrade('u88', "Home Front Support", 8, 1.4e+32, "These mandatory pre-game group rites of submission..."),
        
        // CLIENT STATE 
        new UnitUpgrade('u90', "Sweat Shops", 9, 1100000000000, "The unavoidable cost of Mrs. Gifford's Global Fashion."),
        new UnitUpgrade('u91', "Resource Extraction", 9, 3500000000000, "Diamond monopolies are a girl's best friend."),
        new UnitUpgrade('u92', "Armed Rebel Groups", 9, 30000000000000, "With a name like Operation Cyclone, what could go wrong?"),
        new UnitUpgrade('u93', "CIA-Sponsored Coups", 9, 1000000000000000, "[redacted]"),
        new UnitUpgrade('u94', "Political Executions", 9, 1100000000000000000, "A resounding PBSUCCESS!"),
        new UnitUpgrade('u95', "Roving Death Squads", 9, 1.2e+21, "Top of their class at the School of the Americas."),
        new UnitUpgrade('u96', "Very Free Markets", 9, 1.3e+24, "Making the world safe for austerity."),
        new UnitUpgrade('u97', "The Dirtiest Wars", 9, 1.4e+27, "Better dead than red."),
        new UnitUpgrade('u98', "Operation Condor", 9, 1.65e+33, "It is barely conceivable that there are people who like war."),
        
        // SHADOW GOVERNMENT
        new UnitUpgrade('u100', "Chem Trails", 10, 12900000000000, "Aluminum... ash... like you can smell the psychosphere."),
        new UnitUpgrade('u101', "Paid Protestors", 10, 45000000000000, "He’s playing a character. He is a performance artist."),
        new UnitUpgrade('u102', "Open Borders", 10, 369250000000000, "Legal or illegal, watch her fucking go - she'll take what's hers."),
        new UnitUpgrade('u103', "False-Flag Operations", 10, 12160000000000000, "Jet fuel can't melt steel beams."),
        new UnitUpgrade('u104', "MKUltra Sleeper Agents", 10, 13170000000000000000, "Slap my salami, the guy's a Commie."),
        new UnitUpgrade('u105', "Mass Gun Confiscation", 10, 1.4e+22, "From my cold, dead hands."),
        new UnitUpgrade('u106', "FEMA Internment Camps", 10, 1.5e+25, "Brownie, you're doing a heck of a job."),
        new UnitUpgrade('u107', "Increased Soros Funding", 10, 1.7e+28, "Laundered through the Antifa war chest."),
        new UnitUpgrade('u108', "Weather Control Sites", 10, 2e+34, "Angels Don't Play This HAARP."),
        
        // PUPPETMASTER 
        new UnitUpgrade('u110', "Secret Handshakes", 11, 150000000000000, "Weaving spiders come not here."),
        new UnitUpgrade('u111', "Occult Gatherings", 11, 550000000000000, "Don't you want to go where the rainbow ends?"),
        new UnitUpgrade('u112', "Otherwordly Rituals", 11, 4500000000000000, "Wouldst thou like to live deliciously?"),
        new UnitUpgrade('u113', "The Mark of the Beast", 11, 150000000000000000, "The mark will be on all of them."),
        new UnitUpgrade('u114', "One World Unity Army", 11, 160000000000000000000, "Blood for the blood god! Skulls for the Skull Throne!"),
        new UnitUpgrade('u115', "Supranational Currency", 11, 1.7e+23, "The Euro so cometh as a thief in the night."),
        new UnitUpgrade('u116', "Jahbulon's Dominion", 11, 1.9e+26, "I have tasted the flesh of fallen angels!"),
        new UnitUpgrade('u117', "Chariots of the Gods", 11, 2e+29, "Tekeli-li! Tekeli-li!"),
        new UnitUpgrade('u118', "The Ten-Horned Beast", 11, 2.3e+35, "The little horn of capital rises from the sea."),

        // ID, Name, unlocking unit, price, flavor - (Math.pow(1.15, NUM) * BASE_PRICE) * 50
        new SpecialUnitUpgrade('su00', false, 'Daily Lunch Pick-Up', 2, 215000000, 'I don\'t like pulp. No pulp. Pulp isn\'t juice. All juice, OK?'),
        new SpecialUnitUpgrade('su01', false, 'Timesheet Authoritarianism', 3, 2600000000, 'You can bend the rules plenty once you get to the top.'),
        new SpecialUnitUpgrade('su02', false, 'Thinly-Veiled Harassment', 4, 31000000000, '...and then I would take the other hand with the falafel thing...'),
        new SpecialUnitUpgrade('su03', false, 'Indentured Servitude', 5, 370000000000, 'Politico does not endorse this plan for immigration.'),
        new SpecialUnitUpgrade('su04', false, 'Universal Cash Bail', 6, 4500000000000, 'You have to pay this one before you\'re even arrested.'),
        new SpecialUnitUpgrade('su05', false, 'Ultra-Regressive Taxation', 7, 550000000000000, 'The Fairest tax of all.'),
        new SpecialUnitUpgrade('su06', false, 'Militarized Checkpoints', 8, 639000000000000, 'Who ever said freedom of movement was a human right?'),
        new SpecialUnitUpgrade('su07', false, 'Low-Priced Plastic Goods', 9, 7700000000000000, 'Freedom isn\'t free.'),
        new SpecialUnitUpgrade('su08', false, 'Fluoridated Water', 10, 92000000000000000, 'It will sap and impurify all of our precious bodily fluids.'),
        new SpecialUnitUpgrade('su09', false, 'Virulent Feminism', 11, 1100000000000000000, 'We are not going to have our men become subservient.'),
        
        new SpecialUnitUpgrade('su10', true, 'Administrative Dirty-Work', 2, 232000000000, 'In about 10 seconds, I gotta start cleaning up somebody\'s shit, man.'), // sales
        new SpecialUnitUpgrade('su11', true, 'Bathroom Panopticon', 3, 2800000000000, 'Boss makes a dollar, I make a dime.'), // manager
        new SpecialUnitUpgrade('su12', true, 'Casual Wage Discrimination', 4, 33000000000000, 'Agreeable people get paid less than disagreeable people for the same job'), // c-level
        new SpecialUnitUpgrade('su13', true, 'Anti-Homeless Measures', 5, 400000000000000, 'A pit full of punji sticks outside every department store.'), // blue blood
        new SpecialUnitUpgrade('su14', true, 'Extra-Broken Windows', 6, 4800000000000000, 'Some litter accumulates. Soon, more litter accumulates.'), // police
        new SpecialUnitUpgrade('su15', true, 'Free-Falling Minimum Wages', 7, 570000000000000000, 'The minimum wage doesn\'t support a family. We all know that.'), // politician
        new SpecialUnitUpgrade('su16', true, 'Armed Militia Conscription', 8, 693000000000000000, 'Vigilant citizens keeping watch for blue helmets on the shore.'), // merc
        new SpecialUnitUpgrade('su17', true, 'Student Protest Crackdowns', 9, 8310000000000000000, 'The Tiananmen Square protestor should not have blocked traffic.'), // state
        new SpecialUnitUpgrade('su18', true, 'Forced Thimerosal Vaccines', 10, 100000000000000000000, 'It\'s 90% mercury and manifests autism within seconds.'), // shadow
        new SpecialUnitUpgrade('su19', true, 'Cultural Marxism', 11, 1200000000000000000000, 'As Orwell said: Beware the cuck PC leftist thought police.'), // puppet
        
        // Symbiotic Upgrade (id, name, units, price, flavor) - price is (Math.pow(1.15, NUM) * BASE_PRICE) * 100
        new SymbioticUpgrade('nsymb0', 'Inspiring Listicles', [{ id: 2, mod: 4}, { id: 3, mod: 4}], 48000000000000000, '10 Things Rich People Do Every Day.'),
        new SymbioticUpgrade('nsymb00', 'Tomes of Wisdom', [{ id: 2, mod: 4}, { id: 3, mod: 4}], 52000000000000000, 'Finally I can win friends and influence people.'),
        new SymbioticUpgrade('nsymb9', 'Boundless Advertising', [{ id: 2, mod: 4}, { id: 3, mod: 4}], 57000000000000000000, 'THIS IS YOUR GOD.'),
        new SymbioticUpgrade('nsymb9.1', 'Viral Marketing', [{ id: 2, mod: 2}, { id: 3, mod: 2}], 6.2e+22, 'Positively False - Exposing the Myths Around Marketing.'),
        new SymbioticUpgrade('nsymb15', 'Kaizen Blitzkrieg', [{ id: 2, mod: 2}, { id: 3, mod: 2}], 6.7e+25, 'Improving processes through a battle of annihilation.'),
        new SymbioticUpgrade('nsymb15.1', 'Cosmic Funnels', [{ id: 2, mod: 2}, { id: 3, mod: 2}], 7.2e+28, 'Converts all matter into leads.'),

        new SymbioticUpgrade('nsymb1', 'Closed-Door Meetings', [{ id: 4, mod: 3.5}, { id: 5, mod: 3.5}], 7000000000000000, 'To determine exactly which hill shit will roll down.'),
        new SymbioticUpgrade('nsymb2', 'Additional Buses', [{ id: 4, mod: 3.5}, { id: 5, mod: 3.5}], 7600000000000000000, 'Under which many will be thrown.'),
        new SymbioticUpgrade('nsymb10', 'Divine Mandates', [{ id: 4, mod: 3.5}, { id: 5, mod: 3.5}], 8.2e+21, 'L\'état, c\'est nous.'),
        new SymbioticUpgrade('nsymb10.1', 'Noblesse Oblige', [{ id: 4, mod: 1.5}, { id: 5, mod: 1.5}], 8.9e+24, '25 cents in the Red Kettle at Christmas.'),
        new SymbioticUpgrade('nsymb16', 'Silver Spoons', [{ id: 4, mod: 1.5}, { id: 5, mod: 1.5}], 9.6e+27, 'The dignity of work is my measure of success.'),
        new SymbioticUpgrade('nsymb16.1', 'Corporate Blóts', [{ id: 4, mod: 1.5}, { id: 5, mod: 1.5}], 1.04e+31, 'Sacred leaders require great sacrifices.'),
        
        new SymbioticUpgrade('nsymb3', 'Hostile Architecture', [{ id: 6, mod: 3}, { id: 7, mod: 3}], 1200000000000000000, 'I feel safe behind the electric fences around Fiddler\'s Green.'),
        new SymbioticUpgrade('nsymb4', 'Militarized Riot Control', [{ id: 6, mod: 3}, { id: 7, mod: 3}], 1.25e+21, 'The absolute best in less-than-lethal collective punishment.'),
        new SymbioticUpgrade('nsymb11', 'Late-Night Raids', [{ id: 6, mod: 3}, { id: 7, mod: 3}], 1.2e+24, 'No Quarter for Wild Beasts'),
        new SymbioticUpgrade('nsymb11.1', 'Sermons on Mounds', [{ id: 6, mod: 1}, { id: 7, mod: 1}], 1.3e+27, 'If a man will not work, he shall not eat.'),
        new SymbioticUpgrade('nsymb17', 'Prison-Industrialism', [{ id: 6, mod: 1}, { id: 7, mod: 1}], 1.4e+30, 'Every cop is a job creator!'), 
        new SymbioticUpgrade('nsymb17.1', 'Ballots or Bullets', [{ id: 6, mod: 1}, { id: 7, mod: 1}], 1.5e+33, 'To land Plymouth Rock on everybody.'), 
        
        new SymbioticUpgrade('nsymb5', 'Deeper Mass Graves', [{ id: 8, mod: 2}, { id: 9, mod: 2}], 165000000000000000000, 'They\'re not dead, they\'re just los desaparecidos.'),
        new SymbioticUpgrade('nsymb6', 'Full Sea Drainage', [{ id: 8, mod: 2}, { id: 9, mod: 2}], 1.8e+23, 'The guerrilla must move amongst the people as a fish swims in the sea.'),
        new SymbioticUpgrade('nsymb12', 'Right-Wing Guerillas', [{ id: 8, mod: 2}, { id: 9, mod: 2}], 1.7e+26, 'They are the moral equal of our Founding Fathers.'),
        new SymbioticUpgrade('nsymb12.1', 'Territorial Expansion', [{ id: 8, mod: 1}, { id: 9, mod: 1}], 1.84e+29, 'We have gone there to conquer, not to redeem.'),
        new SymbioticUpgrade('nsymb18', 'Generalized AUMF', [{ id: 8, mod: 1}, { id: 9, mod: 1}], 2e+32, 'Swing low satellite, hot white chariot.'),
        new SymbioticUpgrade('nsymb18.1', 'Coalitions of the Willing', [{ id: 8, mod: 1}, { id: 9, mod: 1}], 2.16e+35, 'Well, actually, he forgot Poland.'),
        
        new SymbioticUpgrade('nsymb7', 'Black Helicopters', [{ id: 10, mod: 1.5}, { id: 11, mod: 1.5}], 2.4e+22, 'I keep M69 cluster bombs and depleted uranium shells for home defense.'),
        new SymbioticUpgrade('nsymb8', 'Esoteric Monoliths', [{ id: 10, mod: 1.5}, { id: 11, mod: 1.5}], 2.6e+25, 'Engraved with instructions on post-apocalyptic small business management.'),
        new SymbioticUpgrade('nsymb13', 'Casus Belli', [{ id: 10, mod: 1.5}, { id: 11, mod: 1.5}], 2.5e+28, 'We must eliminate that threat now, before it is too late.'),
        new SymbioticUpgrade('nsymb13.1', 'Majestic 12 Meetings', [{ id: 10, mod: 0.5}, { id: 11, mod: 0.5}], 2.7e+31, 'The truth is out there.'),
        new SymbioticUpgrade('nsymb19', 'Project ARTICHOKE', [{ id: 10, mod: 0.5}, { id: 11, mod: 0.5}], 2.85e+34, 'At least you\'ll never be a vegetable.'),
        new SymbioticUpgrade('nsymb19.1', 'Greater Tribulations', [{ id: 10, mod: 0.5}, { id: 11, mod: 0.5}], 3.1e+37, 'Little children, it is the last hour.'),
        
        new SymbioticUpgrade('nsymb14', 'Worker Solidarity', [{ id: 0, mod: 3}, { id: 1, mod: 3}], 2e+34, 'Without our brain and muscle, not a single wheel can turn.'),

        // Lawyer Upgrades
        new OneUnitCountUpgrade('one1', 'Public Defenders', 0, 1, 600000000000000000000, 'The proceedings gradually merge into the judgement.'),
        new OneUnitCountUpgrade('one2', 'Cheap Hack Lawyers', 1, 1, 4000000000000000000000, 'I\'ve argued in front of every judge in the state. Often as a lawyer.'),
        new OneUnitCountUpgrade('one3', 'Ambulance Chasers', 2, 1, 49000000000000000000000, 'Don\'t drink and drive. But if you do, call me.'),
        new OneUnitCountUpgrade('one4', 'Greedy Attorneys', 3, 1, 583000000000000000000000, 'I know you both must have been secretly thanking me for that one.'),
        new OneUnitCountUpgrade('one5', 'Attorneys on Retainer', 4, 1, 7000000000000000000000000, 'I got the briefcase. You got the shotgun.'),
        new OneUnitCountUpgrade('one6', 'The Elite Legal Team', 5, 1, 84000000000000000000000000, 'Absolutely, 100 percent not guilty.'),
        new OneUnitCountUpgrade('one7', 'Police Union Attorneys', 6, 1, 1e+27, 'He may be a cannibal, but we can handle that in arbitration.'),
        new OneUnitCountUpgrade('one8', 'Presidential Lawyers', 7, 1, 1.2e+28, 'You might as well call me. You will see me. I promise. Bro.'),
        new OneUnitCountUpgrade('one9', 'Military Defense Attorneys ', 8, 1, 1.5e+29, 'Ensuring that justice is served for the Haditha massacre.'),
        new OneUnitCountUpgrade('one10', 'Extrajudicial Prosecutors', 9, 1, 1.75e+30, 'Most clients work for the Temara interrogation center.'),
        new OneUnitCountUpgrade('one11', 'Bureaucratic Law Clerks', 10, 1, 2e+31, 'Before the law sits a gatekeeper.'),
        new OneUnitCountUpgrade('one12', 'Infernal Lawyers', 11, 1, 25e+31, 'No, I only set the stage. You pull your own strings.'),

        // Earned From Click upgrades - %, X, price
        new MClickUpgrade('m0', 'Bootstraps', 1, 1, 100, "Pull yourself up by them."),
        new MClickUpgrade('m1', 'Self-Motivation', 1, 0, 1000, "You are an island."),
        new MClickUpgrade('m2', 'Greasier Elbows', 1, 0, 500000, "Alongside blood, sweat, and tears."),
        new MClickUpgrade('m3', 'More Brow Sweat', 1, 0, 5000000, "Just like choppin' wood at Prairie Chapel Ranch."),
        new MClickUpgrade('m4', 'Rugged Individualism', 1, 0, 10000000000, "If it worked in the '30s, it has to work now."),
        new MClickUpgrade('m5', 'Sweatier Equity', 1, 0, 10000000000000, "Much more valuable than regular equity."),
        new MClickUpgrade('m6', 'Personal Responsibility', 1, 0, 10000000000000000, "It gives structure, meaning and dignity to most of our lives."),
        new MClickUpgrade('m7', 'Gritty Perseverance', 1, 0, 10000000000000000000, "Praise boss when morning workbells chime."),
        new MClickUpgrade('m8', 'Relentless Momentum', 1, 0, 10000000000000000000000, "It can't be bargained with. It can't be reasoned with."),
        new MClickUpgrade('m9', 'Dulled Pain Receptors', 1, 0, 10000000000000000000000000, "A true winner feels nothing."),
        new MClickUpgrade('m10', 'The Desire to Achieve', 1, 0, 10000000000000000000000000000, "Just stepping on the rungs of opportunity."),
        
        // Manual Click Upgrades - %, X, price
        new MClickUpgrade('mc0', 'Finger Exercises', 0, 0.4, 750000000, "It's as satisfying to me as coming is."),
        new MClickUpgrade('mc1', 'Finger-Enhancing Drugs', 0, 0.4, 750000000000, "You\'ll be the Lance Armstrong of clicking."),
        new MClickUpgrade('mc2', 'A Few Extra Fingers', 0, 0.4, 750000000000000, "Just grafted on there, why not?"),
        new MClickUpgrade('mc3', 'Mysterious Fingers', 0, 0.4, 750000000000000000, "They call \'em fingers, but I never see them fing."),
        new MClickUpgrade('mc4', 'Devil-Possessed Fingers', 0, 0.4, 750000000000000000000, "Dearly beloved, we are gathered here today because you're all dead..."),
        new MClickUpgrade('mc5', 'Evil Disembodied Fingers', 0, 0.4, 750000000000000000000000, "That's right, who's laughing now?"),
        new MClickUpgrade('mc6', 'The Holy Finger', 0, 0.4, 750000000000000000000000000, "I with the finger of God raise capital."),
        
        // Windfall Likelihood Upgrades
        new StatUpgrade('wfl1', 'Lucky Rabbit\'s Foot', 'casino', windfallChance, 0.25, 1000000000000, "Increase your chance of experiencing a <b>Windfall</b> on every <b>Manual Click</b>.", "Swiped from a pet food factory farm."),
        new StatUpgrade('wfl2', 'Cursed Monkey\'s Paw', 'casino', windfallChance, 0.25, 10000000000000000, "Increase your chance of experiencing a <b>Windfall</b> on every <b>Manual Click</b>.", "Just wish for more cash and nothing can go wrong."),
        new StatUpgrade('wfl3', 'Huge Chattery Teeth', 'casino', windfallChance, 0.25, 1000000000000000000000, "Increase your chance of experiencing a <b>Windfall</b> on every <b>Manual Click</b>.", "Always ready to help you out of a tight spot."),
        new StatUpgrade('wfl4', 'A Silver Spoon', 'casino', windfallChance, 0.25, 10000000000000000000000000, "Increase your chance of experiencing a <b>Windfall</b> on every <b>Manual Click</b>.", "My father gave me a small loan of a million dollars."),
        
        // Guaranteed Windfall Unlock
        new StatUpgrade('gwf', 'Generational Wealth', 'lock_open', windfallGuarantee, 1, 10000000000000000000000, 'Unlock <b>Guaranteed Windfalls</b> to remove luck as a factor (can be toggled in settings).', 'I make my own luck.'),
        new StatUpgrade('gwf1', 'Trust Fund Payouts', 'casino', windfallGrowthMultiplier, 0.5, 1000000000000000000000000000000, 'Increase the <b>Windfall Guarantee Rate</b> multiplier by <b>1</b>.', 'A better future for Matt, Tagg, Craig, Ben and Josh.'),
        new StatUpgrade('gwf2', 'Inherited Job Roles', 'casino', windfallGrowthMultiplier, 0.5, 10000000000000000000000000000000, 'Increase the <b>Windfall Guarantee Rate</b> multiplier by <b>1</b>.', 'After many interviews, I happen to have chosen my son-in-law.'),
        new StatUpgrade('gwf3', 'Parental Investments', 'casino', windfallGrowthMultiplier, 0.5, 1000000000000000000000000000000000, 'Increase the <b>Windfall Guarantee Rate</b> multiplier by <b>1</b>.', 'Special thanks to Jackie and Mike Bezos.'),
        new StatUpgrade('gwf4', 'Zambian Emerald Mines', 'casino', windfallGrowthMultiplier, 0.5, 10000000000000000000000000000000000, 'Increase the <b>Windfall Guarantee Rate</b> multiplier by <b>1</b>.', 'Therefore, the money is most likely a simulation, because it exists.'),

        // Windfall Duration Upgardes
        new StatUpgrade('wfd1', 'Sacks with Dollar Signs', 'monetization_on', windfallDuration, 2, 10000000000, "Boost the duration of every <b>Windfall</b> by <b>2 seconds</b>.", "Waiting to be filled with shiny gold coins."),
        new StatUpgrade('wfd2', 'Reinforced Bank Vaults', 'monetization_on', windfallDuration, 2, 1000000000000000, "Boost the duration of every <b>Windfall</b> by <b>2 seconds</b>.", "Vulnerable only to dragging by muscle cars."),
        new StatUpgrade('wfd3', 'Man-Made Lakes of Cash', 'monetization_on', windfallDuration, 2, 10000000000000000000, "Boost the duration of every <b>Windfall</b> by <b>2 seconds</b>.", "Incapable of holding the money God poured into them."),
        new StatUpgrade('wfd4', 'Dubious Investment Firms', 'monetization_on', windfallDuration, 2, 1000000000000000000000000, "Boost the duration of every <b>Windfall</b> by <b>2 seconds</b>.", "Follow the money."),
        new StatUpgrade('wfd5', 'International Shell Companies', 'monetization_on', windfallDuration, 2, 10000000000000000000000000000, "Boost the duration of every <b>Windfall</b> by <b>2 seconds</b>.", "If it moves, don't tax it."),
        
        new StatUpgrade('wfm1', 'Unearned Self-Confidence', 'monetization_on', windfallMultiplier, 5, 10000000000000, "Pump up your <b>Windfall Multiplier</b> by <b>5</b>.", "Some people aren't used to an environment where excellence is expected."),
        new StatUpgrade('wfm2', 'Baseless Optimism', 'monetization_on', windfallMultiplier, 5, 1000000000000000000, "Pump up your <b>Windfall Multiplier</b> by <b>5</b>.", "All is for the best in the best of all possible worlds."),
        new StatUpgrade('wfm3', 'Naive Resilience', 'monetization_on', windfallMultiplier, 5, 10000000000000000000000, "Pump up your <b>Windfall Multiplier</b> by <b>5</b>.", "If things are not failing, you are not innovating enough."),
        new StatUpgrade('wfm4', 'Protestant Work Ethic', 'monetization_on', windfallMultiplier, 5, 1000000000000000000000000000, "Pump up your <b>Windfall Multiplier</b> by <b>5</b>.", "I was born in a log cabin."),

        // Idle Bonus Rate Upgrades
        new StatUpgrade('idle1', 'Executive Assistants', 'weekend', idleBonusRate, 0.001, 10000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'For when you need Executive Outcomes.'),
        new StatUpgrade('idle2', 'Predatory Pricing', 'weekend', idleBonusRate, 0.001, 10000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'You\'re talking about the American way - survival of the fittest.'),
        new StatUpgrade('idle3', 'No-Bid Contracts', 'weekend', idleBonusRate, 0.001, 10000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'Everything is fine, please do not audit.'),
        new StatUpgrade('idle4', 'Targeted Tax Cuts', 'weekend', idleBonusRate, 0.001, 10000000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'Top 10 cities for your HQ2.'),
        new StatUpgrade('idle5', 'Massive Subsidies', 'weekend', idleBonusRate, 0.001, 10000000000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'Socialism for the rich, capitalism for the poor.'),
        new StatUpgrade('idle6', 'Privatized Tax Collection', 'weekend', idleBonusRate, 0.001, 10000000000000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'Products? Where we\'re going, we don\'t need products.'),
        new StatUpgrade('idle7', 'Semi-Deified Tribute', 'weekend', idleBonusRate, 0.001, 10000000000000000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'The peak of customer engagement.'),
        new StatUpgrade('idle8', 'Corporate Indulgences', 'weekend', idleBonusRate, 0.001, 10000000000000000000000000000, 'Slightly bump up the rate at which your <b>Idle Bonus Multiplier</b> increases.', 'To reduce the temporal punishment for brand disloyalty.'),

        // Away Earnings Upgrades
        new StatUpgrade('away1', 'In-House Accountants', 'snooze', awayEarningRate, 5, 10000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'For some reason, the IRS pays you.'),
        new StatUpgrade('away2', 'Wealthy Patrons', 'snooze', awayEarningRate, 5, 10000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'There\'s a check here from a William M. Tweed...'),
        new StatUpgrade('away3', 'Monopolized Industries', 'snooze', awayEarningRate, 5, 10000000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'God gave me my money.'),
        new StatUpgrade('away4', 'Corporate Espionage', 'snooze', awayEarningRate, 5, 10000000000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'It\'s called "The Landlord\'s Game," but if we change the name...'),
        new StatUpgrade('away5', 'Transparent Corruption', 'snooze', awayEarningRate, 5, 10000000000000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'How about a juicy oil contract at Teapot Dome?'),
        new StatUpgrade('away6', 'Colonial Hegemony', 'snooze', awayEarningRate, 5, 10000000000000000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'I don\'t see how maintaining a standing army is anti-competitive.'),
        new StatUpgrade('away7', 'Full Global Conquest', 'snooze', awayEarningRate, 5, 10000000000000000000000000, 'Increase your <b>Earning Rate While Away</b> by <b>5%</b>.', 'When the conquest of bread just isn\'t enough.'),

        // Count upgrades - %, X, price
        new CountUpgrade('cps1', 'Missing Coins', 10, 0, 500, 'From under the couch cushions in your home office.'),
        new CountUpgrade('cps2', 'Untaxed Coins', 10, 0, 50000, "Carefully obscured from the view of the IRS."),
        new CountUpgrade('cps3', 'Slurry-Stained Coins', 10, 0, 500000, "Direct from the Bank of Buffalo Creek."),
        new CountUpgrade('cps4', 'Soot-Covered Coins', 10, 0, 5000000, "Plucked from the ashes of the barges at Homestead."),
        new CountUpgrade('cps5', 'Sticky Coins', 10, 0, 500000000, "Paid to Colombian paramilitaries at Coke's bottling plants."), // 500 million
        new CountUpgrade('cps6', 'Petrol-Soaked Coins', 15, 0, 5000000000, "Pulled from the pockets of the Ogoni Nine."), // 5 billion
        new CountUpgrade('cps7', 'White Coins', 15, 0, 50000000000, "Lost by Klansmen at the Greensboro Massacre."), // 50 billion
        new CountUpgrade('cps8', 'Copper Coins', 15, 0, 500000000000, "Rio Tinto's payment to the PNGDF in Bougainville."), // 500 billion
        new CountUpgrade('cps9', 'Coal-Dusted Coins', 20, 0, 5000000000000, "Dropped by the Felts brothers in the streets of Matewan."), // 5 trillion
        new CountUpgrade('cps10', 'Cracked Coins', 20, 0, 50000000000000, "Damaged by the gunfire at Haymarket Square."), // 50 trillion
        new CountUpgrade('cps11', 'Dirt-Covered Coins', 20, 0, 500000000000000, "Buried under bodies in the ditches at My Lai."), // 500 trillion
        new CountUpgrade('cps12', 'Chemical-Burned Coins', 25, 0, 5000000000000000, "Courtesy of Dow Chemical - sorry about Bhopal!"), // 5 quad
        new CountUpgrade('cps13', 'Donated Coins', 25, 0, 50000000000000000, "Funneled to Congress through Lockheed Martin's PAC."), // 50 quad
        new CountUpgrade('cps15', 'Radioactive Coins', 25, 0, 500000000000000000, "Pressed from Raytheon's spent depleted uranium shells."), // 500 quad
        new CountUpgrade('cps16', 'Bottle-Cap Coins', 50, 0, 5000000000000000000, "Coca Cola's reward for lack of competition in apartheid South Africa."), // 5 quint quad
        new CountUpgrade('cps17', 'Anthracite Coins', 50, 0, 50000000000000000000, "Found on the gallows at the feet of the Molly Maguires"), // 50 quint
        new CountUpgrade('cps18', 'Rail Spike Coins', 50, 0, 500000000000000000000, "Funded the Pittsburgh militiamen's murder of striking rail workers."), // 500 quint
        new CountUpgrade('cps19', 'Sugary Coins', 100, 0, 5000000000000000000000, "Paid to the white supremacist militias during the Thibodaux massacre."), // 5 sext
        new CountUpgrade('cps20', 'Blood-Speckled Coins', 100, 0, 50000000000000000000000, "Fees paid for the assassination of Frank Little."), // 50 sext
        new CountUpgrade('cps21', 'Fabric Coins', 100, 0, 500000000000000000000000, "Dug from the rubble of Rana Plaza in Bangladesh."), // 500 sext
        new CountUpgrade('cps22', 'Salted Coins', 250, 0, 5000000000000000000000000, "Paid to child laborers at the Agriprocessors meatpacking plant in Iowa."), // 5 sept
        new CountUpgrade('cps23', 'Undocumented Coins', 250, 0, 50000000000000000000000000, "Cleaned from the cells of ICE's dead detainees."), // 50 sept

        new CountUpgrade('c0', 'Loaned Coins', 10, 0, 1000, "An early investment from Mom and Dad."),
        new CountUpgrade('c1', 'Borrowed Coins', 10, 0, 10000, "Yanked straight from your kid's college fund."),
        new CountUpgrade('c2', 'Repurposed Coins', 10, 0, 50000, "Recovered after the cancellation of holiday bonuses."),
        new CountUpgrade('c3', 'Water-Logged Coins', 10, 0, 100000, "Minted in Johnstown, 1889."), // 1 million
        new CountUpgrade('c4', 'Bullet-Riddled Coins', 10, 0, 1000000, "Dug from the remains of the tent camps at Ludlow."), // 10 million
        new CountUpgrade('c5', 'Oily Coins', 10, 0, 10000000, "Valid at ExxonMobil locations in Aceh, Indonesia"),
        new CountUpgrade('c6', 'Gold Coins', 15, 0, 100000000, "Payment for Barrick's private security at Porgera."), // 1 billion
        new CountUpgrade('c7', 'Chalky Coins', 15, 0, 1000000000, "Once held by lawyers for Turing Pharmaceuticals."), // 10 billion
        new CountUpgrade('c8', 'Dirty Coins', 15, 0, 10000000000, "Scraped from the treads of an IDF Caterpillar D9."),
        new CountUpgrade('c9', 'Banana Coins', 20, 0, 100000000000, "United Fruit's payment for Colombian machine guns."), // 1 trillion
        new CountUpgrade('c10', 'Chocolate Coins', 20, 0, 1000000000000, "The daily wage of Nestle's Ivory Coast child laborers."), // 10 trillion
        new CountUpgrade('c11', 'Poisonous Coins', 20, 0, 10000000000000, "Recovered from DynCorp's toxic Ecuadorian fields."),
        new CountUpgrade('c12', 'Gaseous Coins', 25, 0, 100000000000000, "Hidden by forced laborers at Chevron's Yadana gas field."), // 1 quad
        new CountUpgrade('c13', 'Silver Coins', 25, 0, 1000000000000000, "Pried from protestors' hands outside the Escobal mine."), // 10 quad
        new CountUpgrade('c14', 'Fruit-Flavored Coins', 25, 0, 10000000000000000, "Used to finance Chiquita's Colombian paramilitaries."),
        new CountUpgrade('c15', 'Blackened Coins', 50, 0, 100000000000000000, "Dropped by the murdered strikers at the Lattimer mine."), // 1 quint
        new CountUpgrade('c16', 'Imported Coins', 50, 0, 1000000000000000000, "Trafficked into Iraq along with KBR's forced workers."), // 10 quint
        new CountUpgrade('c17', 'Mud-Caked Coins', 50, 0, 10000000000000000000, "Lost by Baldwin-Felts men on the way to Paint Creek."),
        new CountUpgrade('c18', 'Burnt Coins', 100, 0, 100000000000000000000, "Salvaged from the ashes of the MOVE building."), // 1 sext
        new CountUpgrade('c19', 'Secret Coins', 100, 0, 1000000000000000000000, "Paid to South African mercenaries for the Wonga coup."), // 10 sext
        new CountUpgrade('c20', 'Powder-Blackened Coins', 100, 0, 10000000000000000000000, "Paid to a Utah firing squad for Joe Hill's execution."),
        new CountUpgrade('c21', 'Blood-Stained Coins', 250, 0, 100000000000000000000000, "Stolen by the Chicago PD from Fred Hampton's apartment."), // 1 sept
        new CountUpgrade('c22', 'Crude Coins', 250, 0, 1000000000000000000000000, "Paid to the Nigerian military to eliminate anti-Chevron protestors."),
        new CountUpgrade('c23', 'Dusty Coins', 250, 0, 10000000000000000000000000, "Left behind by Titan Corp contractors at Abu Ghraib."), 
        new CountUpgrade('c24', 'Bomb-Scorched Coins', 500, 0, 100000000000000000000000000, "Collected from the tunnels at No Gun Ri."), // 1 oct
        new CountUpgrade('c25', 'Textile Coins', 500, 0, 1000000000000000000000000000, "Grabbed from the wreckage of the Ali Enterprises factory."), // 10 oct
        new CountUpgrade('c26', 'Time-Release Coins', 500, 0, 10000000000000000000000000000, "Fines paid by Purdue Pharma for reckless OxyContin marketing."), // 100 oct
        new CountUpgrade('c27', 'Military-Issue Coins', 1000, 0, 100000000000000000000000000000, "Used to fund the AC-130s over Azizabad."), // 1 nonillion
        new CountUpgrade('c28', 'Declassified Coins', 1000, 0, 1000000000000000000000000000000, "Found between the pages of the KUBARK manual."), // 10 nonillion
        new CountUpgrade('c29', 'Prison Coins', 1000, 0, 10000000000000000000000000000000, "Bribes taken from Mid-Atlantic Youth Services Corp."), // 100 non
        new CountUpgrade('c30', 'Pulpified Coins', 1500, 0, 100000000000000000000000000000000, "Pulled from the pockets of Dilawar of Yakubi in Bagram."), // 1 dec
        new CountUpgrade('c31', 'Fashionable Coins', 1500, 0, 1000000000000000000000000000000000, "Savings passed on from H&M's child laborers in Myanmar."), // 10 dec
        new CountUpgrade('c32', 'Blacklisted Coins', 1500, 0, 10000000000000000000000000000000000, "Payment for the hard work of the Phoenix Program."), // 100 dec
        new CountUpgrade('c33', 'Disappearing Coins', 2000, 0, 100000000000000000000000000000000000, "Paid to hide the identities of Bush's ghost detainees."), // 1 undec
        new CountUpgrade('c34', 'Checkpoint Coins', 2000, 0, 1000000000000000000000000000000000000, "Offered as a token apology for the Mahmudiyah killings."), // 10 undec
        
    new CountUpgrade('bk1', 'Seed Money', 50, 0, 500000000000, 'Mom and Dad are proud of the way you\'ve monetized human suffering.', null, 'stars'),
    new CountUpgrade('bk2', 'Venture Capital', 100, 0, 500000000000000, 'Courtesy of Shark Tank Season 25, hosted by Mohammed bin Salman.', null, 'stars'),
    new CountUpgrade('bk3', 'Government Grants', 250, 0, 500000000000000000, 'You\'re like a public utility, except private, and nobody benefits.', null, 'stars'),
    new CountUpgrade('bk4', 'Colonial Sovereignty', 500, 0, 500000000000000000000, 'Investors are pleased with your standing army and public executions.', null, 'stars'),
    new CountUpgrade('bk5', 'The Spoils of War', 1000, 0, 500000000000000000000000, 'To crush your enemies, see them driven before you...', null, 'stars'),
    new CountUpgrade('bk6', 'Lucrative Charismata', 2500, 0, 500000000000000000000000000, 'Simply put, God favors those who ask.', null, 'stars'),

    // Lobbyist Upgrades - %, price
		new AwardCountUpgrade('lob0', 'Volunteer Lobbyists', 1, 400000000, "Doing no more and no less than their fiduciary duty."),
		new AwardCountUpgrade('lob1', '9-to-5 Lobbyists', 1, 2500000000, "Ensuring that you get pie in the sky when you die."), 
		new AwardCountUpgrade('lob2', 'Professional Lobbyists', 1, 30000000000, "I haven't got time for this Mickey Mouse bullshit!"), 
		new AwardCountUpgrade('lob3', 'Senior Lobbyists', 1, 365000000000, "A lobbyist is a fellow who is standing athwart history yelling 'Stop!'"), 
		new AwardCountUpgrade('lob4', 'Executive Lobbyists', 1, 4500000000000, "Representing Tyco executives since 2002."), 
		new AwardCountUpgrade('lob5', 'Country Club Lobbyists', 1, 5300000000000, "Coincidental members at Mar-a-Lago."), 
		new AwardCountUpgrade('lob6', 'Prison Lobbyists', 1, 635000000000000, "Handling lead generation for the school-to-prison pipeline."),
		new AwardCountUpgrade('lob7', 'Entrenched Lobbyists', 1, 7500000000000000, "Only an anti-establishment outsider could stop them."),
		new AwardCountUpgrade('lob8', 'Defense Lobbyists', 1, 90000000000000000, "Speaking softly and carrying big sticks."),
		new AwardCountUpgrade('lob9', 'Lobbyists Abroad', 1, 1100000000000000000, "Everywhere they go, Coca Cola's already been."),
		new AwardCountUpgrade('lob10', 'Patriot Lobbyists', 1, 13170000000000000000, "Crisis actors don't hire themselves."),
		new AwardCountUpgrade('lob11', 'Ancient Lobbyists', 1, 160000000000000000000, "I wear no mask."),
		
		new AwardCountUpgrade('lob12', 'Student Lobbyists', 2, 450000000000000, "Working for the interests of the Silent Majority."), 
		new AwardCountUpgrade('lob13', 'Stuffy Office Lobbyists', 2, 3000000000000000, "Hey, I'm not square, you're the one that's square."),
		new AwardCountUpgrade('lob14', 'Bullpen Lobbyists', 2, 35000000000000000, "Protecting vaporware from antitrust laws."),
		new AwardCountUpgrade('lob15', 'Upper-Level Lobbyists', 2, 430000000000000000, "Regularly studying cost-benefit analyses of flaming cars."), 
		new AwardCountUpgrade('lob16', 'Boardroom Lobbyists', 2, 5200000000000000000, "A bonus to one is a bonus to all."),
		new AwardCountUpgrade('lob17', 'Yacht Lobbyists', 2, 62000000000000000000, "They have to return some videotapes."),
		new AwardCountUpgrade('lob18', 'Police Union Lobbyists', 2, 745000000000000000000, "Who can trust a cop that won't take money?"),
		new AwardCountUpgrade('lob19', 'Moderate Lobbyists', 2, 9e+21, "To end welfare as we have come to know it."),
		new AwardCountUpgrade('lob20', 'Militarized Lobbyists', 2, 1.07e+23, "You go to war with the army you have."),
		new AwardCountUpgrade('lob21', 'Junta Lobbyists', 2, 1.3e+24, "Mostly retirees from the Atlacatl Battallion."),
		new AwardCountUpgrade('lob22', 'Masonic Lobbyists', 2, 1.5e+25, "The true killers of Vince Foster and Seth Rich."),
		new AwardCountUpgrade('lob23', 'Unspeakable Lobbyists', 2, 1.9e+26, "Ph'nglui mglw'nafh ROI R'lyeh wgah'nagl fhtagn."),
		
		// Increases the overall CPS bonus derived from the total number of employees
		new UnitCountUpgrade('un1', 'Amateur Debt Collectors', 0.1, 25000, "The going get tough, the tough get debt."), 
		new UnitCountUpgrade('un2', 'Law-Abiding Debt Collectors', 0.15, 250000, "Three-strikes policies will surely ensure payment."),
		new UnitCountUpgrade('un3', 'Aggressive Debt Collectors', 0.2, 250000000, "They will rip and tear your guts."),
		new UnitCountUpgrade('un4', 'Sadistic Debt Collectors', 0.25, 250000000000, "There's no love in your violence."),
		new UnitCountUpgrade('un5', 'Disciplined Debt Collectors', 0.3, 250000000000000, "Do any of you people know where these individuals learned how to shoot?"),
		new UnitCountUpgrade('un6', 'Paramilitary Debt Collectors', 0.4, 25000000000000000, "On loan from Battalion 3-16."),
    new UnitCountUpgrade('un7', 'Black Site Debt Collectors', 0.5, 25000000000000000000, "I mean, these are terrorists for the most part."),
    new UnitCountUpgrade('un8', 'Odious Debt Collectors', 0.6, 25000000000000000000000, "Ensuring that lendees are only crushed by beneficial debts."),
    new UnitCountUpgrade('un9', 'Righteous Debt Collectors', 1, 25000000000000000000000000, "The ACLU's got to take a lot of blame for this."),
    new UnitCountUpgrade('un10', 'Nuclear Debt Collectors', 2, 25000000000000000000000000000, "Anyway, we delivered the bomb."),
    new UnitCountUpgrade('un11', 'Mercenary Debt Collectors', 3, 25000000000000000000000000000000, "Regular readers of Debt Collector of Fortune magazine."),
    new UnitCountUpgrade('un12', 'Veteran Debt Collectors', 5, 25000000000000000000000000000000000, "Retirees from Tiger Force, mostly."),

		// Updates the number of simultaneous investments allowed
    new InvestmentsAllowedUpgrade('ia1', "Semi-Qualified Stock Brokers", 1, 200000000000, "Business-wise, this all seems like appropriate business."),
    new InvestmentsAllowedUpgrade('ia2', "Slick Cowboy Stock Brokers", 1, 200000000000000, "Is that you, John Wayne? Is this me?"),
    new InvestmentsAllowedUpgrade('ia3', "Fearless Stock Brokers", 1, 200000000000000000, "SHE makes a difference."),
    new InvestmentsAllowedUpgrade('ia4', "Supernatural Stock Brokers", 1, 200000000000000000000, "The securities are bound in human flesh and inked in human blood."),
    
    // Updates the per-second interest rates of investments
    new InvestmentInterestUpgrade('ir1', 'Frothier Markets', 10, 10000000000, 'What goes up will probably never go down.'),
    new InvestmentInterestUpgrade('ir2', 'Well-Chopped Stocks', 10, 10000000000000, 'Thank you for your vote of confidence and welcome to the Investor\'s Center.'),
    new InvestmentInterestUpgrade('ir3', '0% Tax Rates', 10, 10000000000000000, 'Read my lips: no new taxes.'),
    new InvestmentInterestUpgrade('ir4', 'Shorter Selling', 10, 10000000000000000000, 'Every day is Black Wednesday here.'),
    new InvestmentInterestUpgrade('ir5', 'Fully Primed Pumps', 10, 10000000000000000000000, 'Have you heard that expression used before? Because I haven\'t heard it.'),
    new InvestmentInterestUpgrade('ir6', '24-Hour Trading Exchanges', 10, 10000000000000000000000000, 'And the sun stood still, and the moon stayed, until the transactions had finished.'),
    new InvestmentInterestUpgrade('ir7', 'Total Financial Ouroboros', 10, 10000000000000000000000000000, 'If you buy all of your own stocks, you\'ll be rich.'),
    new InvestmentInterestUpgrade('ir8', 'Charts That Go Up', 10, 10000000000000000000000000000000, 'For all the points of the compass, there\'s only one direction.'),
    new InvestmentInterestUpgrade('ir9', 'Exceptional & Rich Indexes', 10, 10000000000000000000000000000000000, 'Much better than Standard and Poor.'),

    // Increases the time bonus of all investments
    new StatUpgrade('tb1', 'Inhuman Patience', 'access_time', timeBonusRate, 15, 5000000000000, "Increase the <b>Time Bonus Rate</b> of future <b>Investments</b> by <b>15%</b>.", "It's longer than you think, Dad! Longer than you think!"),
    new StatUpgrade('tb2', 'Sisyphean Perseverance', 'access_time', timeBonusRate, 15, 5000000000000000000, "Increase the <b>Time Bonus Rate</b> of future <b>Investments</b> by <b>15%</b>.", "One must imagine the investors happy."),
    new StatUpgrade('tb3', 'Novikovian Time Manipulation', 'access_time', timeBonusRate, 15, 5000000000000000000000000, "Increase the <b>Time Bonus Rate</b> of future <b>Investments</b> by <b>15%</b>.", "You are dealing with the oddity of time travel with the greatest of ease."),
    
    // Increase the payout bonus for very short (10 minute and under )investments
    new StatUpgrade('sb1', 'Insider Tips & Tricks', 'access_time', shortInvestmentBonus, 25, 20000000000, "Add <b>25%</b> to your <b>Short Investment Bonus</b> for investments under <b>10 minutes</b>.", "Like Ken Lay, you have to get out quick."),
    new StatUpgrade('sb2', 'Pumping and Dumping', 'access_time', shortInvestmentBonus, 25, 20000000000000000, "Add <b>25%</b> to your <b>Short Investment Bonus</b> for investments under <b>10 minutes</b>.", "So easy, even a 15-year-old can do it!"),
    new StatUpgrade('sb3', 'Brazen & Reckless Fraud', 'access_time', shortInvestmentBonus, 25, 20000000000000000000000, "Add <b>25%</b> to your <b>Short Investment Bonus</b> for investments under <b>10 minutes</b>.", "Just find two investors, and then each of them find two more..."),

    // Reduce overall risk in R&D
    new StatUpgrade('risk1', 'Flimsy Protective Railings', 'error_outline', riskReduction, 5, 10000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>5%</b>.', 'Need some wood?'),
    new StatUpgrade('risk2', 'Gently-Used Ear Plugs', 'error_outline', riskReduction, 5, 10000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>5%</b>.', 'You are always talking and you never stop.'),
    new StatUpgrade('risk3', 'Reassuring Leadership', 'error_outline', riskReduction, 10, 10000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>10%</b>.', 'I\'m John Kerry and I\'m reporting for duty.'),
    new StatUpgrade('risk4', 'Bihourly Safety Meetings', 'error_outline', riskReduction, 10, 10000000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>10%</b>.', 'He\'s comin\' in. I feel safer already.'),
    new StatUpgrade('risk5', 'Full-Body Delousing', 'error_outline', riskReduction, 15, 10000000000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>15%</b>.', 'Generally takes place in the comatorium.'),
    new StatUpgrade('risk6', 'Preventative Dental Extraction', 'error_outline', riskReduction, 15, 10000000000000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>15%</b>.', 'The procedure includes a free Cinco Food Tube.'),
    new StatUpgrade('risk7', 'Mandatory Nap Pods', 'error_outline', riskReduction, 15, 10000000000000000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>15%</b>.', 'I ain\'t afraid of no bed.'),
    new StatUpgrade('risk8', 'Daily Health Checkups', 'error_outline', riskReduction, 15, 10000000000000000000000000000000000, 'Reduce the <b>Catastrophic Risk</b> in your <b>Research</b> by an additional <b>15%</b>.', 'Birth control is not covered and the copay is $800.'),

    // Increase value of R&D
    new StatUpgrade('rd1', 'Bigger Ideas', 'new_releases', researchBonus, 25, 100000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'What if a garbage man was actually smart?'),
    new StatUpgrade('rd2', 'More Boxes', 'new_releases', researchBonus, 25, 100000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'Outside of which to think.'),
    new StatUpgrade('rd3', 'STEM Education', 'new_releases', researchBonus, 25, 100000000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'If you could put the universe into a tube...'),
    new StatUpgrade('rd4', 'IQ Experiments', 'new_releases', researchBonus, 25, 100000000000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'I dint know mice were so smart.'),
    new StatUpgrade('rd5', 'Weaponized Brains', 'new_releases', researchBonus, 25, 100000000000000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'You wanna load it up with little bitty bullets of knowledge.'),
    new StatUpgrade('rd6', 'Mensa Memberships', 'new_releases', researchBonus, 25, 100000000000000000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'Necessary for a true cognitive elite.'),
    new StatUpgrade('rd7', '100% Neural Capacity', 'new_releases', researchBonus, 25, 100000000000000000000000000000000, 'Increase the overall value of <b>R&D</b> by an additional <b>25%</b>.', 'I AM EVERYWHERE.'),

    // Raise Speed Boosts in R&D
    new StatUpgrade('spd1', 'Motivational Work Conditions', 'fast_forward', speedBoost, 25, 500000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'My concern is not that there are too many sweatshops, but that there are too few.'),
    new StatUpgrade('spd2', 'Courtesy Amphetamines', 'fast_forward', speedBoost, 25, 500000000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'Part of the Tuskegee Study of Untreated Amphetamines.'),
    new StatUpgrade('spd3', 'Forced HGH Injections', 'fast_forward', speedBoost, 25, 500000000000000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'The unstoppable rise! It\'s like globalization, it\'s inevitable!'),
    new StatUpgrade('spd4', 'Productivity Mutations', 'fast_forward', speedBoost, 25, 500000000000000000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'If you beautiful perversions don\'t shut the fuck up, I\'ll turn you into glue!'),
    new StatUpgrade('spd5', 'Reckless Endangerment', 'fast_forward', speedBoost, 25, 500000000000000000000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'Can\'t stop the A-Train--!'),
    new StatUpgrade('spd6', 'Red-Painted Work Spaces', 'fast_forward', speedBoost, 25, 500000000000000000000000000000, 'Pump up the <b>Speed Bonus</b> for your <b>Research-Assigned Interns</b> by <b>25%</b>.', 'WAAAGH!'),

    // Raise Value Boosts in R&D
    new StatUpgrade('val1', 'Budget Reductions', 'add_shopping_cart', valueBoost, 25, 500000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'Beautiful to live in poverty just to spite what they\'re selling.'),
    new StatUpgrade('val2', 'Departmental Insolvency', 'add_shopping_cart', valueBoost, 25, 500000000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'You\'re 30 cents away from having a quarter.'),
    new StatUpgrade('val3', 'Inverted Salaries', 'add_shopping_cart', valueBoost, 25, 500000000000000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'Truly dedicated employees are self-motivated and self-funded.'),
    new StatUpgrade('val4', 'Generational Debts', 'add_shopping_cart', valueBoost, 25, 500000000000000000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'I ain\'t no forgiver forgetter.'),
    new StatUpgrade('val5', 'Doing More With Less', 'add_shopping_cart', valueBoost, 25, 500000000000000000000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'Eventually leads to doing everything with nothing.'),
    new StatUpgrade('val6', 'Increased Gilding', 'add_shopping_cart', valueBoost, 25, 500000000000000000000000000000, 'Bloat the <b>Value Bonus</b> for your <b>Research-Assigned Wage Slaves</b> by <b>25%</b>.', 'It\'s a tale of today.'),

    // Time Boosts for Outgoing Investment Mail - inspiring
    new StatUpgrade('ouI1', 'Personal Touches', 'skip_next', investmentBoostBonus, 20, 1000000000000000000000, '<b>Outgoing Emails</b> inspire your <b>Investments</b> department to squeeze out <b>20%</b> extra productivity.', 'Dear Mrs., Mr., Miss, or Mr. and Mrs. Daneeka...'),
    new StatUpgrade('ouI2', 'Paternalistic Guilt', 'skip_next', investmentBoostBonus, 20, 100000000000000000000000, '<b>Outgoing Emails</b> inspire your <b>Investments</b> department to squeeze out <b>20%</b> extra productivity.', 'I have fed you all a thousand years.'),
    new StatUpgrade('ouI3', 'Exhilirating Rhetoric', 'skip_next', investmentBoostBonus, 20, 1000000000000000000000000, '<b>Outgoing Emails</b> inspire your <b>Investments</b> department to squeeze out <b>20%</b> extra productivity.', 'If it be a sin to covet honour, I am the most offending soul alive.'),
    new StatUpgrade('ouI4', 'Stirring Corporate Pride', 'skip_next', investmentBoostBonus, 20, 100000000000000000000000000, '<b>Outgoing Emails</b> inspire your <b>Investments</b> department to squeeze out <b>20%</b> extra productivity.', 'Your guidepost stands out like a tenfold beacon in the night: Duty, Honor, Capital Gains.'),
    new StatUpgrade('ouI5', 'Jingoistic Fervor', 'skip_next', investmentBoostBonus, 20, 1000000000000000000000000000, '<b>Outgoing Emails</b> inspire your <b>Investments</b> department to squeeze out <b>20%</b> extra productivity.', 'Come on, you apes! You want to live forever?'),

    // Time Boosts for Outgoing Research Mail (yell to work harder) - persuading
    new StatUpgrade('ouR1', 'Congenial Encouragement', 'skip_next', researchBoostBonus, 20, 1000000000000000000000, '<b>Outgoing Emails</b> persuade your <b>R&D</b> department to squeeze out <b>20%</b> extra productivity.', 'I like Jim Hill, he\'s a good friend of mine'),
    new StatUpgrade('ouR2', 'Playful Threats', 'skip_next', researchBoostBonus, 20, 100000000000000000000000, '<b>Outgoing Emails</b> persuade your <b>R&D</b> department to squeeze out <b>20%</b> extra productivity.', 'I\'ve signed legislation that will outlaw Russia forever.'),
    new StatUpgrade('ouR3', 'Furious Subtext', 'skip_next', researchBoostBonus, 20, 1000000000000000000000000, '<b>Outgoing Emails</b> persuade your <b>R&D</b> department to squeeze out <b>20%</b> extra productivity.', 'I like these calm little moments before the storm.'),
    new StatUpgrade('ouR4', 'Menacing Word Choice', 'skip_next', researchBoostBonus, 20, 100000000000000000000000000, '<b>Outgoing Emails</b> persuade your <b>R&D</b> department to squeeze out <b>20%</b> extra productivity.', 'I\'m going to count to three. There will not be a four.'),
    new StatUpgrade('ouR5', 'The Promise of Death', 'skip_next', researchBoostBonus, 20, 1000000000000000000000000000, '<b>Outgoing Emails</b> persuade your <b>R&D</b> department to squeeze out <b>20%</b> extra productivity.', 'I\'ve frequently not been on boats.'),

    // Time Boosts for Outgoing Acquisition Mail (finding people to fire) - assisting
    new StatUpgrade('ouA1', 'Arbitrary Finger-Pointing', 'skip_next', acquisitionBoostBonus, 20, 1000000000000000000000, '<b>Outgoing Emails</b> assist your <b>Acquisitions</b> department in squeezing out <b>20%</b> extra productivity.', 'This guy is, I believe, a racist.'),
    new StatUpgrade('ouA2', 'Long Lists of Names', 'skip_next', acquisitionBoostBonus, 20, 100000000000000000000000, '<b>Outgoing Emails</b> assist your <b>Acquisitions</b> department in squeezing out <b>20%</b> extra productivity.', 'Engaged in a final, all-out battle between communistic atheism and employment.'),
    new StatUpgrade('ouA3', 'Executive Disgust', 'skip_next', acquisitionBoostBonus, 20, 1000000000000000000000000, '<b>Outgoing Emails</b> assist your <b>Acquisitions</b> department in squeezing out <b>20%</b> extra productivity.', 'Someday a real rain will come and wash all this scum off the streets.'),
    new StatUpgrade('ouA4', 'Slanderous Accusations', 'skip_next', acquisitionBoostBonus, 20, 100000000000000000000000000, '<b>Outgoing Emails</b> assist your <b>Acquisitions</b> department in squeezing out <b>20%</b> extra productivity.', 'It is important to root out these Masters of Deceit.'),
    new StatUpgrade('ouA5', 'Why We Fire', 'skip_next', acquisitionBoostBonus, 20, 1000000000000000000000000000, '<b>Outgoing Emails</b> assist your <b>Acquisitions</b> department in squeezing out <b>20%</b> extra productivity.', 'A seven-part documentary series directed by Frank Capra.'),
    
    // Time Boosts for Employee Training (encouraging)
    new StatUpgrade('ouT1', 'Company-Wide Competitions', 'skip_next', trainingBoostBonus, 20, 1000000000000000000000, '<b>Outgoing Emails</b> encourage your <b>Career Development</b> department to squeeze out <b>20%</b> extra training productivity.', 'Without further ado, it\'s time to start... running!'),
    new StatUpgrade('ouT2', 'In-House Counseling', 'skip_next', trainingBoostBonus, 20, 100000000000000000000000, '<b>Outgoing Emails</b> encourage your <b>Career Development</b> department to squeeze out <b>20%</b> extra training productivity.', 'You were born broken. That\'s your birthright.'),
    new StatUpgrade('ouT3', 'Venting Opportunities', 'skip_next', trainingBoostBonus, 20, 1000000000000000000000000, '<b>Outgoing Emails</b> encourage your <b>Career Development</b> department to squeeze out <b>20%</b> extra training productivity.', 'Nothing is over! Nothing!'),
    new StatUpgrade('ouT4', 'Behavioral Demerits', 'skip_next', trainingBoostBonus, 20, 100000000000000000000000000, '<b>Outgoing Emails</b> encourage your <b>Career Development</b> department to squeeze out <b>20%</b> extra training productivity.', 'With disdain, I reject your verdict!'),
    new StatUpgrade('ouT5', 'Punitive Pyre Burnings ', 'skip_next', trainingBoostBonus, 20, 1000000000000000000000000000, '<b>Outgoing Emails</b> encourage your <b>Career Development</b> department to squeeze out <b>20%</b> extra training productivity.', 'Jakob Rohrbach in accounting was the first to go.'),

    // Manual Stress Reduction Upgrades
    new StatUpgrade('stb1', 'Clearer Expectations', 'airline_seat_individual_suite', stressReductionMultiplier, 1, 1000000000000000000000, 'Add <b>1</b> to your <b>Stress Reduction Multiplier</b> for HR Emails.', 'Deputy likes dots.'),
    new StatUpgrade('stb2', 'Compulsory Sedation', 'airline_seat_individual_suite', stressReductionMultiplier, 1, 100000000000000000000000, 'Add <b>1</b> to your <b>Stress Reduction Multiplier</b> for HR Emails.', 'Inside me I\'m screaming, nobody pays any attention.'),
    new StatUpgrade('stb3', 'Purge of the Weak', 'airline_seat_individual_suite', stressReductionMultiplier, 1, 1000000000000000000000000, 'Add <b>1</b> to your <b>Stress Reduction Multiplier</b> for HR Emails.', 'If you\'re always worried about crushing the ants beneath you...'),
    new StatUpgrade('stb4', 'Limited Merit Promotions', 'airline_seat_individual_suite', stressReductionMultiplier, 1, 100000000000000000000000000, 'Add <b>1</b> to your <b>Stress Reduction Multiplier</b> for HR Emails.', 'He has just been awarded the cross of the Legion of Honor.'),

    // Increase the bonus to the multiplier proportional to employee rank
    new StatUpgrade('h1', 'Strip-Mall Moneylenders', 'store', allEmployeeMod, 1, 30000000000000000, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "Only 400% APR!"),
    new StatUpgrade('h50', 'Cash Bail Moneylenders', 'store', allEmployeeMod, 1, 30000000000000000000, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "Are there no prisons?"),
    new StatUpgrade('h100', 'Bureaucratic Moneylenders', 'store', allEmployeeMod, 1, 2.2e+21, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "Sorry, I'm a bit of a stickler for paperwork."),
    new StatUpgrade('h150', 'Multinational Moneylenders', 'store', allEmployeeMod, 1, 2.4e+24, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "The IMF is here to help."),
    new StatUpgrade('h200', 'Death Squad Moneylenders', 'store', allEmployeeMod, 1, 2.6e+27, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "I probably have a lot of blood on my hands, but that's not all bad."),
    new StatUpgrade('h250', 'Imperialist Moneylenders', 'store', allEmployeeMod, 1, 4e+29, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "This is a farewell kiss, you dog."),
    new StatUpgrade('h300', 'Ordained Moneylenders', 'store', allEmployeeMod, 1, 435000000000000000000000000000000, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "Flee from the peasants as from the devil himself."),
    new StatUpgrade('h350', 'Primeval Moneylenders', 'store', allEmployeeMod, 1, 470000000000000000000000000000000000, "Double the <b>Cash per Second</b> wrenched from every one of your employees.", "He is calling! He is calling! I hear him! We must go!"),

    // Unlocks for away messages
    new StatUpgrade('au1', 'Efficient Stratcom', 'lock_open', emailAway, 1, 500000, 'Unlock the <b>Out of Office</b> toggle for your <b>Email</b> inbox.', 'Being completely unavailable is an effective power move.'),
    new StatUpgrade('au2', 'All Accounts Deleted', 'lock_open', policyAway, 1, 100000000000000000, 'Unlock the <b>Out of Office</b> toggle for your <b>New Policy</b> inbox.', 'Nothing on your phone but the E*TRADE app.'),
    new StatUpgrade('au3', 'Lyrical Away Messages', 'lock_open', chatAway, 1, 100000000000000000, 'Unlock the <b>Out of Office</b> toggle for your <b>Chat</b> window.', 'Back off I\'ll take you on / Headstrong to take on anyone'),

    // Increases the amount of time before emails become stale
    new StatUpgrade('ef1', 'Faster Software', 'mail', timeToAnswerMail, 30, 25000000000, 'Increase your <b>Email Freshness Timer</b> by <b>30 seconds</b>.', "And that's the way I meet my goals."),
    new StatUpgrade('ef2', 'Decentralized Crypto-Inboxes', 'mail', timeToAnswerMail, 30, 25000000000000000, 'Increase your <b>Email Freshness Timer</b> by <b>30 seconds</b>.', "As if your old fiat inboxes are any more stable."),
    new StatUpgrade('ef3', 'Quantum Computers', 'mail', timeToAnswerMail, 30, 25000000000000000000000, 'Increase your <b>Email Freshness Timer</b> by <b>30 seconds</b>.', "To invent universes and bake apple pies from scratch."),
    new StatUpgrade('ef4', 'A Shining Trapezohedron', 'mail', timeToAnswerMail, 30, 25000000000000000000000000000, 'Increase your <b>Email Freshness Timer</b> by <b>30 seconds</b>.', "Providing a dark and unspeakable window into email responsiveness."),
    
    // Increase the base bonus for text entered in email responses
    new StatUpgrade('et1', 'Incomprehensible Jargon', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000, 'Increase your <b>Bonus for Email Reply Text</b> by <b>0.15</b>.', "Why use a fifty-cent word when you can use a five-dollar word?"),
    new StatUpgrade('et2', 'Threatening Diction', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "The worst thing one can do with words is to surrender to them."),
    new StatUpgrade('et3', 'Outright Lies', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "My belief is we will, in fact, be greeted as liberators."),
    new StatUpgrade('et4', 'Masculine Posturing', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "You talkin\' to me?"),
   
    new StatUpgrade('et5', 'Blatant Doublespeak', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "When we talk about war, we're really talking about peace."),
    new StatUpgrade('et6', 'Galloping Fallacies', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "Debate me, coward!"),
    new StatUpgrade('et7', 'Artful Pathos', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "Please help me budget this. My family is dying."),
    new StatUpgrade('et8', 'Chilling Portents', 'edit', baseEmailTextMultiplier, 0.15, 5000000000000000000000000000000, 'Increase your <b>Email Text Bonus Multiplier</b> by <b>0.15</b>.', "...there has been a creeping socialism spreading in the United States."),
    
    // Increase the minimum time bonus of emails
    new StatUpgrade('exem1', 'Supplemental Email Assistance Program', 'mail', timeBonusMinimum, 0.025, 25000000000, 'Increase the <b>Minimum Cash Return</b> of expired <b>Emails</b>.', "We don't want to turn the safety net into a hammock."),
    new StatUpgrade('exem2', 'Email Benefits Transfer Card', 'mail', timeBonusMinimum, 0.025, 25000000000000000, 'Increase the <b>Minimum Cash Return</b> of expired <b>Emails</b>.', "She used 80 names, 30 addresses, 15 telephone numbers to collect emails..."),
    new StatUpgrade('exem3', 'The Affordable Emails Act', 'mail', timeBonusMinimum, 0.025, 25000000000000000000000, 'Increase the <b>Minimum Cash Return</b> of expired <b>Emails</b>.', "You must answer emails or pay the new Gestapo - the IRS."),
    new StatUpgrade('exem4', 'Universal Basic Email', 'mail', timeBonusMinimum, 0.025, 25000000000000000000000000000, 'Increase the <b>Minimum Cash Return</b> of expired <b>Emails</b>.', "I am now convinced that the simplest solution to poverty is to send emails."),
    
    // Increase the maximum number of emails allowed in the inbox
    new StatUpgrade('inbox1', 'More Hard Drives', 'storage', inboxMax, 15, 1000000, 'Increase your <b>Email Inbox Maximum</b> by <b>15</b>', 'To store additional Data Beans.'),
    new StatUpgrade('inbox2', 'Off-Site Data Centers', 'storage', inboxMax, 25, 1000000000, 'Increase your <b>Email Inbox Maximum</b> by <b>25</b>', '750TB of important business emails.'),

    // Increases the cash earned from each email - value is doubled in practice
    new StatUpgrade('eem1', 'The Reasonable Sales Model', 'mail', emailCashBonus, 5, 10000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Every man a customer.'),
    new StatUpgrade('eem2', 'The Ambitious Sales Model', 'mail', emailCashBonus, 5, 5000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'A chicken in every pot and a car in every garage.'),
    new StatUpgrade('eem3', 'The Reckless Sales Model', 'mail', emailCashBonus, 5, 5000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Sell products now, create products later.'),
    new StatUpgrade('eem4', 'The Personable Sales Model', 'mail', emailCashBonus, 5, 5000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Basically just negging and harassment.'),
    new StatUpgrade('eem5', 'The Militant Sales Model', 'mail', emailCashBonus, 5, 5000000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Product Pushing through Personality, Persistence, and Military Force.'),
    new StatUpgrade('eem6', 'The Occult Sales Model', 'mail', emailCashBonus, 5, 5000000000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Keep it Simple, be iNvaluable, always Align, and raise Pazuzu.'),
    new StatUpgrade('eem7', 'The Challenger Sales Model', 'mail', emailCashBonus, 5, 5000000000000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Sometimes when we reach for the stars, we fall short.'),
    new StatUpgrade('eem8', 'The Supreme Sales Model', 'mail', emailCashBonus, 5, 5000000000000000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Just follow the Ten Principles for a Monolithic Sales System.'),
    new StatUpgrade('eem9', 'The Stargate Sales Model', 'mail', emailCashBonus, 5, 5000000000000000000000000000000, 'Increase your <b>Bonus to Email Payout</b> by <b>10%</b>.', 'Utilizes military-developed psychotronics for customer relations.'),

    // Increase the likelihood of receiving an urgent email
    new StatUpgrade('smac1', 'Extra Email Addresses', 'error', specialMailChance, 1, 100000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'Now with full 24-hour availability.'),
    new StatUpgrade('smac2', 'Anxiety Medication', 'error', specialMailChance, 1, 100000000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'More are always coming it never stops.'),
    new StatUpgrade('smac3', 'Fully Lucid Nightmares', 'error', specialMailChance, 1, 100000000000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'Allows you to manage your inbox even while sleeping.'),
    new StatUpgrade('smac4', 'Extensive Nerve Damage', 'error', specialMailChance, 1, 100000000000000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'You can\'t feel tired if you can\'t feel.'),
    new StatUpgrade('smac5', 'Ethereal Sleeplessness', 'error', specialMailChance, 1, 100000000000000000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'Instead of sleeping, you just meditate for 4 hours each night.'),
    new StatUpgrade('smac6', 'Business Precognition', 'error', specialMailChance, 1, 100000000000000000000000000, 'Slightly Increase your chance of receiving <b>Urgent Emails</b>.', 'You\'re important, and the visions are just after market extras.'),
    
    // Increase the cash bonus added to every urgent email
    new StatUpgrade('smb1', 'Surge Pricing', 'error', specialMailBonus, 200, 1000000000, 'Add an additional <b>200%</b> to your <b>Urgent Email Bonus</b>.', 'These emails arrived during peak hours.'),
    new StatUpgrade('smb2', 'Convenience Fees', 'error', specialMailBonus, 200, 1000000000000, 'Add an additional <b>200%</b> to your <b>Urgent Email Bonus</b>.', 'That\'s why they call it a service economy.'),
    new StatUpgrade('smb3', 'Extremely Fine Print', 'error', specialMailBonus, 200, 1000000000000000, 'Add an additional <b>200%</b> to your <b>Urgent Email Bonus</b>.', 'The rational Economic Man always reads it.'),
    new StatUpgrade('smb4', 'Disaster Price-Gouging', 'error', specialMailBonus, 200, 1000000000000000000, 'Add an additional <b>200%</b> to your <b>Urgent Email Bonus</b>.', 'It\'s good for the public.'),
    new StatUpgrade('smb5', 'Fully Legal Extortion', 'error', specialMailBonus, 200, 1000000000000000000000, 'Add an additional <b>200%</b> to your <b>Urgent Email Bonus</b>.', 'If there\'s a problem, the market will correct it.'),
    new StatUpgrade('smb6', 'Trojan Horse Keyloggers', 'error', specialMailBonus, 250, 1000000000000000000000000, 'Add an additional <b>250%</b> to your <b>Urgent Email Bonus</b>.', 'The Equifax branding lets everybody know they\'re safe.'),
    new StatUpgrade('smb7', 'Structural Adjustment Programs', 'error', specialMailBonus, 250, 1000000000000000000000000000, 'Add an additional <b>250%</b> to your <b>Urgent Email Bonus</b>.', 'The needs of the many do not outweigh the needs of the global economy.'),

    // Increases the likelihood of emails appearing
    new StatUpgrade('em1', 'Superliminal Advertising', 'mail', mailChanceMultiplier, 0.20, 200000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "Hey, you! Join the Navy!"),
    new StatUpgrade('em2', 'Stronger Brand Identity', 'mail', mailChanceMultiplier, 0.20, 200000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "What if we called it Academi?"),
    new StatUpgrade('em3', 'Top of a Better Funnel', 'mail', mailChanceMultiplier, 0.20, 200000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "Attention - do I have your attention?"),
    new StatUpgrade('em4', 'Draconian Brand Compliance', 'mail', mailChanceMultiplier, 0.20, 200000000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "There will be no love, except the love of the brand."),
    new StatUpgrade('em5', 'Invasive Data-Mining', 'mail', mailChanceMultiplier, 0.20, 200000000000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "The Tommyknockers let you know when you\'ve gone too deep."),
    new StatUpgrade('em6', 'Mandatory Engagement', 'mail', mailChanceMultiplier, 0.20, 200000000000000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "Geneva Convention, Article 6: The Rules of Brand Engagement."),
    new StatUpgrade('em7', 'Omnidimensional Marketing', 'mail', mailChanceMultiplier, 0.20, 200000000000000000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "This attractive piece of paper represents space-time."),
    new StatUpgrade('em8', 'Baphometic Hypnotism', 'mail', mailChanceMultiplier, 0.20, 200000000000000000000000000000, 'Slightly increase the frequency at which you receive <b>Emails.</b>', "The horned idol beckons through an intriguing call to action."),

    new StatUpgrade('ace1', 'Pinker Slips', 'healing', acquisitionValueMultiplier, 0.2, 10000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.2</b>.', "They run the risk of splitting into two blue slips."),
    new StatUpgrade('ace2', 'Negative Severance', 'healing', acquisitionValueMultiplier, 0.2, 100000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.2</b>.', "Employees pay you to be fired."),
    new StatUpgrade('ace3', 'Firings in Name Only', 'healing', acquisitionValueMultiplier, 0.2, 1000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.2</b>.', "Fired employees still fulfill their work obligations, only unpaid."),
    new StatUpgrade('ace4', 'Special Forces Philosophy', 'healing', acquisitionValueMultiplier, 0.2, 10000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.2</b>.', "Launch fired employees into the sun in a SpaceX rocket."),
    new StatUpgrade('ace5', 'Operation Rolling Layoffs', 'healing', acquisitionValueMultiplier, 0.3, 100000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.3</b>.', "Hey! Hey! LBJ! How many employees did you fire today?"),
    new StatUpgrade('ace6', 'Targeted Drone Firing', 'healing', acquisitionValueMultiplier, 0.3, 1000000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.3</b>.', "We may have fired Abdulrahman al-Awlaki by mistake..."),
    new StatUpgrade('ace7', 'Bane Capital', 'healing', acquisitionValueMultiplier, 0.3,   10000000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.3</b>.', "You merely adopted private equity; I was born in it, moulded by it..."),
    new StatUpgrade('ace8', 'The Fourth Woe', 'healing', acquisitionValueMultiplier, 0.3, 100000000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.3</b>.', "If those days had not been cut short, no one would remain employed."),
    new StatUpgrade('ace9', 'Adults in the Room', 'healing', acquisitionValueMultiplier, 0.3, 1000000000000000000000000000000, 'Increase your <b>Acquisition Value Multiplier</b> by <b>0.3</b>.', "From a kingdom of gold to one of rust and iron."),

    new StatUpgrade('exec1', 'Folksy Servility', 'directions_run', defaultExecutives, 1, 250000000000000000000000, 'New <b>Acquisitions</b> begin with <b>1</b> extra <b>Executive Financier</b>.', 'I\'m just a workin\' man. My boss does all the supposin\''),
    new StatUpgrade('exec2', 'Boy\'s Club Camaraderie', 'directions_run', defaultExecutives, 1, 25000000000000000000000000, 'New <b>Acquisitions</b> begin with <b>1</b> extra <b>Executive Financier</b>.', 'Let\'s hurt somebody.'),
    new StatUpgrade('exec3', 'Aspirational Loyalty', 'directions_run', defaultExecutives, 1, 2500000000000000000000000000, 'New <b>Acquisitions</b> begin with <b>1</b> extra <b>Executive Financier</b>.', 'As far back as I can remember, I always wanted to be a mid-level executive.'),
    new StatUpgrade('exec4', 'Esprit De Corporate', 'directions_run', defaultExecutives, 1, 250000000000000000000000000000, 'New <b>Acquisitions</b> begin with <b>1</b> extra <b>Executive Financier</b>.', 'Machine men, with machine minds and machine hearts.'),

    new StatUpgrade('acw1', 'Direct Lines to HR', 'person_outline', acquisitionsWorkerDiscount, 5, 1000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "They see the clicker game on your monitor."),
    new StatUpgrade('acw2', 'Relentless Rationalization', 'person_outline', acquisitionsWorkerDiscount, 5, 100000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "After all, rationality is man's basic virtue."),
    new StatUpgrade('acw3', 'Fuzzier Math', 'person_outline', acquisitionsWorkerDiscount, 5, 1000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "Look, this man, he's got great numbers."),
    new StatUpgrade('acw4', 'The Little Red Book of Acquiring', 'person_outline', acquisitionsWorkerDiscount, 5, 100000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "Offers 12.5 principles for firing people."),
    new StatUpgrade('acw5', 'Lunch with the Bosses', 'person_outline', acquisitionsWorkerDiscount, 5, 1000000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "I don't want to talk behind anybody's back, but..."),
    new StatUpgrade('acw6', 'Automated Firing Algorithms', 'person_outline', acquisitionsWorkerDiscount, 5, 100000000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "Who lubricates the machine joints with their own blood?"),
    new StatUpgrade('acw7', 'White Shoes', 'person_outline', acquisitionsWorkerDiscount, 5, 1000000000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "How could they be antisemitic if they support Israel?"),
    new StatUpgrade('acw8', 'The Art of Acquisition', 'person_outline', acquisitionsWorkerDiscount, 5, 100000000000000000000000000000, 'Increase the <b>Discount</b> for <b>Acquisition Workers</b> by <b>5%</b>.', "In the midst of chaos, there is also opportunity."),
		
    // Election upgrades

    new StatUpgrade('dt1', 'Youth Non-Profits', 'how_to_vote', electionSupportRate, 2, 50000000000000000000000000, 'Increase the <b>Donation Efficacy Rate</b> for <b>Elections</b> by <b>2.</b>', 'Maintaining professor watchlists to promote free speech.'),
    new StatUpgrade('dt2', 'FEC Loopholes', 'how_to_vote', electionSupportRate, 2, 50000000000000000000000000000, 'Increase the <b>Donation Efficacy Rate</b> for <b>Elections</b> by <b>2.</b>', 'Don\'t worry, all expenditures are independent.'),
    new StatUpgrade('dt3', 'Indirect Advocacy', 'how_to_vote', electionSupportRate, 2, 50000000000000000000000000000000, 'Increase the <b>Donation Efficacy Rate</b> for <b>Elections</b> by <b>2.</b>', 'None of the Eight Magic Words were uttered.'),
    new StatUpgrade('dt4', 'Ultra PACs', 'how_to_vote', electionSupportRate, 2, 50000000000000000000000000000000000, 'Increase the <b>Donation Efficacy Rate</b> for <b>Elections</b> by <b>2.</b>', '"We the People" refers exclusively to corporate entities.'),

    new StatUpgrade('strk1', 'Campaign Loyalists', 'flash_on', winStreakCap, 5, 250000000000000000000000000, 'Increase the <b>Win Streak Cap</b> for <b>Elections</b> by <b>5</b>.', 'Attack, attack, attack - never defend.'),
    new StatUpgrade('strk2', 'Repeatable Strategies', 'flash_on', winStreakCap, 5, 25000000000000000000000000000, 'Increase the <b>Win Streak Cap</b> for <b>Elections</b> by <b>5</b>.', 'We are doing away with the racial problem one way or the other.'),
    new StatUpgrade('strk3', 'Election Rigging', 'flash_on', winStreakCap, 5, 2500000000000000000000000000000, 'Increase the <b>Win Streak Cap</b> for <b>Elections</b> by <b>5</b>.', 'Election integrity guaranteed by Crosscheck.'),
    new StatUpgrade('strk4', 'Dynastic Candidates', 'flash_on', winStreakCap, 5, 250000000000000000000000000000000, 'Increase the <b>Win Streak Cap</b> for <b>Elections</b> by <b>5</b>.', 'Jeb!'),
    new StatUpgrade('strk5', 'No Term Limits', 'flash_on', winStreakCap, 5, 25000000000000000000000000000000000, 'Increase the <b>Win Streak Cap</b> for <b>Elections</b> by <b>5</b>.', 'Looking forward to the Enabling Act of 2033.'),

    new StatUpgrade('elu0', 'Casual Skimming', 'ballot', electionPayoutBonus, 25, 500000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'My world is strictly cash and carry.'),
    new StatUpgrade('elu1', 'Revolving Doors', 'ballot', electionPayoutBonus, 25, 5000000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'It is simply a descent from heaven.'),
    new StatUpgrade('elu2', 'Targeted Deregulation', 'ballot', electionPayoutBonus, 25, 500000000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'Relaxed laws for the smallest minority on earth.'),
    new StatUpgrade('elu3', 'Juicy Defense Contracts', 'ballot', electionPayoutBonus, 25, 5000000000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'We must build Schwerer Gustavs for national security.'),
    new StatUpgrade('elu4', 'Colossal Tax Breaks', 'ballot', electionPayoutBonus, 25, 500000000000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'Robbing Paul to pay Peter.'),
    new StatUpgrade('elu5', 'Cabinet Positions', 'ballot', electionPayoutBonus, 25, 5000000000000000000000000000000000, 'Increase the <b>Election Payout Bonus</b> by <b>25%</b>, win or lose.', 'My own personal theory is that Joseph built the pyramids to store grain.'),

    new StatUpgrade('gaf0', 'Political Consultants', 'local_hospital', gaffeBuffer, 10, 10000000000000000000000000, 'Increase the <b>Buffer to Gaffe Risk</b> for elections by <b>10%</b>.', 'Now, I resign so I will not become the issue.'),
    new StatUpgrade('gaf1', 'Elite Speech-Writers', 'local_hospital', gaffeBuffer, 10, 10000000000000000000000000000, 'Increase the <b>Buffer to Gaffe Risk</b> for elections by <b>10%</b>.', 'All of us who advocated for the war have had to do some reckoning.'),
    new StatUpgrade('gaf2', 'Limitless Teleprompters', 'local_hospital', gaffeBuffer, 15, 10000000000000000000000000000000, 'Increase the <b>Buffer to Gaffe Risk</b> for elections by <b>15%</b>.', 'I\'m Ron Burgundy?'),
    new StatUpgrade('gaf3', 'Media Characterization', 'local_hospital', gaffeBuffer, 15, 10000000000000000000000000000000000, 'Increase the <b>Buffer to Gaffe Risk</b> for elections by <b>15%</b>.', 'Who would you rather have a Beer Summit with?'),
    
    new StatUpgrade('pr0', 'Blame-Shifting Strategies', '360', prChance, 10, 1000000000000000000000000000, 'Increase the <b>Chance for PR Spin</b> for election gaffes by <b>10%</b>.', 'Nixon Sees \'Witch-Hunt,\' Insiders Say'),
    new StatUpgrade('pr1', 'Friendly Interviewers', '360', prChance, 10, 1000000000000000000000000000000, 'Increase the <b>Chance for PR Spin</b> for election gaffes by <b>10%</b>.', 'Caution: you are about to enter the No-Spin Zone!'),
    new StatUpgrade('pr2', 'Heartfelt Apologies', '360', prChance, 10, 1000000000000000000000000000000000, 'Increase the <b>Chance for PR Spin</b> for election gaffes by <b>10%</b>.', 'Let me be Frank.'),
    
    new StatUpgrade('elem1', 'Etiquette Coaches', 'lock_open', electionNotifications, 1, 2500000000000000000000000000, 'Unlock <b>Thank You Emails</b> from winning <b>Election</b> candidates.', 'Thank you for your service.'),

    // Employee discounts

    new StatUpgrade('disc1', 'Cost-of-Living Decreases', 'content_cut', employeeDiscount, 3, 1000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "You're just a step on the boss-man's ladder"),
    new StatUpgrade('disc2', 'Means-Tested Paychecks', 'content_cut', employeeDiscount, 3, 1000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "That's right, I've got a floor. So what?"),
    new StatUpgrade('disc3', 'Catastrophic Health Plans', 'content_cut', employeeDiscount, 3, 1000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "These ones only cover the Death Panels."),
    new StatUpgrade('disc4', 'The Spectre of Reorg', 'content_cut', employeeDiscount, 3, 1000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "Your new position no longer includes payment as a perk."),
    new StatUpgrade('disc5', 'Less Bread, Fewer Roses', 'content_cut', employeeDiscount, 3, 1000000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "Hearts starve as well as bodies."),
    new StatUpgrade('disc6', 'Disciplinary Pay Cuts', 'content_cut', employeeDiscount, 3, 1000000000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "You become part of the unregenerate two per cent."),
    new StatUpgrade('disc7', 'Annual Retirement Fees', 'content_cut', employeeDiscount, 3, 1000000000000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "Compensation for lost productivity upon retirement."),
    new StatUpgrade('disc8', 'Reverse Benefits Packages', 'content_cut', employeeDiscount, 3, 1000000000000000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "Pay cuts cover health expenses for management."),
    new StatUpgrade('disc9', 'Inflexible Spending Accounts', 'content_cut', employeeDiscount, 3, 1000000000000000000000000000000000, 'Increase your overall <b>Employee Discount</b> by <b>3%</b>.', "Tax-advantaged accounts to be used only for coffins."),

    new StatUpgrade('tc1', 'Untested Brain Drugs', 'fitness_center', trainingBonus, 25, 100000000000000000000000000, 'Increase your employee <b>Training Bonus</b> by <b>25%</b>', 'Oh, isn\'t that the one where the guy becomes limitless?'),
    new StatUpgrade('tc2', 'Highly Illegal Nootropics', 'fitness_center', trainingBonus, 25, 100000000000000000000000000000, 'Increase your employee <b>Training Bonus</b> by <b>25%</b>', 'I\'ve seen it all. I\'ve seen everything.'),
   
    new StatUpgrade('tc3', 'Disruptive Techniques', 'fitness_center', trainingBonus, 10, 50000000000000000000, 'Increase your employee <b>Training Bonus</b> by <b>10%</b>', 'Will you teach me about this - what is it? A new way?'),
    new StatUpgrade('tc4', 'Grueling Calisthenics', 'fitness_center', trainingBonus, 10, 50000000000000000000000, 'Increase your employee <b>Training Bonus</b> by <b>10%</b>', 'The repetitive strain injuries mean it\'s working.'),
    new StatUpgrade('tc5', 'Hyperbolic Time Chambers', 'fitness_center', trainingBonus, 10, 50000000000000000000000000, 'Increase your employee <b>Training Bonus</b> by <b>10%</b>', 'Just one day of training! It\'s easy!'),

    new StatUpgrade('cru1', 'Free Thought', 'extension', crypticEmailBonus, 25, 100000000000000000000000000000, 'Increase your <b>Cryptic Email Bonus</b> by <b>25%</b>', 'Prison\'s in your mind. Can\'t you see I\'m free?'),
    new StatUpgrade('cru2', 'Pattern Recognition', 'extension', crypticEmailBonus, 25, 1000000000000000000000000000000, 'Increase your <b>Cryptic Email Bonus</b> by <b>25%</b>', 'I used to be in a barbershop quartet in Skokie, Illinois.'),
    new StatUpgrade('cru3', 'Paranoid Skepticism', 'extension', crypticEmailBonus, 25, 10000000000000000000000000000000, 'Increase your <b>Cryptic Email Bonus</b> by <b>25%</b>', 'I want to believe...'),
    new StatUpgrade('cru4', 'Sealed Indictments', 'extension', crypticEmailBonus, 25, 100000000000000000000000000000000, 'Increase your <b>Cryptic Email Bonus</b> by <b>25%</b>', 'Maybe it\'s the calm before the storm. Could be.'),

    // additionalBankruptcyBonus

    new StatUpgrade('tp1', 'Reverse Vacation Accrual', 'alarm_add', timePlayedBonusRate, 0.1, 1000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "Negative vacation days do roll over."),
    new StatUpgrade('tp2', 'Centenarian Retirement', 'alarm_add', timePlayedBonusRate, 0.1, 100000000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "At the party, you receive a $15 Chili\'s gift card."),
    new StatUpgrade('tp3', 'Intergenerational Labor', 'alarm_add', timePlayedBonusRate, 0.1, 100000000000000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "Babies born on company property are company IP."),
    new StatUpgrade('tp4', 'Permanent Isolation Cubicles', 'alarm_add', timePlayedBonusRate, 0.1, 100000000000000000000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "No monkey has died during isolation."),
    new StatUpgrade('tp5', 'Quincentennial Celebration', 'alarm_add', timePlayedBonusRate, 0.1, 100000000000000000000000000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "Party hats top the skeletons propped up at their desks."),
    new StatUpgrade('tp6', 'Mid-Sleep Task Management', 'alarm_add', timePlayedBonusRate, 0.1, 100000000000000000000000000000000000, "Increase your <b>Bonus for Time Played</b> by <b>0.1%</b>.", "He told me he's been having long dreams.")
	]);

  var availableUpgrades = ko.computed(function() {
    return upgrades().filter(function(u) {
      return u.available();
    }).sort(function(a, b) {
      return a.price.val() === b.price.val() ? 0 : (a.price.val() < b.price.val() ? -1 : 1)
    });
  }, this);
	
	var newUpgradesCount = new Stat('New Upgrades', ko.computed(function() {
	  return availableUpgrades().filter(function(u) {
	    return !u.read();
	  }).length;
	}, this));
	
	var totalUpgradeCount = ko.observable(upgrades().length);
	
	var upgradePercentageEarned = ko.computed(function() {
	  var num = upgradeCount.val() / totalUpgradeCount() * 100;
	  return num + '%';
	}, this);

    /**
     * Achievements include the following types: 
     * click - awarded based on click threshold vs. number of manual clicks
     * count - awarded based on click threshold vs. total click resource earned
     * unit - awarded based on the threshold vs. number of units (for the unit to which they correspond)
     * totalUnit - awarded based on the threshold vs. total number of units owned
     * totalUpgrade - awarded based on the threshold vs. total number of upgrades owned
     * totalDPS - awarded based on the threshold vs. total CPS
     * misc - awarded under unique circumstances - handled individually
     **/
	var achievements = ko.observableArray([

        // INTERN ACHIEVEMENTS
        new UnitAward('ua11', 'Unpaid Assistant', 0, 1, ['u00']),
        new UnitAward('ua12', 'trigger', 0, 10, ['u01']),
        new UnitAward('ua13', 'trigger', 0, 25, ['u02']),
        new UnitAward('ua14', 'Downtrodden Workhorse', 0, 50, ['u03']),
        new UnitAward('ua15', 'trigger', 0, 75, ['u04']),
        new UnitAward('ua16', 'Exploitable Laborer', 0, 100, ['u05', 'lob0']),
        new UnitAward('ua17', 'trigger', 0, 125, ['u06']),
        new UnitAward('ua18', 'Lumpenproletariat', 0, 150, ['u07']),
        new UnitAward('ua19', 'trigger', 0, 175, ['u08']),
        new UnitAward('ua120', 'Bewildered Herd', 0, 200, ['u09', 'lob12']),
        new UnitAward('ua120-5', 'The Underclass', 0, 250, ['u09.1']),
        new UnitAward('ua1-21', 'Work Will Set You Free', 0, 300, ['one1']),
        new UnitAward('ua1-21-5', 'Untouchable', 0, 350, ['u09.2']),
        new UnitAward('ua1-22', 'The Surplus Valuable', 0, 400, ['u010']),
        new UnitAward('ua1-22-5', 'Materially Conditioned', 0, 450, ['u011']),
        new UnitAward('ua1-23', 'The Alienated Essence', 0, 500, ['u012']),

        // WAGE SLAVE ACHIEVEMENTS
        new UnitAward('ua21', 'Office Drone', 1, 1, ['u10']),
        new UnitAward('ua22', 'trigger', 1, 10, ['u11']),
        new UnitAward('ua23', 'trigger', 1, 25, ['u12']),
        new UnitAward('ua24', 'Working Stiff', 1, 50, ['u13']),
        new UnitAward('ua25', 'trigger', 1, 75, ['u14']),
        new UnitAward('ua26', 'Cubicle Connoisseur', 1, 100, ['u15', 'lob1']),
        new UnitAward('ua27', 'trigger', 1, 125, ['u16']),
        new UnitAward('ua28', 'Employee of the Month', 1, 150, ['u17']),
        new UnitAward('ua29', 'trigger', 1, 175, ['u18']),
        new UnitAward('ua210', 'Weekend Warrior', 1, 200, ['u19', 'lob13']),
        new UnitAward('ua210-5', 'Burning Both Ends', 1, 250, ['u19.1']),
        new UnitAward('ua2-11', 'Salaryman', 1, 300, ['one2']),
        new UnitAward('ua211-5', 'Quietly Desperate', 1, 350, ['u19.2']),
        new UnitAward('ua2-12', 'Withering Serf', 1, 400, ['u120']),
        new UnitAward('ua2-12-5', 'The Organization Man', 1, 450, ['u121']),
        new UnitAward('ua2-13', 'I\'m Henry Dubb!', 1, 500, ['u122']),
        
        // SALES HOTSHOT ACHIEVEMENTS
        new UnitAward('ua31', 'Struggling Sadsack', 2, 1, ['u20']),
        new UnitAward('ua32', 'trigger', 2, 10, ['u21']),
        new UnitAward('ua33', 'trigger', 2, 25, ['u22']),
        new UnitAward('ua34', 'Door-to-Door Charlatan', 2, 50, ['u23']),
        new UnitAward('ua3s1', 'trigger', 2, 75, ['su00']),
        new UnitAward('ua36', 'Snake Oil Sweet-Talker', 2, 100, ['u24', 'lob2']),
        new UnitAward('ua3s2', 'trigger', 2, 125, ['su10']),
        new UnitAward('ua37', 'Telephone Terrorist', 2, 150, ['u25']),
        new UnitAward('ua38', 'Master of the Pipeline', 2, 200, ['u26', 'lob14']),
        new UnitAward('ua38-5', 'Creator of Demand', 2, 250, ['u27']),
        new UnitAward('ua39', 'Good Quarterly Numbers', 2, 300, ['one3']),
        new UnitAward('ua39-5', 'Landed and Expanded', 2, 350, ['u28']),
        new UnitAward('ua3-10', 'Silver Tongued', 2, 400, []),
        
        // MIDDLE MANAGER ACHIEVEMENTS
        new UnitAward('ua41', 'Fun Boss', 3, 1, ['u30']),
        new UnitAward('ua42', 'trigger', 3, 10, ['u31']),
        new UnitAward('ua43', 'trigger', 3, 25, ['u32']),
        new UnitAward('ua44', 'Corporate Loyalist', 3, 50, ['u33']),
        new UnitAward('ua4s1', 'trigger', 3, 75, ['su01']),
        new UnitAward('ua46', 'Company Man', 3, 100, ['u34', 'lob3']),
        new UnitAward('ua4s2', 'trigger', 3, 125, ['su11']),
        new UnitAward('ua47', 'A Team Player', 3, 150, ['u35']),
        new UnitAward('ua48', 'True Believer', 3, 200, ['u36', 'lob15']),
        new UnitAward('ua48-5', 'Upwardly Mobile', 3, 250, ['u37']),
        new UnitAward('ua49', 'Lifer', 3, 300, ['one4']),
        new UnitAward('ua49-5', 'Ladder Climber', 3, 350, ['u38']),
        new UnitAward('ua4-10', 'Petite Bourgeoisie', 3, 400, []),
        
        // C-LEVEL ACHIEVEMENTS
        new UnitAward('ua51', 'Thought Leader', 4, 1, ['u40']),
        new UnitAward('ua52', 'trigger', 4, 10, ['u41']),
        new UnitAward('ua53', 'trigger', 4, 25, ['u42']),
        new UnitAward('ua54', 'Change Agent', 4, 50, ['u43']),
        new UnitAward('ua5s1', 'trigger', 4, 75, ['su02']),
        new UnitAward('ua56', 'A Clear-Eyed Realist', 4, 100, ['u44', 'lob4']),
        new UnitAward('ua5s2', 'trigger', 4, 125, ['su12']),
        new UnitAward('ua57', 'The Name on the Door', 4, 150, ['u45']),
        new UnitAward('ua58', 'Sub-Prime Leader', 4, 200, ['u46', 'lob16']),
        new UnitAward('ua58-5', 'Job Creator', 4, 250, ['u47']),
        new UnitAward('ua59', 'Too Big to Fail', 4, 300, ['one5']),
        new UnitAward('ua59-5', 'Fearless Leader', 4, 350, ['u48']),
        new UnitAward('ua5-10', 'The Corner Office', 4, 400, []),
        
        // BLUE BLOOD ACHIEVEMENTS
        new UnitAward('ua61', 'Privileged', 5, 1, ['u50'], 'What could go wrong?'),
        new UnitAward('ua62', 'trigger', 5, 10, ['u51']),
        new UnitAward('ua63', 'trigger', 5, 25, ['u52']),
        new UnitAward('ua64', 'Upper-Class Twit', 5, 50, ['u53']),
        new UnitAward('ua6s1', 'trigger', 5, 75, ['su03']),
        new UnitAward('ua66', 'Old Money', 5, 100, ['u54', 'lob5']),
        new UnitAward('ua6s2', 'trigger', 5, 125, ['su13']),
        new UnitAward('ua67', 'Plutocrat', 5, 150, ['u55']),
        new UnitAward('ua68', 'The Ruling Class', 5, 200, ['u56', 'lob17']),
        new UnitAward('ua68-5', 'Haute Bourgeoisie', 5, 250, ['u57']),
        new UnitAward('ua69', 'Neo-Feudal Lord', 5, 300, ['one6']),
        new UnitAward('ua69-5', 'Peak Rentier', 5, 350, ['u58']),
        new UnitAward('ua6-10', 'Manorialist', 5, 400, []),
        
        // PRIVATE COPS ACHIEVEMENTS
        new UnitAward('ua71', 'Officer Friendly', 6, 1, ['u60'], 'What could go wrong?'),
        new UnitAward('ua72', 'trigger', 6, 10, ['u61']),
        new UnitAward('ua73', 'trigger', 6, 25, ['u62']),
        new UnitAward('ua74', 'Crime Dog', 6, 50, ['u63']),
        new UnitAward('ua7s1', 'trigger', 6, 75, ['su04']),
        new UnitAward('ua76', 'Reasonably Suspicious', 6, 100, ['u64', 'lob6']),
        new UnitAward('ua7s2', 'trigger', 6, 125, ['su14']),
        new UnitAward('ua77', 'Thin Blue Line', 6, 150, ['u65']),
        new UnitAward('ua78', 'Blue Lives Matter', 6, 200, ['u66', 'lob18']),
        new UnitAward('ua78-5', 'User of Force', 6, 250, ['u67']),
        new UnitAward('ua79', 'We Love Our Cops', 6, 300, ['one7']),
        new UnitAward('ua79-5', 'Stopped and Frisked', 6, 350, ['u68']),
        new UnitAward('ua7-10', 'Qualifiedly Immune', 6, 400, []),
        
        // POCKET POLITICIAN ACHIEVEMENTS
        new UnitAward('ua81', 'Fresh-Faced Candidate', 7, 1, ['u70'], 'What could go wrong?'),
        new UnitAward('ua82', 'trigger', 7, 10, ['u71']),
        new UnitAward('ua83', 'trigger', 7, 25, ['u72']),
        new UnitAward('ua84', 'Elected Official', 7, 50, ['u73']),
        new UnitAward('ua8s1', 'trigger', 7, 75, ['su05']),
        new UnitAward('ua86', 'Elder Statesman', 7, 100, ['u74', 'lob7']),
        new UnitAward('ua8s2', 'trigger', 7, 125, ['su15']),
        new UnitAward('ua87', 'Crony Capitalist', 7, 150, ['u75']),
        new UnitAward('ua88', 'Maverick', 7, 200, ['u76', 'lob19']),
        new UnitAward('ua88-5', 'The General Will', 7, 250, ['u77']),
        new UnitAward('ua89', 'Contracted with America', 7, 300, ['one8']),
        new UnitAward('ua89-5', 'Lord of the Swamp', 7, 350, ['u78']),
        new UnitAward('ua8-10', 'True Patriot', 7, 400, []),
        
        // MERCENARY ACHIEVEMENTS
        new UnitAward('ua91', 'Peacekeeper', 8, 1, ['u80']),
        new UnitAward('ua92', 'trigger', 8, 10, ['u81']),
        new UnitAward('ua93', 'trigger', 8, 25, ['u82']),
        new UnitAward('ua94', 'War Profiteer', 8, 50, ['u83']),
        new UnitAward('ua9s1', 'trigger', 8, 75, ['su06']),
        new UnitAward('ua96', 'Jolly Green Giant', 8, 100, ['u84', 'lob8']),
        new UnitAward('ua9s2', 'trigger', 8, 125, ['su16']),
        new UnitAward('ua97', 'Les Enfants Terrible', 8, 150, ['u85']),
        new UnitAward('ua98', 'Mission Accomplished', 8, 200, ['u86', 'lob20']),
        new UnitAward('ua98-5', 'Esquadrão da Morte', 8, 250, ['u87']),
        new UnitAward('ua99', 'The Absence of Alternatives', 8, 300, ['one9']),
        new UnitAward('ua99-5', 'Mutually Assured Destroyer', 8, 350, ['u88']),
        new UnitAward('ua9-10', 'Shocked and Awed', 8, 400, []),
        
        // CLIENT STATES ACHIEVEMENTS
        new UnitAward('ua101', 'Globalizer', 9, 1, ['u90']),
        new UnitAward('ua102', 'trigger', 9, 10, ['u91']),
        new UnitAward('ua103', 'trigger', 9, 25, ['u92']),
        new UnitAward('ua104', 'Domino Champ', 9, 50, ['u93']),
        new UnitAward('ua10s1', 'trigger', 9, 75, ['su07']),
        new UnitAward('ua106', 'Good Neighbor', 9, 100, ['u94', 'lob9']),
        new UnitAward('ua10s2', 'trigger', 9, 125, ['su17']),
        new UnitAward('ua107', 'International Monetary Fun!', 9, 150, ['u95']),
        new UnitAward('ua108', 'Destiny Manifested', 9, 200, ['u96', 'lob21']),
        new UnitAward('ua108-5', 'Roosevelt Correlated', 9, 250, ['u97']),
        new UnitAward('ua109', 'Mission Civilisatrice', 9, 300, ['one10']),
        new UnitAward('ua109-5', 'The Most Urgent Fury', 9, 350, ['u98']),
        new UnitAward('ua10-10', 'We Came, We Saw, He Died', 9, 400, []),
        
        // SHADOW GOVERNMENT ACHIEVEMENTS
        new UnitAward('ua111', 'Deep State', 10, 1, ['u100']),
        new UnitAward('ua112', 'trigger', 10, 10, ['u101']),
        new UnitAward('ua113', 'trigger', 10, 25, ['u102']),
        new UnitAward('ua114', 'One-World Globalist', 10, 50, ['u103']),
        new UnitAward('ua11s1', 'trigger', 10, 75, ['su08']),
        new UnitAward('ua116', 'Homeland Eradicator of Local Militants', 10, 100, ['u104', 'lob10']),
        new UnitAward('ua11s2', 'trigger', 10, 125, ['su18']),
        new UnitAward('ua117', 'New World Order', 10, 150, ['u105']),
        new UnitAward('ua118', 'La-li-lu-le-lo', 10, 200, ['u106', 'lob22']),
        new UnitAward('ua118-5', 'Consent Engineer', 10, 250, ['u107']),
        new UnitAward('ua119', 'The Fifth Column', 10, 300, ['one11']),
        new UnitAward('ua119-5', 'I Am Part of the Resistance', 10, 350, ['u108']),
        new UnitAward('ua11-10', 'The Powers That Be', 10, 400, []),
        
        // PUPPETMASTER ACHIEVEMENTS
        new UnitAward('ua121', 'All-Seeing', 11, 1, ['u110']),
        new UnitAward('ua122', 'trigger', 11, 10, ['u111']),
        new UnitAward('ua123', 'trigger', 11, 25, ['u112']),
        new UnitAward('ua124', 'Bilderberger', 11, 50, ['u113']),
        new UnitAward('ua12s1', 'trigger', 11, 75, ['su09']),
        new UnitAward('ua126', 'Lost Lemurian', 11, 100, ['u114', 'lob11']),
        new UnitAward('ua12s2', 'trigger', 11, 125, ['su19']),
        new UnitAward('ua127', 'Babylonian Brother', 11, 150, ['u115']),
        new UnitAward('ua128', 'G.A.O.T.U.', 11, 200, ['u116', 'lob23']),
        new UnitAward('ua128-5', 'The Anunnaki of Nibiru', 11, 250, ['u117']),
        new UnitAward('ua129', 'The Primordial Ba\'al', 11, 300, ['one12']),
        new UnitAward('ua129-5', 'Thoth the Atlantean Priest-King', 11, 350, ['u118']),
        new UnitAward('ua12-10', 'The Esoteric Order of Dagon', 11, 400, []),
        
        /* Cash Awards */
        
        new Award('uc1', 'Corner Store', 25, ['un1'], unitCount),
        new Award('uc2', 'Local Establishment', 100, ['un2'], unitCount),
        new Award('uc3', 'Big-Box Factory', 250, ['un3'], unitCount),
        new Award('uc4', 'Sprawling Industrial Wasteland', 500, ['un4'], unitCount),
        new Award('uc5', 'Faceless Multinational Corporation', 1000, ['un5'], unitCount),
        new Award('uc6', 'All-Powerful Global Conglomerate', 1500, ['un6'], unitCount),
        new Award('uc7', 'Dystopian Imperial Cartel', 2000, ['un7'], unitCount),
        new Award('uc8', 'Timeless Secret Cabal', 2500, ['un8'], unitCount),
        new Award('uc9', 'Primordial Global Conspiracy', 3000, ['un9'], unitCount),
        new Award('uc10', 'Ancient Byzantine Institution', 3500, ['un10'], unitCount),
        new Award('uc11', 'Unstoppable World-Spanning Horde', 4000, ['un11'], unitCount),
        new Award('uc12', 'Gibbering Corporate Mass', 4500, ['un12'], unitCount),
        new Award('uc13', 'Antediluvian Hive-Mind', 5000, [], unitCount),
	   
        new Award('td1', 'In the Black', 1, ['cps1'], accessibleDPS),
        new Award('td2', 'Ramen Profitable', 100, ['cps2'], accessibleDPS),
        new Award('td3', 'Dry Powdered', 1000, ['cps3'], accessibleDPS),
        new Award('td4', 'Minimally Viable', 10000, ['cps4'], accessibleDPS),
        new Award('td5', 'Incubated', 1000000, ['cps5'], accessibleDPS), // 1 million
        new Award('td6', 'Growth Hacked', 10000000, ['cps6'], accessibleDPS), // 10 million
        new Award('td7', 'Seed Accelerated', 100000000, ['cps7'], accessibleDPS), // 100 million
        new Award('td8', 'The Three Commas Club', 1000000000, ['cps8'], accessibleDPS), // 1 billion
        new Award('td9', 'Rapidly Pivoting', 10000000000, ['cps9'], accessibleDPS), // 10 billion
        new Award('td10', 'Hockey Stick Growth', 100000000000, ['cps10'], accessibleDPS), // 100 billion
        new Award('td11', 'Market Cannibal', 1000000000000, ['cps11'], accessibleDPS), // 1 trillion
        new Award('td12', 'Growth-Oriented', 10000000000000, ['cps12'], accessibleDPS), // 10 trillion
        new Award('td13', '800-Pound Gorilla', 100000000000000, ['cps13'], accessibleDPS), // 100 trillion
        new Award('td14', 'The Five Commas Club', 1000000000000000, ['cps14'], accessibleDPS), // 1 quadrillion
        new Award('td15', 'Running Fat', 10000000000000000, ['cps15'], accessibleDPS), // 10 quad
        new Award('td16', 'Moving Fast & Breaking Everything', 100000000000000000, ['cps16'], accessibleDPS), // 100 quad
        new Award('td17', 'Glamorous Glennis', 1000000000000000000, ['cps17'], accessibleDPS), // 1 quint
        new Award('td18', 'Terminal Income Velocity', 10000000000000000000, ['cps18'], accessibleDPS), // 10 quint
        new Award('td19', '80-Million-Pound Gorilla', 100000000000000000000, ['cps19'], accessibleDPS), // 100 quint
        new Award('td20', 'The Seven Commas Club', 1000000000000000000000, ['cps20'], accessibleDPS), // 1 sext
        new Award('td21', 'Faster-than-Light Growth', 10000000000000000000000, ['cps21'], accessibleDPS), // 10 sext
        new Award('td22', 'Gravimetric Revenue Displacement', 100000000000000000000000, ['cps22'], accessibleDPS), // 100 sext
        new Award('td23', 'Mandeville Pointed', 1000000000000000000000000, ['cps23'], accessibleDPS), // 1 sept
	    	
        new Award('tc1', 'Monetized', 100, ['c0'], totalCashSlowed),
        new Award('tc2', 'Piggy Banker', 10000, ['c1'], totalCashSlowed),
        new Award('tc3', 'Flush with Cash', 100000, ['c2'], totalCashSlowed),
        new Award('tc4', 'Self-Made Millionaire', 1000000, ['c3', 'tp1'], totalCashSlowed), // 1 million
        new Award('tc5', 'The 1%', 10000000, ['c4'], totalCashSlowed), // 10 million
        new Award('tc6', 'Fat Cat', 100000000, ['c5'], totalCashSlowed), // 100 million
        new Award('tc7', 'Unicorn', 1000000000, ['c6'], totalCashSlowed), // 1 billion
        new Award('tc8', 'Off-Shore Accountant', 10000000000, ['c7'], totalCashSlowed), // 10 billion
        new Award('tc9', 'Industrialist', 100000000000, ['c8'], totalCashSlowed), // 100 billion
        new Award('tc10', 'Old Moneybags', 1000000000000, ['c9', 'tp2'], totalCashSlowed), // 1 trillion
        new Award('tc11', 'Robber Baron', 10000000000000, ['c10'], totalCashSlowed), // 10 trillion
        new Award('tc12', 'The .0001%', 100000000000000, ['c11'], totalCashSlowed), // 100 trillion
        new Award('tc13', 'Teracorn', 1000000000000000, ['c12'], totalCashSlowed), // 1 quadrillion
        new Award('tc14', 'Landed Gentry', 10000000000000000, ['c13'], totalCashSlowed), // 10 quadrillion
        new Award('tc15', 'Daddy Warbucks', 100000000000000000, ['c14'], totalCashSlowed), // 100 quadrillion
        new Award('tc16', 'Titan of Industry', 1000000000000000000, ['c15', 'tp3'], totalCashSlowed), // 1 quintillion
        new Award('tc17', 'Randian Hero', 10000000000000000000, ['c16'], totalCashSlowed), // 10 quintillion
        new Award('tc18', 'The 0.0000001%', 100000000000000000000, ['c17'], totalCashSlowed), // 100 quintillion
        new Award('tc19', 'Preternaturally Wealthy', 1000000000000000000000, ['c18'], totalCashSlowed), // 1 sextillion
        new Award('tc20', 'Four-Dimensional Capitalist', 10000000000000000000000, ['c19'], totalCashSlowed), // 10 sextillion
        new Award('tc21', 'Supernatural Magnate', 100000000000000000000000, ['c20'], totalCashSlowed), // 100 sextillion
        new Award('tc22', 'Cosmic Tycoon', 1000000000000000000000000, ['c21', 'tp4'], totalCashSlowed), // 1 septillion
        new Award('tc23', 'Trilateral Commissioner', 10000000000000000000000000, ['c22'], totalCashSlowed), // 10 septillion
        new Award('tc24', 'Lord of the Round Table', 100000000000000000000000000, ['c23'], totalCashSlowed), // 100 septillion
        new Award('tc25', 'Malthusian Trapper', 1000000000000000000000000000, ['c24'], totalCashSlowed), // 1 octillion
        new Award('tc26', 'Destroyer of Worlds', 10000000000000000000000000000, ['c25'], totalCashSlowed), // 10 octillion
        new Award('tc27', 'The Sum Total of the Universe', 100000000000000000000000000000, ['c26'], totalCashSlowed), // 100 octillion
        new Award('tc28', 'Alpha and Omega', 1000000000000000000000000000000, ['c27', 'tp5'], totalCashSlowed), // 1 nonillion
        new Award('tc29', 'Annuit Cœptis', 10000000000000000000000000000000, ['c28'], totalCashSlowed), // 10 nonillion
        new Award('tc30', 'Universal Dominion', 100000000000000000000000000000000, ['c29'], totalCashSlowed), // 100 nonillion
        new Award('tc31', 'Immanentized Eschaton', 1000000000000000000000000000000000, ['c30'], totalCashSlowed), // 1 decillion
        new Award('tc32', 'The Abomination of Desolation', 10000000000000000000000000000000000, ['c31'], totalCashSlowed), // 10 decillion
        new Award('tc33', 'The 0.000000000000000001%', 100000000000000000000000000000000000, ['c32'], totalCashSlowed), // 100 dec
        new Award('tc34', 'Grande Bourgeoisie', 1000000000000000000000000000000000000, ['c33', 'tp6'], totalCashSlowed), // 1 undecillion
        new Award('tc35', 'Mansa Musa', 10000000000000000000000000000000000000, ['c34'], totalCashSlowed), // 10 undecillion
        new Award('tc36', 'The Whole Heaven is Mine', 100000000000000000000000000000000000000, [], totalCashSlowed), // 100 undecillion

        /* Upgrade Awards */
	   
	    	new Award('upc1', 'Innovator', 10, [], upgradeCount),
	    	new Award('upc2', 'Disruptor', 50, ['disc1'], upgradeCount),
	    	new Award('upc3', 'Game Changer', 100, ['disc2'], upgradeCount),
	    	new Award('upc4', 'Paradigm Shifter', 150, ['disc3'], upgradeCount), 
	    	new Award('upc5', 'Bleeding Edge Visionary', 200, ['disc4'], upgradeCount), 
        new Award('upc6', 'Reshaper of Worlds', 250, ['disc5'], upgradeCount),
        new Award('upc7', 'Universal Flux', 300, ['disc6'], upgradeCount),
        new Award('upc7b', 'The Lord of Change', 350, ['disc7'], upgradeCount), 
        new Award('upc7c', 'Unlimited Vicissitude', 400, ['disc8'], upgradeCount), 
        new Award('upc7d', 'Fully Metamorphosed', 450, ['disc9'], upgradeCount), 
	    	new Award('upc8', 'Completionist', 530, [], upgradeCount, 'Buy every single <b>Upgrade</b>.'), // TODO make sure it's updated
	    		    	
	    	/* Click Awards */
	    	
      new Award('ec1', 'Founder', 10, ['m0'], earnedFromManualClicks), 
      new Award('ec2', 'Self-starter', 500, ['m1'], earnedFromManualClicks),
      new Award('ec3', 'Hands-On', 10000, ['m2'], earnedFromManualClicks),
      new Award('ec4', 'Micromanager', 1000000, ['m3'], earnedFromManualClicks),
      new Award('ec5', 'In The Trenches', 100000000, ['mc0'], earnedFromManualClicks), // 100 mil
      new Award('ec6', 'Incapable of Delegation', 1000000000, ['m4'], earnedFromManualClicks),
      new Award('ec7', 'Monstrous Work Ethic', 100000000000, ['mc1'], earnedFromManualClicks), // 100 bil
      new Award('ec8', 'One Man Army', 1000000000000, ['m5'], earnedFromManualClicks), // 1 trillion
      new Award('ec9', 'Brute Forcer', 100000000000000, ['mc2'], earnedFromManualClicks), // 100 tril 
      new Award('ec10', 'Fiercely Independent', 1000000000000000, ['m6'], earnedFromManualClicks), // 1 quadrillion
      new Award('ec11', 'Wearer of Multiple Hats', 100000000000000000, ['mc3'], earnedFromManualClicks), // 100 quad
      new Award('ec12', 'Full-Stack', 1000000000000000000, ['m7'], earnedFromManualClicks), // 1 quintillion
      new Award('ec13', 'Rockstar', 100000000000000000000, ['mc4'], earnedFromManualClicks), // 100 quint
      new Award('ec14', 'Wearer of All Hats', 1000000000000000000000, ['m8', 'gwf'], earnedFromManualClicks), // 1 sext
      new Award('ec15', 'The Roarkian Ideal', 100000000000000000000000, ['mc5'], earnedFromManualClicks), // 100 sext
      new Award('ec16', 'Low-Functioning Sociopath', 1000000000000000000000000, ['m9'], earnedFromManualClicks), // 1 sept
      new Award('ec17', 'Lisan al Gaib', 100000000000000000000000000, ['mc6'], earnedFromManualClicks), // 100 sept
      new Award('ec18', 'Ubermensch', 1000000000000000000000000000, ['m10'], earnedFromManualClicks), // 1 oct
      new Award('ec19', 'Midas Touch', 100000000000000000000000000000, ['gwf1'], earnedFromManualClicks), // 100 oct
      new Award('ec20', 'The Master of Mankind', 1000000000000000000000000000000, ['gwf2'], earnedFromManualClicks), // 1 non
      new Award('ec21', 'The Finger on the Button', 100000000000000000000000000000000, ['gwf3'], earnedFromManualClicks), // 100 non
      new Award('ec22', 'The Clicking of Adam', 1000000000000000000000000000000000, ['gwf4'], earnedFromManualClicks), // 1 dec

        new Award('ewf1', 'Pretty Much Just Lucky', 1000000000, ['wfd1'], earnedFromWindfalls), // 1 bil
        new Award('ewf2', 'Committed Crapshooter', 100000000000, ['wfl1'], earnedFromWindfalls), // 100 bil
        new Award('ewf3', 'On A Roll', 1000000000000, ['wfm1'], earnedFromWindfalls), // 1 tril
        new Award('ewf4', 'Nothing but Aces', 100000000000000, ['wfd2'], earnedFromWindfalls),
        new Award('ewf5', 'Catching all the Breaks', 1000000000000000, ['wfl2'], earnedFromWindfalls), // 1 quad
        new Award('ewf6', 'Seven-Leaf Clover', 100000000000000000, ['wfm2'], earnedFromWindfalls),
        new Award('ewf7', 'Highest Possible Roller', 1000000000000000000, ['wfd3'], earnedFromWindfalls), // 1 quint
        new Award('ewf8', 'Non-Stop Jackpot Winner', 100000000000000000000, ['wfl3'], earnedFromWindfalls), // 100 quint
        new Award('ewf9', 'A Deal with the Devil', 1000000000000000000000, ['wfm3'], earnedFromWindfalls), // 1 sext
        new Award('ewf10', '4, 8, 15, 16, 23, 42', 100000000000000000000000, ['wfd4'], earnedFromWindfalls), // 100 sext
        new Award('ewf11', 'Seven-Million-Leaf Clover', 1000000000000000000000000, ['wfl4'], earnedFromWindfalls), // 1 sept
        new Award('ewf12', 'Unstoppable Terrifying Luck', 100000000000000000000000000, ['wfm4'], earnedFromWindfalls), // 100 sept
        new Award('ewf13', 'Sick and Tired of Winning', 1000000000000000000000000000, ['wfd5'], earnedFromWindfalls), // 1 oct
        
        new Award('wf1', 'Strike Gold', 1, [], windfallCountAllTime, 'Experience your first <b>Windfall</b>.'),
        new Award('wf2', 'Fortune Favors the Fortunate', 25, [], windfallCountAllTime, "Experience a total of <b>25 Windfalls</b> across all of your businesses."),
        new Award('wf3', 'Everything\'s Coming Up Milhouse', 100, [], windfallCountAllTime, "Experience a total of <b>100 Windfalls</b> across all of your businesses."),
        new Award('wf4', 'Well-Deserved Winnings', 250, [], windfallCountAllTime, "Experience a total of <b>250 Windfalls</b> across all of your businesses."),
        new Award('wf5', 'Luck Had Nothing to Do With It', 500, [], windfallCountAllTime, "Experience a total of <b>500 Windfalls</b> across all of your businesses."),
        
        new Award('mc0', 'Lots of Clicking', 1000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>1,000</b> times across all of your businesses."),
        new Award('mc1', 'You Have Clicked Too Much', 10000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>10,000</b> times across all of your businesses."),
        new Award('mc2', 'It\'s Too Many Clicks', 25000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>25,000</b> times across all of your businesses."),
        new Award('mc3', 'Lots of Clicks, Maybe Too Many', 50000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>50,000</b> times across all of your businesses."),
        new Award('mc4', 'Basically Too Much Clicking', 75000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>75,000</b> times across all of your businesses."),
        new Award('mc5', 'You Clicked Too Many Times', 100000, [], manualClicksAllTime, "<b>Manually Click</b> a total of <b>100,000</b> times across all of your businesses."),
        
        new ManualAward('lck1', 'Meritocrat', [], 'Just get lucky.'),
        new ManualAward('lck2', 'The Chosen One', [], 'Just get really lucky.'),
        new ManualAward('lck3', 'Hard-Earned', [], 'Just get really, very lucky.'),

        /* Idle Awards */

        new Award('it1', 'Lunch Breaker', (1 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>1 hour</b> earning <b>Idle</b> income across all of your businesses.'),
        new Award('it2', 'Eight Hours Rest', (8 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>8 hours</b> earning <b>Idle</b> income across all of your businesses.'),
        new Award('it3', 'The Keynesian Dream', (15 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>15 hours</b> earning <b>Idle</b> income across all of your businesses.'),
        new Award('it4', 'All In A Day\'s Work', (24 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>1 day</b> earning <b>Idle</b> income across all of your businesses.'),
        new Award('it5', 'Two-Day Weekend', (24 * 2 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>2 days</b> earning <b>Idle</b> income across all of your businesses.'),
        new Award('it6', 'Unlimited Vacation Days', (24 * 5 * hoursInMilliseconds), [], timeSpentIdleAllBusinesses, 'Spend a total of <b>5 days</b> earning <b>Idle</b> income across all of your businesses.'),

        new Award('ie1', 'Hands-Off', 1000000, ['idle1'], earnedWhileIdle), // 1 mil
        new Award('ie3', 'Born Leader', 1000000000, ['idle2'], earnedWhileIdle), // 1 bil
        new Award('ie5', 'Basically Lazy', 1000000000000, ['idle3'], earnedWhileIdle), // 1 tril
        new Award('ie7', 'Passive Observer', 1000000000000000, ['idle4'], earnedWhileIdle), // 1 quad
        new Award('ie9', 'The Means of Production', 1000000000000000000, ['idle5'], earnedWhileIdle), // 1 quint
        new Award('ie11', 'Variable Capitalizer', 1000000000000000000000, ['idle6'], earnedWhileIdle), // 1 sext
        new Award('ie13', 'Perpetual Motion Machine', 1000000000000000000000000, ['idle7'], earnedWhileIdle), // 1 sept
        new Award('ie15', 'Reverse Universal Heat Death', 1000000000000000000000000000, ['idle8'], earnedWhileIdle), // 1 oct

        new Award('ie2', 'Kicked Back', 1000000, ['away1'], earnedWhileAway, 'Earn a total of <b>$1 million</b> while away.'), // 1 mil
        new Award('ie4', 'Master Delegator', 1000000000, ['away2'], earnedWhileAway, 'Earn a total of <b>$1 billion</b> while away.'), // 1 bil
        new Award('ie6', 'The Idle Class', 1000000000000, ['away3'], earnedWhileAway, 'Earn a total of <b>$1 trillion</b> while away.'), // 1 tril
        new Award('ie8', 'Deadbeat Decision-Maker', 1000000000000000, ['away4'], earnedWhileAway, 'Earn a total of <b>$1 quadrillion</b> while away.'), // 1 quad
        new Award('ie10', 'Wealth Begets Wealth', 1000000000000000000, ['away5'], earnedWhileAway, 'Earn a total of <b>$1 quintillion</b> while away.'), // 1 quint
        new Award('ie12', 'The Mostly Invisible Hand', 1000000000000000000000, ['away6'], earnedWhileAway, 'Earn a total of <b>$1 sextillion</b> while away.'), // 1 sext
        new Award('ie14', 'Infinite Self-Replication', 1000000000000000000000000, ['away7'], earnedWhileAway, 'Earn a total of <b>$1 septillion</b> while away.'), // 1 sept

        /* Email Awards */
	    	
	    	new Award('numEmail1', 'Please Advise', 1, [], mailAnsweredAllTime, 'Answer your first <b>Email</b>.'),
	    	new Award('numEmail2', 'Best Regards', 100, [], mailAnsweredAllTime, 'Answer <b>100</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail3', 'Reaching Out', 250, [], mailAnsweredAllTime, 'Answer <b>250</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail4', 'Thanks in Advance', 1000, [], mailAnsweredAllTime, 'Answer <b>1,000</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail5', 'Touching Base', 2500, [], mailAnsweredAllTime, 'Answer <b>2,500</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail6', 'Circle Back', 5000, [], mailAnsweredAllTime, 'Answer <b>5,000</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail7', 'Loop Me In', 7500, [], mailAnsweredAllTime, 'Answer <b>7,500</b> total <b>Emails</b> across all of your businesses.'),
	    	new Award('numEmail8', 'Let\'s Take This Offline', 10000, [], mailAnsweredAllTime, 'Answer <b>10,000</b> total <b>Emails</b> across all of your businesses.'),

        new Award('exEm1', 'No Rush', 1000000000, ['exem1'], expiredEmailEarned), // 1 bil
        new Award('exEm2', 'Just Checking In...', 1000000000000, ['et1'], expiredEmailEarned), 
        new Award('exEm3', 'Any Update Here?', 1000000000000000, ['exem2'], expiredEmailEarned), // 1 quad
        new Award('exEm4', 'Haven\'t Heard Back...', 1000000000000000000, ['et2'], expiredEmailEarned), 
        new Award('exEm5', 'Please Answer, Please',  1000000000000000000000, ['exem3'], expiredEmailEarned), // 1 sext
        new Award('exEm6', 'Are You Getting These?', 1000000000000000000000000, ['et3'], expiredEmailEarned), // 1 sept
        new Award('exEm7', 'Screaming into the Void', 1000000000000000000000000000, ['exem4'], expiredEmailEarned), // 1 oct
        new Award('exEm8', 'Must Have Missed This', 1000000000000000000000000000000, ['et4'], expiredEmailEarned), // 1 non

        new Award('frEm1', 'Haver of Bandwidth', 1000000000, ['ef1'], freshEmailEarned), // 1 bil
        new Award('frEm2', 'On the Ball', 1000000000000, ['et5'], freshEmailEarned),
        new Award('frEm3', 'Lightning Reflexes', 1000000000000000, ['ef2'], freshEmailEarned), // 1 quad
        new Award('frEm4', 'Quickest Draw', 1000000000000000000, ['et6'], freshEmailEarned),
        new Award('frEm5', 'Ever Vigilant', 1000000000000000000000, ['ef3'], freshEmailEarned), // 1 sext
        new Award('frEm6', 'Highest-Strung', 1000000000000000000000000, ['et7'], freshEmailEarned), // 1 sept
        new Award('frEm7', 'Finger on the Button', 1000000000000000000000000000, ['ef4'], freshEmailEarned), // 1 oct
        new Award('frEm8', 'Ready to Strike', 1000000000000000000000000000000, ['et8'], freshEmailEarned), // 1 non

        new Award('eEm1', 'Lead Magnet', 1000000, ['eem1'], totalEarnedFromEmails),
        new Award('eEm2', 'Low-Hanging Fruitarian', 100000000, ['em1'], totalEarnedFromEmails), // 100 mil
        new Award('eEm3', 'Webinar Wizard', 1000000000, ['eem2'], totalEarnedFromEmails),
        new Award('eEm4', 'Customer Courtier', 100000000000, ['em2'], totalEarnedFromEmails), // 100 bil
        new Award('eEm5', 'Whitepaper Wunderkind', 1000000000000, ['eem3'], totalEarnedFromEmails), // tril
        new Award('eEm6', 'Greenfield Territorialist', 100000000000000, ['em3'], totalEarnedFromEmails), // 100 tril
        new Award('eEm7', 'LinkedIn Luminary', 1000000000000000, ['eem4'], totalEarnedFromEmails),
        new Award('eEm8', 'Fully Qualified Leader', 100000000000000000, ['em4'], totalEarnedFromEmails), // 100 quad
        new Award('eEm9', 'Market Penetrator', 1000000000000000000, ['eem5'], totalEarnedFromEmails), // quint
        new Award('eEm10', 'Pipeline Prophet', 100000000000000000000, ['em5'], totalEarnedFromEmails), // 100 quint
        new Award('eEm11', 'Always Been Closing', 1000000000000000000000, ['eem6'], totalEarnedFromEmails), // 1 sext
        new Award('eEm12', 'Champion of the Process', 100000000000000000000000, ['em6'], totalEarnedFromEmails), // 100 sext
        new Award('eEm13', 'Customer Relationship Master', 1000000000000000000000000, ['eem7'], totalEarnedFromEmails), // 1 sept
        new Award('eEm14', 'Imperial Lord of Leads', 100000000000000000000000000, ['em7'], totalEarnedFromEmails), // 100 sept
        new Award('eEm15', 'The Divine Right of Sales', 1000000000000000000000000000, ['eem8'], totalEarnedFromEmails), // 1 oct
        new Award('eEm16', 'The Odic Sales Force', 100000000000000000000000000000, ['em8'], totalEarnedFromEmails), // 100 oct
        new Award('eEm17', 'The Inbox of the Covenant', 1000000000000000000000000000000, ['eem9'], totalEarnedFromEmails), // 1 non
        new Award('eEm18', 'Where There\'s Leads, I Will Follow', 100000000000000000000000000000000, [], totalEarnedFromEmails), // 100 non
        new Award('eEm19', 'Salesman of the Epoch', 1000000000000000000000000000000000, [], totalEarnedFromEmails), // 1 dec
        new Award('eEm20', 'Fully Churned', 100000000000000000000000000000000000, [], totalEarnedFromEmails), // 100 dec
	    	
	    	new Award('words1', 'Functionally Literate', 500, [], wordsReplied, 'Feverishly type <b>500</b> smart words in the replies to your <b>Emails</b>.'),
	    	new Award('words2', 'Prolific Writer', 2500, [], wordsReplied, 'Feverishly type <b>2,500</b> smart words in the replies to your <b>Emails</b>.'),
	    	new Award('words3', 'Warrior Poet', 10000, [], wordsReplied, 'Feverishly type <b>10,000</b> smart words in the replies to your <b>Emails</b>.'),
        new Award('words4', 'Literary Giant', 25000, [], wordsReplied, 'Feverishly type <b>25,000</b> smart words in the replies to your <b>Emails</b>.'),
        new Award('words5', 'Bound in Blood', 50000, [], wordsReplied, 'Feverishly type <b>50,000</b> smart words in the replies to your <b>Emails</b>.'),
        new Award('words6', 'Mavis Beacon', 100000, [], wordsReplied, 'Feverishly type <b>100,000</b> smart words in the replies to your <b>Emails</b>.'),

        new ManualAward('etime1', 'Procrastinator', [], 'Answer an <b>Email</b> with <b>1</b> second remaining on the timer.'),
        new ManualAward('etime2', 'Prompt Responder', [], 'Answer an <b>Email</b> within <b>1</b> second of receiving it.'),

        new ManualAward('pl1', 'Very Polite', [], 'Use the sender\'s full name in your response to an email.'),
        new ManualAward('pl2', 'Very Rude', [], 'Say something very rude in a chat message.'),
        new ManualAward('pl3', 'Talk the Talk', [], 'Use at least <b>1</b> very meaningful business word in an email.'),
        new ManualAward('pl4', 'Lingoism', [], 'Use at least <b>5</b> different very meaningful business words in a single email.'),
        new ManualAward('pl5', 'How\'s That Boot Taste?', [], 'Utter the name of the acquisition\'s founder in a chat message.'),
        new ManualAward('pl6', 'Shop Talk', [], 'Mention at least one of the acquisition\'s products in a chat message.'),
        new ManualAward('pl7', 'Proactive Leadership', [], 'Prematurely request that your employees all be fired in a chat message.'),
        
        new ManualAward('markasread1', 'Spam Disposal', ['inbox1'], 'Mark at least <b>10 Emails</b> as read at once.'),
        new ManualAward('markasread2', 'Just Catching Up', ['inbox2'], 'Mark at least <b>25 Emails</b> as read at once.'),
        new ManualAward('markasread3', 'Sorry for the Delayed Response', [], 'Mark at least <b>50 Emails</b> as read at once.'), 
        
        new Award('sme1', 'On Call', 1000000000, ['smb1'], specialMailEarned),
        new Award('sme2', 'First Responder', 100000000000, ['smac1'], specialMailEarned), // 100 bil
        new Award('sme3', 'Putting Out Fires', 1000000000000, ['smb2'], specialMailEarned), // tril
        new Award('sme4', 'Restless Defender', 100000000000000, ['smac2'], specialMailEarned), // 100 tril
        new Award('sme5', 'Dynamic Problem Solver', 1000000000000000, ['smb3'], specialMailEarned),
        new Award('sme6', 'Emergency Prepared', 100000000000000000, ['smac3'], specialMailEarned), // 100 quad
        new Award('sme7', 'Disaster Reliever', 1000000000000000000, ['smb4'], specialMailEarned), // quint
        new Award('sme8', 'Mission Critical', 100000000000000000000, ['smac4'], specialMailEarned),
        new Award('sme9', 'Firehose Recipient', 1000000000000000000000, ['smb5'], specialMailEarned), // 1 sext
        new Award('sme10', 'Struggling Insomniac', 100000000000000000000000, ['smac5'], specialMailEarned), // 100 sext
        new Award('sme11', 'Bloodshot & Shaking', 1000000000000000000000000, ['smb6'], specialMailEarned), // 1 sept
        new Award('sme12', 'Broken Spirit', 100000000000000000000000000, ['smac6'], specialMailEarned), // 100 sept
        new Award('sme13', 'Staring Dead-Eyed at the Inbox', 1000000000000000000000000000, ['smb7'], specialMailEarned), // 1 oct
        
        new Award('sma1', 'Get Back to Me by EOD', 1, [], specialMailAnsweredAllTime, 'Answer your first <b>Urgent Email</b>.'), 
        new Award('sma2', 'Please Respond ASAP', 25, [], specialMailAnsweredAllTime, 'Answer <b>25</b> total <b>Urgent Emails</b> across all of your businesses.'), 
        new Award('sma3', 'You Have to Expedite This', 100, [], specialMailAnsweredAllTime, 'Answer <b>100</b> total <b>Urgent Emails</b> across all of your businesses.'), 
        new Award('sma4', 'I Need it Yesterday', 250, [], specialMailAnsweredAllTime, 'Answer <b>250</b> total <b>Urgent Emails</b> across all of your businesses.'), 
        new Award('sma5', 'Everything is a Priority', 500, [], specialMailAnsweredAllTime, 'Answer <b>500</b> total <b>Urgent Emails</b> across all of your businesses.'), 
	    	
        /* Investment Awards */

    	new Award('invest1', 'Dabbler', 1, [], completedInvestments, 'Cash out your first <b>Investment</b>.'),
    	new Award('invest2', 'Diversified', (25 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>25 hours</b> in <b>Investments</b> across all of your businesses.'),
    	new Award('invest3', 'Angel Investor', (100 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>100 hours</b> in <b>Investments</b> across all of your businesses.'),
      new Award('invest4', 'Venture Capitalist', (250 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>250 hours</b> in <b>Investments</b> across all of your businesses.'),
    	new Award('invest5', 'Elephant Hunter', (500 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>500 hours</b> in <b>Investments</b> across all of your businesses.'),
      new Award('invest6', 'Master Financier', (1000 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>1,000 hours</b> in <b>Investments</b> across all of your businesses.'),
      new Award('invest7', 'The Central Bank', (2000 * hoursInMilliseconds), [], timeInvestedAllTime, 'Cash out a total of <b>2,000 hours</b> in <b>Investments</b> across all of your businesses.'),

      new Award('sInv1', 'Scalper', 1000000000, ['sb1'], earnedFromShortInvestments), // 1 bil
      new Award('sInv2', 'Day Trader', 1000000000000000, ['sb2'], earnedFromShortInvestments), // 1 quad
      new Award('sInv3', 'Rapid Fire Speculator', 1000000000000000000000, ['sb3'], earnedFromShortInvestments), // 1 sext

      new Award('lInv1', 'Set It and Forget It', 1000000000000, ['tb1'], earnedFromLongInvestments), // 1 tril
      new Award('lInv2', 'Playing the Long Game', 1000000000000000000, ['tb2'], earnedFromLongInvestments), // 1 quint
      new Award('lInv3', 'Until the End of Time', 1000000000000000000000000, ['tb3'], earnedFromLongInvestments), // 1 sept

      new ManualAward('itime1', 'Premature', [], 'Cash out an <b>Investment</b> that had only brewed for <b>1 minute</b>.'),
      new ManualAward('itime2', 'Tactical Trading', [], 'Cash out an <b>Investment</b> that had stewed for at least <b>1 full hour</b>.'),
      new ManualAward('itime3', 'A Fair Day\'s Wage', [], 'Cash out an <b>Investment</b> that had fermented for <b>1 full day</b>.'),
    	
      new Award('eInvest1', 'Always Bullish', 1000000000, ['ir1'], earnedFromInvestments, 'Milk a total of <b>$1 billion</b> in earnings from <b>Investments</b>.'), // 1 bil
      new Award('eInvest2', 'Chasing Returns', 100000000000, ['ia1'], earnedFromInvestments, 'Milk a total of <b>$100 billion</b> in earnings from <b>Investments</b>.'), // 100 bil
      new Award('eInvest3', 'A Leg Up on the Pile', 1000000000000, ['ir2'], earnedFromInvestments, 'Milk a total of <b>$1 trillion</b> in earnings from <b>Investments</b>.'), // 1 tril
      new Award('eInvest4', 'Penny Stock Pro', 100000000000000, ['ia2'], earnedFromInvestments, 'Milk a total of <b>$100 trillion</b> in earnings from <b>Investments</b>.'), 
      new Award('eInvest5', 'Maximized Leverager', 1000000000000000, ['ir3'], earnedFromInvestments, 'Milk a total of <b>$1 quadrillion</b> in earnings from <b>Investments</b>.'), // 1 quad
      new Award('eInvest6', 'Blue Chip Bigwig', 100000000000000000, ['ia3'], earnedFromInvestments, 'Milk a total of <b>$100 quadrillion</b> in earnings from <b>Investments</b>.'), 
      new Award('eInvest7', 'Sick Capital Gains', 1000000000000000000, ['ir4'], earnedFromInvestments, 'Milk a total of <b>$1 quintillion</b> in earnings from <b>Investments</b>.'), // 1 quint
      new Award('eInvest8', 'Dividend Destroyer', 100000000000000000000, ['ia4'], earnedFromInvestments, 'Milk a total of <b>$100 quintillion</b> in earnings from <b>Investments</b>.'),
      new Award('eInvest9', 'Ear to Ear, Baby', 1000000000000000000000, ['ir5'], earnedFromInvestments, 'Milk a total of <b>$1 sextillion</b> in earnings from <b>Investments</b>.'), // 1 sext
      new Award('eInvest10', 'Master of Margins', 100000000000000000000000, [], earnedFromInvestments, 'Milk a total of <b>$100 sextillion</b> in earnings from <b>Investments</b>.'), // 100 sext
      new Award('eInvest11', 'Currency Manipulator', 1000000000000000000000000, ['ir6'], earnedFromInvestments, 'Milk a total of <b>$1 septillion</b> in earnings from <b>Investments</b>.'), // 1 sept
      new Award('eInvest12', 'The World Banker', 100000000000000000000000000, [], earnedFromInvestments, 'Milk a total of <b>$100 septillion</b> in earnings from <b>Investments</b>.'), // 100 sept
      new Award('eInvest13', 'Broker of Mammon', 1000000000000000000000000000, ['ir7'], earnedFromInvestments, 'Milk a total of <b>$1 octillion</b> in earnings from <b>Investments</b>.'), // 1 oct
      new Award('eInvest14', 'No Limits to Growth', 100000000000000000000000000000, [], earnedFromInvestments, 'Milk a total of <b>$100 octillion</b> in earnings from <b>Investments</b>.'), // 100 oct
      new Award('eInvest15', 'Brownian Ratcheter', 1000000000000000000000000000000, ['ir8'], earnedFromInvestments, 'Milk a total of <b>$1 nonillion</b> in earnings from <b>Investments</b>.'), // 1 non
      new Award('eInvest16', 'Infinite Returns', 100000000000000000000000000000000, [], earnedFromInvestments, 'Milk a total of <b>$100 nonillion</b> in earnings from <b>Investments</b>.'), // 100 non
      new Award('eInvest17', 'Maximum Alpha', 1000000000000000000000000000000000, ['ir9'], earnedFromInvestments, 'Milk a total of <b>$1 decillion</b> in earnings from <b>Investments</b>.'), // 1 dec
      new Award('eInvest18', 'Rated by the Morning Star', 100000000000000000000000000000000000, [], earnedFromInvestments, 'Milk a total of <b>$100 decillion</b> in earnings from <b>Investments</b>.'), // 100 dec

      new Award('q1', 'Winners Never Quit', 1, [], canceledInvestments, 'Cancel an <b>Investment</b> before it has matured.'),
      new Award('q2', 'Quitters Never Win', 10, [], canceledInvestments, 'Cancel <b>10 Investments</b> before they have matured.'),

      /* RESEARCH AWARDS */

      new Award('res1', 'Initial Patent Offering', 1, [], patentsSold, 'Sell a <b>Patent</b> for the first time.'),
      new Award('res2', 'More of an Ideas Person', 100, [], patentsSold, 'Sell <b>100 Patents</b> across all of your businesses.'),
      new Award('res3', 'Churning Out Innovation', 250, [], patentsSold, 'Sell <b>250 Patents</b> across all of your businesses.'),
      new Award('res4', 'Le Epic Bacon Genius', 1000, [], patentsSold, 'Sell <b>1,000 Patents</b> across all of your businesses.'),
      new Award('res5', 'Rearden Metallic', 2500, [], patentsSold, 'Sell <b>2,500 Patents</b> across all of your businesses.'),
      new Award('res6', '1% Inspiration', 5000, [], patentsSold, 'Sell <b>5,000 Patents</b> across all of your businesses.'),
      new Award('res7', 'The Man Who Thought Different', 10000, [], patentsSold, 'Sell <b>10,000 Patents</b> across all of your businesses.'),
      new Award('res8', 'Edisonian', 25000, [], patentsSold, 'Sell <b>25,000 Patents</b> across all of your businesses.'),
      new Award('res9', 'The Wind of Change', 50000, [], patentsSold, 'Sell <b>50,000 Patents</b> across all of your businesses.'),
      new Award('res10', 'Reinventer of Wheels', 100000, [], patentsSold, 'Sell <b>100,000 Patents</b> across all of your businesses.'),

      new Award('dead', 'OSHA Doesn\'t Need to Know', 1, [], employeesKilled, 'Discover that <b>1</b> of your employees couldn\'t handle hard work.'),
      new Award('dead2', 'Acceptable Losses', 10, [], employeesKilled, 'Discover that <b>10</b> of your employees couldn\'t handle hard work.'),

      new Award('rese1', 'Blue-Sky Thinker', 1000000000000, ['risk1'], earnedFromResearch, 'Haul a total of <b>$1 trillion</b> in earnings from <b>Research</b>.'), // 1 tril
      new Award('rese2', 'Finger on the Pulse', 100000000000000, ['rd1'], earnedFromResearch, 'Haul a total of <b>$100 trillion</b> in earnings from <b>Research</b>.'), 
      new Award('rese3', 'Bizmeth Artisan', 1000000000000000, ['risk2'], earnedFromResearch, 'Haul a total of <b>$1 quadrillion</b> in earnings from <b>Research</b>.'), // 1 quad
      new Award('rese4', 'Focus Group Fanatic', 100000000000000000, ['rd2'], earnedFromResearch, 'Haul a total of <b>$100 quadrillion</b> in earnings from <b>Research</b>.'), 
      new Award('rese5', 'User Storyteller', 1000000000000000000, ['risk3'], earnedFromResearch, 'Haul a total of <b>$1 quintillion</b> in earnings from <b>Research</b>.'), // 1 quint
      new Award('rese6', 'Big-Game Coolhunter', 100000000000000000000, ['rd3'], earnedFromResearch, 'Haul a total of <b>$100 quintillion</b> in earnings from <b>Research</b>.'),
      new Award('rese7', 'Blue Ocean Strategist', 1000000000000000000000, ['risk4'], earnedFromResearch, 'Haul a total of <b>$1 sextillion</b> in earnings from <b>Research</b>.'), // 1 sext
      new Award('rese8', 'Market Diviner', 100000000000000000000000, ['rd4'], earnedFromResearch, 'Haul a total of <b>$100 sextillion</b> in earnings from <b>Research</b>.'), // 100 sext
      new Award('rese9', 'Harbinger of Trends', 1000000000000000000000000, ['risk5'], earnedFromResearch, 'Haul a total of <b>$1 septillion</b> in earnings from <b>Research</b>.'), // 1 sept
      new Award('rese10', 'Militarized Market Surveyor', 100000000000000000000000000, ['rd5'], earnedFromResearch, 'Haul a total of <b>$100 septillion</b> in earnings from <b>Research</b>.'), // 100 sept
      new Award('rese11', 'Business Omniscient', 1000000000000000000000000000, ['risk6'], earnedFromResearch, 'Haul a total of <b>$1 octillion</b> in earnings from <b>Research</b>.'), // 1 oct
      new Award('rese12', 'The Eye of Market Providence', 100000000000000000000000000000, ['rd6'], earnedFromResearch, 'Haul a total of <b>$100 octillion</b> in earnings from <b>Research</b>.'), // 100 oct
      new Award('rese13', 'Trend Predestination', 1000000000000000000000000000000, ['risk7'], earnedFromResearch, 'Haul a total of <b>$1 nonillion</b> in earnings from <b>Research</b>.'), // 1 nonillion
      new Award('rese14', 'Ahead of All Curves', 100000000000000000000000000000000, ['rd7'], earnedFromResearch, 'Haul a total of <b>$100 nonillion</b> in earnings from <b>Research</b>.'), // 100 nonillion
      new Award('rese15', 'Early Editioner', 1000000000000000000000000000000000, ['risk8'], earnedFromResearch, 'Haul a total of <b>$1 decillion</b> in earnings from <b>Research</b>.'), // 1 decillin
      new Award('rese16', 'Keeper of Secret Knowledge', 100000000000000000000000000000000000, [], earnedFromResearch, 'Haul a total of <b>$100 decillion</b> in earnings from <b>Research</b>.'), // 100 dec

      new ManualAward('resMan', 'Hoarder', [], 'Keep at least <b>10 Patents</b> in storage at one time.'),

      new ManualAward('rSpd1', 'Rapid Ideation', ['spd1'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>100%</b>'),
      new ManualAward('rSpd2', 'Cyclonic Brainstormer', ['spd2'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>200%</b>'),
      new ManualAward('rSpd3', 'The Wild Black Yonder ', ['spd3'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>400%</b>'),
      new ManualAward('rSpd4', 'Superluminal Thinker', ['spd4'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>600%</b>'),
      new ManualAward('rSpd5', 'Failing Fast', ['spd5'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>800%</b>'),
      new ManualAward('rSpd6', 'The Spirit of America', ['spd6'], 'Sell or store a <b>Patent</b> with a <b>Speed Boost</b> of at least <b>1,000%</b>'),

      new ManualAward('rVal1', 'Prime Deliverable', ['val1'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>100%</b>'),
      new ManualAward('rVal2', 'Supplied & Demanded', ['val2'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>200%</b>'),
      new ManualAward('rVal3', 'Best of Breed', ['val3'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>400%</b>'),
      new ManualAward('rVal4', 'Most Valuable Patent', ['val4'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>600%</b>'),
      new ManualAward('rVal5', 'Million Dollar Idea', ['val5'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>800%</b>'),
      new ManualAward('rVal6', 'The Tavernier Blue', ['val6'], 'Sell or store a <b>Patent</b> with a <b>Value Boost</b> of at least <b>1,000%</b>'),

      /* ACQUISITION AWARDS */

      new Award('aq1', 'Trimming the Fat', 1000000000000000000000, ['ace1'], earnedFromAcquisitions, 'Scrape a total of <b>$1 sextillion</b> in earnings from <b>Acquisitions</b>.'),
      new Award('aq2', 'Professional Liquidator', 10000000000000000000000, ['ace2', 'exec1'], earnedFromAcquisitions, 'Scrape a total of <b>$10 sextillion</b> in earnings from <b>Acquisitions</b>.'), 
      new Award('aq3', 'Everything Must Go', 100000000000000000000000, ['ace3'], earnedFromAcquisitions, 'Scrape a total of <b>$100 sextillion</b> in earnings from <b>Acquisitions</b>.'), 
      new Award('aq4', 'Fire Sale Afficionado', 1000000000000000000000000, ['ace4', 'exec2'], earnedFromAcquisitions, 'Scrape a total of <b>$1 septillion</b> in earnings from <b>Acquisitions</b>.'), 
      new Award('aq5', 'Leave No Trace', 10000000000000000000000000, ['ace5'], earnedFromAcquisitions, 'Scrape a total of <b>$10 septillion</b> in earnings from <b>Acquisitions</b>.'),
      new Award('aq6', 'Nothing on the Inside', 100000000000000000000000000, ['ace6', 'exec3'], earnedFromAcquisitions, 'Scrape a total of <b>$100 septillion</b> in earnings from <b>Acquisitions</b>.'),
      new Award('aq7', 'Universal Acquisition', 1000000000000000000000000000, ['ace7'], earnedFromAcquisitions, 'Scrape a total of <b>$1 octillion</b> in earnings from <b>Acquisitions</b>.'),
      new Award('aq8', 'The Giant Void', 100000000000000000000000000000, ['ace8', 'exec4'], earnedFromAcquisitions, 'Scrape a total of <b>$100 octillion</b> in earnings from <b>Acquisitions</b>.'),  
      new Award('aq9', '100% Unemployment', 1000000000000000000000000000000, [], earnedFromAcquisitions, 'Scrape a total of <b>$1 nonillion</b> in earnings from <b>Acquisitions</b>.'), 
      new Award('aq10', 'Fully Optimized Workforce', 100000000000000000000000000000000, ['ace9'], earnedFromAcquisitions, 'Scrape a total of <b>$100 nonillion</b> in earnings from <b>Acquisitions</b>.'), // 100 non
      new Award('aq11', 'Today\'s Companies, Tomorrow\'s Ashes', 1000000000000000000000000000000000, [], earnedFromAcquisitions, 'Scrape a total of <b>$1 decillion</b> in earnings from <b>Acquisitions</b>.'), // 1 dec
      new Award('aq11', 'The Elephant\'s Graveyard', 100000000000000000000000000000000000, [], earnedFromAcquisitions, 'Scrape a total of <b>$100 decillion</b> in earnings from <b>Acquisitions</b>.'), // 100 dec

      new ManualAward('aqw1', 'Temporarily Embarrassed Millionaires', ['acw1'], 'Hire <b>10</b> total <b>Personal Assistants</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw2', 'Personnel Realignment Specialists', ['acw2'], 'Hire <b>10</b> total <b>Financial Consultants</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw3', 'The Freddie Mac Award for Ethics', ['acw3'], 'Hire <b>10</b> total <b>Independent Auditors</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw4', 'The Protectors of Our Industries', ['acw4'], 'Hire <b>10</b> total <b>Executive Financiers</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw5', 'Falsely Conscious', ['acw5'], 'Hire <b>20</b> total <b>Personal Assistants</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw6', 'For A Goddamn Percentage', ['acw6'], 'Hire <b>20</b> total <b>Financial Consultants</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw7', 'Just Enough Cooks', ['acw7'], 'Hire <b>20</b> total <b>Independent Auditors</b> in a single <b>Acquisition</b>.'),
      new ManualAward('aqw8', 'Company Cultural Hegemony', ['acw8'], 'Hire <b>20</b> total <b>Executive Financiers</b> in a single <b>Acquisition</b>.'),

      new ManualAward('aqs1', 'Now, Hold On, Mr. Potter', [], 'Sell a fully smartsized <b>Acquisition</b> of no more than <b>10,000</b> employees.'),
      new ManualAward('aqs2', 'Behold Now Behemoth', [], 'Sell a fully smartsized <b>Acquisition</b> with at least <b>1 million</b> employees.'),

      new ManualAward('loss1', 'Loss Leader', [], 'Sell an <b>Acquisition</b> for less than your initial <b>Investment</b> was worth.'),

      new Award('ch1', 'Quick Question...', 1, [], chatsCompleted, 'Complete a <b>Chat</b> in an <b>Acquisition</b> for the first time.'),
      new Award('ch2', 'All Talk and Some Action', 10, [], chatsCompleted, 'Complete <b>Chats</b> at least <b>10</b> times across all businesses.'),
      new Award('ch3', 'Logorrheic Professionalism', 50, [], chatsCompleted, 'Complete <b>Chats</b> at least <b>50</b> times across all businesses.'),
      new Award('ch4', '¯\\_(ツ)_/¯', 100, [], chatsCompleted, 'Complete <b>Chats</b> at least <b>100</b> times across all businesses.'),

      new ManualAward('chat1', 'Several People Are Typing', [], 'Have <b>8</b> concurrent <b>Chats</b> filling your chat box.'),

      new Award('chw1', 'Social Butterfly', 100, [], wordsChatted, 'Devote at least <b>100 words</b> to your various <b>Chats</b>.'),
      new Award('chw2', 'The Office Gossip', 1000, [], wordsChatted, 'Devote at least <b>1,000 words</b> to your various <b>Chats</b>.'),

      new ManualAward('policy1', 'Rapid Innovation', [], 'Accept <b>10</b> total <b>New Policies</b> at the same time.'),

      new Award('pa1', 'Under New Management', 1, [], policiesAccepted, 'Accept your first <b>New Policy</b> in an <b>Acquisition</b>'),
      new Award('pa2', 'Making Some Big Changes', 25, [], policiesAccepted, 'Accept <b>25</b> total <b>New Policies</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('pa3', 'A New Sheriff In Town', 100, [], policiesAccepted, 'Accept <b>100</b> total <b>New Policies</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('pa4', 'Not Here To Make Friends', 250, [], policiesAccepted, 'Accept <b>250</b> total <b>New Policies</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('pa5', 'This is a Business', 500, [], policiesAccepted, 'Accept <b>500</b> total <b>New Policies</b> in <b>Acquisitions</b> across all of your businesses.'),

      new Award('lc1', 'Synergy-Related Adjustments', 1, [], layoffsConducted, 'Conduct your first <b>Massive Layoff</b> in an <b>Acquisition</b>.'),
      new Award('lc2', 'Realignment of Growth Opportunities', 25, [], layoffsConducted, 'Conduct <b>25</b> total <b>Massive Layoffs</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('lc3', 'Total Organizational Streamlining', 100, [], layoffsConducted, 'Conduct <b>100</b> total <b>Massive Layoffs</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('lc4', 'Maximization of Throughput', 250, [], layoffsConducted, 'Conduct <b>250</b> total <b>Massive Layoffs</b> in <b>Acquisitions</b> across all of your businesses.'),
      new Award('lc5', 'This Time, It\'s Personnel', 500, [], layoffsConducted, 'Conduct <b>500</b> total <b>Massive Layoffs</b> in <b>Acquisitions</b> across all of your businesses.'),

      new Award('fn1', 'Must Have Missed a Decimal Point', 1, [], fudgedNumberSessions, 'Brazenly <b>Fudge the Numbers</b> in an <b>Acquisition</b> for the first time.'),
      new Award('fn2', 'Cooker of Books', 10, [], fudgedNumberSessions, 'Brazenly <b>Fudge the Numbers</b> a total of <b>10</b> times across all businesses.'),
      new Award('fn3', 'Tobashi Schemer', 50, [], fudgedNumberSessions, 'Brazenly <b>Fudge the Numbers</b> a total of <b>50</b> times across all businesses.'),
      new Award('fn4', 'The Telecom Cowboy', 100, [], fudgedNumberSessions, 'Brazenly <b>Fudge the Numbers</b> a total of <b>100</b> times across all businesses.'),
      new Award('fn5', 'But Failure is Not a Crime', 250, [], fudgedNumberSessions, 'Brazenly <b>Fudge the Numbers</b> a total of <b>250</b> times across all businesses.'),

      /* ELECTION AWARDS */

      new Award('el0', 'Cronyist', 10000000000000000000000000, ['dt1'], earnedFromElections, 'Receive <b>$10 septillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el1', 'Greased Palms', 100000000000000000000000000, ['elu0', 'strk1'], earnedFromElections, 'Receive <b>$100 septillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el2', 'Pay to Play', 1000000000000000000000000000, ['elu1'], earnedFromElections, 'Receive <b>$1 octillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el3', 'Influence Peddler', 10000000000000000000000000000, ['dt2', 'strk2'], earnedFromElections, 'Receive <b>$10 octillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el4', 'Quid Pro Quo', 100000000000000000000000000000, ['elu2'], earnedFromElections, 'Receive <b>$100 octillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el5', 'Mr. Ten Percent', 1000000000000000000000000000000, ['elu3', 'strk3'], earnedFromElections, 'Receive <b>$1 nonillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el6', 'Boss Tweed', 10000000000000000000000000000000, ['dt3'], earnedFromElections, 'Receive <b>$10 nonillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el7', 'Tangentopoli', 100000000000000000000000000000000, ['elu4', 'strk4'], earnedFromElections, 'Receive <b>$100 nonillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el8', 'The Golden Goose', 1000000000000000000000000000000000, ['elu5'], earnedFromElections, 'Receive <b>$1 decillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el9', 'Raubwirtschaft', 10000000000000000000000000000000000, ['dt4', 'strk5'], earnedFromElections, 'Receive <b>$10 decillion</b> in kickbacks from <b>Elections</b>.'),
      new Award('el10', 'Friends in High Places', 100000000000000000000000000000000000, [], earnedFromElections, 'Receive <b>$100 decillion</b> in kickbacks from <b>Elections</b>.'),

      new Award('gf1', 'Accident-Prone', 1, [], gaffesExperienced, 'Witness your chosen <b>Election</b> candidate engage in a <b>gaffe</b>.'),
      new Award('gf2', 'I\'m Nothing You\'ve Heard', 100, [], gaffesExperienced, 'Witness your chosen <b>Election</b> candidates engage in <b>100 gaffes</b>.'),
      new Award('gf3', 'We Were Wrong, Terribly Wrong', 1000, [], gaffesExperienced, 'Witness your chosen <b>Election</b> candidates engage in <b>1,000 gaffes</b>.'),
      new Award('gf4', 'Tis Done and Cannot Be Revok\'d', 5000, [], gaffesExperienced, 'Witness your chosen <b>Election</b> candidates engage in <b>5,000 gaffes</b>.'),
      new Award('gf5', 'Mistakes Were Made', 10000, [], gaffesExperienced, 'Witness your chosen <b>Election</b> candidates engage in <b>10,000 gaffes</b>.'),

      new Award('don01', 'Gift Horse', 1000000000000000000000000, ['gaf0'], donatedToCandidates, 'Donate <b>$1 septillion</b> to <b>Election</b> candidates.'),
      new Award('don02', 'Hard Money', 100000000000000000000000000, ['pr0'], donatedToCandidates, 'Donate <b>$100 septillion</b> to <b>Election</b> candidates.'),
      new Award('don2', 'Campaign Financier', 1000000000000000000000000000, ['gaf1', 'elem1'], donatedToCandidates, 'Donate <b>$1 octillion</b> to <b>Election</b> candidates.'),
      new Award('don3', 'Philanthropist', 100000000000000000000000000000, ['pr1'], donatedToCandidates, 'Donate <b>$100 octillion</b> to <b>Election</b> candidates.'),
      new Award('don4', 'One-Man Super PAC', 1000000000000000000000000000000, ['gaf2'], donatedToCandidates, 'Donate <b>$1 nonillion</b> to <b>Election</b> candidates.'),
      new Award('don5', 'Sow Generously, Reap Generously', 100000000000000000000000000000000, ['pr2'], donatedToCandidates, 'Donate <b>$100 nonillion</b> to <b>Election</b> candidates.'),
      new Award('don6', 'Maximum Individual Contribution', 1000000000000000000000000000000000, ['gaf3'], donatedToCandidates, 'Donate <b>$1 decillion</b> to <b>Election</b> candidates.'),

      new Award('wel1', 'Four More Years', 1, [], electionsWon, 'Win your first <b>Election</b>.'),
      new Award('wel2', 'A Stunning Upset', 100, [], electionsWon, 'Win <b>100</b> total <b>Elections</b>.'),
      new Award('wel3', 'One-Party State', 1000, [], electionsWon, 'Win <b>1,000</b> total <b>Elections</b>.'),

      new Award('lel1', 'What Happened', 1, [], electionsLost, 'Lose your first <b>Election</b>.'),
      new Award('lel2', 'Loser Makes Good', 100, [], electionsLost, 'Lose <b>100</b> total <b>Elections</b>.'),
      new Award('lel3', 'May God Bless His Stewardship', 500, [], electionsLost, 'Lose <b>500</b> total <b>Elections</b>.'),

      new ManualAward('welp1', 'Dewey Defeats Truman', [], 'Win an <b>Election</b> while polling under <b>50%</b>.'),
      new ManualAward('welp2', 'No Recount Needed', [], 'Win an <b>Election</b> while polling at <b>100%</b>.'),
      new ManualAward('don1', 'Wise Investment', [], 'Donate more cash in an <b>Election</b> than you end up earning.'),
      new ManualAward('elbio', 'Would You Like to Know More?', [], 'Read the full bio of one of your candidates.'),
      new ManualAward('suff1', 'Peak Electability', [], 'Win an <b>Election</b> without making any donations.'),

      /* OUTGOING EMAIL AWARDS */

      new Award('oI1', 'Attentive Executive', (1 * hoursInMilliseconds), ['ouI1'], investmentTimeBoosted, 'Inspire <b>1 hour</b> of extra output from your <b>Investments</b> department.'),
      new Award('oI2', 'Hawthorne Effective', (10 * hoursInMilliseconds), ['ouI2'], investmentTimeBoosted, 'Inspire <b>10 hours</b> of extra output from your <b>Investments</b> department.'),
      new Award('oI3', 'Surveillance Capitalist', (25 * hoursInMilliseconds), ['ouI3'], investmentTimeBoosted, 'Inspire <b>25 hours</b> of extra output from your <b>Investments</b> department.'),
      new Award('oI4', 'The Lidless Eye', (50 * hoursInMilliseconds), ['ouI4'], investmentTimeBoosted, 'Inspire <b>50 hours</b> of extra output from your <b>Investments</b> department.'),
      new Award('oI5', 'The Great Motivator', (100 * hoursInMilliseconds), ['ouI5'], investmentTimeBoosted, 'Inspire <b>100 hours</b> of extra output from your <b>Investments</b> department.'),

      new Award('oR1', 'Above and Beyond', (1 * hoursInMilliseconds), ['ouR1'], researchTimeBoosted, 'Persuade your <b>R&D</b> department to muster <b>1 hour</b> of extra productivity.'),
      new Award('oR2', 'Giver of 110%', (10 * hoursInMilliseconds), ['ouR2'], researchTimeBoosted, 'Persuade your <b>R&D</b> department to muster <b>10 hours</b> of extra productivity.'),
      new Award('oR3', 'Real Artists Ship', (25 * hoursInMilliseconds), ['ouR3'], researchTimeBoosted, 'Persuade your <b>R&D</b> department to muster <b>25 hours</b> of extra productivity.'),
      new Award('oR4', 'Work Harder, Not Smarter', (50 * hoursInMilliseconds), ['ouR4'], researchTimeBoosted, 'Persuade your <b>R&D</b> department to muster <b>50 hours</b> of extra productivity.'),
      new Award('oR5', 'In Search of Excellence', (100 * hoursInMilliseconds), ['ouR5'], researchTimeBoosted, 'Persuade your <b>R&D</b> department to muster <b>100 hours</b> of extra productivity.'),

      new Award('oA1', 'An Eye for Efficiency', (1 * hoursInMilliseconds), ['ouA1'], acquisitionTimeBoosted, 'Assist your <b>Acquisitions</b> department in managing <b>1 hour</b> of additional firings.'),
      new Award('oA2', 'Ruthless Streamliner', (10 * hoursInMilliseconds), ['ouA2'], acquisitionTimeBoosted, 'Assist your <b>Acquisitions</b> department in managing <b>10 hours</b> of additional firings.'),
      new Award('oA3', 'Waste Manager', (25 * hoursInMilliseconds), ['ouA3'], acquisitionTimeBoosted, 'Assist your <b>Acquisitions</b> department in managing <b>25 hours</b> of additional firings.'),
      new Award('oA4', 'Minimum Viable Personnel', (50 * hoursInMilliseconds), ['ouA4'], acquisitionTimeBoosted, 'Assist your <b>Acquisitions</b> department in managing <b>50 hours</b> of additional firings.'),
      new Award('oA5', 'The Leanest Methodology', (100 * hoursInMilliseconds), ['ouA5'], acquisitionTimeBoosted, 'Assist your <b>Acquisitions</b> department in managing <b>100 hours</b> of additional firings.'),

      new Award('oT1', 'So Thoughtful', (1 * hoursInMilliseconds), ['ouT1'], trainingTimeBoosted, 'Encourage your <b>Career Development</b> department to cultivate <b>1 hour</b> of extra productivity.'), 
      new Award('oT2', 'Mission Stater', (10 * hoursInMilliseconds), ['ouT2'], trainingTimeBoosted, 'Encourage your <b>Career Development</b> department to cultivate <b>10 hours</b> of extra productivity.'),
      new Award('oT3', 'Culture Cultivator', (25 * hoursInMilliseconds), ['ouT3'], trainingTimeBoosted, 'Encourage your <b>Career Development</b> department to cultivate <b>25 hours</b> of extra productivity.'),
      new Award('oT4', 'Personenkultus', (50 * hoursInMilliseconds), ['ouT4'], trainingTimeBoosted, 'Encourage your <b>Career Development</b> department to cultivate <b>50 hours</b> of extra productivity.'),
      new Award('oT5', 'The Eternal Leader', (100 * hoursInMilliseconds), ['ouT5'], trainingTimeBoosted, 'Encourage your <b>Career Development</b> department to cultivate <b>100 hours</b> of extra productivity.'),

      new Award('str1', 'Caretaker', 1, ['stb1'], stressReduced, 'Email <b>Human Resources</b> to reduce your employees\' <b>Stress Level</b> by a total of <b>1%</b>.'),
      new Award('str2', 'Interpersonally Skilled', 10, ['stb2'], stressReduced, 'Email <b>Human Resources</b> to reduce your employees\' <b>Stress Level</b> by a total of <b>10%</b>.'),
      new Award('str3', 'Corporate Empath', 50, ['stb3'], stressReduced, 'Email <b>Human Resources</b> to reduce your employees\' <b>Stress Level</b> by a total of <b>50%</b>.'),
      new Award('str4', 'I Am the Bread of Life', 100, ['stb4'], stressReduced, 'Email <b>Human Resources</b> to reduce your employees\' <b>Stress Level</b> by a total of <b>100%</b>.'),

      new ManualAward('out1', 'The Daemon Awakens', [], 'Have one of your outgoing emails bounce back.'),

      new Award('out2', 'Wordsmith', 1, [], outgoingEmails, 'Write your first <b>Outgoing Email</b>.'),
      new Award('out3', 'Content Creator', 25, [], outgoingEmails, 'Write <b>25</b> total <b>Outgoing Emails</b> across all businesses.'),
      new Award('out4', 'Digital Storyteller', 100, [], outgoingEmails, 'Write <b>100</b> total <b>Outgoing Emails</b> across all businesses.'),
      new Award('out5', 'The Great Communicator', 250, [], outgoingEmails, 'Write <b>250</b> total <b>Outgoing Emails</b> across all businesses.'),
      new Award('out6', 'From Your Keyboard to God\'s Ear', 500, [], outgoingEmails, 'Write <b>500</b> total <b>Outgoing Emails</b> across all businesses.'),
      new Award('out7', 'Maestro Lettera', 1000, [], outgoingEmails, 'Write <b>1,000</b> total <b>Outgoing Emails</b> across all businesses.'),

      new ManualAward('out7-5', 'Ascendant Nurturer', [], 'Reference one of your <b>Active Investments</b> in an <b>Outgoing Email</b> to the <b>Investments</b> department.'),
      new ManualAward('out8', 'Vigilant Prodder', [], 'Reference the current product being <b>Researched</b> in an <b>Outgoing Email</b> to the <b>R&D</b> department.'),
      new ManualAward('out9', 'Can I Speak to the Manager?', [], 'Address the founder of your current <b>Acquisition</b> directly in an <b>Outgoing Email</b> to the <b>Acquisitions</b> department.'),
      new ManualAward('out10', 'Tactical Flanking', [], 'Address an <b>Outgoing Email</b> to somebody currently active in your <b>Acquisition Chat</b>.'),
      new ManualAward('out11', 'Who Cares?', [], 'Send a blank <b>Outgoing Email</b> to any department.'), 

      /* BANKRUPTCY AWARDS */

      new ManualAward('nm', 'My Name is My Name', [], 'Name your business for the first time.'),

    	new Award('b1', 'I Declare... Bankruptcy!', 1, [], bankruptcies, 'Declare <b>Bankruptcy</b> for the first time.'),
      new Award('b2', 'Back for More', 2, [], bankruptcies, 'Declare <b>Bankruptcy</b> for the second time.'),
      new Award('b3', 'Serial Entrepeneur', 5, [], bankruptcies, 'Declare <b>Bankruptcy</b> for the fifth time.'),
    	new Award('b4', 'Eternal Recurrence', 10, [], bankruptcies, 'Declare <b>Bankruptcy</b> for the tenth time.'),

      new Award('bkm1', 'Doubled Down', 2, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>2</b>.'),
      new Award('bkm2', 'Business Decimator', 10, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>10</b>.'),
      new Award('bkm3', 'And So It Goes...', 50, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>50</b>.'),
      new Award('bkm4', 'Filing for Chapter 100', 100, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>100</b>.'),
      new Award('bkm5', 'The Ghosts of Fallen Businesses', 500, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>500</b>.'),
      new Award('bkm6', 'The Most Private of Equity', 1000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>1,000</b>.'),
      new Award('bkm7', 'Choke Their Rivers With Our Bankruptcies', 2500, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>2,500</b>.'),
      new Award('bkm8', 'None More Bankrupt', 10000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>10,000</b>.'),
      new Award('bkm9', 'The Poincaré Bankruptcy Theorem', 25000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>25,000</b>.'),
      new Award('bkm10', 'The Bankruptcy that Came to Sarnath', 50000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>50,000</b>.'),
      new Award('bkm11', 'The Vacuum of Bankruptcy', 100000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>100,000</b>.'),
      new Award('bkm12', 'Cosmological Bankruptcy Horizon', 250000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>250,000</b>.'),
      new Award('bkm13', 'Not With a Bang but With a Bankruptcy', 500000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>500,000</b>.'),
      new Award('bkm14', 'The Bankruptcy Out of the Sea', 1000000, [], bankruptcyBonus, 'Raise your <b>Bankruptcy Multiplier</b> to <b>1 million</b>.'),
    	
    	new CustomAward('clk1', 'Barely Lifted a Finger', [], [
    	    { stat: totalCashSlowed, val: 100000000, type: 'gte'},
    	    { stat: manualClicks, val: 15, type: 'lte'}
	    ], 'Earn at least <b>$100 million</b> while clicking a maximum of <b>15</b> times.'),
	    
	    new CustomAward('clk2', 'Peak Efficiency', [], [
    	    { stat: totalCashSlowed, val: 100000000, type: 'gte'},
    	    { stat: manualClicks, val: 1000, type: 'lte'}
	    ], 'Earn at least <b>$100 million</b> while clicking a maximum of <b>1000</b> times.'),

     new ManualAward('fst1', 'A Quick Buck', [], 'Earn <b>$1 trillion</b> within <b>1 minute</b> of starting your business.'),
     new ManualAward('fst2', 'Instant Success', [], 'Earn <b>$1 quadrillion</b> within <b>1 minute</b> of starting your business.'),
     new ManualAward('fst3', 'Rapidly Iterating', [], 'Earn <b>$1 quintillion</b> within <b>1 minute</b> of starting your business.'),
     new ManualAward('fst4', 'Breakneck Speedster', [], 'Earn <b>$1 sextillion</b> within <b>1 minute</b> of starting your business.'),
     new ManualAward('fst5', 'Maximum Overdrive', [], 'Earn <b>$1 septillion</b> within <b>1 minute</b> of starting your business.'),
     new ManualAward('fst6', 'The Bus That Couldn\'t Slow Down', [], 'Earn <b>$1 octillion</b> within <b>1 minute</b> of starting your business.'),

      new CustomAward('bnk1', 'trigger', ['bk1'], [
        { stat: totalCashSlowed, val: 1000000000000, type: 'gte'},
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('bnk2', 'trigger', ['bk2'], [
        { stat: totalCashSlowed, val: 1000000000000000, type: 'gte'},
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('bnk3', 'trigger', ['bk3'], [
        { stat: totalCashSlowed, val: 1000000000000000000, type: 'gte'}, // 1 quint
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('bnk4', 'trigger', ['bk4'], [
        { stat: totalCashSlowed, val: 1000000000000000000000, type: 'gte'}, // 1 sext
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('bnk5', 'trigger', ['bk5'], [
        { stat: totalCashSlowed, val: 1000000000000000000000000, type: 'gte'}, // 1 sept
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('bnk6', 'trigger', ['bk6'], [
        { stat: totalCashSlowed, val: 1000000000000000000000000000, type: 'gte'}, // 1 oct
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      // Unlock awards
      new CustomAward('ay1', 'trigger', ['au1'], [
        { stat: mailAnswered, val: 1, type: 'gte'},
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      new CustomAward('ay2', 'trigger', ['au2', 'au3'], [
        { stat: completedAcquisitions, val: 1, type: 'gte'}, 
        { stat: bankruptcies, val: 1, type: 'gte'}
      ]),

      // Mid-tier

      new CustomAward('smb1', 'The Bosses', ['nsymb1'], [
        { stat: getUnit(4).num, val: 125, type: 'gte'},
        { stat: getUnit(5).num, val: 125, type: 'gte'}
      ], 'Employ <b>125</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb2', 'The Second Estate', ['nsymb2'], [
        { stat: getUnit(4).num, val: 175, type: 'gte'},
        { stat: getUnit(5).num, val: 175, type: 'gte'}
      ], 'Employ <b>175</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb3', 'Chain of Command', ['nsymb3'], [
        { stat: getUnit(6).num, val: 125, type: 'gte'},
        { stat: getUnit(7).num, val: 125, type: 'gte'}
      ], 'Employ <b>125</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb4', 'The Shoulders of Atlas', ['nsymb4'], [
        { stat: getUnit(6).num, val: 175, type: 'gte'},
        { stat: getUnit(7).num, val: 175, type: 'gte'}
      ], 'Employ <b>175</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb5', 'A City Upon a Hill', ['nsymb5'], [
        { stat: getUnit(8).num, val: 125, type: 'gte'},
        { stat: getUnit(9).num, val: 125, type: 'gte'}
      ], 'Employ <b>125</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb6', 'The Last Best Hope of Earth', ['nsymb6'], [
        { stat: getUnit(8).num, val: 175, type: 'gte'},
        { stat: getUnit(9).num, val: 175, type: 'gte'}
      ], 'Employ <b>175</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb7', 'Novus Ordo Seclorum', ['nsymb7'], [
        { stat: getUnit(10).num, val: 125, type: 'gte'},
        { stat: getUnit(11).num, val: 125, type: 'gte'}
      ], 'Employ <b>125</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb8', 'The Imperial Cult of the Goat', ['nsymb8'], [
        { stat: getUnit(10).num, val: 175, type: 'gte'},
        { stat: getUnit(11).num, val: 175, type: 'gte'}
      ], 'Employ <b>175</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb0', 'High Converters', ['nsymb0'], [
        { stat: getUnit(2).num, val: 125, type: 'gte'},
        { stat: getUnit(3).num, val: 125, type: 'gte'}
      ], 'Employ <b>125</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb00', 'Called to Action', ['nsymb00'], [
        { stat: getUnit(2).num, val: 175, type: 'gte'},
        { stat: getUnit(3).num, val: 175, type: 'gte'}
      ], 'Employ <b>175</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb9', 'Bought the World a Coke', ['nsymb9'], [
        { stat: getUnit(2).num, val: 225, type: 'gte'},
        { stat: getUnit(3).num, val: 225, type: 'gte'}
      ], 'Employ <b>225</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb9-1', 'Fully Siloed', ['nsymb9.1'], [
        { stat: getUnit(2).num, val: 275, type: 'gte'},
        { stat: getUnit(3).num, val: 275, type: 'gte'}
      ], 'Employ <b>275</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb15', 'On Commission', ['nsymb15'], [
        { stat: getUnit(2).num, val: 325, type: 'gte'},
        { stat: getUnit(3).num, val: 325, type: 'gte'}
      ], 'Employ <b>325</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb15-1', 'All Sales Final', ['nsymb15.1'], [
        { stat: getUnit(2).num, val: 375, type: 'gte'},
        { stat: getUnit(3).num, val: 375, type: 'gte'}
      ], 'Employ <b>375</b> each of <b>Sales Hotshots</b> and <b>Middle Managers</b>.'),

      new CustomAward('smb10', 'The Oligarchs', ['nsymb10'], [
        { stat: getUnit(4).num, val: 225, type: 'gte'},
        { stat: getUnit(5).num, val: 225, type: 'gte'}
      ], 'Employ <b>225</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb10-1', 'Omnia Sunt Privatus', ['nsymb10.1'], [
        { stat: getUnit(4).num, val: 275, type: 'gte'},
        { stat: getUnit(5).num, val: 275, type: 'gte'}
      ], 'Employ <b>275</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb16', 'Kleptocracy', ['nsymb16'], [
        { stat: getUnit(4).num, val: 325, type: 'gte'},
        { stat: getUnit(5).num, val: 325, type: 'gte'}
      ], 'Employ <b>325</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb16-1', 'Respect Your Betters', ['nsymb16.1'], [
        { stat: getUnit(4).num, val: 375, type: 'gte'},
        { stat: getUnit(5).num, val: 375, type: 'gte'}
      ], 'Employ <b>375</b> each of <b>C-Levels</b> and <b>Blue Bloods</b>.'),

      new CustomAward('smb11', 'The Monopoly on Violence', ['nsymb11'], [
        { stat: getUnit(6).num, val: 225, type: 'gte'},
        { stat: getUnit(7).num, val: 225, type: 'gte'}
      ], 'Employ <b>225</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb11-1', 'State Sanctioned', ['nsymb11.1'], [
        { stat: getUnit(6).num, val: 275, type: 'gte'},
        { stat: getUnit(7).num, val: 275, type: 'gte'}
      ], 'Employ <b>275</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb17', 'Sovereign Authorities', ['nsymb17'], [
        { stat: getUnit(6).num, val: 325, type: 'gte'},
        { stat: getUnit(7).num, val: 325, type: 'gte'}
      ], 'Employ <b>325</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb17-1', 'Long Arm of the Law', ['nsymb17.1'], [
        { stat: getUnit(6).num, val: 375, type: 'gte'},
        { stat: getUnit(7).num, val: 375, type: 'gte'}
      ], 'Employ <b>375</b> each of <b>Privatized Cops</b> and <b>Pocket Politicians</b>.'),

      new CustomAward('smb12', 'The Empire of Liberty', ['nsymb12'], [
        { stat: getUnit(8).num, val: 225, type: 'gte'},
        { stat: getUnit(9).num, val: 225, type: 'gte'}
      ], 'Employ <b>225</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb12-1', 'Go West, Young Man', ['nsymb12.1'], [
        { stat: getUnit(8).num, val: 275, type: 'gte'},
        { stat: getUnit(9).num, val: 275, type: 'gte'}
      ], 'Employ <b>275</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb18', 'White Man\'s Burden', ['nsymb18'], [
        { stat: getUnit(8).num, val: 325, type: 'gte'},
        { stat: getUnit(9).num, val: 325, type: 'gte'}
      ], 'Employ <b>325</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb18-1', 'The Cause of All Mankind', ['nsymb18.1'], [
        { stat: getUnit(8).num, val: 375, type: 'gte'},
        { stat: getUnit(9).num, val: 375, type: 'gte'}
      ], 'Employ <b>375</b> each of <b>Mercenary Groups</b> and <b>Client States</b>.'),

      new CustomAward('smb13', 'The Man Behind the Curtain', ['nsymb13'], [
        { stat: getUnit(10).num, val: 225, type: 'gte'},
        { stat: getUnit(11).num, val: 225, type: 'gte'}
      ], 'Employ <b>225</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb13-1', 'A Smoke-Filled Room', ['nsymb13.1'], [
        { stat: getUnit(10).num, val: 275, type: 'gte'},
        { stat: getUnit(11).num, val: 275, type: 'gte'}
      ], 'Employ <b>275</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb19', 'Éminence Grise', ['nsymb19'], [
        { stat: getUnit(10).num, val: 325, type: 'gte'},
        { stat: getUnit(11).num, val: 325, type: 'gte'}
      ], 'Employ <b>325</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb19-1', 'The Blind Idiot God', ['nsymb19.1'], [
        { stat: getUnit(10).num, val: 375, type: 'gte'},
        { stat: getUnit(11).num, val: 375, type: 'gte'}
      ], 'Employ <b>375</b> each of <b>Shadow Governments</b> and <b>Puppetmasters</b>.'),

      new CustomAward('smb14', 'Nulla Crux, Nulla Corona', ['nsymb14'], [
        { stat: getUnit(0).num, val: 500, type: 'gte'},
        { stat: getUnit(1).num, val: 500, type: 'gte'}
      ], 'Employ <b>500</b> each of <b>Interns</b> and <b>Wage Slaves</b>.'),

      new Award('svw', 'It\'s Got a Lot of Numbers In It', 50, [], statsTabViews, 'Stare deep into the void of numbers and charts under <b>Stats</b> at least <b>50</b> times.'),
      new Award('avw', 'Look Upon My Works', 50, [], achievementTabViews, 'Ogle your accomplishments under <b>Upgrades & Achievements</b> at least <b>50</b> times.'),

      new ManualAward('ps0', 'Lifetime Learner', [], 'Delve into <b>Career Development</b> for the first time.'),
      new ManualAward('ps1', 'Mind Expansion', [], 'Push one form of <b>Career Development</b> to at least <b>level 10</b>.'),
      new ManualAward('ps2', 'Forbidden Knowledge', [], 'Push one form of <b>Career Development</b> to at least <b>level 20</b>.'),
      new ManualAward('ps3', 'Well-Rounded', [], 'Earn at least <b>1 level</b> in every form of <b>Career Development</b>.'),
      new ManualAward('ps4', 'Jack of All Trades', [], 'Earn at least <b>10 levels</b> in every form of <b>Career Development</b>.'),
      new ManualAward('ps5', 'Polymath', [], 'Earn at least <b>20 levels</b> in every form of <b>Career Development</b>.'),

      new ManualAward('tr0', 'Much Pain, a Little Gain', ['tc3'], 'Subject an employee to <b>Training</b> for the first time.'),
      new ManualAward('tr1', 'Every Muscle Must be Tight', ['tc4'], 'Push an employee to be <b>100% Trained</b> for the first time.'),
      new ManualAward('tr2', 'Just a Bunch of Hunks', ['tc1'], 'Push all of your employees to be <b>100% Trained</b> at once.'),
      new ManualAward('tr3', 'Overqualified', ['tc5'], 'Push an employee to be <b>200% Trained</b> for the first time.'),
      new ManualAward('tr4', 'Maximum Crunch', ['tc2'], 'Push all of your employees to be <b>200% Trained</b> at once.'),
      new ManualAward('tr5', 'What Peak Performance Looks Like', [], 'Push an employee to be <b>300% Trained</b> for the first time.'),
      new ManualAward('tr6', 'PEPCK-C<sup>mus</sup> Employees', [], 'Push all of your employees to be <b>300% Trained</b> at once.'),

      new Award('tt1', 'Risen and Ground', 100 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>100 hours</b> to employee training across all businesses.'),
      new Award('tt2', 'Seeing Some Progress', 500 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>500 hours</b> to employee training across all businesses.'),
      new Award('tt3', 'Nose to the Grindstone', 1000 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>1,000 hours</b> to employee training across all businesses.'),
      new Award('tt4', 'All Work, No Play', 2500 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>2,500 hours</b> to employee training across all businesses.'),
      new Award('tt5', 'Highest Achiever', 5000 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>5,000 hours</b> to employee training across all businesses.'),
      new Award('tt6', 'Outlier', 10000 * hoursInMilliseconds, [], timeTrainingAllBusinesses, 'Commit at least <b>10,000 hours</b> to employee training across all businesses.'),

      new Award('cr1', 'Hello, Mother Leopard', 1, ['cru1'], crypticEmailsReceived, 'Receive a <b>Cryptic Email</b> for the first time.'),
      new Award('cr2', 'Spirit Cooked', 1000, ['cru2'], crypticEmailEarnings, 'Add <b>1,000</b> to your <b>Next Bankruptcy Bonus</b> through <b>Cryptic Emails</b>.'),
      new Award('cr3', 'Be Cautious They Are Not Human', 10000, ['cru3'], crypticEmailEarnings, 'Add <b>10,000</b> to your <b>Next Bankruptcy Bonus</b> through <b>Cryptic Emails</b>.'),
      new Award('cr4', 'Harbinger of the Storm', 100000, ['cru4'], crypticEmailEarnings, 'Add <b>100,000</b> to your <b>Next Bankruptcy Bonus</b> through <b>Cryptic Emails</b>.'),
    	
    	new ManualAward('timePlayed1', 'Fresh New Startup', [], 'Experience at least <b>1 full hour</b> of business successes.'), 
    	new ManualAward('timePlayed2', 'Established Corporation', [], 'Experience at least <b>1 full day</b> of business successes.'),
      new ManualAward('timePlayed3', 'Historic Institution', [], 'Experience at least <b>1 full week</b> of business successes.'),
      new ManualAward('timePlayed4', 'Legendary Conglomerate', [], 'Experience at least <b>2 full weeks</b> of business successes.'),
    	new ManualAward('timePlayed5', 'All-Encompassing System', [], 'Experience at least <b>3 full weeks</b> of business successes.'),
      new ManualAward('timePlayed6', 'Ancient Cyclopean Construct', [], 'Experience at least <b>1 full month</b> of business successes.'),
    	
    	new ManualAward('buy10', 'Big Spender', [], 'Hire at least <b>10</b> Employees at once.'),
    	new ManualAward('buy25', 'Hiring Spree', [], 'Hire at least <b>25</b> Employees at once.'),
    	new ManualAward('buy100', 'Infinitely Scalable', [], 'Hire at least <b>100</b> Employees at once.'),
    
    	new ManualAward('sell10', 'Decimator', [], 'Fire at least <b>10</b> Employees at once.'), 
    	new ManualAward('sell25', 'Firing Spree', [], 'Fire at least <b>25</b> Employees at once.'),
    	new ManualAward('sell100', 'Rightsizing!', [], 'Fire at least <b>100</b> Employees at once.'),
      new ManualAward('sellAll', 'Benny, Bring Me Everyone', [], 'Fire everybody.'),
    	
    	new ManualAward('have1', 'Make Total Employ', ['h1'], 'Employ at least <b>1</b> employee of each type.'),
    	new ManualAward('have50', 'Some of Each', ['h50'], 'Employ at least <b>50</b> employees of each type.'),
    	new ManualAward('have100', 'Plenty to Go Around', ['h100'], 'Employ at least <b>100</b> employees of each type.'),
    	new ManualAward('have150', 'Maybe Too Many Now', ['h150'], 'Employ at least <b>150</b> employees of each type.'),
    	new ManualAward('have200', 'Pretty Much All of \'Em', ['h200'], 'Employ at least <b>200</b> employees of each type.'),
      new ManualAward('have250', 'Even More of \'Em', ['h250'], 'Employ at least <b>250</b> employees of each type.'),
      new ManualAward('have300', 'Definitely Too Many', ['h300'], 'Employ at least <b>300</b> employees of each type.'),
      new ManualAward('have350', 'It\'s Gone Too Far', ['h350'], 'Employ at least <b>350</b> employees of each type.'),
      new ManualAward('have400', 'This Must End', [], 'Employ at least <b>400</b> employees of each type.'),
    	
    	new ManualAward('export', 'Cautious', [], 'Export your game data for the first time.'),
    	new ManualAward('import', 'Duty-Free', [], 'Import game data for the first time.')
	]).extend({ deferred: true, rateLimit: 500});
	
	totalAchievementCount = achievements().filter(function(item) {
	  return item.name !== 'trigger';
	}).length;

  var achievementCount = new Stat('Achievements Unlocked', ko.computed(function() {
    return achievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded();
    }).length;
  }, this));
	
	var achievementPercentageEarned = ko.computed(function() {
	  var num = achievementCount.val() / totalAchievementCount * 100;
	  return num + '%';
	}, this);

  var achievementSort = function(left, right) {
    if (!left.read() && left.awarded() && (right.read() || !right.awarded())) {
      return -1;
    } else if (!right.read() && right.awarded() && (left.read() || !left.awarded())) {
      return 1;
    } else {
      return 0;
    }
  };

  /* SECRET ACHIEVEMENTS */

  var secretAchievements = ko.observableArray([
    new ManualAward('brk', 'On a Break', [], 'Take a break for at least <b>1 month</b> before realizing that you can\'t drop out of this system.'),
    new ManualAward('brk1', 'The Forgotten Game', [], 'Take a break for at least <b>1 year</b> before realizing that just when you think you\'re out, they pull you back in.'),
    new Award('empk', 'Truly Callous', 1000, [], employeesKilled, 'Discover that at least <b>1,000</b> employees couldn\'t hack it.'),
    new Award('outg', 'Gutenberger', 100000, [], outgoingEmails, 'Compose at least <b>100,000</b> outgoing emails.'),
    new Award('bankr', 'Infinite Looper', 1000, [], bankruptcies, 'Declare bankruptcy at least <b>1,000</b> times.'),
    new Award('chatmax', 'You are typing...', 100000, [], wordsChatted, 'Type at least <b>100,000</b> smart words into acquisition chats.'),
    new Award('auc1', 'Autoclicked', 1000000, [], manualClicks, 'Manually click at least <b>1 million</b> times.'),
    new Award('elecw', 'Realestpolitik', 10000, [], electionsWon, 'Win at least <b>10,000</b> elections'),
    new Award('elecl', 'Resigned to Failure', 10000, [], electionsLost, 'Lose at least <b>10,000</b> elections'),
    new ManualAward('timePlayed7', 'Never Forget', [], 'Play this nightmare of a game for at least <b>1 year</b>.'),
    new ManualAward('cheat', 'Prince of Lies', [], 'I can\'t believe you cheated.')
  ]);

  var secretAchievementCount = new Stat('Secret Achievements Unlocked', ko.computed(function() {
    return secretAchievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded();
    }).length;
  }, this));

  var newAchievements = ko.computed(function() {
    return achievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded() && !a.read();
    })
  }, this);

  var newAchievementCount = new Stat('New Achievements', ko.computed(function() {
    return achievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded() && !a.read();
    }).length + secretAchievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded() && !a.read();
    }).length
  }, this));

  var newSecretAchievementCount = new Stat('New Secret Achievements', ko.computed(function() {
    return secretAchievements().filter(function(a) {
      return a.name !== 'trigger' && a.awarded() && !a.read();
    }).length
  }, this));
	
	// These stats are checked to be saved, but not displayed
  var stats = [
    unitsUnlocked,
    unitsOwned,
    unitCount,
    upgradeCount,
    achievementCount,
    manualClicks,
    manualClicksAllTime,
    earnedFromManualClicks,
    earnedPerClick,
    currentCash,
    totalCash,
    totalCashAllTime,
    earnedWhileIdle,
    totalDPM,
    totalDPH,
    baseDPSMod,
    overallDPSPercentage,
    achievementBonusRate,
    unitCountBonusRate,
    startTime,
    startTimeAllTime,
    mailAnswered,
    mailAnsweredAllTime,
    mailChanceMultiplier,
    timeToAnswerMail,
    totalEarnedFromEmails,
    freshEmailEarned,
    expiredEmailEarned,
    wordsReplied,
    manualClickMultiplier,
    manualClickDPSPercentage,
    interestRate,
    completedInvestments,
    earnedFromInvestments,
    earnedFromShortInvestments,
    earnedFromLongInvestments,
    simultaneousInvestments,
    bankruptcies,
    bankruptcyBonus,
    nextBankruptcyBonus,
    saveFileSize,
    inboxMax,
    allEmployeeMod,
    emailCashBonus,
    employeeDiscount,
    timeBonusMinimum,
    expiredEmailsAnswered,
    freshEmailsAnswered,
    timeInvested,
    timeInvestedAllTime,
    shortInvestments,
    longInvestments,
    baseEmailTextMultiplier,
    timeBonusRate,
    specialMailAnswered,
    specialMailAnsweredAllTime,
    specialMailEarned,
    specialMailBonus,
    specialMailChance,
    timePlayedBonusRate,
    shortInvestmentBonus,
    windfallCount,
    windfallCountAllTime,
    windfallDuration,
    windfallMultiplier,
    canceledInvestments,
    earnedFromWindfalls,
    statsTabViews,
    achievementTabViews,
    windfallChance,
    windfallProgress,
    windfallGrowthMultiplier,
    timeSpentIdle,
    timeSpentIdleAllBusinesses,
    idleBonusRate,
    awayEarningRate,
    earnedWhileAway,
    simultaneousAcquisitions,
    completedAcquisitions,
    completedAcquisitionsAllTime,
    earnedFromAcquisitions,
    acquisitionValueMultiplier,
    acquisitionsWorkerDiscount,
    defaultExecutives,
    chatsCompleted,
    wordsChatted,
    policiesAccepted,
    layoffsConducted,
    fudgedNumberSessions,
    emailAway,
    policyAway,
    chatAway,
    windfallGuarantee,
    electionNotifications,
    patentsSold,
    earnedFromResearch,
    employeesKilled,
    riskReduction,
    speedBoost,
    valueBoost,
    researchBonus,
    outgoingEmails,
    overallTimeBoosted,
    investmentTimeBoosted,
    researchTimeBoosted,
    acquisitionTimeBoosted,
    trainingTimeBoosted,
    investmentBoostBonus,
    researchBoostBonus,
    acquisitionBoostBonus,
    trainingBoostBonus,
    stressReduced,
    stressReductionMultiplier,
    trainingSeminars,
    additionalBankruptcyBonus,
    timeTraining,
    timeTrainingAllBusinesses,
    trainingBonus,
    seminarsUsed,
    crypticEmailsReceived,
    crypticEmailsReceivedAllTime,
    crypticEmailEarnings,
    crypticEmailBonus,
    electionsWon,
    electionsLost,
    earnedFromElections,
    donatedToCandidates,
    gaffesExperienced,
    gaffeBuffer,
    prChance,
    electionPayoutBonus,
    electionSupportRate,
    winStreak,
    winStreakCap
  ];

  // The following stats will be displayed  
  var generalStats = ko.observableArray([
    achievementCount,
    upgradeCount,
    unitCount,
    bankruptcies,
    startTime,
    startTimeAllTime,
    lastClick,
    timePlayedBonusRate,
    employeeDiscount,
    saveFileSize,
    version
  ]);
  
  var unitStats = ko.observableArray([
    unitsUnlocked,
    unitsOwned,
    unitCount,
    employeeDiscount
  ]);
  
  var cashStats = ko.observableArray([
    totalCash,
    totalCashAllTime,
    totalDPM,
    totalDPH,
    baseDPSMod,
    achievementBonusRate,
    unitCountBonusRate,
    idleBonus,
    bankruptcyBonus,
    nextBankruptcyBonus,
    nextBankruptcySeminars
  ]);
  
  var clickStats = ko.observableArray([
    manualClicks,
    manualClicksAllTime,
    earnedFromManualClicks,
    manualClickMultiplier,
    manualClickDPSPercentage,
    windfallCountAllTime,
    earnedFromWindfalls,
    windfallDuration,
    windfallMultiplier
  ]);

  var acquisitionStats = ko.observableArray([
    completedAcquisitionsAllTime,
    earnedFromAcquisitions,
    acquisitionValueMultiplier,
    acquisitionsWorkerDiscount,
    policiesAccepted,
    chatsCompleted,
    wordsChatted,
    layoffsConducted,
    fudgedNumberSessions
  ]);

  var idleStats = ko.observableArray([
    timeSpentIdle,
    timeSpentIdleAllBusinesses,
    idleBonusRate,
    earnedWhileIdle,
    awayEarningRate,
    earnedWhileAway
  ]);

  var researchStats = ko.observableArray([
    patentsSold,
    earnedFromResearch,
    employeesKilled,
    riskReduction,
    speedBoost,
    valueBoost
  ]);
  
  var emailStats = ko.observableArray([
    mailAnsweredAllTime,
    specialMailAnswered,
    specialMailAnsweredAllTime,
    inboxMax,
    totalEarnedFromEmails,
    freshEmailEarned,
    expiredEmailEarned,
    specialMailEarned,
    specialMailBonus,
    wordsReplied
  ]);
  
  var investmentStats = ko.observableArray([
    interestRate,
    completedInvestments,
    canceledInvestments,
    shortInvestmentBonus,
    timeBonusRate,
    timeInvestedAllTime,
    earnedFromInvestments,
    earnedFromShortInvestments,
    earnedFromLongInvestments,
    totalSimultaneousInvestmentsAllowed
  ]);

  var earningsStats = ko.observableArray([
    totalCash,
    earnedFromManualClicks,
    totalEarnedFromEmails,
    earnedFromInvestments,
    earnedFromResearch,
    earnedFromAcquisitions,
    netElectionEarnings
  ]);

  var composedStats1 = ko.observableArray([
    outgoingEmails,
    investmentTimeBoosted,
    researchTimeBoosted,
    acquisitionTimeBoosted,
    trainingTimeBoosted,
    stressReduced
  ]);

  var composedStats2 = ko.observableArray([
    stressReduction,
    investmentBoostBonus,
    researchBoostBonus,
    acquisitionBoostBonus,
    trainingBoostBonus,
    stressReductionMultiplier
  ]);

  var careerDevStats = ko.observableArray([
    timeTraining,
    timeTrainingAllBusinesses,
    trainingBonus,
    seminarsUsed
  ]);

  var crypticStats = ko.observableArray([
    crypticMailChance,
    crypticEmailsReceivedAllTime,
    crypticEmailEarnings,
    crypticEmailBonus
  ]);

  var electionStats1 = ko.observableArray([
    electionsWon,
    electionsLost,
    winStreak,
    winStreakCap,
    gaffeBuffer
  ]);

  var electionStats2 = ko.observableArray([
    gaffesExperienced,
    prChance,
    earnedFromElections,
    donatedToCandidates,
    netElectionEarnings
  ]);
	
	/*************************************************************
						          GENERAL CONSTRUCTORS
	*************************************************************/
	
	function Unit(id, name, icon, basePrice, baseClick, description, flavor, careerBonus) {
	  this.id = id;
	  this.name = ko.observable(name);
	  this.descriptionText = ko.observable(description);
	  this.flavorText = ko.observable(flavor);
	  this.basePrice = ko.observable(basePrice);
	  this.baseClick = ko.observable(baseClick);
	  this.available = ko.observable(id === "0" ? true : false);
	  this.num = new Stat('Quantity', 0);
	  this.mod = new Stat('Modifier', 0);
    this.numMod = new Stat('Quantity Modifier', 0);
	  this.icon = ko.observable(icon);
    this.careerBonus = careerBonus;

    this.numCanAfford = ko.computed(function() {
      if (viewingTab() === 'store' && buyRate() === 'max') {
        var price = 0;
        var count = -1;
        var lastIncrementMet;
        while (price <= currentCashSlowed()) {
          count++;
          var p = Math.pow(PRICE_GROWTH, this.num.val() + count) * this.basePrice();
          var discount = p * (employeeDiscount.val() / 100);
          price += p - discount

          if (maxType() !== 'targetIncrement') {
            if (count % (maxType() === 'maxIncrement' ? maxIncrement() : 1) === 0) {
              lastIncrementMet = count;
            }
          } else {
            if ((this.num.val() + count) % targetIncrement() === 0) {
              lastIncrementMet = count;
            }
          }
        }

        return lastIncrementMet ? lastIncrementMet : 0;
      } else {
        return 0;
      }
    }, this);

    this.minWantToAfford = ko.computed(function() {
      if (maxType() === 'targetIncrement') { 
        var count = 0;
        for (var i = 0; i < targetIncrement(); i++) {
          count++;
          if ((this.num.val() + count) % targetIncrement() === 0) {
            return count;
          }
        }
      }

      if (maxType() === 'maxIncrement') { return maxIncrement() }
      return 1;
    }, this);
	  
	  this.price = new Stat('Price', ko.computed(function() {
	    var price = 0;
      var rate = buyRate() === 'max' ? (this.numCanAfford() ? this.numCanAfford() : this.minWantToAfford()): buyRate();
	    for (var i = 0; i < rate; i++) {
	      price += Math.pow(PRICE_GROWTH, this.num.val() + i) * this.basePrice();
	    }
	    
      var discount = price * (employeeDiscount.val() / 100);
	    return (price - discount);
	  }, this), '$');
	  
	  this.sellPrice = new Stat('Sell Value', ko.computed(function() {
	    if (this.num.val() === 0) {
	      return 0;
	    }
	    
	    var price = 0;
	    for (var i = 0; i < (buyRate() === 'max' ? this.num.val() : buyRate()); i++) {
	      price += Math.pow(PRICE_GROWTH, this.num.val() - i) * this.basePrice();
	    }
	    
	    return price / 2.5;
	  }, this), '$');
	  
	  this.cps = new Stat('Dollars Per Second', ko.computed(function() {
	    var baseCPS = (parseFloat(this.baseClick()) * Math.pow(2, this.mod.val() + allEmployeeMod.val())) * this.num.val();
	    var baseMod = baseCPS * (baseDPSMod.val() / 100);
      var quantityMod = (this.numMod.val() * this.num.val()) / 100;
      quantityMod = quantityMod > 1 ? quantityMod : 1;
	    var total = (baseCPS + baseMod) * bankruptcyBonus.val() * idleBonus.val() * quantityMod;
      return total + (total * ((this.careerBonus && this.careerBonus.total ? this.careerBonus.total.val() : 0) / 100));
	  }, this), '$');

	  this.cpm = new Stat('Dollars Per Minute', ko.computed(function() {
	    return this.cps.val() * 60;
	  }, this), '$');
	  
	  this.cph = new Stat('Dollars Per Hour', ko.computed(function() {
	    return this.cpm.val() * 60;
	  }, this), '$');
	  
	  this.cantAfford = ko.computed(function() {
	    return viewingTab() === 'store' && (currentCashSlowed && currentCashSlowed() < this.price.val()) || (buyRate() === 'max' && this.numCanAfford() === 0);
	  }, this);

    this.shareOfTotal = ko.computed(function() {
      return (this.cps.val() === 0 || totalDPS.val() === 0) ? 0 : ((this.cps.val() / totalDPS.val()) * 100).toFixed(2)
    }, this);

    this.individualEarnings = ko.computed(function() {
      return this.num.val() > 0 ? format(this.cps.val() / this.num.val()) : 0;
    }, this);

    this.potentialEarnings = ko.computed(function() {
      if (this.num.val() === 0) {
        var baseCPS = (parseFloat(this.baseClick()) * Math.pow(2, this.mod.val() + allEmployeeMod.val())) * 1;
        var baseMod = baseCPS * (baseDPSMod.val() / 100);
        var quantityMod = (this.numMod.val() * 1) / 100;
        quantityMod = quantityMod > 1 ? quantityMod : 1;
        return format((baseCPS + baseMod) * bankruptcyBonus.val() * idleBonus.val() * quantityMod);
      } else {
        return 0;
      }
    }, this);

    this.baseClickDisplay = ko.computed(function() {
      if (this.baseClick()) {
        return format(this.baseClick());
      }
    }, this);

    /******* TRAINING *******/

    this.trainingCost = new Stat('Training Cost', ko.computed(function() {
      return ((Math.pow(PRICE_GROWTH, this.num.val()) * this.basePrice()) / 5) * trainingHours();
    }, this), '$');

    this.cantAffordTraining = ko.computed(function() {
      return viewingTab() === 'store' && isTrainingView() && (currentCashSlowed() < this.trainingCost.val());
    }, this);

    this.trainingBonus = new Stat('Training Bonus', 0, null, '%');
    this.inProgressTrainingBonus = new Stat('In Progress Training Bonus', 0, null, '%');
    this.nextTrainingBonus = new Stat('Next Training Bonus', ko.computed(function() {
      var base = (this.num.val() / (75 + (this.trainingBonus.val() * 2))) * trainingHours()
      var baseWithUpgrades = base + (base * (trainingBonus.val() / 100));
      return baseWithUpgrades + (baseWithUpgrades * (trainingBoost.total.val() / 100));
    }, this), null, '%');

    this.trainingTime = new Stat('Training Time', ko.computed(function() {
      return parseInt(trainingHours());
    }, this), null, ' hour(s)');

    this.timeRemaining = ko.observable();
    this.trainingActive = ko.observable(false);
    this.trainingFinished = ko.observable(false);
    this.defaultTrainingText = 'Your <b>' + this.name() + '</b> are ' + 'not currently training.';
    this.trainingText = ko.observable(this.defaultTrainingText);
    this.targetTime;
    this.lastInterval = 0;

    this.startTimer = function(loadedTimeRemaining, loadedTargetTime) {
      this.targetTime = loadedTargetTime || this.trainingTime.val() * 60 * 60 * 1000;
      this.timeRemaining(loadedTimeRemaining !== undefined ? loadedTimeRemaining : this.trainingTime.val() * 60 * 60  * 1000);
      this.trainingActive(true);
      this.trainingText('Your <b>' + this.name() + '</b> are ' + getRandomFromArray(trainingText[this.id]));

      this.handleTimer = setInterval(function() {
        var now = Date.now();
        var elapsedTime = now - this.lastInterval;
        this.lastInterval = now;
        
        if (elapsedTime < 60000) {
          var newTime = this.timeRemaining() - elapsedTime;
          this.timeRemaining(newTime > 0 ? newTime : 0);
        }

        if (this.timeRemaining() <= 0) {
          this.trainingActive(false);
          this.trainingFinished(true);
          clearInterval(this.handleTimer);
        }
      }.bind(this), 1000);
    }
    
    this.displayTimeRemaining = ko.computed(function() {
      return formatTimeRemaining(Math.round(this.timeRemaining() / 1000));
    }, this);
    
    this.percentageComplete = ko.computed(function() {
      if (this.timeRemaining() !== null) {
        var timeInProgress = this.targetTime - this.timeRemaining();
        return (timeInProgress / this.targetTime) * 100 + '%';
      } else {
        return '0%';
      }
    }, this);


    this.hoverVisible = ko.observable(false);
    this.viewDetails = function() {
      if (enableHover() && window.screen.availWidth >= 500) {
        clearTimeout(this.visibilityDelay);
        this.visibilityDelay = setTimeout(function() {
          this.hoverVisible(true);
        }.bind(this), HOVER_DELAY);
      }
    }

    this.leaveDetails = function() {
      clearTimeout(this.visibilityDelay);
      this.visibilityDelay = setTimeout(function() {
        this.hoverVisible(false);
      }.bind(this), HOVER_HIDE_DELAY);
    }
	}

  Unit.prototype.train = function() {
    if (currentCash.val() >= this.trainingCost.val()) {
      this.startTimer();
      currentCash.sub(this.trainingCost.val());
      this.inProgressTrainingBonus.val(this.nextTrainingBonus.val());
    }
  };

  Unit.prototype.stopTraining = function() {
    this.trainingActive(false);
    this.trainingText(this.defaultTrainingText);
    clearInterval(this.handleTimer);
    this.targetTime = null;
    this.timeRemaining(null);
    this.inProgressTrainingBonus.val(0);
  }

  Unit.prototype.finishTraining = function() {
    timeTraining.add(this.targetTime);
    timeTrainingAllBusinesses.add(this.targetTime);
    this.trainingFinished(false);
    this.trainingBonus.add(this.inProgressTrainingBonus.val());
    this.stopTraining();
    this.checkTrainingAwards();
  }

  Unit.prototype.checkTrainingAwards = function() {
    earnAchievement('tr0');
    if (this.trainingBonus.val() >= 100) { earnAchievement('tr1'); }
    if (this.trainingBonus.val() >= 200) { earnAchievement('tr3'); }
    if (this.trainingBonus.val() >= 300) { earnAchievement('tr5'); }

    var any100Untrained = false;
    var any200Untrained = false;
    var any300Untrained = false;
    for (var i = 0; i < units().length; i++) {
        if (units()[i].trainingBonus.val() < 100) { any100Untrained = true; } 
        if (units()[i].trainingBonus.val() < 200) { any200Untrained = true; } 
        if (units()[i].trainingBonus.val() < 300) { any300Untrained = true; }
    }

    if (!any100Untrained) { earnAchievement('tr2'); }
    if (!any200Untrained) { earnAchievement('tr4'); }
    if (!any300Untrained) { earnAchievement('tr6'); }
  }
	
	Unit.prototype.select = function() {
    selectedUnit(this);
	};
	
	Unit.prototype.buy = function() {
	  if (currentCash.val() >= this.price.val()) {
      var num = this.numCanAfford();
      var buyNum = buyRate() === 'max' ? num : buyRate();

	    currentCash.sub(this.price.val());
	    this.num.add(buyNum);
	    unitCount.add(buyNum);
	    
	    var nextId = parseInt(this.id) + 1;
	    var nextUnit = getUnit(nextId.toString());
	    
	    if (nextUnit && !nextUnit.available() && this.num.val() >= 5) {
	      this.unlockNext();
	    }
	    
	    // Check for the multi-buy achievements
      if (buyNum >= 100) {
        earnAchievement('buy100');
      } 

      if (buyNum >= 25) {
        earnAchievement('buy25');
      } 

      if (buyNum >= 10) {
        earnAchievement('buy10');
      }
	    
	    // Check for the employee position achievements
      checkEmployeePositionAchievements();
	  }
	};
	
	Unit.prototype.sell = function() {
	  if ((this.num.val() >= buyRate() || buyRate() === 'max')) {
      addClicks(this.sellPrice.val());

      var num = this.num.val();
      var sellNum = buyRate() === 'max' ? num : buyRate()
      this.num.sub(sellNum);
      unitCount.sub(sellNum);
      
      // Check for the multi-sell achievements
      if (sellNum >= 100) {
        earnAchievement('sell100');
      } 

      if (sellNum >= 25) {
        earnAchievement('sell25');
      } 

      if (sellNum >= 10) {
        earnAchievement('sell10');
      }

      if (unitCount.val() === 0 && unitsUnlocked.val() === 12) {
        earnAchievement('sellAll');
      }

      if (research().active() && parseInt(this.id) <= 3) {
        console.log(this.id)
        if (this.id === '0') {
          if (research().intern() > this.num.val()) {
            research().intern(this.num.val());
          }
        } else if (this.id === '1') {
          if (research().wage() > this.num.val()) {
            research().wage(this.num.val());
          }
        } else if (this.id === '2') {
          if (research().sales() > this.num.val()) {
            research().sales(this.num.val());
          }
        } else if (this.id === '3') {
          if (research().manager() > this.num.val()) {
            research().manager(this.num.val());
          }
        }
      }
	  }
	};
	
	Unit.prototype.unlockNext = function() {
	  var nextId = (parseInt(this.id) + 1).toString();
	  var nextUnit = getUnit(nextId);
	  nextUnit.available(true);
	  document.dispatchEvent(new CustomEvent("employee-unlocked", { "detail": { "id": nextId, "name": nextUnit.name() }}));
	};

  Unit.prototype.getPotentialEarnings = function() {
    var baseCPS = (parseFloat(this.baseClick()) * Math.pow(2, this.mod.val() + allEmployeeMod.val())) * 1;
    var baseMod = baseCPS * (baseDPSMod.val() / 100);
    var quantityMod = (this.numMod.val() * 1) / 100;
    quantityMod = quantityMod > 1 ? quantityMod : 1;
    return format((baseCPS + baseMod) * bankruptcyBonus.val() * idleBonus.val() * quantityMod);
  };

  function Price(baseVal) {
    this.val = ko.observable(baseVal);
    this.displayVal = ko.observable('$' + format(this.val()))
  }
	
	function Stat(name, baseVal, beforeDisplay, afterDisplay, longerFormat, longerSingleDigit, info) {
	  this.name = name;
	  this.baseVal = baseVal;
	  this.beforeDisplay = beforeDisplay ? beforeDisplay : '';
	  this.afterDisplay = afterDisplay ? afterDisplay : '';
    this.info = info;

	  if (isNaN(baseVal)) {
	    this.val = baseVal;
	  } else {
    	 this.val = ko.observable(baseVal);
	  }

	  this.displayVal = ko.computed(function() {
      return ((typeof this.val === 'function' && this.val() < 0) ? '- ': '') + this.beforeDisplay + (typeof this.val === 'function' ? format(this.val(), longerFormat, longerSingleDigit) : this.val) + this.afterDisplay;
	  }, this);
	  
	  this.isCash = ko.computed(function() {
	    return this.name.toLowerCase().indexOf('cash') > -1;
	  }, this);

	}
	
	Stat.prototype.add = function(val) {
	  var newVal = this.val() + val;
	  this.val(newVal > 0 ? newVal : 0);
	};
	
	Stat.prototype.sub = function(val) {
	  var newVal = this.val() - val;
	  this.val(newVal > 0 ? newVal : 0);
	};
	
	function DateStat(name, baseVal, info) {
    this.info = info;
    this.type = 'date';
    this.name = name;
    this.baseVal = baseVal;
    this.val = ko.observable(baseVal);
    this.displayVal = ko.computed(function() {
      mediumIntervalCounter(); 
      return this.val() ? timeSinceStart(this.val()) : 'N/A';
    }, this);
  }

  function TimeStat(name, baseVal, doNotRound) {
    Stat.call(this, name, baseVal);
    this.displayVal = ko.computed(function() {
      return getFormattedTime(this.val(), true, doNotRound);
    }, this);
  }

  function TextStat(name, baseVal) {
    Stat.call(this, name, baseVal);
    this.displayVal = ko.computed(function() {
      return this.baseVal;
    }, this);
  }

  TimeStat.prototype.add = Stat.prototype.add;

	/*************************************************************
						UPGRADE CONSTRUCTORS
	*************************************************************/
	var called = 0;
	function Upgrade(id, name, price, flavor, icon) {
	  this.id = id;
	  this.name = ko.observable(name);
    this.price = new Price(price);
	  //this.price = new Stat('Price', price ? price : 0, '$');
	  this.date = ko.observable(null);
	  this.available = ko.observable(false);
	  this.bought = ko.observable(false);
	  this.read = ko.observable(false);
	  this.descriptionText = ko.observable(null);
	  this.flavorText = ko.observable(flavor || 'Wow...');
	  this.icon = ko.observable(icon ? icon : 'card_giftcard');
	  this.buy = function() {
	    if (currentCash.val() >= this.price.val()) {
	      currentCash.sub(this.price.val());
	      upgradeCount.add(1);
	      this.handlePurchase();
	      this.available(false);
	      this.bought(true);
	      this.date(new Date().toLocaleString());
        this.cantAfford = ko.observable(false);
	    }
	  };
	  
	  this.select = function() {
     selectedUpgrade(this);
    this.read(true);
	  };

    this.cantAfford = ko.observable(false);

   this.trackAffording = function() {
    this.cantAfford = ko.pureComputed(function() {
      return currentCashSlowed() < this.price.val();
    }, this);
   };

    this.hoverVisible = ko.observable(false);
    this.viewDetails = function(isStatsTab) {
      if (enableHover() && window.screen.availWidth >= 500 && (isStatsTab !== true || this.bought())) {
        clearTimeout(this.visibilityDelay);
        this.visibilityDelay = setTimeout(function() {
          this.hoverVisible(true);
          this.read(true);
        }.bind(this), HOVER_DELAY);
      }
    }

    this.leaveDetails = function() {
      clearTimeout(this.visibilityDelay);
      this.visibilityDelay = setTimeout(function() {
        this.hoverVisible(false);
      }.bind(this), HOVER_HIDE_DELAY);
    }

    this.trackAffording();
	}
	
	function UnitUpgrade(id, name, unit, price, flavor, mod, description) {
	    Upgrade.call(this, id, name, price, flavor, getUnit(unit).icon());
	    this.unit = unit;
	    this.type = 'unit';
	    this.mod = mod ? mod : 1;
	    
	    this.descriptionText = ko.observable(description ? description : 'Squeeze <b>twice</b> as much cash out of every one of your <b>' + getUnit(unit).name() + '</b>.');

	    this.handlePurchase = function() {
	      getUnit(unit).mod.add(this.mod);
	    };
	}

  function SpecialUnitUpgrade(id, highValue, name, unlockingUnit, price, flavor) {
    Upgrade.call(this, id, name, price, flavor, 'people');
    this.type = 'unit';
    var valueText = highValue ? ' a lot ' : ' ';
    this.descriptionText = ko.observable('Your <b>' + getUnit(unlockingUnit).name() + '</b> wring' + valueText + 'more cash from your <b>Interns</b> and <b>Wage Slaves</b>');

    this.handlePurchase = function() {
      getUnit(0).mod.add(highValue ? 1.25 : 1);
      getUnit(1).mod.add(highValue ? 1 : 0.8);
    };
  }

  function SymbioticUpgrade(id, name, units, price, flavor) {
    Upgrade.call(this, id, name, price, flavor, 'autorenew');
    var unitsText = getSymbioticUpgradeText(units);
    this.descriptionText = ko.observable('Your ' + unitsText + ' form a lucrative symbiotic relationship.');

    this.handlePurchase = function() {
      for (var i = 0; i < units.length; i++) {
        getUnit(units[i].id).mod.add(units[i].mod);
      }
    };
  }

  function getSymbioticUpgradeText(units) {
    var fullText = '';
    for (var i = 0; i < units.length; i++) {
      var text = '<b>' + getUnit(units[i].id).name() + '</b>';

      // If this is not the first, but also not the last
      if (i > 0 && i !== units.length - 1) {
        text = ', ' + text;
      } else if (i > 0 && units.length > 2) { // If this is the last of 2+
        text = ', and ' + text;
      } else if (i > 0 && units.length === 2) {
        text = ' and ' + text;
      }

      fullText += text;
    }

    return fullText;
  }
	
	function MClickUpgrade(id, name, percentage, multiplier, price, flavor, description) {
	    Upgrade.call(this, id, name, price, flavor, 'touch_app');
	    this.percentage = percentage;
	    this.multiplier = multiplier;
	    this.type = 'click';
	    
	    var multText = 'Add <b>' + (multiplier) + '</b> to your <b>Cash Earned per Click</b> multiplier.';
	    var percText = 'Increase your <b>Cash Earned per Click</b> by <b>' + percentage + '%</b> of your current <b>Dollars per Second</b>.'; 
	    var both = 'Add <b>' + (multiplier) + '</b> to your <b>Cash Earned per Click</b> multiplier, as well as <b>' + percentage + '%</b> of your current <b>Dollars per Second</b>.';
	    
	    var currentDefault = both;
	    if (!percentage || !multiplier) {
	      currentDefault = this.percentage > 0 ? percText : multText;
	    }
	    
	    this.descriptionText = ko.observable(description ? description : currentDefault);
	    
	    this.handlePurchase = function() {
	      manualClickDPSPercentage.add(this.percentage);
				manualClickMultiplier.add(this.multiplier);
	    };
	}
	
	function CountUpgrade(id, name, percentage, multiplier, price, flavor, description, icon) {
	    Upgrade.call(this, id, name, price, flavor, icon ? icon : 'attach_money');
	    this.percentage = percentage;
	    this.multiplier = multiplier;
	    this.type = 'count';
	    
	    var multText = 'TBD';
	    var percText = 'Inflate your <b>Total Mod to Cash Per Second</b> by an additional <b>' + percentage + '%</b>.';
	    var currentDefault = this.percentage > 0 ? percText : multText;
	    this.descriptionText = ko.observable(description ? description : currentDefault);
	    
	    this.handlePurchase = function() {
	      overallDPSPercentage.add(this.percentage);
				overallDPSMultiplier.add(this.multiplier);
	    };
	}
	
	function InvestmentsAllowedUpgrade(id, name, investmentsAllowed, price, flavor, description) {
	    Upgrade.call(this, id, name, price, flavor, 'access_time');
	    this.type = 'investmentsAllowed';
	   // this.icon = 'access_time';
	    
	    this.descriptionText = ko.observable(description ? description : 'Increase the number of <b>Simultaneous Investments</b> permitted by <b>' + investmentsAllowed + '</b>.');
	    this.handlePurchase = function() {
	        simultaneousInvestments.add(investmentsAllowed);  
	    };
	}
	
	function InvestmentInterestUpgrade(id, name, rate, price, flavor, description) {
	    Upgrade.call(this, id, name, price, flavor, 'access_time');
	    this.type = 'investmentInterest';
	    //this.icon = 'access_time';
	    
	    this.descriptionText = ko.observable(description ? description : "Raise the per-second <b>Investment Interest Rate</b> by <b>" + rate + "%</b>.");
	    this.handlePurchase = function() {
	        interestRate.add(rate);
	    };
	}
	
	function StatUpgrade(id, name, icon, stat, valueToAdd, price, description, flavor) {
	    Upgrade.call(this, id, name, price, flavor, icon);
	    
	    this.descriptionText = ko.observable(description);
	    this.handlePurchase = function() {
	        stat.add(valueToAdd);
	    };
	}
	
	function AwardCountUpgrade(id, name, percentage, price, flavor, description) {
	    Upgrade.call(this, id, name, price, flavor);
	    this.percentage = percentage;
	    this.type = 'awardCount';
	    
	    this.descriptionText(description ? description : 'Boosts the percentage bonus of each of your achievements by <b>' + percentage + '%</b>. ');
	    
	    this.handlePurchase = function() {
	      achievementBonusRate.add(this.percentage);
	    };
	}
	
	function UnitCountUpgrade(id, name, percentage, price, flavor, description) {
    Upgrade.call(this, id, name, price, flavor, 'receipt');
    this.percentage = percentage;
    this.type = 'unitCount';
    
    this.descriptionText(description ? description : 'Boosts the percentage bonus of each of your employees by <b>' + percentage + '%</b>. ');
    
    this.handlePurchase = function() {
      unitCountBonusRate.add(this.percentage);
    };
	}

  function OneUnitCountUpgrade(id, name, unit, mod, price, flavor, description) {
    Upgrade.call(this, id, name, price, flavor, 'lock');
    this.mod = mod;
    this.type = 'unitCount';
    
    var name = getUnit(unit).name();
    this.descriptionText(description ? description : 'Chokes each of your <b>' + name + '</b> for an extra <b>' + mod + '%</b> for every <b>' + name.substring(0, name.length - 1) + '</b> employed.');
    
    this.handlePurchase = function() {
      getUnit(unit).numMod.add(this.mod);
    };
  }
	
	/*************************************************************
						ACHIEVEMENT CONSTRUCTORS
	*************************************************************/
	
	function AwardBase(id, name, threshold, unlocks, flavor) {
	  this.id = id;
	  this.name = name;
	  this.threshold = threshold;
	  this.unlocks = unlocks;
	  this.date = ko.observable(null);
	  this.awarded = ko.observable(false);
    this.upgradesUnlocked = ko.observable(false);
	  this.read = ko.observable(false);
	  this.flavorText = ko.observable(flavor ? flavor : 'Not bad...');
	  this.icon = ko.observable('check_circle');
	  
	  this.unlock = function() {
      if (!this.upgradesUnlocked()) {
        this.upgradesUnlocked(true);
    	  for (var i = 0; i < this.unlocks.length; i++) {
    	    for (var j = 0; j < upgrades().length; j++) {
    	      if (this.unlocks[i] === upgrades()[j].id) {
              if (!upgrades()[j].bought())
    	        upgrades()[j].available(true);
              upgrades()[j].trackAffording();
    	        break;
    	      }
    	    }
    	  }
      }
	  };
	  
	  this.earn = function() {
	    if (!this.awarded()) {
  	    if (this.name !== 'trigger') {
          this.date(new Date().toISOString());

          try {
            gtag('event', 'achievement_earned', {
              'event_category': 'business_simulator',
              'event_label': this.name
            });
          } catch (err) {
            console.log('Google Analytics is unavailable');
          }
        }
        
        this.awarded(true);
        document.dispatchEvent(new CustomEvent("achievement-earned", { "detail": { 
          "name": this.name,
          "id": this.id
        }}));
	    }

      if (!this.upgradesUnlocked()) {
        this.unlock();
      }

      this.earned = null;

	  };
	  
	  this.select = function() {
      selectedUpgrade(this);
      selectedUpgrade().flavorText('Unlocked about ' + achievementTimeSinceStart(this.date()));
	    this.read(true);
	  };

    this.hoverVisible = ko.observable(false);
    this.viewDetails = function(isStatsTab) {
      if (enableHover() && window.screen.availWidth >= 400 && (isStatsTab !== true || this.awarded())) {
        clearTimeout(this.visibilityDelay);
        this.visibilityDelay = setTimeout(function() {
          this.hoverVisible(true);
          this.flavorText('Unlocked about ' + achievementTimeSinceStart(this.date()));
        }.bind(this), HOVER_DELAY);
      }
    }

    this.leaveDetails = function() {
      clearTimeout(this.visibilityDelay);
      this.visibilityDelay = setTimeout(function() {
        this.hoverVisible(false);
      }.bind(this), HOVER_HIDE_DELAY);
    }
	}
	
	function UnitAward(id, name, unit, threshold, unlocks, flavor) {
	    AwardBase.call(this, id, name, threshold, unlocks, flavor);
	    
	    var uName = threshold > 1 ? getUnit(unit).name() : getUnit(unit).name().slice(0, -1);
	    var singleText = 'Hire your first <b>' + uName + '</b>.';
	    this.descriptionText = ko.observable(threshold === 1 ? singleText : 'Hire <b>' + threshold + '</b> ' + uName + '.');
	    
	    this.unit = unit;
	    
      this.startTracking = function() {
        this.earned = ko.computed(function() {
          if (units && getUnit(this.unit.toString()).num.val() >= this.threshold) {
            this.earn();
          } 
        }, this);
      };

      this.startTracking();
	}
	
	function Award(id, name, threshold, unlocks, stat, description, flavor)  {
      AwardBase.call(this, id, name, threshold, unlocks, flavor);
      
      var num = stat.isCash() ? '$' + format(threshold) : format(threshold);
      this.descriptionText = ko.observable(
        description ? description : 'Raise the ' + getQuantityWord(stat.isCash()) + ' of <b>' + stat.name + '</b> to <b>' + num + '</b>.'
      );
      
	    this.stat = stat;

      this.startTracking = function() {
  	    this.earned = ko.computed(function() {
  	      if (this.stat && this.stat.val() >= this.threshold) {
            this.earn();
  	      }
  	    }, this);
      };

      this.startTracking();
	}
	
	function CustomAward(id, name, unlocks, conditions, description, flavor) {
	    AwardBase.call(this, id, name, null, unlocks, flavor);
	    this.descriptionText = ko.observable(description);
	    
      this.startTracking = function() {
  	    this.earned = ko.computed(function() {
  	        var allConditionsMet = conditions.every(function(c) {
  	            return c.type === 'gte' ? c.stat.val() >= c.val : c.stat.val() <= c.val;
  	        });
  	        
  	        if (allConditionsMet) {
  	            this.earn();
  	        }
  	    }, this);
      };

      this.startTracking();
	}
	
	function ManualAward(id, name, unlocks, description, flavor) {
	  AwardBase.call(this, id, name, null, unlocks, flavor);
	  this.descriptionText = ko.observable(description ? description : 'Test description...');
	}
	
	function getQuantityWord(isCash) {
	  if (isCash) {
	    return 'amount'; 
	  } else {
	    return 'number';
	  }
	}

  /*************************************************************
            CAREER DEVELOPMENT SYSTEM
  *************************************************************/

  function PermStatBoost(id, unit, icon, mod, name, description, flavor) {
    Upgrade.call(this, id, name, 0, flavor, icon);
    this.id = id;
    this.level = ko.observable(0);
    this.descriptionText = ko.observable(description.replace('%percent', mod + '%'));
    this.modifier = mod;
    this.unit = unit;
    this.cost = new Stat('Price', ko.computed(function() {
      return Math.round(Math.pow(1.5, this.level()));
    }, this));

    this.cantAfford = ko.computed(function() {
      return this.cost.val() > trainingSeminars.val();
    }, this);

    this.available = ko.computed(function() {
      var unit = getUnit(this.unit)
      return unit != undefined ? getUnit(this.unit).available() : false;
    }, this);

    this.correspondingEmployee = ko.computed(function() {
      var unit = getUnit(this.unit)
      return unit != undefined ? getUnit(this.unit).name() : false;
    }, this);

    this.total = new Stat('Value', ko.computed(function() {
      if (units && getUnit(unit)) {
        var base = this.level() * this.modifier;
        return base + (base * (getUnit(unit).trainingBonus.val() / 100));
      } else {
        return 0;
      }
    }, this), null, '%');

    this.hoverVisible = ko.observable(false);
    this.viewDetails = function() {
      if (enableHover() && window.screen.availWidth >= 500) {
        clearTimeout(this.visibilityDelay);
        this.visibilityDelay = setTimeout(function() {
          this.hoverVisible(true);
        }.bind(this), HOVER_DELAY);
      }
    }

    this.leaveDetails = function() {
      clearTimeout(this.visibilityDelay);
      this.visibilityDelay = setTimeout(function() {
        this.hoverVisible(false);
      }.bind(this), HOVER_HIDE_DELAY);
    }
  }

  PermStatBoost.prototype.levelUp = function() {
    if (trainingSeminars.val() >= this.cost.val()) {
      trainingSeminars.sub(this.cost.val());
      seminarsUsed.add(this.cost.val());
      earnAchievement('ps0');
      this.level(this.level() + 1);

      if (this.level() >= 10) { earnAchievement('ps1'); }  
      if (this.level() >= 20) { earnAchievement('ps2'); }
      if (this.id === 'pm2') { this.checkCrypticNotifications(); }

      checkForAllCareerDevelopments();
    }
  }

  PermStatBoost.prototype.checkCrypticNotifications = function() {
      if (this.level() === 5) {
        document.dispatchEvent(new CustomEvent("cryptic-notification", { "detail": "True sight expands your ability to invest..." }));
      }

      if (this.level() === 10) {
        document.dispatchEvent(new CustomEvent("cryptic-notification", { "detail": "Your email inbox seems to have opened its mind..." }));
      }
  }

  function checkForAllCareerDevelopments() {
    var somethingMissing = false;
    var somethingMissing10 = false;
    var somethingMissing20 = false;
    for (var i = 0; i < careerUpgrades().length; i++) {
      if (careerUpgrades()[i].level() === 0) { somethingMissing = true; }
      if (careerUpgrades()[i].level() < 10) { somethingMissing10 = true; }
      if (careerUpgrades()[i].level() < 20) { somethingMissing20 = true; }
    }

    if (!somethingMissing) { earnAchievement('ps3'); }
    if (!somethingMissing10) { earnAchievement('ps4'); }
    if (!somethingMissing20) { earnAchievement('ps5'); }
  }

  var trainingHoursValidation = ko.computed(function() {
    if (trainingHours() < 1) {
      return 'Employees must train for at least 1 hour to learn anything valuable'
    } else if (trainingHours() > 12) {
      return 'Due to employee laziness, 12 straight hours of training is the maximum'
    } else {
      return null
    }
  }, this);

  var trainingsComplete = ko.computed(function() {
    return units().filter(function(u) {
      return u.trainingFinished();
    }).length;
  }, this);

  // Your Interns are -
  var trainingText = {
    0: [ // Interns
      'learning <b>hard work</b> and <b>discipline</b> by taking on a second unpaid internship during their off hours.',
      'attending <b>menial task workshops</b> in order to learn the ideal way to bring lunch to old white men during meetings.',
      'spending 60 hours weekly at <b>life skills seminars</b> to learn how to refinance student loans to continue living without income.',
      'attending <b>1-on-1 meetings</b> with management to discuss how there really just might be a full time position coming up soon.',
    ],
    1: [ // Wage Slaves
      'spending 20 hours weekly in <b>mandatory employee therapy sessions</b> to learn how to manage non-stop fight-or-flight responses.',
      'attending daily <b>group counseling sessions</b> to avoid fusing with the thought that there is no future, no hope, no light at the end of the tunnel, only blank gray cubicle walls that seem to stretch into an infinite, empty future.',
      'attending annual <b>company conferences</b> during which Coldplay will be performing, but only for level 2 managers and above, as well as corporate partners.',
      'participating in <b>detailed safety meetings</b> during which light-hearted videos will explain that no benefits will be paid out to employees who intentionally enter the industrial baler.',
    ],
    2: [ // Sales Hotshots
      'spending hours each morning in <b>Rise & Grind Breakfast Meetings</b> to learn the newest techniques to convince potential buyers that products both work and exist.',
      'attending daily <b>communication workshops</b> to learn to mask the sound of crying over the phone as they scream "I really need a win right now" again and again.',
      'memorizing <b>daily mantras</b> to maintain an aura of mental calm and avoid losing one\'s sense of self and identity after being hung up on for the 653rd cold call in a row while desperately trying to sell leads harvested from the mostly fake user profiles of a website that aggregates reviews of phones.',
      'studying the <b>Annual Bonus Plan</b> for the Sales Department and looking up discount vacation packages for resorts in Mexico, refreshing both pages over and over again in the futile hope that the prices might line up, every click weighed down by the memory of the road trips they used to take when their children still loved them.'
    ],
    3: [ // Middle Managers
      'reading <b>Top 10 Listicles</b> about the best ways to leverage what limited power they actually have over their subordinates in order to feel like they have some kind of agency in their lives.',
      'taking <b>interpersonal skills courses</b> to find more tactful ways to tell subordinates to take notes during meetings in order to maintain a sense of control and authority in their otherwise spiraling lives.',
      'reading <b>LinkedIn articles by Life-Hack Gurus</b> about innovative business strategies that cutting edge startups have implemented, then scouring the comments for some kind of insight into why their employees responded so poorly when they kicked in the door the next morning and forced everyone to read that LinkedIn article and start doing everything it said.',
      'poring over <b>Forbes 30 Under 30</b> lists to try to pinpoint the moment in their own lives where everything went wrong, where they could have made one choice, but made the wrong one, and how they ended up trapped in their own skin, staring at the top rungs of a ladder they\'ll never climb, thinking every night of that one hollow-point bullet they\'ve been saving all these years.'
    ],
    4: [ // C-Levels
      'watching <b>TED Talks</b> about the best way to create a floating micronation in international waters that will act as a beacon for tech geniuses who want to create killer apps unfettered by government regulation.',
      'listening to <b>professional pseudo-scientists</b> explain how hierarchies occur in nature, which completely justifies their impulse to funnel the fruits of their employees\' labor into a new Mercedes-Benz S-Class.',
      'listening to <b>in-depth investigative podcasts</b> about labor uprisings in Latin America, but with a particular focus on ideal techniques for executing organizers.',
      'taking <b>in-depth economics courses</b> to be better equipped to explain to employees why it is important that stock buybacks and layoffs occur simultaneously, and why it is essential for executive pay to skyrocket, because how else can one ensure that only the best minds will be hired?'
    ],
    5: [ // Blue Bloods
      'attending <b>alumni fundraisers</b> to determine the best ways to funnel money into prestigious universities, because otherwise your granddaughter might attend Harvard even though your husband is a Yale man, and what are the other ladies at the DAR going to think if that happens?',
      'studying <b>international tax codes</b> to find the best techniques for off-shoring and investing their hard-earned wealth to ensure that their childrens\' inheritance is untouched by estate taxes.',
      'reading about the <b>fastest-growing biotech startups</b> in hopes of finding the one rockstar wunderkind who has developed an innovative technique to harvest young peoples\' blood in an attempt at reversing the aging process.',
      'informing themselves about <b>the beliefs of their political representatives</b> in order to determine which $25k-per-plate fundraisers to attend with the intention of taking a moment of a candidate\'s time to discuss the ways in which free at the point of service healthcare is actually bad because people really don\'t want things handed to them.'
    ],
    6: [ // Cops
      'taking local <b>arts and crafts courses</b> to improve their penmanship when etching "You\'re Fucked" onto their rifles, which is essential to their ability to protect and also to serve.',
      'taking lessons from <b>military consultants</b> to learn how to drive Army Surplus APCs into civilian populations to finally put a stop to the insidious War on Cops that began the day Obama invented racism by saying that Trayvon Martin could have been his son.',
      'studying <b>community outreach literature</b> to find new techniques to play basketball with some local kids, or make a silly joke on Instagram, or record a video where they pull somebody over but then give them a gift card, all in order to convince the general public not to complain too much once they\'ve been extrajudicially executed.',
      'learning <b>tactical defense techniques</b> in order to patrol the halls of local schools and protect students from would-be mass shooters, or, more often, choke-slam teens who they perceive as being belligerent, which is the only way to ensure that they do not forget their place in the prison pipeline.'
    ],
    7: [ // Politicians
      'taking <b>critical reading courses</b> to learn how to better intrepret Orwell\'s 1984 as being an allegory for a nightmarish dystopian hell-scape in which pink-haired students are rude to conservatives on college campuses',
      'studying <b>theories of pragmatism</b> in order to become more confident in the inspirational belief that things need to change, but when they do, that change should be incremental and profoundly ineffectual.',
      'watching <b>old episodes of The West Wing</b> to learn the rhetorical fundamentals of awe-inspiring speeches and how divorcing the signifier from the signified can make them that much more effective.',
      'studying <b>rhetorical strategies</b> to find new ways to explain that there is nothing contradictory about a progressive platform that values the lumbering authoritarianism of an ever-growing carceral state, because they saw photos of Willie Horton in 1988 and they have daughters, you know?'
    ],
    8: [ // Mercs
      'watching <b>facial hair grooming</b> YouTube videos for hours at a time to learn the most advanced techniques to police that mustache.',
      'attending <b>advanced firearm proficiency courses</b> in order to become adept at explaining, via targeted internet comment, when something is not a clip, but a magazine.',
      'discussing how to deal with <b>painful memories</b>, such as the time they were in this bar in Saigon and this kid comes up, this kid carrying a shoe-shine box. And he says, uh, "Shine, please, shine!" They said "No." He kept askin\', yeah, and Joey said "Yeah." And, they went to get a couple beers, and the&mdash;the box was wired, and he opened up the box, fucking blew his body all over the place. And he\'s laying there, and he\'s fuckin\' screaming, there\'s pieces of him all over them, just... like this, and they\'re tryin\' to pull him off, you know, and they&mdash;their friend that\'s all over them! They got blood and everything, and they\'re tryin\' to hold him together, they put him together, his fuckin\' insides keep comin\' out, and nobody would help! Nobody\'d help, and he\'s sayin\' "Hey, I wanna go home! I wanna go home!" He keeps calling their names! "I wanna go home, guys! I wanna drive my Chevy!" They said "With what? I can\'t find your fuckin\' legs! I can\'t find your legs!" They can\'t get it out of their heads. They\'ve&mdash;they\'ve dreamed this seven years. Every day, they have this. And sometimes, they wake up, and they don\'t know where they are. They don\'t talk to anybody. Sometimes a day... a week... they can\'t put it out of their minds.',
      'planning <b>extended indiscriminate bombing campaigns</b> that only inadvertantly decimate weddings and hospitals and other civilian population centers, because that is the only way to fight back against a savage and war-like radical terrorist mentality that threatens our weddings and hospitals and other civilian population centers.'
    ],
    9: [ // Client States
      'teaching <b>crowd control techniques</b> to paramilitary groups at the <em>Elliott Abrams School for Winning Hearts and Minds</em> in El Mozote.',
      'learning <b>disaster response techniques</b> to help recover as much merchandise as possible from beneath the bodies and rubble of the collapsed factories in Bangladesh.',
      'studying <b>theoretical labor relations</b> at the <em>Coca Cola Sinaltrainal Memorial Conference</em> in Colombia.'
    ],
    10: [ // Shadow Governments
      'attending <b>Cultural Marxism Symposiums</b> in order to determine the best ways to undermine traditional Western values by encouraging, I don\'t know, miscegenation, probably, or something like that.',
      'studying <b>Frankfurt School Thinkers</b> to find new ways to reshape nice, matronly teachers into aggressively feminist lesbians, in turn stunting the masculine development of our young men, who may otherwise have grown up to be ruthlessly efficient soldiers, or possibly coal miners.',
      'strategizing with <b>Triple-A Game Developers</b> to determine the most effective way of inserting extreme social justice ideology into video games, forcing many well-meaning gamers to instantaneously become racist.',
      'cutting back-room deals with <b>degenerate Hollywood elites</b> in order to surreptitiously shoehorn the Marxist ideology of "diversity" into popular movies and TV shows with the stated goal of "forcing it down the audience\'s throat."',
    ],
    11: [ // Puppetmasters
      'learning to <b>leave careful trails of clues</b> to ensure that pioneering teenagers and manic internet fascists are able to parse their otherwise surreptitious machinations.',
      'attending <b>conspiratorial gatherings</b> in order to come to a consensus on a consistent set of symbols and code words to use while flagrantly advertising their presence.',
      'designing <b>vast networks of secret societies</b> to maintain social and economic control over the entire world and assemble the greatest existential threat to human liberty: Antifa.',
      'laying out <b>detailed long-term plans</b> for the gradual destabilization of Western cultural identity in order to loosen national bonds and bring about authoritarian supranational organizations, which will inevitably be headed by a charismatic figure who will rise to political prominence before descending with his multicultural army on the holy city of Jerusalem.'
    ]
  }

  /*************************************************************
            ACQUISITION SYSTEM
  *************************************************************/

  function getAcquisition(id) {
    for (var i = 0; i < activeAcquisitions().length; i++) {
      if (id === activeAcquisitions()[i].id) {
        return activeAcquisitions()[i];
      }
    }
  }

  var workerDesc = [
    'The eager <b>Personal Assistant</b> is your eyes and ears in every new <b>Acquisition</b>. Fueled by the hope that they may someday be you, they roam your acquired hallways like hungry ghosts, pointing out those who most deserve a pink slip.',
    'The stoic <b>Financial Consultant</b> is the unfeeling brain of your new <b>Acquisition</b>. They see the world in spreadsheets and budgets, every human life reduced to nothing but a number, and the only math they know is subtraction.',
    'The shifty <b>Independent Auditor</b> is the central nervous system of your new <b>Acquisition</b>. Biased only by their paychecks, they find profits where there were none and make tax liabilities disappear, always dedicated to raising the bottom line.',
    'The regal <b>Executive Financier</b> is the beating heart of your new <b>Acquisition</b>. They inspire with their leadership and business savvy, hopping from company to crumbling company, eyes always fixed on the next most expendable employee.'
  ];

  function Acquisition(size, name, employees, price, sizeDivider, load) {
    this.id = Date.now().toString();
    this.active = ko.observable(load ? load.active : true);
    this.sold = ko.observable(false);
    this.dateAcquired = ko.observable(Date.now());
    this.size = size;
    this.initialPrice = new Stat('Initial Price', load ? load.price : price, '$');
    this.initialEmployees = load ? load.iEmp : Math.round(employees);
    this.currentEmployees = new Stat('Current Employees', load ? load.cEmp : this.initialEmployees);
    this.cashSpent = new Stat('Cash Spent', load ? load.spent : 0, '$');
    this.clicks = new Stat('Clicks', load ? load.clicks : 0);
    this.sizeDivider = load ? load.sizeD : sizeDivider;
    this.name = load ? load.name : (name ? name : getCompanyName());
    this.description = load ? load.desc : getAcquisitionDescription(this.name, this.initialEmployees);
    this.layoffTimer = null;
    this.activeLayoff = ko.observable(false);
    this.activeValBonus = ko.observable(false);
    this.fireClicked = ko.observable(false);

    this.workers = ko.observableArray([
      new AcquisitionWorker('w1', load ? load.emp0 : 0, 'Personal Assistants', 1, this.cashSpent, this.initialPrice.val() * 0.005 / this.sizeDivider, workerDesc[0], 'flav'), // Add to auto progress // Mass Layoffs
      new AcquisitionWorker('w2', load ? load.emp1 : 0, 'Financial Consultants', 1, this.cashSpent, this.initialPrice.val() * 0.025 / this.sizeDivider, workerDesc[1], 'flav'), // Add to amount gained from clicking // New Policies (encourage to quit)
      new AcquisitionWorker('w3', load ? load.emp2 : 0, 'Independent Auditors', 1, this.cashSpent, this.initialPrice.val() * 0.050 / this.sizeDivider, workerDesc[2], 'flav'),  // Add to overall value // Value bonus clicking
      new AcquisitionWorker('w4', load ? load.emp3 : defaultExecutives.val(), 'Executive Financiers', 1, this.cashSpent, this.initialPrice.val() * 0.100 / this.sizeDivider, workerDesc[3], 'flav') // Add to all three // Something else email... (fired)
    ]);

    this.mail = ko.observableArray([]);
    this.chats = ko.observableArray([]);

    this.unreadMessages = ko.computed(function() {
      var read = 0;
      for (var i = 0; i < this.chats().length; i++) {
        var messages = this.chats()[i].messages();
        for (var j = 0; j < messages.length; j++) {
          if (!messages[j].read()) {
            read++;
          }
        }
      }

      return read;
    }, this);

    this.autoMod = new Stat('Auto Mod', ko.computed(function() {
      var num = this.workers()[1].num() + (this.workers()[3].num() / 2);
      var autoEarningRate = 0.0001 /// this.sizeDivider;
      //return this.initialEmployees * (num * autoEarningRate);
      return 1 * num
      //return total + (total * (acqWorkerBoost.total.val() / 100));
    }, this));

    this.clickMod = new Stat('Click Mod', ko.computed(function() {
      var num = this.workers()[0].num() + (this.workers()[3].num() / 2);
      var clickRate = 0.000075 /// this.sizeDivider;
      //var base = this.initialEmployees * (clickRate + (num * clickRate));
      var base = 1 + (0.5 * num)
      return base * (this.activeLayoff() ? 3 : 1);
      //return total + (total * (acqWorkerBoost.total.val() / 100));
    }, this));

    this.valMod = new Stat('Value Mod', ko.computed(function() {
      var num = this.workers()[2].num() + (this.workers()[3].num() / 2);
      return (num * 5) + (this.clicks.val() * 0.0005);
    }, this), null, '%');

    this.currentValue = new Stat('Current Valuation', ko.computed(function() {
      var endValue = this.initialPrice.val() * acquisitionValueMultiplier.val();
      var completedPercentage = 1 - (this.currentEmployees.val() / this.initialEmployees);
      var baseValue = completedPercentage * endValue;
      var totalValue = baseValue;
      totalValue = totalValue + (totalValue * (this.valMod.val() / 100));
      return totalValue + (totalValue * (acquisitionBoost.total.val() / 100));
    }, this), '$');

    this.employeesFired = ko.computed(function() {
      return format(Math.round(this.initialEmployees - this.currentEmployees.val()));
    }, this);

    this.netValue = new Stat('Net Value', ko.computed(function() {
      return this.currentValue.val() - this.cashSpent.val();
    }, this), '$');

    this.employeePercentageRemaining = ko.computed(function() {
      return ((this.currentEmployees.val() / this.initialEmployees) * 100) + '%';
    }, this);

    this.mailChance = ko.computed(function() {
      var chance = ((1 * this.workers()[1].num()) / 5) / 10;
      return Math.round(chance * 100) / 100;
    }, this);

    this.layoffChance = ko.computed(function() {
      var chance = ((1 * this.workers()[0].num()) / 5) / 2.5;
      return Math.round(chance * 100) / 100;
    }, this);

    this.valBonusChance = ko.computed(function() {
      var chance = ((1 * this.workers()[2].num()) / 5) / 5;
      return Math.round(chance * 100) / 100;
    }, this);

    this.chatChance = ko.computed(function() {
      var chance = ((1 * this.workers()[3].num()) / 5) / 20;
      return Math.round(chance * 100) / 100;
    }, this);

    this.checkInterval = 1000;
    this.lastLoop = Date.now();
    this.timer = setInterval(function() {
      var now = Date.now();
      var elapsedTime = now - this.lastLoop;
      this.lastLoop = now;
      
      if (elapsedTime < 60000) {
        var total = this.autoMod.val() * (elapsedTime / this.checkInterval);
        if (this.currentEmployees.val() > 0) {
          this.checkForMail();
          this.checkForChat();
          this.currentEmployees.sub(total ? total : 0); 
        } else {
          this.currentEmployees.val(0);
          this.active(false);
          this.clearChats();
          clearInterval(this.timer);
        }
      }
    }.bind(this), this.checkInterval);
  }

  Acquisition.prototype.selectAcquisition = function() {
    regularInbox(false);
    viewingAcquisition(this);
  };

  Acquisition.prototype.fire = function() {
    if (this.currentEmployees.val() > 0) {
      var clicksToAdd = 1 + (0.01 * this.workers()[0].num())
      this.checkForLayoffs();
      this.checkForValBonus();
      this.clicks.add((clicksToAdd * (this.activeLayoff() ? 3 : 1)) * (this.activeValBonus() ? 100 : 1));
      this.currentEmployees.sub(this.clickMod.val());

      this.fireClicked(true);
      clearTimeout(this.clickTimer);
      this.clickTimer = setTimeout(function() {
        this.fireClicked(false);
      }.bind(this), 200);
    }
  };

  Acquisition.prototype.checkForLayoffs = function() {
    if (Math.random() * 100 < this.layoffChance()) {
      clearInterval(this.layoffTimer);
      this.activeLayoff(true);
      layoffsConducted.add(1);
      this.layoffTimer = setTimeout(function() {
        this.activeLayoff(false);
      }.bind(this), 5000);
    }
  }

  Acquisition.prototype.checkForValBonus = function() {
    if (Math.random() * 100 < this.valBonusChance()) {
      clearInterval(this.valBonusTimer);
      this.activeValBonus(true);
      fudgedNumberSessions.add(1);
      this.valBonusTimer = setTimeout(function() {
        this.activeValBonus(false);
      }.bind(this), 5000);
    }
  }

  Acquisition.prototype.fireByMail = function(wordBonus, timeBonus) {
    policiesAccepted.add(1);
    if (this.currentEmployees.val() > 0) {
      var baseToFire = this.autoMod.val() * 30;
      var timeModded = baseToFire * timeBonus;
      var total = Math.round(timeModded + (timeModded * (wordBonus / 100)));
      this.currentEmployees.sub(total);
      return total;
    } else {
      return 0;
    }
  };

  Acquisition.prototype.checkForMail = function() {
    if (Math.random() * 100 < this.mailChance()) {
      if (awayPolicyInbox().active()) {
        new Email(false, false, 'RE: New Policy Proposal for ' + this.name, getRandomAcquisitionBody(), null, this.id).respond();
      } else if (this.mail().length < MAXIMUM_ACQUISITION_MAIL) {
        this.addMail();
      }
    }
  }

  Acquisition.prototype.addMail = function() {
    this.mail.push(new Email(false, false, 'RE: New Policy Proposal for ' + this.name, getRandomAcquisitionBody(), null, this.id));
  };

  Acquisition.prototype.checkForChat = function() {
    if (Math.random() * 100 < this.chatChance()) {
      if (awayChatInbox().active()) {
        handleFakeChat(this, awayChatInbox().message());
      } else if (this.chats().length < MAXIMUM_CHATS) {
        this.addChat();
      }
    }
  };

  Acquisition.prototype.sell = function() {
    addClicks(this.netValue.val());
    earnedFromAcquisitions.add(this.netValue.val());
    clearInterval(this.timer);
    this.sold(true);
    completedAcquisitions.add(1);
    completedAcquisitionsAllTime.add(1);
    this.checkAwards();
    setTimeout(function() {
      viewingChat(new Chat());
      activeAcquisitions.remove(this);
    }.bind(this), 6000);
  };

  Acquisition.prototype.checkAwards = function() {
    if (this.currentEmployees.val() === 0) {
      if (this.initialEmployees < 10000) {
        earnAchievement('aqs1');
      } else if (this.initialEmployees > 1000000) {
        earnAchievement('aqs2');
      }
    } else {
      if (this.netValue.val() < this.initialPrice.val()) {
        earnAchievement('loss1');
      }
    }
  }

  Acquisition.prototype.addChat = function() {
    this.chats.push(new Chat(Date.now(), getRandomName(), this));

    if (this.chats().length >= MAXIMUM_CHATS) {
      earnAchievement('chat1');
    }
  }

  Acquisition.prototype.clearChats = function() {
    for (var i = 0; i < this.chats().length; i++) {
      this.chats()[i].handleAcquisitionFinish();
    }
  }

  /****************************************
                ACQUISITION - CHAT
  *****************************************/

  var firstMessages = ['hey', 'hello', 'hey there', 'hi', 'how\'s it going?', 'howdy', 'oh hey'];

  // Random delay after each message - the longer the total time to get the end, the more firings there are
  function Chat(id, name, parentAcquisition) {
    this.id = id;
    this.name = name;
    this.firstName = this.name ? this.name.split(' ')[0] : '';
    this.lastName = this.name ? this.name.split(' ')[1] : '';
    this.messages = ko.observableArray([]);
    this.timer = null;
    this.typingTimer = null;
    this.followupTimer = null;
    this.messagesFinished = ko.observable(false);
    this.inputMessage = ko.observable('');
    this.showTyping = ko.observable(false);
    this.computerReplies = 1;
    this.keyStrokes = 0;
    this.parentAcquisition = parentAcquisition;
    this.timePassed = 0;
    this.timePassedFormatted = ko.observable(null);
    this.textBonus = 0;
    this.textBonusFormatted = ko.observable(null)
    this.fired = ko.observable(null);
    this.finished = ko.observable(false);
    this.selected = ko.observable(false);
    this.productsMentioned = 0;

    if (this.parentAcquisition) {
      this.messages.push(new Message(this.firstName, getRandomFromArray(firstMessages)));
    }

    this.unreadMessages = ko.computed(function() {
      var count = 0;
      for (var i = 0; i < this.messages().length; i++) {
        if (!this.messages()[i].read()) {
          if (viewingChat && viewingChat() === this && $('#chatModal').hasClass('in')) { // TODO make an observable that tracks if the modal is open
            this.messages()[i].read(true);
          } else {
            count++;
          }
        }
      }

      return count;
    }, this);
  }

  Chat.prototype.close = function() {
    this.parentAcquisition.chats.remove(this);
    viewingChat(new Chat());
  }

  Chat.prototype.select = function() {
    var allChats = this.parentAcquisition.chats();
    for (var i = 0; i < allChats.length; i++) {
      allChats[i].selected(false);
    }

    viewingChat(this);
    this.selected(true)
    this.inputMessage('')

    // Pull focus to the text box
    $('#chat-response').focus();
  }

  Chat.prototype.addMessage = function(source, text) {
    this.messages.push(new Message(source, text));
    document.dispatchEvent(new CustomEvent("new-message"));
  };

  var qFollowups = [
    'you there?', 'hello?', 'you around?', 'hey, you there?', 'are you still there?'
  ];

  var qFollowups2 = [
    'are you getting these?', 'you still there?', 'you still around?', 'did you leave?', 'you getting my messages?'
  ];

  var qGiveups = [
    'fine, never mind', 'never mind then', 'ok, I\'ll find someone else then', 'ugh never mind', 'fine, bye', 
  ];

  Chat.prototype.handleFirings = function() {
    var percentage = this.timePassed / 40000000;
    var fired = this.parentAcquisition.initialEmployees * percentage;
    fired = Math.round(fired + (fired * (this.textBonus / 100)));
    this.finished(true);
    chatsCompleted.add(1);

    setTimeout(function() {
      this.timePassedFormatted(getFormattedTime(this.timePassed));
      this.textBonusFormatted(format(this.textBonus));

      if (this.parentAcquisition.currentEmployees.val() > fired) {
        this.parentAcquisition.currentEmployees.sub(fired);
      } else {
        fired = this.parentAcquisition.currentEmployees.val()
        this.parentAcquisition.currentEmployees.val(0)
      }

      this.fired(format(fired));
    }.bind(this), 2000);    
  }

  Chat.prototype.respond = function(text) {
    var input = $(text[1])
    if (!this.finished() && this.messages().length !== 0 && input.val() !== '') {
      this.addMessage('You', input.val());
      this.analyzeText(input.val());
      input.val('');

      clearInterval(this.followupTimer);
      clearInterval(this.secondFollwupTimer);
      clearInterval(this.finalFollowupTimer);
      if (!this.timer && !this.messagesFinished()) {
        var time = getRandomInt(10000, 100000);
        //var time = getRandomInt(5000, 10000)
        this.timePassed = this.timePassed + time;
        this.timer = setTimeout(function() {
          this.showTyping(false);
          this.handleNextMessage();
          this.timer = null;
        }.bind(this), time);

        this.typingTimer = setTimeout(function() {
          this.showTyping(true);
        }.bind(this), time / 2);

        this.followupTimer = setTimeout(function() {
          this.addMessage(this.firstName, getRandomFromArray(qFollowups));
        }.bind(this), time * 5);

        this.secondFollwupTimer = setTimeout(function() {
          this.addMessage(this.firstName, getRandomFromArray(qFollowups2));
        }.bind(this), time * 25);

        this.finalFollowupTimer = setTimeout(function() {
          this.addMessage(this.firstName, getRandomFromArray(qGiveups));
          this.finished(true);
        }.bind(this), time * 50);
      } else if (!this.timer && this.messagesFinished()) {
        this.timer = setTimeout(function() {
          this.showTyping(false);
          this.timer = null;
          this.addMessage(this.firstName, getRandomFromArray(qConfirmations));
          this.handleFirings();
        }.bind(this), 3000);

        this.typingTimer = setTimeout(function() {
          this.showTyping(true);
        }.bind(this), 1500);
      }
    }
  };

  var secondMessages = [
    'you got a sec? need some advice',
    'just a quick question',
    'question for you', 
    'I have a question',
    'quick question',
    'clear something up for me',
    'help me out with something',
    'I need your help with something',
    'I need a little help with something',
    'point me in the right direction here',
    'need to pick your brain for a minute',
    'need your input on something',
    'you busy? I need some help',
    'you free for a minute? I need your input',
  ];

  var delays = [
    'just a sec', 'just a minute', 'hold on a sec', 'hold on a minute', 'wait hold on', 'actually wait a sec', 'sorry just a minute',
    'give me a minute', 'give me a second', 'hold on', 'sorry wait'
  ];

  var delayReasons = [
    'active shooter in the building',
    'gotta finish teaching this homeless guy to code',
    'just finishing up a poem dedicated to John McCain',
    'the drug testing drone is coming around',
    'somebody just jumped off the roof',
    'there\'s another fire in the warehouse',
    'the coal ash is leaking again',
    'the canary just died, we have to evacuate',
    'the boss\'s daughter is here to sing a song?',
    'the boss wants me to add dots to some forms',
    'car bomb in the parking lot',
    'the chemical weapons siren is going off',
    'some people outside are supposedly protesting a video',
    'the protesters are throwing bricks at the windows again',
    'somebody got stuck in the toxic slurry',
    'there\'s a migrant caravan outside the gates',
    'one of the interns fell into the textile thresher',
    'one of the newbies got caught in the hydraulic press again',
  ];

  // Question parts
  var qStarts = [
    'so', 'okay so', 'well', 'ok so', 'so basically', 'basically the issue is', 'so the problem is',
    'ok, so I need some help', 'basically what\'s happening is', 'ok, so the issue is'
  ];

  var qQuantities = [
    'some of the', 'a bunch of the', 'most of the', 'a lot of the', 'a bunch of', 'tons of the',
    'an unfortunate number of', 'almost all of the', 'pretty much all of the', 'lots of the'
  ];

  var qDepartments = [
    'janitorial fleet', 'sub-basement mailroom', 'means-testing department', 'content mill', 'cubicle maze',
    'slurry fields', 'salt mines', 'coal ash department', 'cybernetic warfare division', 'medical ward',
    'social media pens', 'sales panopticon', 'phone bank', 'administrative assistant\'s stockade', 'noxious products ward'
  ];

  var qTalking = [
    'have been talking', 'have been making some noises', 'are getting a bit restless', 'seem a bit agitated', 'have been making some complaints', 'seem to have some complaints',
    'have been grumbling a bit', 'are a bit upset', 'are getting hysterical', 'are all worked up', 'seem a bit distressed', 'have been whining', 'keep moaning about this and that'
  ];

  var qDesires = [
    'it seems like they', 'it sounds like they', 'they seem to', 'it\'s starting to sound like they', 'I\'m getting the impression they', 'looks like they', 'I think they',
    'some of the floor managers think they', 'it looks like they', 'I have a feeling they'
  ];

  var qActions = [
    'want to talk about unionizing', 'think they should start getting paid in actual legal tender', 'want to use some of their vacation days',
    'want to know why they aren\'t receiving hazard pay', 'want to start getting actual paychecks', 'want to stop getting put in solitary confinement',
    'want to put the yellow warning markers back in even though the boss doesn\'t like them', 'think they should get eye-wash stations installed (because of all the acid)',
    'want to start leaving the doors unlocked (because of all the fires)', 'feel like they ought to be allowed to leave at night - something about missing their families',
    'want us to do something about all the shootings', 'might be realizing who we\'ve been selling the weapons to', 'might be thinking that all the deaths are bad for morale',
    'want some kind of protective breathing equipment (because of all the fumes)', 'want us to remove some of the bodies that have been piling up',
    'want to be able to shop at places other than company stores, for some reason', 'might be taking issue with the armed guards at the entrances and exits',
    'might be starting to think they ought to be able to use the bathrooms during work hours', 'don\'t seem to like blood tithing as a disciplinary measure'
  ];

  var qQuestions = [
    'what do we do about this?', 'how should we handle this?', 'what do you want us to do?', 'how do we proceed?', 'what should we do?',
    'what should we do here?', 'what do you want us to do?', 'what\'s the best way forward with that?', 'what should we tell them?'
  ];

  var qConfirmations = [
    'you got it', 'no problem', 'can do', 'will do', 'sounds good', 'I\'m on it', '10-4', 'affirmative',
    'good plan', 'done and done'
  ];

  var qFired = [
    'ah, sorry, I got fired', 'whoops, I\'m fired', 'actually, looks like I\'m fired', 'dang, just got laid off', 'never mind, I got fired', 'never mind, I got canned',
    'actually I have to go, I got fired', 'oops, actually, I\'m fired', 'ah, never mind, I got fired', 'looks like I\'m fired actually', 'never mind, got fired'
  ];

  var finalMessage = 'FIRE THEM ALL';

  function formulateQuestionPart1() {
    return getRandomFromArray(qStarts);
  }

  function formulateQuestionPart2() {
    return getRandomFromArray(qQuantities) + (Math.random() > 0.5 ? ' employees over in the ' : ' employees down in the ') + getRandomFromArray(qDepartments)
      + ' ' + getRandomFromArray(qTalking);
  }

  function formulateQuestionPart3() {
    return getRandomFromArray(qDesires) + ' ' + getRandomFromArray(qActions) + '...';
  }

  function formulateQuestionPart4() {
    return getRandomFromArray(qQuestions);
  }

  Chat.prototype.handleNextMessage = function() {
    var text = 'uh...';
    if (this.messagesFinished()) {
      text = getRandomFromArray(qConfirmations) + ', boss!';
    } else if (this.computerReplies === 1) {
      text = getRandomFromArray(secondMessages);
    } else {
      if (Math.random() < (1 / this.computerReplies)) {
        text = getRandomFromArray(delays) + (Math.random() > 0.5 ? ' - ' + getRandomFromArray(delayReasons) : '...');
      } else {
        text = formulateQuestionPart1();
        this.handleFinalQuestion();
        this.messagesFinished(true);
      }
    }

    this.computerReplies++;
    this.addMessage(this.firstName, text);
  };

  Chat.prototype.handleFinalQuestion = function() {
    this.showTyping(true);

    setTimeout(function() {
      this.addMessage(this.firstName, formulateQuestionPart2())
    }.bind(this), 4000);

    setTimeout(function() {
      this.addMessage(this.firstName, formulateQuestionPart3())
    }.bind(this), 7000);

    setTimeout(function() {
      this.addMessage(this.firstName, formulateQuestionPart4());
      this.showTyping(false);
    }.bind(this), 10000);
  };

  Chat.prototype.checkFinalMessage = function(e) {
    if (this.messagesFinished()) {
      if (this.keyStrokes === 0) {
        this.inputMessage('');
      }

      if (this.keyStrokes < finalMessage.length) {
        this.inputMessage(this.inputMessage() + finalMessage[this.keyStrokes]);
        this.keyStrokes++;
      } else {
        setTimeout(function() {
          this.inputMessage(finalMessage)
        }.bind(this), 25);
      }
    }
  };

  var rudeWords = ['fuck', 'shit', 'ass', 'bitch', 'bastard'];

  Chat.prototype.analyzeText = function(text) {
    var inputWords = text.toLowerCase().split(/\s+/);
    inputWords = inputWords.filter(function(word) {
      return word.length >= 3;
    });
      
    var baseBonus = inputWords.length;
    wordsChatted.add(baseBonus);
    this.textBonus = this.textBonus + baseBonus;

    // Cap it at 100 to prevent too much abuse
    if (this.textBonus > 50) {
      this.textBonus = 50;
    }

    // Check for rude words
    for (var i = 0; i < rudeWords.length; i++) {
      if (inputWords.indexOf(rudeWords[i]) > -1) {
        earnAchievement('pl2')
      }
    }

    var bossName = $('.acquisition .bossname').text();
    var products = [];
    $('.acquisitionproducts').each(function() { 
      products.push($(this).text());
    });

    if (!this.bossMentioned && bossName && new RegExp(bossName.toLowerCase()).test(text.toLowerCase())) {
      this.textBonus += 10;
      this.bossMentioned = true;
      earnAchievement('pl5');
    }

    for (var i = 0; i < products.length; i++) {
      if (this.productsMentioned < 3 && new RegExp(products[i]).test(text)) {
        this.textBonus += 10;
        this.productsMentioned++;
        earnAchievement('pl6');
      }
    }

    if (/[a-zA-z0-9]*(fire them all|FIRE THEM ALL)[a-zA-z0-9]*/.test(text) && !this.messagesFinished()) {
      earnAchievement('pl7');
    }
  }

  Chat.prototype.handleAcquisitionFinish = function() {
    clearInterval(this.followupTimer);
    clearInterval(this.secondFollwupTimer);
    clearInterval(this.finalFollowupTimer);
    clearInterval(this.typingTimer);
    clearInterval(this.timer);

    this.messagesFinished(true);
    this.addMessage(this.firstName, getRandomFromArray(qFired));
    this.finished(true);
  }

  function Message(source, text) {
    this.date = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    this.source = source;
    this.message = text;
    this.read = ko.observable(this.source === 'You' ? true : false);
  }

  var awayChatInbox = ko.observable(new AwayChatInboxData(0, 0, ''))

  function AwayChatInboxData(emails, earned, message) {
    this.start = ko.observable(new Date().toLocaleString());
    this.messages = new Stat('Chat Messages', 0);
    this.fired = new Stat('Away Fired', 0);
    this.message = ko.observable(message);
    this.active = ko.observable(false);

    this.handleChange = function() {
      if (this.active()) {
        this.start(new Date().toLocaleString());
        this.messages.val(0);
        this.fired.val(0);
      }
    }
  }

  function handleFakeChat(acquisition, text) {
    var percentage = 0.00025; // based on a minimal assumption of a 10-second chat: 10000 / 40000000
    var fired = acquisition.initialEmployees * percentage;

    var inputWords = text.toLowerCase().split(/\s+/);
    inputWords = inputWords.filter(function(word) {
      return word.length >= 3;
    });
      
    var baseBonus = inputWords.length;
    wordsChatted.add(baseBonus);
    fired = Math.round(fired + (fired * (baseBonus / 100)));
    chatsCompleted.add(1);

    if (acquisition.currentEmployees.val() > fired) {
      acquisition.currentEmployees.sub(fired);
    } else {
      fired = acquisition.currentEmployees.val()
      acquisition.currentEmployees.val(0)
    }

    awayChatInbox().fired.add(fired);
    awayChatInbox().messages.add(1)
  }

  /******************************************
            ACQUISITION WORKERS
  ******************************************/

  function AcquisitionWorker(id, num, name, baseProgress, cashSpent, basePrice, description, flavor) {
    this.id = id;
    this.name = name;
    this.baseProgress = baseProgress;
    this.basePrice = basePrice;
    this.cashSpent = cashSpent;
    this.flavorText = flavor;
    this.descriptionText = description;
    this.num = ko.observable(num);
    this.progressRate = ko.computed(function() {
      return this.baseProgress;
    }, this);

    this.price = new Stat('Price', ko.computed(function() {
      var base = Math.pow(1.5, this.num()) * this.basePrice;
      return base - (base * (acquisitionsWorkerDiscount.val() / 100));
    }, this), '$');

    this.hoverVisible = ko.observable(false);
    this.viewDetails = function() {
      if (enableHover() && window.screen.availWidth >= 500) {
        clearTimeout(this.visibilityDelay);
        this.visibilityDelay = setTimeout(function() {
          this.hoverVisible(true);
        }.bind(this), HOVER_DELAY);
      }
    }

    this.leaveDetails = function() {
      clearTimeout(this.visibilityDelay);
      this.visibilityDelay = setTimeout(function() {
        this.hoverVisible(false);
      }.bind(this), HOVER_HIDE_DELAY);
    }

    this.select = function() {
      selectedAcquisitionWorker(this);
    };
  }

  AcquisitionWorker.prototype.hire = function() {
    if (this.price.val() <= activeAcquisitions()[0].netValue.val()) {
      this.cashSpent.add(this.price.val());
      this.num(this.num() + 1);

      if (this.num() === 10) {
        switch (this.id) {
          case 'w1': 
            earnAchievement('aqw1');
            break;
          case 'w2': 
            earnAchievement('aqw2');
            break;
          case 'w3': 
            earnAchievement('aqw3');
            break;
          case 'w4': 
            earnAchievement('aqw4');
            break;
        }
      } else if (this.num() === 20) {
        switch (this.id) {
          case 'w1': 
            earnAchievement('aqw5');
            break;
          case 'w2': 
            earnAchievement('aqw6');
            break;
          case 'w3': 
            earnAchievement('aqw7');
            break;
          case 'w4': 
            earnAchievement('aqw8');
            break;
        }
      }
    }
  }

  /*************************************************************
            ACQUISITION DESCRIPTION RANDOMIZER
  *************************************************************/

  var name1 = ['Executive Solutions', 'Dutch India', 'Global Petroleum', 'Security Solutions', 'Global Solutions', 'North Star Defense',
   'Aerospace Tech', 'Global Security', 'International Enforcement', 'International Diamond', 'Elite Defense', 'Risk Control', 'Alexon Security',
   'Industrial Mining', 'Mining Security', 'Oil & Minerals', 'Conflict Resolutions', 'Munitions Supply', 'Worldwide Intelligence',
   'Aegis International', 'Global Phalanx', 'Elite Border Recon', 'Secure Technologies', 'Humane Solutions', 'Essential Personnel',
   'North Star Defense', 'Faithful Shield', 'Orbital Defense', 'East Coast Munitions', 'Apex Armor', 'Vertex Defense', 'Centurion Manufacturing',
    'Zenith Munitions', 'Global Corporate Solutions', 'Unified Security', 'Phoenix Industries', 'Spartan Technologies', 'Black Mountain', 'Red Sun Solutions',
    'Marine Systems', 'Renegade Manufacturing', 'Black Tiger Manufacturing', 'Eagle Systems', 'Vulcan Systems', 'Praetor Solutions', 'Legate International',
    'Hoplite Industries', 'Enterprise Manufacturing', 'Elysium Pharmaceuticals', 'United Ordnance', 'Precision Dynamics', 'Regen Pharmaceuticals',
    'Aerospace Intelligence', 'Black Sky Aeronautics', 'Genesis Pharmaceuticals', 'Adriel Laboratories', 'Phobos Aeuronautics', 'Deimos Defense',
    'Anhur Industrial Dynamics', 'Valkyrie Systems', 'Morning Star Defense', 'Elite Biotechnical Solutions', 'Alecto International', 'Megaera Security'
  ];

  var name2 = ['Corp.', 'Co.', 'Partnership', 'Conglomerate', 'Corporation', 'Group', 'Company', 'Ltd.', 'LLC.', 'Inc.'];

  var products = ['depleted uranium', 'discount thalidomide', 'parts for Saudi Arabian tanks', 'white phosphorous',
    'Agent Orange', 'especially inaccurate cluster bombs', 'unlimited-lifespan land-mines', 'asbestos blankets',
    'extra-stength fentanyl', 'child-sized body armor', 'mustard gas', 'napalm', 'prison-friendly pentobarbital',
    'Technically Not Flamethrowers', 'debt-relief suicide kits', 'ankle monitors', 'pre-fab prisons', 'F-35 design documents',
    'Challenger O-rings', 'Ford Pinto fuel tanks', 'tactical home-defense grenades', 'Stinger missiles for the mujahideen',
    'training materials for Salvadoran fascists', 'Predator drones', 'wedding-seeking Hellfire missiles', 'bulletproof school uniforms',
    'farm-to-table krokodil', 'non-detectable landmine fragments', 'juvenile electric chairs', 'xylyl bromide artillery shells', 'phosgene gas',
    'plastic bags of sarin gas', 'V-Series nerve agents', 'propane cluster bombs', 'tamper-friendly Tylenol', 'repackaged Vioxx pills',
    'piles of black slag', 'pre-fab border walls', 'bomb kits for anti-Castro exiles', 'high-margin insulin', 'extra-sticky Toyota gas pedals',
    'rebranded DDT', 'lead-based children\'s toys', 'extra-sharpened lawn darts', 'flavor-blasted Aqua Dots', 'uranium-based playsets',
    'Boeing 737 safety systems', 'refurbished trench knives', 'small arms for Salafi militias', 'home defense land-mines', 'AR-15s (High School Edition&#8482;)'
    ];

  var bossTypes = ['industrialist', 'entrepeneur', 'titan of industry', 'business magnate', 'notorious failchild', 'tycoon', 'Hapsburg descendent',
    'disgraced politician', 'beloved war criminal', 'respected pundit', 'genius op-ed writer', 'startup wunderkind', 'idiot savant', 'professional grifter'];

  var mottos = [
    'work hard, play hard.', 'it\'s five o\'clock somewhere.', 'let the good times roll.',
    'don\'t be evil.', 'let\'s roll.', 'building better worlds',
    'working for American families.', 'keeping America safe.',
    'thank goodness it\'s Friday!', 'live for the weekend.',
    'we work because we care.', 'our work is our passion.', 'working for yesterday\'s tomorrow.',
    'just like Mom used to make.', 'just like a Saturday with Dad.', 'just like Grandma used to make.',
    'a better world for everyone.', 'a better world for all of us.', 'a better world for you and me.',
    'do what you love.', 'follow your dreams.', 'live, laugh, love.',
    'the secret ingredient is love.', 'the secret ingredient is caring', 
    'only the best for your family.', 'looking out for you and yours.',
    'make every day your best.'
  ];

  function getAcquisitionDescription(name, employeeNum) {
    var year = getRandomInt(1980, (new Date().getFullYear()));
    var bossType = getRandomFromArray(bossTypes);
    var bossName = getRandomName();
    var products = getRandomProducts();
    var motto = getRandomFromArray(mottos);
    return assembleAcquisitionDescription(name, year, bossType, bossName, employeeNum, products, motto);
  }

  function assembleAcquisitionDescription(name, year, bossType, bossName, employeeNum, products, motto) {
    return name + ' was founded in ' + year + ' by the ' + bossType + ' <span class="bossname">' + bossName + '</span>.'
      + ' Upon acquisition, the company employed approximately ' + format(employeeNum) + ' workers,'
      + ' and produced mostly <span class="acquisitionproducts">' + products[0] + '</span> and <span class="acquisitionproducts">' + products[1] + '</span>,'
      + ' as well as some <span class="acquisitionproducts">' + products[2] + '</span>.'
      + ' The company motto is: "' + motto + '"';
  }

  function getRandomProducts() {
    var selected = [];
    selected.push(getRandomFromArray(products));

    var next = getRandomFromArray(products);
    while (selected.length < 3) {
      while (selected.indexOf(next) > -1) {
        next = getRandomFromArray(products);
      }

      selected.push(next);
    }

    return selected;
  }

  function getCompanyName() {
    return getRandomFromArray(name1) + ' ' + getRandomFromArray(name2);
  }

  var viewingAcquisition = ko.observable(null);
  var viewingChat = ko.observable(new Chat());

  /************************************************************
                  ACQUISITION - NEW POLICIES 
  ************************************************************/

  var newPolicyBodies = [
    'new hire probationary periods will last a minimum of 3,650 business days.', // 1
    'full-time employees are not to make direct eye contact with temporary workers under any circumstances.',
    'health benefits will not cover injuries sustained during working hours. The current policy of non-coverage for injuries sustained during non-work hours shall be maintained as well.',
    'management is not responsible for the presence of so-called "red mud" in the break rooms. Employees who wish to continue using the break rooms will be expected to develop resistances.',
    'personal protective equipment will not be provided to employees with a pre-existing sensitivity to corrosive or potentially infectious medical waste.',
    'thoughts and dreams conceived during working hours are legally considered to be the company\'s intellectual property.',
    'employees will not use restrooms unless permitted by forms 29-A through 49-D and accompanied by a certified manager.',
    'required non-competes will not permit seeking any further employment after termination.',
    'HR will not be receiving any more complaints regarding the company\'s position on the Armenian Genocide.',
    'employees are not to discuss or interact with the CEO\'s sons, Uday and Qusay, under any circumstances.',
    'required NDAs will not permit public or private discussion of any management practices, no matter how sexually invasive they may be.',
    'required NDAs will not permit public or private discussion of the personal lives of any board members or upper management, regardless of their role in the Syrian Civil War.', // 10
    'all employee social media accounts shall be commandeered and reconfigured as "Brand Ambassador" accounts. Positivity training will begin shortly.',
    'any employee still residing in the tent cities outside the warehouses will be considered an enemy combatant. Security personnel have been permitted to open fire.',
    'employees are never to question upper management when it comes to "The Salt Pit" or "Cobalt." Any who utter the names shall be terminated.',
    'employees are not to discuss, publicly or privately, the claims made by the Shoah Foundation regarding the management team.',
    'employees are not to disseminate any media discussing the management team\'s role in the disappearance of Khaled Masri.',
    'employees are not to discuss any of the company-branded equipment recovered from the wreckage of al-Majalah.',
    'employees are not to describe the management team\'s current legal troubles as a "war crimes tribunal," regardless of mainstream media interpretations.',
    'all employees must sign a waiver stating their recognition that, despite complaints, tear gas is technically only banned in international conflicts.', 
    'employees are forbidden from referring to the new International Children\'s Internship Program as "human trafficking" under any circumstances.',
    'any employee describing break room tokens as "truck wages" shall be terminated. The tokens are more convenient, and in turn more valuable, than regular wages.', // 20
    'employees are not to dispute the "C57BL/6" designation given on some employee IDs. It is only a convenience for HR, and is nothing to worry about.',
    'employees are not to speak to the press about any members of the management team who may or may not have been spotted leaving the Saudi Consulate in Turkey with a bloody suitcase.',
    'employees are not to discuss the management team\'s personal friendship with Slobodan Milošević. Prosecutors at the Hague presented no evidence that the management team was involved.',
    'required NDAs will not permit public or private discussion of the remains found in the walls of the Qatar office. There is no conclusive evidence that they are human.',
    'required NDAs will not permit public or private discussion of the chasm uncovered beneath the Mexico City corporate office. Any reference to Huitzilopochtli is forbidden.',
    'all offices are strictly Bring Your Own Device. Keep in mind that all devices brought onto work premises legally become company property.',
    'every Friday will include a catered Team Lunch to promote cohesion, unity, and morale. Employees attempting to bring their own lunch will be disciplined or terminated.',
    'all corporate offices will be supplied with mini-fridges stocked with healthy drinks and water bottles. Employee hydration will be monitored hourly and strictly enforced.',
    'the sales associate who makes the most sales in a given week will be awarded with a $10 bonus. That associate\'s direct superior will recieve a $1,000 bonus as well.',
    'any employee caught attempting to leave early will be disciplined or terminated. Employees will be expected to stay late to avoid being mistakenly perceived as leaving early.' // 30
  ];

  var newPolicyStarts = [
    'From now on', 'From here on out', 'From this day forward', 'Beginning today', 'Beginning immediately', 'Effective immediately'
  ];
  
  function getRandomAcquisitionBody() {
    return getRandomFromArray(newPolicyStarts) + ', ' + getRandomFromArray(newPolicyBodies);
  }

  var awayPolicyInbox = ko.observable(new AwayPolicyInboxData(0, 0, ''))

  function AwayPolicyInboxData(emails, earned, message) {
    this.start = ko.observable(new Date().toLocaleString());
    this.policies = new Stat('New Policies', 0);
    this.fired = new Stat('Away Quit', 0);
    this.message = ko.observable(message);
    this.active = ko.observable(false);

    this.handleChange = function() {
      if (this.active()) {
        this.start(new Date().toLocaleString());
        this.policies.val(0);
        this.fired.val(0);
      }
    }
  }

  /*************************************************************
                        R&D
  *************************************************************/

  var research = ko.observable(new ResearchCenter());

  function ResearchCenter() {
    this.intern = ko.observable(null);
    this.wage = ko.observable(null);
    this.sales = ko.observable(null);
    this.manager = ko.observable(null);
    this.patents = ko.observableArray([]);
    this.product = ko.observable('Nothing');
    this.active = ko.observable(false);
    this.sellNumber = ko.observable(0);
    this.sellValue = ko.observable(null);
    this.helpView = ko.observable(false);

    this.risk = new Stat('Risk of Death', ko.computed(function() {
      var intern = this.intern() ? parseInt(this.intern()) : 0;
      var wage = this.wage() ? parseInt(this.wage()) : 0;
      var sales = this.sales() ? parseInt(this.sales()) : 0;
      var manager = this.manager() ? parseInt(this.manager()) : 0;
      var base = intern + wage + sales + manager;
      var calculated = Math.pow(base ? base : 0, 1.25) / 100 - 2.16;
      calculated -= riskReduction.val();
      //calculated -= calculated * (riskReduction.val() / 100); 
      return calculated > 1 ? calculated : 0;
    }, this), null, '%');

    this.speed = new Stat('Speed Boost', ko.computed(function() {
      var base = this.intern() ? parseInt(this.intern()) : 0;
      return base + (base * (speedBoost.val() / 100));
    }, this), null, '%');

    this.value = new Stat('Value Boost', ko.computed(function() {
      var base = this.wage() ? parseInt(this.wage()) : 0;
      return base + (base * (valueBoost.val() / 100));
    }, this), null, '%');

    this.storage = new Stat('Total Storage', ko.computed(function() {
      return 1 + Math.floor((this.manager() ? parseInt(this.manager()) : 0) / 5);
    }, this));

    this.autoSell = new Stat('Auto Sell', ko.computed(function() {
      return (this.sales() ? this.sales() : 0) * 0.2;
    }, this), null, '%');

    this.baseValue = new Stat('Value', ko.computed(function() {
      var val = totalDPS.val() * 12.5;
      var base =  val + (val * (this.value.val() / 100));
      var upgraded = base + (base * (researchBonus.val() / 100));
      return upgraded + (upgraded * (rdBoost.total.val() / 100));
    }, this), '$');

    this.lastInterval = 0;
    this.targetTime = 1000 * 60 * 5;
    this.timeRemaining = ko.observable(this.targetTime);
    this.timer = null;
    this.startTimer = function() { 
      this.lastInterval = 0;
      this.timer = setInterval(function() {
        var now = Date.now();
        var elapsedTime = now - this.lastInterval;
        this.lastInterval = now;
        
        if (elapsedTime < 60000) {
          var bonus = elapsedTime * (this.speed.val() / 100)
          var newTime = this.timeRemaining() - (elapsedTime + bonus) ;
          this.timeRemaining(newTime > 0 ? newTime : 0);
        }

        if (this.timeRemaining() <= 0) {
          this.timeRemaining(this.targetTime);
          this.product(getRandomFromArray(products));
          if (Math.random() * 100 <= this.autoSell.val()) {
            this.handleSales(this.baseValue.val(), 1);
            this.checkAwards();
          } else if (this.patents().length < this.storage.val()) {
            this.checkAwards();
            this.patents.push(this.baseValue.val());
            if (this.patents().length >= 10) {
              earnAchievement('resMan');
            }
          }

          if (Math.random() * 100 < this.risk.val()) {
            var employee = this.killRandomEmployee();
            if (employee) {
              document.dispatchEvent(new CustomEvent("employee-killed", { "detail": 'One of your <b>' + units()[employee].name() + '</b> couldn\'t hack it' }));
            }
          }
        }
      }.bind(this), 1000);
    }

    this.killRandomEmployee = function() {
      var options = [];
      this.intern() > 0 ? options.push(0) : null;
      this.wage() > 0 ? options.push(1) : null;
      this.sales() > 0 ? options.push(2) : null;
      this.manager() > 0 ? options.push(3) : null;

      if (options.length === 0) {
        return null;
      }

      var employee = getRandomFromArray(options);
      units()[employee].num.sub(1);
      unitCount.sub(1);

      switch (employee.toString()) {
        case '0':
          this.intern(this.intern() - 1);
          break;
        case '1': 
          this.wage(this.wage() - 1);
          break;
        case '2':
          this.sales(this.sales() - 1);
          break;
        case '3': 
          this.manager(this.manager() - 1);
          break;
      }

      employeesKilled.add(1);
      return employee;
    }
    
    this.displayTimeRemaining = ko.computed(function() {
      return formatTimeRemaining(Math.round(this.timeRemaining() / 1000));
    }, this);
    
    this.percentageRipe = ko.computed(function() {
      var timeInProgress = this.targetTime - this.timeRemaining();
      return (timeInProgress / this.targetTime) * 100 + '%';
    }, this);

    this.readyToBegin = ko.computed(function() {
      return this.active() 
        || (this.intern() <= units()[0].num.val() && this.intern() >= 0
        && this.wage() <= units()[1].num.val() && this.wage() >= 0
        && this.sales() <= units()[2].num.val() && this.sales() >= 0
        && this.manager() <= units()[3].num.val() && this.manager() >= 0);
    }, this);

    this.toggleProduction = function() {
      if (this.active() && this.readyToBegin()) {
        this.active(false);
        clearInterval(this.timer);
        this.timeRemaining(this.targetTime);
        this.product('Nothing');
      } else {
        this.active(true);
        this.startTimer();
        this.product(getRandomFromArray(products));
      }
    };

    this.sellPatents = function() {
      if (this.patents().length) {
        var sum = 0;
        for (var i = 0; i < this.patents().length; i++) {
          sum += this.patents()[i];
        }

        this.handleSales(sum, this.patents().length);
        this.patents.removeAll();
      }
    };

    this.handleSales = function(value, number) {
      this.sellNumber(number);
      patentsSold.add(number);
      this.sellValue(format(value));
      earnedFromResearch.add(value);
      addClicks(value);
      setTimeout(function() {
        this.sellValue(null);
      }.bind(this), 2500);
    };

    this.reset = function() {
      clearInterval(this.timer);
      this.active(false);
      this.intern(0);
      this.wage(0);
      this.sales(0);
      this.manager(0);
      this.patents([]);
      this.timeRemaining(this.targetTime);
    }

    this.toggleHelpView = function() {
      this.helpView(!this.helpView());
    };

    this.checkAwards = function() {
      if (this.speed.val() >= 1000) { earnAchievement('rSpd6'); }
      if (this.speed.val() >= 800) { earnAchievement('rSpd5'); }
      if (this.speed.val() >= 600) { earnAchievement('rSpd4'); } 
      if (this.speed.val() >= 400) { earnAchievement('rSpd3'); } 
      if (this.speed.val() >= 200) { earnAchievement('rSpd2'); } 
      if (this.speed.val() >= 100) { earnAchievement('rSpd1'); }

      if (this.value.val() >= 1000) { earnAchievement('rVal6'); }
      if (this.value.val() >= 800) { earnAchievement('rVal5'); }
      if (this.value.val() >= 600) { earnAchievement('rVal4'); } 
      if (this.value.val() >= 400) { earnAchievement('rVal3'); } 
      if (this.value.val() >= 200) { earnAchievement('rVal2'); } 
      if (this.value.val() >= 100) { earnAchievement('rVal1'); }
    }

    this.assignMax = function() {
      if (!this.active()) {
        this.intern(units()[0].num.val());
        this.wage(units()[1].num.val());
        this.sales(units()[2].num.val());
        this.manager(units()[3].num.val());
      }
    }
  }

  /*************************************************************
            BUSINESS NAME
  *************************************************************/

  var businessName = ko.observable(new businessNameData());

  function businessNameData() {
    this.name = ko.observable('Unnamed Business');
    this.editing = ko.observable(false);
    this.toggleEditing = function() {
      this.editing(!this.editing());
    }.bind(this);

    this.newName = ko.observable(null);

    this.save = function() {
      this.name(this.newName());
      this.editing(false);
      this.newName(null);
      earnAchievement('nm');
    }.bind(this);
  }

  var pastBusinesses = ko.observableArray([]);

  function addBankruptcyToRecord() {
    pastBusinesses.push({
      date: Date.now(),
      length: Date.now() - startTime.val(),
      name: businessName().name(),
      earned: totalCash.val()
    });
  }
	
  var pastBusinessesFormatted = ko.computed(function() {
    return pastBusinesses().map(function(record) {
      return {
        date: new Date(record.date).toLocaleDateString(),
        length: getFormattedTime(record.length),
        name: record.name,
        earned: format(record.earned)
      }
    });
  }, this);

	/*************************************************************
						INVESTMENT SYSTEM
	*************************************************************/
	
	var makeInvestment = function(percentage, timeTilRipe) {
    if (activeInvestments().length < totalSimultaneousInvestmentsAllowed.val() && timeTilRipe > 0 && timeTilRipe <= 1440 && totalCash.val() >= 100000000 && accessibleDPS.val() > 0) {
  	  var baseInvestment = totalDPS.val() * (percentage / 100);
  	  activeInvestments.push(new Investment(baseInvestment, timeTilRipe));
    }
	};

	function Investment(base, time, loadedTargetTime, loadedProgress, name) {
	  this.active = ko.observable(true);
    this.paid = ko.observable(false);
	  this.baseInvestment = new Stat('Principal Value', base);
	  this.targetTime = loadedTargetTime || time * 60 * 1000;
	  this.timeRemaining = ko.observable(loadedProgress !== undefined ? loadedProgress : this.targetTime);
	  this.timeCreated = new Date();
	  this.currentValue = new Stat('Current Value', base, '$');
    this.finalTotal = ko.observable(null);
    this.name = name ? name : getCompanyName();
    this.payingOut = false;

    if (this.name.indexOf('undefined') > -1) {
      this.name = getCompanyName();
    }

	  this.checkInterval = 1000;
	  this.lastInterval = this.timeCreated;
	  this.handleTimer = setInterval(function() {
	    var now = Date.now();
	    var elapsedTime = now - this.lastInterval;
	    this.lastInterval = now;
	    
      if (elapsedTime < 60000) {
        var newTime = this.timeRemaining() - elapsedTime;
        this.timeRemaining(newTime > 0 ? newTime : 0);
      }

	    if (this.timeRemaining() <= 0) {
	      this.active(false);
	      clearInterval(this.handleTimer);
	    }
	  }.bind(this), this.checkInterval);
	  
	  this.displayTimeRemaining = ko.computed(function() {
	    return viewingTab() === 'investments' && formatTimeRemaining(Math.round(this.timeRemaining() / 1000));
	  }, this);
	  
	  this.percentageRipe = ko.computed(function() {
	    var timeInProgress = this.targetTime - this.timeRemaining();
	    return (timeInProgress / this.targetTime) * 100 + '%';
	  }, this);

    this.interestEarned = this.baseInvestment.val() * (interestRate.val() / 100);

    this.baseEarnings = new Stat('Base Earnings', ko.computed(function() {
      var secondsInProgress = (this.targetTime - this.timeRemaining()) / 1000;
      return this.baseInvestment.val() * (secondsInProgress > 0 ? secondsInProgress : 1);
    }, this));

    this.interestEarnings = new Stat('Interest Earnings', ko.computed(function() {
      if (viewingTab() === 'investments') {
        var hoursInProgress = (this.targetTime - this.timeRemaining()) / 1000 / 60 / 60;
        var interestEarned = this.baseEarnings.val() * (interestRate.val() / 100);
        var timeBonus = interestEarned * ((timeBonusRate.val() / 100) * hoursInProgress / 1.5)
        var total = interestEarned + timeBonus;
        return total + (total * (investmentBoost.total.val() / 100));
      } else {
        return 0;
      }
    }, this));

    this.displayPayout = function(total) {
      // Update investment
      this.finalTotal(format(total));
      this.paid(true);
      setTimeout(function() {
        activeInvestments.splice(activeInvestments.indexOf(this), 1);
      }.bind(this), 2000);
    };
	  
	  this.handlePayout = function() {
      // If active, pay out. If not, cancel.
      if (!this.active()) {
        if (!this.payingOut) {
          this.payingOut = true;
          var earningsTotal = this.baseEarnings.val() + this.interestEarnings.val();

          // Add short investment bonus (if any) for investments under 10 minutes
          if (this.targetTime <= 60000 * 10) {
            earningsTotal += earningsTotal * (shortInvestmentBonus.val() / 100);
          }

          this.displayPayout(earningsTotal);
          addClicks(earningsTotal);
          
          earnedFromInvestments.add(this.interestEarnings.val());
          if (this.targetTime < 60000 * 60) {
            earnedFromShortInvestments.add(this.interestEarnings.val())
          } else {
            earnedFromLongInvestments.add(this.interestEarnings.val());
          }

          completedInvestments.add(1);
          timeInvested.add(this.targetTime);
          timeInvestedAllTime.add(this.targetTime);
          checkForInvestmentAwards(this.targetTime);
          lastClick.val(Date.now());
        }
      } else {
        if (!this.payingOut) {
          this.payingOut = true;

          // Stop the timer
          this.active(false);
          clearInterval(this.handleTimer);

          // Return the principal
          canceledInvestments.add(1);
          this.displayPayout(0);
        }
      }
	  };
	}

  Investment.prototype.handleAcquisition = function() {
    if (activeAcquisitions().length < simultaneousAcquisitions.val()) {
      var earningsTotal = this.baseEarnings.val() + this.interestEarnings.val();
      var sizeDivider = this.targetTime / (1000 * 60 * 10); // Number of ten-minute blocks
      sizeDivider = sizeDivider > 0 ? sizeDivider : 1;

      activeAcquisitions.push(new Acquisition('medium', this.name, getRandomInt(9500, 10500) * sizeDivider, earningsTotal, sizeDivider));
      activeInvestments.splice(activeInvestments.indexOf(this), 1);

      document.dispatchEvent(new CustomEvent("acquisition-made", { "detail": this.name }));
    }
  }
  
  function checkForInvestmentAwards(time) {
      var minute = 60000;
      if (time <= minute) {
          earnAchievement('itime1');
      }
      
      if (time >= minute * 60) {
          earnAchievement('itime2');
          longInvestments.add(1);
      } else {
        shortInvestments.add(1);
      }
      
      if (time >= minute * 60 * 24) {
          earnAchievement('itime3');
      }
      
  }

  var investmentPenaltyPercentage = ko.computed(function() {
    var totalInvested = 0;
    for (var i = 0; i < activeInvestments().length; i++) {
      if (activeInvestments()[i].active()) {
        totalInvested += activeInvestments()[i].baseInvestment.val();
      }
    }

    var val = Math.round((totalInvested / totalDPS.val()) * 100);
    return val < 100 ? val : 100;
  }, this);

  var cashOutAllInvestments = function() {
    for (var i = 0; i < activeInvestments().length; i++) {
      if (!activeInvestments()[i].active()) {
        activeInvestments()[i].handlePayout();
      }
    }
  }
	
	/*************************************************************
						          MAIL SYSTEM
	*************************************************************/

  var emailHelpView = ko.observable(false);
  function toggleEmailHelpView() {
    emailHelpView(!emailHelpView());
  }

  var composeView = ko.observable(false);
  function toggleComposeView(val) {
    if (!locked().outgoingMail) {
      composeView(val);
    }
  }

  var composeHelpView = ko.observable(false);
  function toggleComposeHelpView(val) {
    composeHelpView(!composeHelpView());
  }

  var setViewingInbox = function() {
    viewingModal('mail');
    regularInbox(true);
  };

  var containsUrgent = ko.computed(function() {
    for (var i = 0; i < mail().length; i++) {
      if (mail()[i].isSpecial()) {
        return true;
      }
    }

    return false;
  }, this);

  var containsCryptic = ko.computed(function() {
    for (var i = 0; i < mail().length; i++) {
      if (mail()[i].isCryptic()) {
        return true;
      }
    }

    return false;
  }, this);

  var awayMailInbox = ko.observable(new AwayMailInboxData(0, 0, 0, ''))

  function AwayMailInboxData(emails, urgentEmails, earned, message) {
      this.start = ko.observable(new Date().toLocaleString());
      this.regularEmails = new Stat('Regular Emails', 5);
      this.urgentEmails = new Stat('Urgent Emails', 0);
      this.crypticEmails = new Stat('Urgent Emails', 0);
      this.earned = new Stat('Away Earnings', 0, '$');
      this.message = ko.observable(message);
      this.active = ko.observable(false);

      this.handleChange = function() {
        if (this.active()) {
          this.start(new Date().toLocaleString());
          this.regularEmails.val(0);
          this.urgentEmails.val(0);
          this.crypticEmails.val(0);
          this.earned.val(0);
        }
      }
  }

  var outgoingReplyBodies = {
    0: [
      'Very sorry you had to reach out. Production is up significantly - I\'ll circle back once the numbers are in, but so far, they\'re looking great!',
      'Sorry you had to reach out. We just want you to know that we\'re pushing harder than ever, and the graphs are looking great. Every line goes up!',
      'Thanks for reaching out! So sorry you had to do that. It\'s the interns\' fault, I think, but we can turn this around. The numbers are looking much better now, sky high.',
      'I just wanted to assure you that the numbers should be looking much better. The charts are way up, and we found a new way to measure production so that it\'s higher.',
      'I jumped on the issue as soon as I saw your email. Don\'t worry, we\'re cracking the whip over here. We\'ll get some complaints, I\'m sure, but nothing is more important than efficiency.',
      'Thanks for the email - we\'re working hard to speed things up. All the graphs should be pointing up soon... we\'ve got some new ideas on how to move numbers around and get it done.',
      'I think one of the interns may have made an error with the numbers. He received the necessary corporal demerits, and we ran them again. Now we\'ve got new, much better numbers.',
      'My understanding is that you\'ve felt that some of the latest graphs aren\'t going up as much as they could be. We are working hard to make them go up more, and you should see results immediately.',
      'One of my passions in life is efficiency in business systems, so I am truly sorry you had to reach out. I have personally seen to it that our metrics are rethought to reflect greater efficiency.',
      'Thanks for reaching out, and I\'m sorry it came to that. We are ramping things up and being smarter with our time, like you always say. The numbers look great.' // 10
    ],
    1: [
      'Oh god, I\'m sorry, we\'re ramping up, I promise, things are going to turn around soon. We\'re pushing hard, okay? Just give us a little more time, you\'ll see.',
      'This is going to turn around quick, I promise you that. The numbers are going to push forward, I absolutely swear it, they\'re going to skyrocket, trust me. I promise.',
      'I know you have some concerns about the numbers, but I assure you we are working as hard as we can to speed things up. Nobody is going home tonight - NOBODY.',
      'This is the intern\'s fault, I swear to god it\'s not us, it\'s not me. If you need to drop somebody, drop the interns, this is their fault. To be clear: this is NOT MY FAULT.',
      'We\'re really improving things, I swear! You should have seen me, I was in the zone. What? No, no, I didn\'t make a sale, but I was so close, I could feel it!',
      'I know the troops have been dropping the ball lately, and I just wanted to reassure you that this will no longer be tolerated. The numbers are everything, I swear to you.',
      'Please forgive the failures of my underlings. To show my dismay, the entire cohort will be subjected to decimation. This is certain to improve morale.'
      //
      //
      //
    ],
    2: [
      'things loking up  I swaer to god ok? ssome of them are trying to go home im so tired im really tired.  im sorry. im so sorry. im sorry.  im sorry.',
      'so sorry please pleas understand were going to fix this i promise you please understand going to fix this right now i porimse that we are im doing everything i can',
      'i know how it looks and you had to get in touch but that doesnt mean we cant do it, we\'re going to fix this i swear it, just give us a little more time and we can fix it',
      'This is his wife, you caused a seizure. I have your information and have called the police to report the assault.',
      'ok i understand i assure you i do and everything is pushing harder than ever and  ihavent slept in so long but i understand im trying and if i coul ust gfchciuddddddddddddddd',
      'This is an automated message from the office of Employee: %name. The requested employee has self-terminated and is no longer employed by %business. Please contact another employee.',
      'This is an automated message from the office of Employee: %name. The requested employee couldn\'t hack it and is no longer employed by %business. Please contact another employee.',
      'This is an automated message from the office of Employee: %name. The requested employee is currently in the psych ward after exhibiting anti-social behavior. Please contact another employee.',
      'Everything tastes like ashes.',
      'Itchy. Tasty.'
      //
    ]
  }

  var composedMail = ko.observable(new ComposedMailData());
  var stressLevels = [5, 20, 50];
  var baseValues = [60 * 1000 * 5, 60 * 1000 * 20, 60 * 1000 * 60];
  var outgoingBonuses = [investmentBoostBonus, researchBoostBonus, acquisitionBoostBonus, trainingBoostBonus];
  var departments = {
    '0': 'Investments',
    '1': 'R&D',
    '2': 'Acquisitions',
    '3': 'Training',
    '4': 'Human Resources'
  }

  function ComposedMailData() {
    this.selectedDepartment = ko.observable(null);
    this.selectedUrgency = ko.observable(null);
    this.to = ko.observable('');
    this.subject = ko.observable('');
    this.message = ko.observable('');
    this.resting = ko.observable(false);
    this.stressLevel = new Stat('Stress Level', 0, null, '%');
    this.resolution = ko.observable({
      baseTimeBonus: ko.observable(null),
      textBonus: ko.observable(null),
      totalTimeBonus: ko.observable(null),
      patentsSold: ko.observable(null),
      employeesFired: ko.observable(null),
      averageBonus: ko.observable(null),
      baseStressReduction: ko.observable(null),
      totalStressReduction: ko.observable(null)
    });

    this.unavailable = ko.computed(function() {
      return this.resting() 
       || (this.stressLevel.val() > 100 && this.selectedDepartment() !== '4') 
       || (this.selectedDepartment() === '' && this.selectedUrgency() === '')
       || (this.selectedDepartment() !== '4' && this.selectedUrgency() === '')
    }.bind(this), this);

    this.lowerStress = function(numberOfTicks, totalAmount, actualTimeMod) {
      if (this.stressLevel.val() > 0) {
        var num = numberOfTicks ? numberOfTicks : 1
        var lowerAmount = (0.025 + (0.025 * (stressReduction.val() / 100))) * (actualTimeMod ? actualTimeMod : 1);
        lowerAmount = totalAmount ? totalAmount : lowerAmount;
        var newStress = this.stressLevel.val() - (lowerAmount * num);
        this.stressLevel.val(newStress > 0 ? newStress : 0);
      }
    };

    this.send = function() {
      // TODO validate

      this.resting(true);
      this.fullText = this.subject() + ' ' + this.message();

      var isHR = this.selectedDepartment() === '4'
      if (!isHR) {
        var stressIncrease = stressLevels[parseInt(this.selectedUrgency())];
        this.stressLevel.add(stressIncrease + (stressIncrease * (this.stressLevel.val() / 100)));
      }

      if (!this.to() && !this.message() && !this.subject()) {
        earnAchievement('out11');
      }

      setTimeout(function() {
        this.reset();
        this.resting(false);
      }.bind(this), 5000);

      this.baseBonus = getBonusFromInputText(this.to() + ' ' + this.message() + ' ' + this.subject(), null, null, false);
      var extraBonus = this.getComposeMailBonuses();
      outgoingEmails.add(1);

      if (!extraBonus.error) {
        this.baseBonus += extraBonus;
        this.resolveMail(this.baseBonus);

        if (!isHR) {
          setTimeout(function() {
            var stressType = 0;
            if (this.stressLevel.val() > 100) {
              stressType = 2;
            } else if (this.stressLevel.val() > 50) {
              stressType = 1;
            }

            var stressBody = outgoingReplyBodies[stressType];
            var body = getRandomFromArray(stressBody).replace('%name', this.to()).replace('%business', businessName().name());

            var newEmail = new Email(stressType === 2 ? true : false, false, 'RE: ' + this.subject(), body, this.to(), null, null, stressType);
            if (awayMailInbox().active()) {
              newEmail.respond();
            } else {
              mail.push(newEmail);
            }
          }.bind(this), 3000);
        }
      } else {
        this.errorResolution(extraBonus.msg);
      }

    }.bind(this);

    this.getComposeMailBonuses = function() {
      var bonus = 0
      if (this.selectedDepartment() === '0') { // Investments
        if (activeInvestments().length - pendingInvestmentCount.val() > 0) {
          for (var i = 0; i < activeInvestments().length; i++) {
            if (new RegExp(activeInvestments()[i].name.toLowerCase()).test(this.fullText.toLowerCase())) {
              earnAchievement('out7-5');
              bonus += 20;
            }
          }
        } else {
          return { error: true, msg: 'Error: No active investments available'};
        }
      } else if (this.selectedDepartment() === '1') { // R&D
        var types = ['intern', 'wage slave', 'sales hotshot', 'middle manager'];
        if (research().active()) {
          for (var i = 0; i < types; i++) {
            if (new RegExp(types[i]).test(this.subject().toLowerCase())) {
              bonus += 10;
            }
          }

          if (new RegExp(research().product().toLowerCase()).test(this.fullText.toLowerCase())) {
            earnAchievement('out8');
            bonus += 60;
          }
        } else {
          return { error: true, msg: 'Error: Research is not active'}
        }
      } else if (this.selectedDepartment() === '2') { // Acquisitions
        if (activeAcquisitions().length > 0 && activeAcquisitions()[0].active()) {
          var bossName = $('.acquisition .bossname').text();
          var products = [];
          $('.acquisitionproducts').each(function() { 
            products.push($(this).text());
          });

          for (var i = 0; i < products.length; i++) {
            if (new RegExp(products[i].toLowerCase()).test(this.fullText.toLowerCase())) {
              bonus += 10;
            }
          }

          if (new RegExp(bossName.toLowerCase()).test(this.to().toLowerCase())) {
            earnAchievement('out9');
            bonus += 70;
          } else { 
            if (activeAcquisitions().length > 0 && activeAcquisitions()[0].chats().length > 0) {
              for (var i = 0; i < activeAcquisitions()[0].chats().length; i++) {
                if (activeAcquisitions()[0].chats()[i].name.toLowerCase() === this.to().toLowerCase()) {
                  earnAchievement('out10');
                  bonus += 70;
                  break;
                }
              }
            }
          }
        } else {
          return { error: true, msg: 'Error: No active acquisition available'}
        }
      } else if (this.selectedDepartment() === '3') { // Employee Training
        var trainingsActive = units().filter(function(u) {
          return u.trainingActive();
        }).length;

        if (trainingsActive > 0) {
          // TODO bonus points for employee training outgoing emails
        } else {
          return { error: true, msg: 'Error: No training in progress' }
        }
      } else if (this.selectedDepartment() === '4') { // Human Resources

      }

      return bonus;
    }.bind(this);

    this.errorResolution = function(error) {
      earnAchievement('out1');
      this.resolution().baseTimeBonus(getFormattedTime(0));
      this.resolution().textBonus(format(0) + '%');
      this.resolution().totalTimeBonus(error);

      var newEmail = new Email(false, false, error, 'Please try again.', 'MAILER-DAEMON@business.org');
      if (awayMailInbox().active()) {
        newEmail.respond();
      } else {
        mail.push(newEmail);
      }
    }.bind(this);

    this.resolveMail = function(bonus) {
      var base = 0;

      if (this.selectedDepartment() !== '4') {
        base = baseValues[parseInt(this.selectedUrgency())];
        base += (base * outgoingBonuses[parseInt(this.selectedDepartment())].val()) / 100;
        base += base * (outgoingBoost.total.val() / 100);
      } else {
        bonus += stressReduction.val();
      }

      var total = base + (base * (bonus / 100));
      this.resolution().baseTimeBonus(getFormattedTime(base, false, true));
      this.resolution().textBonus(format(bonus) + '%');
      this.resolution().totalTimeBonus(getFormattedTime(total, false, true));
      this.resolution().patentsSold(null);
      this.resolution().averageBonus(null);
      this.resolution().employeesFired(null);

      if (this.selectedDepartment() !== '4') {
        overallTimeBoosted.add(total);
      }

      if (this.selectedDepartment() === '0') { // Investments
        this.handleInvestmentResolution(total);
        investmentTimeBoosted.add(total);
      } else if (this.selectedDepartment() === '1') { // R&D
        this.handleResearchResolution(total);
        researchTimeBoosted.add(total);
      } else if (this.selectedDepartment() === '2') { // Acquisitions
        this.handleAcquisitionResolution(total);
        acquisitionTimeBoosted.add(total);
      } else if (this.selectedDepartment() === '3') { // Training
        this.handleTrainingResolution(total);
        trainingTimeBoosted.add(total);
      } else if (this.selectedDepartment() === '4') { // Human Resources'
        var baseVal = 0.2 * stressReductionMultiplier.val();
        var total = baseVal + (baseVal * (bonus / 100));
        this.lowerStress(null, total)
        stressReduced.add(total);
        this.resolution().baseStressReduction(format(baseVal) + '%');
        this.resolution().totalStressReduction(format(total) + '%');
      }
    }.bind(this);

    this.handleInvestmentResolution = function(bonusTime) {
      var avg = bonusTime / activeInvestments().length;
      this.resolution().averageBonus(getFormattedTime(avg, false, true));
      for (var i = 0; i < activeInvestments().length; i++) {
        var newTime = activeInvestments()[i].timeRemaining() - avg;
        activeInvestments()[i].timeRemaining(newTime > 0 ? newTime : 0);
      }
    }.bind(this);

    this.handleResearchResolution = function(bonusTime) {
      var researchProgress = bonusTime * (research().speed.val() / 100);
      var sold = handleExtraResearchTime(bonusTime, false);
      this.resolution().patentsSold(sold);
    }.bind(this);

    this.reset = function() {
      this.selectedDepartment('');
      this.selectedUrgency('');
      this.to('');
      this.subject('');
      this.message('');
    }.bind(this);

    this.handleAcquisitionResolution = function(bonusTime) {
      var fired = activeAcquisitions()[0].autoMod.val() * (bonusTime / 1000);
      var newTotal = activeAcquisitions()[0].currentEmployees.val() - fired;
      activeAcquisitions()[0].currentEmployees.val(newTotal > 0 ? newTotal : 0);
      this.resolution().employeesFired(format(fired));
    }.bind(this);

    this.handleTrainingResolution = function(bonusTime) {
      var activeTrainings = units().filter(function(u) {
        return u.trainingActive();
      });

      var avg = bonusTime / activeTrainings.length;
      this.resolution().averageBonus(getFormattedTime(avg, false, true));
      for (var i = 0; i < activeTrainings.length; i++) {
        var newTime = activeTrainings[i].timeRemaining() - avg;
        activeTrainings[i].timeRemaining(newTime > 0 ? newTime : 0);
      }
    }.bind(this);
  }
	
	// Use this to cycle through special mail subject lines, so we don't see two in a row
	var specialMailSessionCycler = getRandomInt(0, 115);
	
	var checkForMail = function() {
	  if (mail().length < inboxMax.val()) {
      if (Math.random() <= (baseMailChance.val() * mailChanceMultiplier.val()) && !locked().mail) {
	      if (mysteryBoostResults.crypticEmailsUnlocked() && (Math.random() * 100 <= crypticMailChance.val())) {
          if (awayMailInbox().active()) {
            new CrypticEmail(false).respond();
          } else {
             mail.push(new CrypticEmail(false));
          }
        } else if (Math.random() * 100 <= specialMailChance.val() && totalDPS.val() > 10000) {
          if (awayMailInbox().active()) {
            new SpecialEmail(false).respond();
          } else {
            mail.push(new SpecialEmail(false));
          }
        } else {
          if (awayMailInbox().active()) {
            new Email(false).respond();
          } else {
            mail.push(new Email(false));
          }
        }
	    } 
	  }
	};

	// email constructor
	function Email(isSpecial, isLoaded, subject, body, from, acquisitionId, acquisitionType, stressLevel, isCryptic) {
	  this.date = new Date();
	  this.unit = getUnit(Math.floor(Math.random() * unitsUnlocked.val().toString()));
	  this.subject = subject ? subject : getRandomSubject();
	  this.from = from ? from : getRandomName();
	  this.body = body ? body : getRandomBody();
	  this.timeRemaining = ko.observable(isLoaded ? 0 : timeToAnswerMail.val());
	  this.replied = ko.observable(false);
	  this.payout = ko.observable(0);
	  this.payoutBonus = ko.observable(0);
    this.timeBonus = ko.observable(0);
	  this.inputText = ko.observable(null);
    this.isSpecial = ko.observable(isSpecial);
    this.isAcquisition = ko.observable(acquisitionId ? true : false);
    this.isCryptic = ko.observable(isCryptic);
    this.acquisitionId = acquisitionId;
    this.acquisitionType = acquisitionType;
    this.stressLevel = stressLevel;
	  this.displayTimeRemaining = ko.computed(function() {
	   return formatTimeRemaining(this.timeRemaining());
	  }, this);
	  
	  this.respond = function() {
      this.replied(true);
      clearInterval(this.timer);
      if (!this.isAcquisition() && !this.isCryptic()) {
        this.regularResponse();
      } else if (this.isAcquisition()) {
        this.acquisitionResponse();
      } else if (this.isCryptic()) {
        this.crypticResponse();
      }

      lastClick.val(Date.now());
	    setTimeout(function() {
        if (this.isAcquisition()) {
          viewingAcquisition().mail.splice(viewingAcquisition().mail.indexOf(this), 1);
        } else {
          mail.splice(mail.indexOf(this), 1);
        }
	    }.bind(this), 2000);
	  };
	  
	  this.timer = setInterval(function() {
	    if (this.timeRemaining() > 0) {
	      this.timeRemaining(this.timeRemaining() - 1);
	    } else {
	      clearInterval(this.timer);
	    }
	  }.bind(this), 1000);
	}

  Email.prototype.crypticResponse = function() {
    var bonus = getBonusFromInputText(awayMailInbox().active() ? awayMailInbox().message() : this.inputText(), this.from, this.unit.name(), this.isSpecial());
    var timeBonus = getTimeBonus(this.date.getTime(), this.timeRemaining(), awayMailInbox().active());

    var crypticBonus = (baseNextBankruptcyBonus() / 250) * timeBonus.bonus;
    crypticBonus += crypticBonus * (bonus / 100);
    crypticBonus += crypticBonus * (emailBoost.total.val() / 100);
    crypticBonus += crypticBonus * (crypticEmailBonus.val() / 100);

    additionalBankruptcyBonus.add(crypticBonus);
    crypticEmailEarnings.add(crypticBonus);
    crypticEmailsReceived.add(1);
    crypticEmailsReceivedAllTime.add(1);
    this.payout(format(crypticBonus));
    this.payoutBonus(Math.round(bonus) + '%');
    this.timeBonus(format(timeBonus.bonus * 100) + '%');

    // if (awayMailInbox().active()) {

    // }
    if (awayMailInbox().active()) {
      awayMailInbox().crypticEmails.add(1);
    }
  };

  Email.prototype.acquisitionResponse = function() {
    var wordBonus = getBonusFromInputText(awayPolicyInbox().active() ? awayPolicyInbox().message() : this.inputText(), this.from, this.unit.name(), false);
    var timeBonus = getTimeBonus(this.date.getTime(), this.timeRemaining(), awayPolicyInbox().active()).bonus;
    var fired = getAcquisition(this.acquisitionId).fireByMail(wordBonus, timeBonus);
    this.payout(format(fired));
    this.payoutBonus(format(Math.round(wordBonus)) + '%');
    this.timeBonus(format(timeBonus * 100) + '%');

    if (awayPolicyInbox().active()) {
      awayPolicyInbox().policies.add(1);
      awayPolicyInbox().fired.add(fired);
    }
  };

  Email.prototype.regularResponse = function() {
    var specialBonus = this.isSpecial() ? specialMailBonus.val() : 0;
    var bonus = getBonusFromInputText(awayMailInbox().active() ? awayMailInbox().message() : this.inputText(), this.from, this.unit.name(), this.isSpecial()) + specialBonus;
    var timeBonus = getTimeBonus(this.date.getTime(), this.timeRemaining(), awayMailInbox().active());
    var cash = getCashFromEmail(bonus, timeBonus);

    this.payout(format(cash));
    this.payoutBonus(Math.round(bonus) + '%');
    this.timeBonus(format(timeBonus.bonus * 100) + '%');
    
    if (this.isSpecial()) {
      specialMailAnswered.add(1);
      specialMailAnsweredAllTime.add(1);
      specialMailEarned.add(cash);
    }
    
    mailAnswered.add(1);
    mailAnsweredAllTime.add(1);
    addClicks(cash);
    totalEarnedFromEmails.add(cash);

    if (awayMailInbox().active()) {
      if (this.isSpecial()) {
        awayMailInbox().urgentEmails.add(1);
      } else {
          awayMailInbox().regularEmails.add(1);
      }
      awayMailInbox().earned.add(cash);
    }
  }

  function SpecialEmail(isLoaded) {
    var subject = getRandomSubject();
    var body = getRandomBody();
    return new Email(true, isLoaded, subject, body);
  }

  var crypticEmails = [
    {
      subject: 'Military Intelligence. No media. No leaks.',
      body: 'What really happened when the wizards and warlocks revealed what they had? These are crumbs and you cannot imagine the full and complete picture. Dig deeper - missing critical points to paint the full picture.'
    },
    {
      subject: 'How many clues must we provide?',
      body: 'Connect the \'markers.\' News (in all forms) unlocks the map. Expand your thinking.'
    },
    {
      subject: 'Mockingbird',
      body: 'HRC detained, not arrested (yet). Where is Huma? Follow Huma. Mockingbird 10.30.17. God bless fellow Patriot.'
    },
    {
      subject: 'Everything has meaning +++',
      body: 'Do you believe in coincidences? Paint the picture. Crumbs will make bread. Operations underway. Operators active. Pray.'
    },
    {
      subject: 'The calm before the storm',
      body: 'Think logically about the timing of everything happening. Note increased military movement. Note NG deployments starting tomorrow. Note false flags. Follow Huma.'
    },
    {
      subject: 'Alice & Wonderland',
      body: 'You can paint the picture based solely on the questions asked. Be vigilant today and expect a major false flag.'
    },
    {
      subject: 'Collect my crumbs',
      body: 'Rogue agents/programmers. Per sealed Federal orders, we quickly tracked and reinstated. Expect outages periodically (infiltrated). If this doesn\'t signal what I\'ve been saying I don\'t know what will.'
    },
    {
      subject: 'Why now? Coincidence?',
      body: 'Do military guards (uniform) typically assist the USSS? Why is this relevant? What flying object was recently shot down? Why is this relevant? How precise is geo tracking (non-public c-level pro)? Why is this relevant?'
    },
    {
      subject: "Who funds MS13?",
      body: 'Who do you hire for a hit? Who can be eliminated after the job is complete? Seth Rich. Who was found dead (2) shortly after his murder? What affiliation did they have? Classified.'
    },
    {
      subject: 'Game Theory', // 10
      body: 'The silent ones. Others monitoring (friends and enemies). Instructions. Snow White.'
    },
    {
      subject: 'Who was killed in SA?',
      body: 'Who fired? Who really fired? Why would we fire? Follow the money. Who pulls the strings? Strings detached. Open season on puppets.'
    },
    {
      subject: '!ITPb.qbhqo',
      body: 'Bots deactivated upon arrival. Keep up the good fight. It\'s spreading.' 
    },
    {
      subject: 'Keywords: Confirm. Green. Sky.',
      body: 'Why were keywords added in the stringer? What was the purpose? What was previously stated? To who specifically? ++ Who countered? Learn to read the map. Missing critical items. Graphic is key. Ordering is critical. '
    },
    {
      subject: 'They are puppets',
      body: 'They are weak. They are scared. 80% dark ops necessary. 20% public for justice. The stage must be set. Have faith. '
    },
    {
      subject: 'Coincidence?',
      body: 'Review image/location. Nothing provided is random. SFO>JFK. A321. Direct'
    },
    {
      subject: 'It must happen',
      body: 'What do they fear the most? Public awakening. If they ask. They self destruct. They know this is real. See attacks. The build is near complete. Growing exponentially.'
    },
    {
      subject: 'You have more than you know',
      body: 'U1. Cash flow funnel. Inside job. Traitors. $. We are in control. Those awake can see.'
    },
    {
      subject: 'Chatter Exploding',
      body: 'Change of narrative will be required. [-4][-5]. Public to awaken [mass-start]. Sleeping pill reject. OP Mockingbird FAILURE.'
    },
    {
      subject: 'Safe Comms Maybe Exhausted',
      body: 'We may have exhausted our ability to maintain safe-comms. Snow White. Rig for silent running. Unknown return.'
    },
    {
      subject: 'RED RED Stringer 25th',
      body: 'Expand your thinking. Take multiple paths. One connects to another. Learn to read the map. The map is the key. Find the keystone. What holds everything together?'
    }
    
  ]

  function CrypticEmail(isLoaded) {
    var text = getRandomFromArray(crypticEmails);
    return new Email(false, isLoaded, text.subject, text.body, 'Sender Unknown', null, null, null, true);
  }

var businessWords = ["ASAP", "B2B", "B2C", "BYOD", "CTR", "EBITDA", "EOD", "KPI", "ROI", "SEO", "SAAS", "accelerator", "action",
  "advertainment", "agile", "analytic", "bandwidth", "ballpark", "best practice", "blue sky thinking", "boot strap", "bootstrap",
  "brand", "bubble", "cash flow", "churn rate", "circle back", "client", "content marketing", "crowdfund", "crowdsource", 
  "customer", "deep dive", "deliverable", "digital nomad", "disrupt", "downsiz", "drill down", "dynamism", "early adopter", 
  "end-user", "end user", "enterprise", "equity", "evangelist", "evergreen", "executive", "exit strategy", 
  "freemium", "gamification", "gamified", "globalization", "growth hack", "golden parachute",
  "hacking", "holistic", "hyperlocal", "ideat", "influencer", "innovat", "intellectual property", 
  "invest", "iterat", "layoff", "leverage", "market", "millennial", "mission", "monetiz", "moving forward", "optimiz", 
  "outsourc", "overhead", "paradigm", "pivot", "profit", "redundanc", "revenue", "sale", "scaleable", "share", "shareholder", 
  "stakeholder", "startup", "stock", "synergy", "thought leader", "trim the fat", "unicorn", "valuation", 
  "visionary", "wheelhouse", "wunderkind"];
	
	function getBonusFromInputText(text, from, unit, isSpecial) {
	  if (text) {
      // Split entered text into words and only keep those of 3 characters or longer
  	  var inputWords = text.toLowerCase().replace(/[.,\/#!$%\^&?@\*;:{}=\-_`~()]/g,"").split(/\s+/);
  	  inputWords = inputWords.filter(function(word) {
  	    return word.length >= 3;
  	  });
  	  
  	  var baseBonus = inputWords.length;
  	  var multiplier = baseEmailTextMultiplier.val();
  	  
  	  wordsReplied.add(baseBonus);
  	  
      var bonusWordsFound = 0;

      var bonusWords = from ? from.toLowerCase().split(/\s+/) : null;
      if (!isSpecial && bonusWords) {
        bonusWords.concat(unit.toLowerCase().split(/\s+/));
      }

      if (bonusWords) { 
    	  for (var i = 0; i < bonusWords.length; i++) {
           if (inputWords.indexOf(bonusWords[i]) > -1) {
             bonusWordsFound++;
           }
    	  }

        if (bonusWordsFound === 2) {
          earnAchievement('pl1');
        }
      }

      var businessWordsUsed = [];
      for (var i = 0; i < businessWords.length; i++) {
        if (text.toLowerCase().indexOf(businessWords[i]) > -1) {
          if (businessWordsUsed.indexOf(businessWords[i].toLowerCase()) === -1) {
            businessWordsUsed.push(businessWords[i]);
            earnAchievement('pl3');
          }
        }
      }

      if (businessWordsUsed.length >= 5) {
        earnAchievement('pl4');
      }

      baseBonus += businessWordsUsed.length * 5;
      multiplier += bonusWordsFound;
  	  
  	  var total = baseBonus * multiplier
      return total + (total * (textBoost.total.val() / 100));
	  } else {
	    return 0;
	  }
	}

  function getTimeBonus(timeReceived, timeRemaining, away) {
    var timeBonus = 0;
    if (!away) {
      var diff = (new Date().getTime() - timeReceived) / 1000;
      timeBonus = (timeToAnswerMail.val() - diff) / timeToAnswerMail.val();
      checkForEmailAwards(diff);
    } else {
      timeBonus = 0;
    }

    // Check if it's expired before we set a minimum on the time bonus
    var isExpired = false;
    if (timeBonus <= 0) {
      isExpired = true; 
    }

    if (timeBonus > 1) {
      timeBonus = 1;
    } else if (timeBonus <= timeBonusMinimum.val() || timeRemaining === 0) {
      timeBonus = timeBonusMinimum.val();
    } 

    return { bonus: timeBonus, isExpired: isExpired };
  }

  // The sooner you answer the email, the closer to full value you get
  function getCashFromEmail(textBonus, timeBonus) {
    var cashToAdd = (totalDPS.val() * (50 + (emailCashBonus.val() * 2))) * timeBonus.bonus;
    cashToAdd += cashToAdd * (textBonus / 100);
    cashToAdd += cashToAdd + (cashToAdd * (emailBoost.total.val() / 100));

    if (timeBonus.isExpired) {
      expiredEmailsAnswered.add(1); 
      expiredEmailEarned.add(cashToAdd);
    } else {
      freshEmailsAnswered.add(1);
      freshEmailEarned.add(cashToAdd);
    }

    return cashToAdd;
  }
	
	var clearAllEmails = function(isAcquisition) {
    var inbox = isAcquisition ? viewingAcquisition().mail() : mail();
    var count = 0;
    for (var i = 0; i < inbox.length; i++) {
      if (!inbox[i].replied()) {
        inbox[i].respond(); 
        count++;
      }

      if (count >= 50) {
        earnAchievement('markasread3');
      } else if (count >= 25) {
        earnAchievement('markasread2');
      } else if (count >= 10) {
        if (isAcquisition) {
          earnAchievement('policy1');
        } else {
          earnAchievement('markasread1');
        }
      }
	  } 
  };

  function getRandomSubject() {
    var prefixes = [
      'RE: ',
      'FW: '
    ];

    var subjects = [
      'Top 800 Amazing B2B Content Marketing Solutions',
      'Inspiring Manager Treats His Subordinates Like His Kids',
      '5 Truths Every CEO Needs To Know About Primogeniture',
      'Vid: Ex-Marine CTO & Hiring Manager Destroys PC Culture',
      'Read This Tech Billionaire\'s Epic Clapback Against Taxes',
      'I Think Millennials Should All Just Buy Houses',
      'Born To Lead: Politician\'s Child Also Becomes Politician',
      'All The Feels: This Dedicated Employee Died at Her Desk',
      'Who\'s Cutting Onions: Tear Gas as a Workplace Motivator',
      'Science: All Career Paths Are Biologically Predetermined', // 10
      'Brave Student Destroys Atheist Professor Using Logic',
      'Take Our Quiz: Are Your Employees Secretly ANTIFA?',
      'Cute: What Baby Red Pandas Can Teach Us About Outsourcing',
      'QUIZ: Which Nightmare Kakistocrat is Your Boyfriend?',
      '8 Ways Military Coups Can Protect Your Interests Abroad',
      'Unions? In My Business? Why It\'s Just Not a Good Fit',
      'Which War Criminal Are You (Based On Your Taste In Food)',
      'Top 10 Ways MS-13 is Infiltrating Your Work Space',
      'This Inspiring Mom Works 6 Jobs Because of Love',
      'How to \'GoT\' Your Office Using Jus Primae Noctis', // 20
      'Only 90\'s Kids Will Remember This African Genocide',
      'Shocking: Migrants Force Sharia Law on Local Office',
      'Aww: This Cat Loves Mice, Despite Hierarchical Superiority',
      'How Employee Homelessness Can Improve Your Bottom Line',
      'This Young Hero Reported His Teacher\'s Family to ICE',
      'New Study: Minimum Wage Jobs Are Only For High Schoolers',
      'New Study: Poverty Caused by Moral Failings, Bad Work Ethic',
      'Hold the Door: What Hodor Can Teach Us About Entitlements',
      'Young Patriot Murders Homeless Man for Stolen Valor',
      'This Brave Boy Says the Pledge Every Time He Sees A Flag', // 30
      'This Office Has a Pool Table Instead of Vacation Days',
      'This CEO Respects Women, So He Always Compliments Them',
      'This Ex-Navy Seal Destroys Campus Culture in 22,000 Words',
      'No Safe Spaces: This Logic Crusader Taunts Trauma Victims',
      'Rebel Professor Blows Minds By Ignoring Preferred Pronouns',
      'What to Do When Your Private Security Has Committed Murder',
      '5 Ways to Clear the Tent Camps Outside Your Warehouses',
      'This Artist Reimagined Top Technocrats As Disney Princesses',
      'Office Humor (LOL): Not \'Til I\'ve Had My Coffee!!!!',
      'Logic Warrior Debunks White Privilege: "Actually, You\'re Racist"', // 40
      'QUIZ: Where Would The Sorting Hat Put Your Hired Mercenaries?',
      'The Commons Sure Are Tragic: 8 Places to Dump Your Coal Slurry',
      'Patriot Questions EBT Recipient Over Contents of Shopping Cart',
      'Keep Workers Alert By Keeping Them From Fully Sitting or Standing',
      'Super Cute: 6 Children\'s Books That Teach Deference to Authority',
      'Travel Advisory: Sweden Now Populated Only By Crime-Migrants',
      'Office Humor (LOL): Oh No, There\'s Only Decaf!!!!',
      '8 Ways to Click Your Remote Control, Spit Insults at the Screen',
      'Truth Bomb: If You Don\'t Date Conservatives, That\'s Genocide',
      'New Study: Child Soldiers Respect Elders, Tradition', // 50
      'Watch the Stranger Things Kids at an Execution with Jimmy Fallon',
      '10 Ways to Root Out Communist Sympathizers in Your Office',
      'Counter-Point: Ever Heard of Venezula???????',
      'The Brave: A Retrospective on Surviving a Socialist Muslim Presidency',
      'This Innovative Woman Says "Demon-rats" instead of Democrats',
      'Outsider Art: This Man\'s Effigy of Hillary Clinton Inspires Motorists',
      'News Alert: Multicultural Home Invasions Now Leading Cause of Death',
      'Inspiring: This Business Leader Launched a Car into the Sun',
      'Stay Vigilant: "Knockout Game" Now Leading Cause of Elderly Death',
      'So Wise: Margaret Thatcher Said the Trouble with Socialism Is...', // 60
      '1 Per State: 57 Most Islamic Quotes From Barack Insane Obungler',
      'New Evidence: JFK Jr. Still Alive, Hates Political Correctness',
      'Hypocrite: Local Socialist Owns Phone, Benefits From Capitalism',
      'KilLIARy KKKlinton and the Secret History of the Party of Slavery',
      'AOC Examined: Are Those the Succulent Feet of a Poor Woman?',
      'Heartwarming: Heckin\' Pupper Won\'t Leave Dead War Criminal\'s Side',
      'My Struggle: How Being Called Racist Forced Me to Become Racist',
      'Yass Khaleesi: How Daenerys Would Handle the Houthis in Yemen',
      'New Report: 94% of Latin American Economies Now Caravan-Based',
      'Hogg-Wild: Gun Control Advocate? More Like Tide Pod Advocate', // 70
      'Radio Genius Delivers Thermonuclear MMA Assault on Fake News',
      'Looser Change: Where Exactly Was Ilhan Omar on 9/11?',
      'My Enlarged Heart: It\'s Got Hot Blood Going Through it Fast',
      'Kept Comfortable: Baby Executioner Elected Governor of VA',
      'Elizabeth Warren Releases Personal Phrenology Skull Data',
      'Counterpoint: Real Victim of Christchurch Massacre is PewDiePie',
      'Enter Sandmann: How One Brave Youth Made America Great Again',
      'Hot Covfefe: How Schultz 2020 is Actually the Most Radical',
      'Doing His Part: Activist\'s Gamertag is \'XxCuckTriggerer420xX\'',
      'Mob Mentality: Local SJWs Condemn Man Just for Asking Questions', // 80
      'True Heroism: Hayden Took a Punch in the Face for All of Us',
      'Atheist Professor Slain: God\'s Not Dead, He is Surely Alive',
      'New Study Shows Most Aborted Babies Would Have Been Doctors',
      'Shocking Report: Public Schools Require Radical Islam Courses',
      'How Smaller Breasts in Fighting Games Have Rendered Me Impotent',
      'The Legacy of Stalin: How Joe Biden Embodies Far Left Radicalism',
      'The Hot Seat: The Ladies of The View Get Personal with Ratko Mladić',
      'Migration Whoopsie: Scandinavia Now Consists Entirely of No-Go Zones',
      'Common Sense: Mike Lindell Deconstructs Marxist Commodity Fetishism',
      'Inspiring: This Sam Elliott Meme Explains Why Millennials Are Stupid', // 90
      'Racism Solved: Local Cop Shoots Everyone, Regardless of Skin Color',
      'How a Green Military Can Wage Never-Ending War on Climate Change',
      'Representation Win: US Military Develops Rainbow Phosphorous',
      'Freely Speaking: It is Fascism to Criticize a Comedian Ever',
      'Border-line Genius: Concentration Camp? More Like Summer Camp',
      '#Resist: Heroic Tweet Slams Dolt45 Orange Drumpf Cheetolini',
      'So Radical: How Being Called \'TERF\' Made Me the True Victim',
      'Democratic Hopeful Pitches Kid-Friendly Border Prison Camps',
      'Startup Genius Just Trying to Talk About Biological Differences',
      'Heartwarming Coincidence: CEO\'s Son Happens to Be Best Man for Job', // 100
      'Dark Portents: How John 2:18 Predicted the Coming of Greta',
      'Culture, Canceled: How Internet Critics Mirror the Gestapo',
      'More Like Crynet: How I Realized All My Critics Are Russian Bots',
      'Gun Out of Control: Idiot Charlatan Mixes Up "Clip" and "Magazine"',
      'True Citizens: Why Only First Responders Should Have Voting Rights',
      'Murder Advocate: Class Bigot Says Billionaires "Shouldn\'t Exist"',
      'Pandemic? Dem-panic: Healthy Patriot Coughs Directly into Salad Bar',
      'CEOvid-19: How Global Pandemics Hurt Those with the Most to Lose',
      'Netflix & Steal: How \'Work from Home\' Policies Are Robbing You',
      'No, Bernie Bro: The Existential Threat of Rude People Online', // 110
      'Outside Agitated: Our Very Happy Locals Would Never Riot',
      'ANTIFA: Existential Threat, or Suburban Weenies? Actually, Both',
      'Local Hero Speaks Out for Officers Impacted by Tear Gas Blowback',
      'Appalling: Unruly Protestor Damages Police Cruiser With Broken Body',
      'Hindsight is 19/34: How Fact-Checkers Could Have Stopped Hitler',
      'Ellen Speaks Out: "Félicien Kabuga is My Friend"',
      'Follow the Money: Police & FBI Should Target the CFO of ANTIFA',
      'Domestic Terrified: Being a Cop Is Scary, Can You Blame Them?',
      'Ground Stood: Man Prays for Opportunity to Shoot Home Invaders',
      'Gentler Policing: What if Cops Learn to Maim Instead of Killing?' // 120
    ];

    var prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    var subject = subjects[specialMailSessionCycler];
    specialMailSessionCycler = specialMailSessionCycler < subjects.length - 1 ? specialMailSessionCycler + 1 : 0; 

    return prefix + subjects[specialMailSessionCycler];
  }
  
  function getRandomBody() {
    var bodies = [
      "I think we can learn a lot from this.",
      "Have you seen this? Really got me thinking.",
      "Let's talk about this at lunch. I've got some ideas.",
      "I loved this. Let me know what you think.",
      "Why aren't we doing more like this?",
      "We should be doing more like this.",
      "This is next level. Really smart stuff.",
      "This blew my mind. We should be thinking more like this.",
      "Send this to your group. They should all check it out.",
      "These guys get it. This is really something.",
      "Have you seen this? I'd love to pick your brain on it.",
      "This is what the future looks like. We need to be on top of this.",
      "I can\'t get enough of this. Check it out.",
      "We need these kinds of ideas. Look into this.",
      "Have you heard about this? Really put things into perspective.",
      "I want to see more like this. Outside the box thinking.",
      "Let me know what you think. I found it very thought-provoking.",
      "Read this carefully. I think this could change everything.",
      "Let's circle back on this. I think there is a lot to learn.",
      "I'd love to hear your thoughts on this. Very interesting stuff."
    ];
    
    return bodies[Math.floor(Math.random() * bodies.length)];
  }
	
  function getRandomName() {
    var firstNames = [
      'John',
      'Jane',
      'Steve',
      'Bill',
      'Mark',
      'Sheryl',
      'Larry',
      'Travis',
      'George',
      'Marissa',
      'Jeff',
      'Ken',
      'Dara',
      'Richard',
    ];
      
    var lastNames = [
      'Smith',
      'Johnson',
      'Jones',
      'Williams',
      'Taylor',
      'Singh',
      'Wang',
      'Sato',
      'Kim',
      'Tremblay',
      'Rodriguez',
      'Martin',
      'Rossi',
      'Schmidt'
    ];
      
    return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
  }
  
  function checkForEmailAwards(timeTakenToAnswer) {
    var timeLeftToAnswer = timeToAnswerMail.val() - timeTakenToAnswer;
    if (timeTakenToAnswer < 1) {
      earnAchievement('etime2');
    } else if (timeLeftToAnswer < 1 && timeLeftToAnswer > 0) {
      earnAchievement('etime1');
    }
  }

  /*************************************************************
                      ELECTIONS
  *************************************************************/ 

  function getRandomGender() {
    return Math.random() < 0.5 ? 'm' : 'f';
  }

  function getPoliticianFirstName(gender) {
    var politicianMaleFirstNames = [
      'Michael',
      'Christopher',
      'Robert',
      'William',
      'Matthew',
      'Richard',
      'Thomas',
      'Anthony',
      'Charles',
      'Andrew',
      'Edward',
      'Benjamin',
      'Gary',
      'Douglas',
      'Larry',
      'Dennis',
      'Raymond',
      'Jeffery',
      'Rodney',
      'Roger',
      'Gerald',
      'Walter',
      'Michael',
      'Henry',
      'Arthur',
      'Albert',
      'Jack',
      'Jimmy',
      'Tony'
    ];

    var politicianFemaleFirstNames = [
      'Amy',
      'Elizabeth',
      'Jennifer',
      'Michelle',
      'Angela',
      'Julia',
      'Amanda',
      'Shannon',
      'Christine',
      'Susan',
      'Patricia',
      'Andrea',
      'Pamela',
      'Stacey',
      'Deborah',
      'Sharon',
      'Bridget',
      'Lauren',
      'Kathy',
      'Catherine',
      'Carol',
      'Erica',
      'Janet',
      'Diane',
      'Sheila',
      'Samantha',
      'Margaret',
      'Melinda'
    ];

    if (gender === 'm') {
      return getRandomFromArray(politicianMaleFirstNames);
    } else {
      return getRandomFromArray(politicianFemaleFirstNames);
    }
  }

  var offices = ['Mayor', 'to Congress', 'Governor', 'Senator', 'President'];
  var offices2 = ['Mayor', 'Congress', 'Governor', 'Senator', 'President'];

  var politicianLastNames = [
    'Sullivan',
    'Peterson',
    'Murphy',
    'Hughes',
    'Nelson',
    'Roberts',
    'Russell',
    'Bennett',
    'Phillips',
    'Morgan',
    'Anderson',
    'Campbell',
    'Thompson',
    'Harris',
    'Clark',
    'Lewis'
  ];

  function Election() {
    this.candidateSearchGoal = 1000 /* 75000 */;
    this.gender = getRandomGender();
    this.firstName = ko.observable(getPoliticianFirstName(this.gender));
    this.lastName = ko.observable(getRandomFromArray(politicianLastNames));
    this.gaffes = ko.observableArray([]);
    this.totalDonations = new Stat('Donations', 0, '$');
    this.active = ko.observable(false);
    this.finished = ko.observable(false);
    this.resultsView = ko.observable(false);
    this.resultsMessage = ko.observable('');
    this.win = ko.observable(false);
    this.baseElectionTime = 1000 * 60 * 5;

    this.totalEarned = new Stat('Total Earned', 0, '$');
    this.netEarned = new Stat('Net Earned', 0, '$');

    this.pollNumber = ko.observable(50);
    this.candidateSearch = ko.observable(0);

    this.selectedOffice = ko.observable();
    this.selectedBackground = ko.observable();
    this.selectedPersonality = ko.observable();
    this.selectedBackup = ko.observable();

    this.bio = ko.observable(getBiography(this.firstName(), this.lastName(), this.gender, this.selectedOffice()));
    this.miniBio = ko.observable(getMiniBio(this.firstName(), this.lastName(), this.gender));
    this.slogan = ko.observable(getSlogan());

    /** BONUSES **/

    this.blue = ko.observable(0);
    this.pocket = ko.observable(0);
    this.shadow = ko.observable(0);
    this.puppet = ko.observable(0);

    this.gaffeRisk = new Stat('Gaffe Risk', ko.computed(function() {
      var selectedOffice = this.selectedOffice() ? parseInt(this.selectedOffice()) : 0;
      var selectedBackground = this.selectedBackground() ? parseInt(this.selectedBackground()) : 0;
      var selectedPersonality = this.selectedPersonality() ? parseInt(this.selectedPersonality()) : 0;
      var selectedBackup = this.selectedBackup() ? parseInt(this.selectedBackup()) : 0;
      var base = (selectedOffice * 2) + selectedBackground + selectedPersonality + selectedBackup;
      return 10 + (base * 4) - gaffeBuffer.val();
      return total > 100 ? 100 : total;
    }, this), null, '%');

    this.donationDiscount = new Stat('Donation Discount', ko.computed(function() {
      var base = this.selectedBackground() ? parseInt(this.selectedBackground()) : 0;
      return base * 15;
    }, this), null, '%');

    this.lossBonus = new Stat('Loss Bonus', ko.computed(function() {
      var val = this.selectedBackup() ? parseInt(this.selectedBackup()) : 0;
      return Math.round(val * 200);
    }, this), null, '%');

    this.kickbackBonus = new Stat('Kickback Bonus', ko.computed(function() {
      var val = this.selectedPersonality() ? parseInt(this.selectedPersonality()) : 0;
      return Math.round(val * 50);
    }, this), null, '%');

    this.timeReduction = new Stat('Time Reduction', ko.computed(function() {
      var val = this.selectedBackup() ? parseInt(this.selectedBackup()) : 0;
      return Math.round(val * 10);
    }, this), null, '%');

    var electionTimes = [1000 * 60, 1000 * 60 * 2, 1000 * 60 * 3, 1000 * 60 * 4, 1000 * 60 * 5]
    this.electionTime = new TimeStat('Election Time', ko.computed(function() {
      var time =  electionTimes[this.selectedOffice() ? parseInt(this.selectedOffice()) : 0];
      return time - (time * (this.timeReduction.val() / 100));
    }, this), true);

    this.streakBonus = new Stat('Streak Bonus', ko.computed(function() {
      return winStreak.val() * 5;
    }, this), null, '%');

    var valMultipliers = [1, 2.5, 7, 18, 45];
    this.winValue = new Stat('Win Value', ko.computed(function() {
      if (this.selectedOffice()) {
        var base = totalDPS.val() * 200;
        var office = this.selectedOffice() ? parseInt(this.selectedOffice()) : 0;
        var val = base * valMultipliers[office];
        var valWithBonus = val + (val * this.kickbackBonus.val() / 100);
        var valWithUpgradeBonus = valWithBonus + (valWithBonus * electionPayoutBonus.val() / 100);
        var valWithStreak = valWithUpgradeBonus + (valWithUpgradeBonus * (this.streakBonus.val() / 100));
        return valWithStreak + (valWithStreak * (electionBoost.total.val() / 100));
      } else {
        return 0;
      }
    }, this), '$');

    this.lossValue = new Stat('Loss Value', ko.computed(function() {
      return this.winValue.val() / 10;
    }, this), '$');

    this.readyToBegin = ko.computed(function() {
      return this.active() 
        || (this.selectedOffice()
        && this.selectedBackground()
        && this.selectedPersonality()
        && this.selectedBackup());
    }, this);

    this.resetCandidate = function() {
      this.gender = getRandomGender();
      this.firstName(getPoliticianFirstName(this.gender));
      this.lastName(getRandomFromArray(politicianLastNames));
      this.bio(getBiography(this.firstName(), this.lastName(), this.gender, this.selectedOffice()));
      this.miniBio(getMiniBio(this.firstName(), this.lastName(), this.gender));
      this.slogan(getSlogan());
      this.gaffes.removeAll();

      this.totalDonations.val(0);
      this.pollNumber(50);
    }

    this.reset = function() {
      this.stopElections();
      this.resetCandidate();
      this.selectedOffice(null);
      this.selectedBackground(null);
      this.selectedBackup(null);
      this.selectedPersonality(null);
      this.finished(false);
    }

    this.view = ko.observable('preparing');
    this.setView = function(view) {
      this.view(view);

      if (view === 'bio') {
        earnAchievement('elbio');
      }
    }

    this.donateCooldown = ko.observable(false);

    this.donate = function() {
      this.totalDonations.add(this.donationAmount.val());
      donatedToCandidates.add(this.donationAmount.val());
      currentCash.sub(this.donationAmount.val());
      this.pollNumber(this.pollNumber() + electionSupportRate.val());
      if (this.pollNumber() > 100) {
        this.pollNumber(100);
      }

      clearTimeout(this.cooldown)
      this.donateCooldown(true);
      this.cooldown = setTimeout(function() {
        this.donateCooldown(false);
      }.bind(this), 300);
    }

    this.recordResults = function(isWin, num, totalDonations) {
      if (isWin) {
        winStreak.add(1);
        if (winStreak.val() > winStreakCap.val()) {
          winStreak.val(winStreakCap.val());
        }

        electionsWon.add(num);
        this.totalEarned.val(this.winValue.val() * num);
        this.netEarned.val((this.winValue.val() * num) - totalDonations);

        if (this.pollNumber() >= 100) {
          earnAchievement('welp2');
        } else if (this.pollNumber() <= 50) {
          earnAchievement('welp1');
        }

        if (this.totalDonations.val() === 0) {
          earnAchievement('suff1');
        }

        var thankYouBodies = [
          'Thank you for your assistance in this effort. It has been duly noted.',
          'We couldn\'t have done this without you. It won\'t be forgotten.',
          'Thank you for all your help. Rest assured it will be made up to you.',
          'Your help is much appreciated. I promise that you will not regret it.',
          'Thanks again for everything you\'ve done. We won\'t forget it.',
          'That win was all you - I mean it. We\'ll remember this one.',
          'Thanks so much for your help. We owe you one for sure.'
        ];

        if (electionNotifications.val() > 0) {
          var newEmail = new Email(false, false, 'RE: Successful run for ' + offices2[this.selectedOffice()], getRandomFromArray(thankYouBodies), this.firstName() + ' ' + this.lastName());
          if (awayMailInbox().active()) {
            newEmail.respond();
          } else {
            mail.push(newEmail);
          }
        }
      } else {
        winStreak.val(0);
        electionsLost.add(num);
        this.totalEarned.val(this.lossValue.val() * num);
        this.netEarned.val((this.lossValue.val() * num) - totalDonations);
      }

      if (this.netEarned.val() < 0) {
        earnAchievement('don1')
      }

      earnedFromElections.add(this.totalEarned.val());
      addClicks(this.totalEarned.val());
      return this.totalEarned.val();
    }

    this.seeResults = function() {
      if (!this.resultsView()) {
        this.seeingResults = true;
        if (Math.random() * 100 < this.pollNumber()) {
          this.win(true);
          this.recordResults(true, 1, this.totalDonations.val());
          this.resultsMessage(this.firstName() + ' ' + this.lastName() + ' Wins!')
        } else {
          this.win(false);
          this.recordResults(false, 1, this.totalDonations.val());
          this.resultsMessage(this.firstName() + ' ' + this.lastName() + ' Loses');
        }

        this.resultsView(true);

        setTimeout(function() {
          this.resultsView(false);
          this.finished(false);
          this.setView('preparing');
        }.bind(this), 4000);
      }
    }

    this.stopElections = function() {
      this.active(false);
      clearInterval(this.timer);
      this.setView('preparing');
    }

    this.gaffeInterval = 1000 * 5;
    this.lastInterval = 0;
    this.targetTime = 1000 * 60 * 5; 
    this.timeRemaining = ko.observable();
    this.timer = null;
    this.lastGaffe = Date.now();
    this.startTimer = function() { 
      this.targetTime = this.electionTime.val();
      this.timeRemaining(this.electionTime.val());
      this.lastInterval = 0;
      this.timer = setInterval(function() {
        var now = Date.now();
        var elapsedTime = now - this.lastInterval;
        this.lastInterval = now;
        
        if (elapsedTime < 60000) {
          var newTime = this.timeRemaining() - (elapsedTime);
          this.timeRemaining(newTime > 0 ? newTime : 0);
        }

        if (Math.random() < 0.5) {
          this.pollNumber(this.pollNumber() + getRandomInt(-1, 1));
          if (this.pollNumber() <= 0) {
            this.pollNumber(0);
          }

          if (this.pollNumber() >= 100) {
            this.pollNumber(100);
          }
        }

        if ((Date.now() - this.lastGaffe) >= this.gaffeInterval) {
          if (Math.random() * 100 < this.gaffeRisk.val()) {
            var gaffe = new Gaffe();
            this.pollNumber(this.pollNumber() - gaffe.mod());
            if (this.pollNumber() <= 0) {
              this.pollNumber(0);
            } else if (this.pollNumber() > 100) {
              this.pollNumber(100);
            }

            gaffe = checkForGaffeDuplicates(this.gaffes(), gaffe);

            this.gaffes.unshift(gaffe);
            if (this.gaffes().length > 10) {
              this.gaffes.pop();
            }
          }

          this.lastGaffe = Date.now();
        } 

        if (this.timeRemaining() <= 0) {
          this.active(false);
          this.finished(true);
          //this.seeResults();
          clearInterval(this.timer);
        }

      }.bind(this), 1000);
    }

    this.donationAmount = new Stat('Donation Amount', ko.computed(function() {
        var elapsedTime = this.targetTime - this.timeRemaining();
        var increase = (elapsedTime / this.targetTime) * 5;
        val = this.winValue.val() / 125;
        val = val + (val * increase);
        return val - (val * (this.donationDiscount.val() / 100));
    }, this), '$');

    this.cantAffordDonation = ko.computed(function() {
      return this.active() && (currentCash.val() < this.donationAmount.val());
    }, this);

    this.displayTimeRemaining = ko.computed(function() {
      return formatTimeRemaining(Math.round(this.timeRemaining() / 1000));
    }, this);

    this.start = function() {
      if (this.readyToBegin()) {
        this.resetCandidate();

        this.active(true);
        //this.finished(false);
        this.startTimer();
        this.view('main');
      }
    }
  } 

  function checkForGaffeDuplicates(gaffes, gaffe) {
    if (gaffeExists(gaffes, gaffe)) {
      var newGaffe = new Gaffe();
      return checkForGaffeDuplicates(gaffes, newGaffe);
    } else {
      return gaffe;
    }
  }

  function getGaffeText() {
    var gaffes = [
      'Threw up in Shinzō Abe\'s lap',
      'Did a weird scream at a rally',
      'Said "please clap"',
      'Got hit in the face with a milkshake',
      'Had a meeting on a tarmac',
      'Got video-taped smoking crack in a motel',
      'Had a wide stance in an airport bathroom',
      'Wore a tan suit',
      'Couldn\'t spell "potato"',
      'Looked really sweaty on TV', // 10
      'Cheated on a cancer-stricken spouse',
      'Said "Pokemon Go to the polls"',
      'Looked weird trying to catch a football',
      'Tried to dab on Ellen',
      'Failed to play the sax on Arsenio Hall',
      'Exploited opponent\'s youth and inexperience',
      'Bodyslammed a journalist',
      'Access Hollywood tapes were uncovered',
      'Revealed to be one of the Pinkenba Six',
      'Tied the family dog to the roof of the car', // 20
      'Asked on live television what "Aleppo" was',
      'Arrested for urinating on the Alamo',
      'Broke in to the DNC office',
      'Sold weapons to Nicaraguan rebels',
      'Forgot about 9/11',
      'Did not support our troops',
      'Described veterans as "washed up" and "old news"',
      'Had never heard of Iowa or New Hampshire',
      'Accidentally called Angela Merkel "mom"',
      'Vaped repeatedly during a televised debate', // 30
      'Listed "hentai" as a personal favorite genre',
      'Spent the entirety of college in blackface',
      'Described Anne Frank as "cowardly" and "low-T"',
      'Called the 9/11 hijackers "ambitious young men"',
      'Recorded defiling the corpse of Muammar Gaddafi',
      'Photographed playing tennis with Thomas Lubanga',
      'Gave a toast at Slobodan Milošević\'s wedding',
      'Caught executing a Guatemalan union organizer',
      'Accidentally managed a civil war in El Salvador',
      'Slip of tongue resulted in various racial slurs', // 40
      'Accused of sexual assault by %BIGNUM different women',
      'Suggested the Holocaust was "not that bad"',
      'Listed Omar al-Bashir as emergency contact',
      'Described Jerry Sandusky as a "personal hero"',
      'Interned with the Lord\'s Resistance Army in college', 
      'Repeatedly defined "ephebophelia" during debate',
      'Plausibly accused of being the Zodiac Killer',
      'Wrote a lengthy op-ed defending Jared Fogle',
      'Noted favorite director as Leni Riefenstahl',
      'Listed on every Jeffrey Epstein flight log', // 50
      'Publicly accused of hijacking Flight 305',
      'Described Casey Anthony as a "celebrity crush"',
      'Described Heaven\'s Gate as having "some fresh ideas"',
      'Called age of consent laws "America\'s great injustice"',
      'Listed Ian Watkins as a personal favorite musician',
      'Ran afoul of Joe the Plumber',
      'Brandished a Civil War musket during a debate',
      'Was unable to name any previous American president',
      'Records revealed a history of %SMALLNUM DUIs',
      'Attributed "I Have a Dream" to Martin Lawrence', // 60
      'Avoided jury duty due to "prejudice against all races"',
      'Plausibly accused of murdering Leo Ryan',
      'Sexually harassed an Incan Mummy',
      'Self-identified as the true Pope due to Vatican II',
      'Told too many stories about "T-Bone"',
      'Experienced "heated gaming moments" during a debate',
      'Admitted to running a James Holmes fan Tumblr',
      'Called Anita Sarkeesian "an existential threat to life"',
      'Accidentally wore a novelty SS uniform to a photo op',
      'Referred to a cop as "sugar tits" during a traffic stop', // 70
      'Described own genitals as "white supremacist"',
      'Accidentally Tweeted "sex gifs"',
      'Tried to kiss Justin Trudeau on the lips',
      'Said political career was meant to impress Jodie Foster',
      'Persuasively accused of murdering JonBenet Ramsey',
      'Called Dzhokhar Tsarnaev "the sexiest man alive"',
      'Accidentally brought secret second family to a photo op',
      'Called Woo Bum-kon "an inspiring first responder"',
      'Tried for war crimes during the Yugoslav Wars',
      'Described the Armenian Genocide as a "cool story"', // 80
      'Dismissed the Nanking Massacre as "Japan bashing"',
      'Called the 1965 Tragedy in Indonesia a "market win"',
      'Fell off a stage in Chico, California',
      'Featured in approximately %BIGNUM leaked sex tapes',
      'Starred in an amateur remake of "The Birth of a Nation"',
      'Self-described as "more of a Dylan than an Eric"',
      'Caught selling drugs to Ed Buck',
      'Adopted the "Carlos Danger" alias for sexting',
      'Listed a favorite hobby as "youth blood transfusions"',
      'Persuasively accused of flying United Flight 93', // 90
      'Authoritatively accused of hijacking MAS370',
      'Wrote an op-ed tying David Hogg to Anwar al-Awlaki',
      'Photographed golfing with Idi Amin in 1977',
      'Suggested that Pinochet was "tough, but fair"',
      'Accidentally called Imran Khan "Khan Noonien Singh"',
      'Accused of founding the Davao Death Squad',
      'Simultaneously accused of both elder and child abuse',
      'Played Mr. Yunioshi in "Breakfast at Tiffany\'s"',
      'Described the Statue of Liberty as "a real hag"',
      'Listed Tucker Max as a favorite author', // 100
      'Referred to a female journalist as a "slam-pig"',
      'Described Indira Gandhi as an "old witch"',
      'Arrested in connection with the Lufthansa heist',
      'Records show %BIGNUM arrests for public intoxication',
      'Listed by the SPLC as a one-person hate group',
      'Revealed to have a purse filled with hot sauce',
      'Leaked resume includes "Founder, ISIS (1999)"',
      'Listed all-time favorite author as OJ Simpson',
      'Self-described as "Micheal Vick, but for cats"',
      'Drunkenly groped a female interviewer', // 110
      'Snorted bath salts during a televised debate',
      'Repeatedly rode the sybian on Howard Stern',
      'Falsely claimed to have "plowed Kate Upton"',
      'Threatened to "Chris Benoit" debate opponents',
      'Chose the Fourteen Words as a campaign slogan',
      'Suspected of running the Caravan of Death in Chile',
      'Revealed as a founder of the Silent Brotherhood',
      'Booted from Opie & Anthony for being too racist',
      'Still calling for the execution of the Central Park Five',
      'Inadvertantly confessed to murdering Jeffrey Epstein', // 120
      'Repeatedly claimed to be the Lindbergh baby'
    ];

    return getRandomFromArray(gaffes);
  }

  function Gaffe() {
    this.text = getGaffeText();
    this.text = this.text.replace('%BIGNUM', getRandomInt(100, 500));
    this.text = this.text.replace('%SMALLNUM', getRandomInt(21, 49));
    this.mod = ko.observable(getRandomInt(2, 6));
    this.manualSpinsNeeded = this.mod() * 5;
    this.manualSpins = 0;

    if (Math.random() * 100 < prChance.val()) {
        this.mod(-this.mod());
    }

    gaffesExperienced.add(1);
  }

  function gaffeExists(gaffes, gaffe) {
    var exists = false;
    for (var i = 0; i < gaffes.length; i++) {
      if (gaffes[i].text === gaffe.text) {
        exists = true;
      }
    }

    return exists;
  }

  /** POLITICIAN BIOGRAPHIES **/

  function getMiniBio(first, last, gender) {
    var miniTemplates = [
      '%FULLNAME is %DESCRIPTOR looking to %DOSOMETHING. Read %HIS <a onclick="game.election().setView(\'bio\');setTimeout(function() {$(\'#electionbio\').scrollTop(0) }, 100);">full biography</a> if you\'d like to know more.'
    ];

    var descriptors = [
      'a political firebrand',
      'an ambitious entrepeneur',
      'an inspiring orator',
      'a political outsider',
      'a successful business leader',
      'a hero of the private sector',
      'a prolific job creator'
    ];

    var doThings = [
      'shake things up in Washington',
      'bring real change to Capitol Hill',
      'reach across the aisle in Washington',
      'bridge the gap between left and right',
      'bring common sense back to politics',
      'bring a fresh perspective to Washington'
    ];
    var template = getRandomFromArray(miniTemplates);

    return template.replace('%FULLNAME', first + ' ' + last)
    .replace('%HIS', gender === 'm' ? 'his' : 'her')
    .replace('%DESCRIPTOR', getRandomFromArray(descriptors))
    .replace('%DOSOMETHING', getRandomFromArray(doThings));
  }

  var slogans = [
    'A Vision for Hope',
    'A Better Future for Our Children',
    'A Better Future for All of Us',
    'Progress for a Stronger America',
    'A Safer World and Hope for the Future',
    'Leadership for a Better Tomorrow',
    'Working for Change, Working for Families',
    'A Future We Can Believe In',
    'Pushing Forward to a Prosperous Future'
  ];

  function getSlogan() {
    return getRandomFromArray(slogans);
  }

  function getBiography(first, last, gender, office) {
    var firstPTemplates = [
      '%FULLNAME belongs to a generation defined by %SHORTISSUE1, %SHORTISSUE2, and %LONGISSUE. In turn, %HE understands the need for %ISSUENEED, and %HE will fight for it.',
      'Ever since %HE was a child, %FULLNAME has believed in the future. %CAPHE didn\'t face %SHORTISSUE1 and %SHORTISSUE2 as young people do today, but as a leader, %HE understands that the only way forward is %ISSUENEED.',
      'Ever since %HE was a child, %FULLNAME has been a leader. %CAPHE grew up in a generation defined by %SHORTISSUE1, %SHORTISSUE2, and %LONGISSUE, and as a result, %HE understands the need for %ISSUENEED. Like every strong leader, %HE will fight for it.',
      '%FULLNAME understands that the world is changing. Today\'s young people are faced with issues like %SHORTISSUE1 and %SHORTISSUE2, not to mention %LONGISSUE. As a result, %FIRSTNAME understands the need for %ISSUENEED, and %HE will work for it.',
      'Throughout %HIS career, %FULLNAME has been a vocal advocate for %GENERICCOMMUNITY1 and %GENERICCOMMUNITY2. %CAPHE believes in all people, not just %GENERICBADCOMMUNITY, which is why %HE understands the need for %ISSUENEED.'
    ];

    var secondPTemplates = [
      'As %PREVIOUSJOB, %FIRSTNAME created an environment of %GOODQUALITY1 and %GOODQUALITY2. In turn, it\'s only fair to remember that %DEFENSIVE1. That is why %FIRSTNAME needs your support now more than ever.', 
      'Unlike the career politicians in Washington, %FIRSTNAME is no stranger to strong leadership. As %PREVIOUSJOB, %HE created an environment of %GOODQUALITY1 and %GOODQUALITY2, and over time, %DEFENSIVE1. That is leadership we can rely on.',
      'During %HIS time as %PREVIOUSJOB, %FIRSTNAME learned a lot about %GOODQUALITY1 and %GOODQUALITY2. That is why we have to remember that %DEFENSIVE1, and it\'s why %FIRSTNAME needs your support more now than ever.',
      'It was during %HIS time as %PREVIOUSJOB that %FIRSTNAME was drawn to politics. That was where %HE learned that %GOODQUALITY1 and %GOODQUALITY2 are essential to strong leadership, and more importantly, that is why it is important to understand that %DEFENSIVE1.',
      'One of %FIRSTNAME\'s greatest passions is %HIS love of %COMMUNITY1, as well as %HIS life-long interest in %COMMUNITY2. That is why %HIS work as %PREVIOUSJOB was so close to %HIS heart, and why we must always keep in mind that %DEFENSIVE1.',
      'The road to success has been challenging for %FIRSTNAME. As %PREVIOUSJOB, %HE was victimized and persecuted &mdash; after all, %DEFENSIVE1 &mdash; and that struggle has informed %HIS character ever since. %CAPHE knows what it\'s like for regular folks.',
      'Like most hard-working people, %FIRSTNAME has known %HIS share of struggles. As %PREVIOUSJOB, %HE was dogged by misinformation &mdash; for example, %DEFENSIVE1 &mdash; and the pain of that struggle has strengthened %HIS resolve ever since.'
    ]

    var policyPTemplates = [
      'When elected %OFFICE, %FIRSTNAME will hit the ground running and make major changes on day one. %CAPHIS innovative plans for %HIS first 100 days in office include: <ul><li>%GENERICPOLICY1</li><li>%GENERICPOLICY2</li><li>%HORRORPOLICY</li></ul>',
      'If elected %OFFICE, %FIRSTNAME will get to work immediately, rather than spending %HIS days on the golf course like some politicians. %CAPHIS top priorities for %HIS first term include: <ul><li>%GENERICPOLICY1</li><li>%GENERICPOLICY2</li><li>%HORRORPOLICY</li></ul>',
      'When elected %OFFICE, %FIRSTNAME will put %HIS nose to the grindstone on day one. %CAPHIS revolutionary plans for %HIS first 50 days in office include: <ul><li>%GENERICPOLICY1</li><li>%GENERICPOLICY2</li><li>%HORRORPOLICY</li></ul>'
    ];

    var thirdPTemplates = [
      'A native of %PLACE, %FIRSTNAME is a graduate of %COLLEGE and %POSTGRAD. %CAPHE is married to %OTHERNAME, and together they live with their %QUANTITY %CHILDORPET, %NAMES',
      'Born and raised in %PLACE, %FIRSTNAME is a graduate of %COLLEGE and %POSTGRAD. %CAPHE is married to %OTHERNAME, and together they live with their %QUANTITY %CHILDORPET, %NAMES',
      'A graduate of %COLLEGE and %POSTGRAD, %FIRSTNAME lives in %HIS hometown of %PLACE with %HIS %GENDERSPOUSE, %OTHERNAME, and %HIS %QUANTITY %CHILDORPET, %NAMES',
      '%CAPHIS most important roles, however, are those at home. %CAPHE is %GENDERSPOUSE to %OTHERNAME and %GENDERPARENT to %KIDNAME1 and %KIDNAME2, and they live together in %HIS hometown of %PLACE.'
    ];

    var firstP = fillOutTemplate(getRandomFromArray(firstPTemplates), first, last, gender, office);
    var secondP = fillOutTemplate(getRandomFromArray(secondPTemplates), first, last, gender, office);
    var policyP = fillOutTemplate(getRandomFromArray(policyPTemplates), first, last, gender, office);
    var thirdP = fillOutTemplate(getRandomFromArray(thirdPTemplates), first, last, gender, office);
    return '<p>' + firstP + '</p><p>' + secondP + '</p><p>' + policyP + '</p><p>' + thirdP + '</p>';
  }

  var childNames = [
    'Taylee',
    'Mckarty',
    'Nayvie',
    'Maylee',
    'Lakynn',
    'Taysom',
    'Ollie',
    'Grayson',
    'Asher',
    'Tatum',

    'Hunter',
    'Scout',
    'Peyton'
  ];

  function fillOutTemplate(template, first, last, gender, office) {
    var places = [
      'Shelbyville, Kentucky',
      'Blair, Oklahoma',
      'Waterville, Ohio',
      'Johnson City, Texas',
      'Buffalo, Wyoming',
      'Yankton, South Dakota',
      'Buck Creek, Indiana',
      'North Liberty, Iowa'
    ];

    var colleges = [
      'Columbia University',
      'Princeton University',
      'Brown University',
      'Cornell University',
      'Dartmouth College',
      'Harvard University'
    ];

    var postGrads = [
      'Yale Law',
      'Yale School of Management',
      'Harvard Law',
      'Harvard Business School'
    ];

    var childOrPet = [
      'beautiful children',
      'adorable children',
      'perfect children',
      'lovely children',
      'purebred munchkin cats',
      'adorable and sickly pugs',
      'deaf German Shepherds',
      'Mastiffs with hip dysplasia'
    ];

    var shortIssues = [
      'gun violence',
      'falling wages',
      'political division',
      'climate catastrophe',
      'economic turmoil',
      'immigration crises',
      'overwhelming debt',
      'police brutality',
      'rising healthcare costs'
    ];

    var longIssues = [
      'never-ending war in the Middle East',
      'an unstoppable global war on terrorism',
      'the advent of a militarized police state',
      'the soul-crushing weight of burgeoning corporate dystopia',
      'the profound alienation of modern life'
    ];

    var issueNeeds = [
      'massive corporate deregulation',
      'exponential GDP growth at all costs',
      'massive and unimpeded corporate growth',
      'the unending spread of globalization',
      'the forceful spread and maintenance of global markets',
      'the relentless defense of international business interests'
    ];

    var genericCommunities = [
      'the voiceless',
      'the vulnerable',
      'the working class',
      'the middle class',
      'the children'
    ];

    var genericBadCommunities = [
      'the 1%',
      'the special interests',
      'the big shots on Capitol Hill',
      'the coastal elites'
    ];

    var previousJobTitles = [
      'Director of R&D for',
      'Vice President of',
      'CEO of',
      'CFO of',
      'Director of Weapons Development for'
    ];

    var goodQualities = [
      'trust',
      'compassion',
      'empathy',
      'dedication'
    ];

    var defensive = [
      'the claims of physical and emotional abuse leveled against %HIM were ultimately determined to be unfounded',
      'no evidence was found to support the accusations of coercion and physical intimidation made against %HIM',
      'all reports of inappropriate touching on %HIS part were found to have been made by disgruntled ex-employees who should be ignored',
      'the exposé on OSHA violations written about %HIM was proven to be nothing more than a mainstream media witch hunt',
      'the Fraternal Order of Police confirmed that every death attributed to %HIM was necessitated by %HIS own fear for %HIS safety',
      'an internal task force exonerated %HIM of all charges of sexual impropriety, rightfully observing that %HE was just kidding around',
      'the slanderous hit piece describing %FIRSTNAME\'s management style as "%BADQUALITY1 and %BADQUALITY2" was widely interpreted to be biased and misinformed',
      'the oft-quoted %MAGAZINE interview %HE gave about %INTERVIEWTOPIC was proven to have been selectively edited to portray %FIRSTNAME in a negative light',
      'a thorough internal investigation found that no sexual misconduct had occurred under %HIS watch',
      'the portrayal of %HIM in the %YEAR biopic titled <i>%BIOPIC</i> was proven to be heavily fictionalized',
      'the leaked copy of %HIS unpublished essay titled <i>%ESSAYTITLE</i> was shown to have been taken wildly out of context by muck-raking critics',
      'the unearthed copy of %HIS essay titled <i>%ESSAYTITLE</i> was proven to have been widely misrepresented by detractors',
      'a lengthy criminal trial found %HIM to be not guilty on all counts of manslaughter, both negligent and aggravated'
    ];


    var biopics = [
      'The Butcher of Burundi',
      'Ghosts of Sarajevo',
      'Memories of Rhodesia',
      'Freedom\'s Last Gasp',
      '%FIRSTNAME\'s America: Empire of Blood'
    ];

    var essayTitles = [
      'The Central Failure of the Female Brain',
      'How Israel Can Cleanse the Arab World',
      'Affirmative Action: Signs of the End Times',
      'Is Desegregation Really the Answer?',
      'How the #MeToo Movement Wronged Bill Cosby',
      'Je Suis Charlie Kirk'
    ];

    var interviewTopics = [
      'race and IQ',
      'the merits of eugenics',
      'Roman Polanski'
    ];

    var communities = [
      'the LGBTQ+ community',
      'the African-American people',
      'the veteran community',
      'the disabled community',
      'the mothers and fathers of America'
    ];

    var unseriousCommunities = [
      'Facebook groups about how nice pitbulls are',
      'listservs dedicated to father\'s rights issues',
      'online forums dedicated to men going their own way',
      'anti-circumcision activism',
      'anti-vaccination activism',
      'holistic alternatives to AIDs treatment'
    ]

    var magazine = [
      'Vanity Fair',
      'New York Times',
      'Time Magazine'
    ];

    var badQualities = [
      'draconian',
      'violent',
      'brutal',
      'maniacal',
      'vicious',
      'inhuman',
      'remorseless',
      'borderline criminal',
      'racially insensitive'
    ];

    var genericPolicies = [
      'Getting things done',
      'Working hard',
      'Reaching across the aisle',
      'Coming up with common-sense policies',
      'Being pragmatic',
      'Making a difference',
      'Finding bipartisan solutions'
    ];

    var horrorPolicies = [
      'Maintaining the profitability of the private prison industry at all costs',
      'Pushing for war in hopes that defense contracts might be sold to %HIS friends',
      'Leading the search for Antifa\'s founder, notorious terrorist William H. Antifa',
      'Preserving free speech through a series of draconian anti-BDS laws',
      'Protecting free speech by punishing flag burning with the death penalty',
      'Ensuring that all abortions are preceded by 10-month waiting periods',
      'Solving mass shootings by replacing all teachers with retired Navy SEALs',
      'Pushing back against crime by becoming the world leader in executions',
      'Repealing Obamacare and replacing it with BOGO fentanyl patches',
      'Deploying targeted MOABs to strike a decisive blow in the War on Christmas',
      'Protecting campus free speech by legally mandating that all spaces be unsafe'
    ];

    var shortIssue1 = getRandomFromArray(shortIssues);
    var genericCommunity1 = getRandomFromArray(genericCommunities);
    var goodQuality1 = getRandomFromArray(goodQualities);
    var community1 = getRandomFromArray(communities);
    var defensive1 = getRandomFromArray(defensive);
    var badQuality1 = getRandomFromArray(badQualities);
    var genericPolicy1 = getRandomFromArray(genericPolicies);
    var quantity = getRandomInt(3, 5);
    var kid1 = getRandomFromArray(childNames);

    return template.replace('%SHORTISSUE1', shortIssue1)
    .replace('%SHORTISSUE2', getRandomFromArrayExcept(shortIssues, [shortIssue1]))
    .replace('%LONGISSUE', getRandomFromArray(longIssues))
    .replace('%ISSUENEED', getRandomFromArray(issueNeeds))
    .replace('%GENERICCOMMUNITY1', genericCommunity1)
    .replace('%GENERICCOMMUNITY2', getRandomFromArrayExcept(genericCommunities, [genericCommunity1]))
    .replace('%GENERICBADCOMMUNITY', getRandomFromArray(genericBadCommunities))
    .replace('%PREVIOUSJOB', getRandomFromArray(previousJobTitles) + ' ' + getCompanyName())
    .replace('%GOODQUALITY1', goodQuality1)
    .replace('%GOODQUALITY2', getRandomFromArrayExcept(goodQualities, [goodQuality1]))
    .replace('%COMMUNITY1', community1)
    .replace('%COMMUNITY2', getRandomFromArray(unseriousCommunities))
    .replace('%DEFENSIVE1', defensive1)
    .replace('%DEFENSIVE2', getRandomFromArrayExcept(defensive, [defensive1]))
    .replace('%COLLEGE', getRandomFromArray(colleges))
    .replace('%POSTGRAD', getRandomFromArray(postGrads))
    .replace('%OTHERNAME', getPoliticianFirstName(gender === 'm' ? 'f' : 'm') + ' ' + last)
    .replace('%GENDERSPOUSE', gender === 'm' ? 'wife' : 'husband')
    .replace('%GENDERPARENT', gender === 'm' ? 'father' : 'mother')
    .replace('%QUANTITY', quantity)
    .replace('%CHILDORPET', getRandomFromArray(childOrPet))
    .replace('%NAMES', getChildNames(quantity))
    .replace('%KIDNAME1', kid1)
    .replace('%KIDNAME2', getRandomFromArrayExcept(childNames, [kid1]))
    .replace('%PLACE', getRandomFromArray(places))
    .replace('%FULLNAME', first + ' ' + last)
    .replace('%YEAR', getRandomInt(2002, 2017))
    .replace('%BIOPIC', getRandomFromArray(biopics))
    .replace('%ESSAYTITLE', getRandomFromArray(essayTitles))
    .replace('%ADULTAGE', getRandomInt(35, 49))
    .replace('%MAGAZINE', getRandomFromArray(magazine))
    .replace('%INTERVIEWTOPIC', getRandomFromArray(interviewTopics))
    .replace('%BADQUALITY1', badQuality1)
    .replace('%BADQUALITY2', getRandomFromArrayExcept(badQualities, [badQuality1]))
    .replace('%GENERICPOLICY1', genericPolicy1)
    .replace('%GENERICPOLICY2', getRandomFromArrayExcept(genericPolicies, [genericPolicy1]))
    .replace('%HORRORPOLICY', getRandomFromArray(horrorPolicies))
    .replace('%OFFICE', offices[office])
    .replace(/%FIRSTNAME/g, first)
    .replace(/%HIM/g, gender === 'm' ? 'him' : 'her')
    .replace(/%HIS/g, gender === 'm' ? 'his' : 'her')
    .replace(/%HE/g, gender === 'm' ? 'he' : 'she')
    .replace(/%CAPHE/g, gender === 'm' ? 'He' : 'She')
    .replace(/%CAPHIS/g, gender === 'm' ? 'His' : 'Her')

  }

  function getChildNames(quantity) {
    var names = [];
    names.push(getRandomFromArray(childNames));

    while (names.length < quantity) {
      names.push(getRandomFromArrayExcept(childNames, names));
    }

    var text = '';
    for (var i = 0; i < names.length; i++) {
      var isFirst = i === 0;
      var isLast = i === names.length - 1;

      if (isFirst) {
        text += names[i];
      } else if (isLast) {
        text += ', and ' + names[i];
      } else {
        text += ', ' + names[i];
      }
    }

    return text + '.';
  }

  var election = ko.observable(new Election());
  
  /*************************************************************
                      WINDFALL
  *************************************************************/

  function chargeWindfall(time) {
    windfallCharge.add(Math.round(time * 5));

    if (windfallCharge.val() >= 100) {
      windfallCharge.val(100);
    }
  }

  var clicksSinceWindfall = 0;
  function checkForWindfall() {
    var windfallAllowed = totalDPS.val() > 100 && locked().windfallGuarantee;
    if (windfallAllowed && (((Math.random() * 500) < windfallChance.val()) || clicksSinceWindfall > 1000)) {
      startWindfall();
      clicksSinceWindfall = 0
    } else {
      clicksSinceWindfall++;
    }
  }
  
  function startWindfall() {
    isWindfall(true);
    windfallCount.add(1);
    windfallCountAllTime.add(1);
    
    setTimeout(function() {
      isWindfall(false);
    }, windfallDuration.val() * 1000);
  }

  function triggerManualWindfall() {
    if (windfallProgress.val() >= 100) {
      windfallProgress.val(0);
      startWindfall();
    } else {
      addManualClicks();
    }
  }

	/*************************************************************
						GETTERS AND SETTERS
	*************************************************************/
	
	function getUnit(id) {
	  id = id.toString();
	  for (var i = 0; i < units().length; i++) {
	    if (units()[i].id === id) {
	      return units()[i]; 
	    }
	  }
	  
	  return null;
	}
	
	function getUpgrade(id) {
	  for (var i = 0; i < upgrades().length; i++) {
	    if (upgrades()[i].id === id) {
	      return upgrades()[i]; 
	    }
	  }
	}
	
	function getAchievement(name) {
	  for (var i = 0; i < achievements().length; i++) {
	    if (achievements()[i].name === name) {
	      return achievements()[i];
	    }
	  }
	}
	
	function getAchievementById(id) {
	  for (var i = 0; i < achievements().length; i++) {
	    if (achievements()[i].id === id) {
	      return achievements()[i];
	    }
	  }

    return getSecretAchievementById(id);
	}
	
	function earnAchievement(id) {
	  getAchievementById(id).earn();
	}

  function getSecretAchievementById(id) {
    for (var i = 0; i < secretAchievements().length; i++) {
      if (secretAchievements()[i].id === id) {
        return secretAchievements()[i];
      }
    }
  }

  function earnSecretAchievement(id) {
    getSecretAchievementById(id).earn();
  }

	var addManualClicks = function() {
    var now = Date.now();
    if (now - lastClick.val() > 100) { // Prevent overkill by holding down enter
      manualClicks.add(1);
      manualClicksAllTime.add(1);
      lastClick.val(now);
  	  var toAdd = earnedPerClick.val();

      if (isWindfall()) {
        earnedFromWindfalls.add(toAdd);
      }

      checkForWindfall();
  		earnedFromManualClicks.add(toAdd);
  		return addClicks(toAdd);
    }
	};

	var addClicks = function(val, mainLoop) {
    if (currentCash.val() <= 0 && accessibleDPS.val() < 0) {
      currentCash.val(0);
      return 0;
    }

	  totalCash.add(val);
	  totalCashAllTime.add(val);
	  currentCash.add(val);
	  
	  if (mainLoop && idleLevel() > 0) {
	      var idleAdded = val - (val / idleBonus.val());
	      earnedWhileIdle.add(idleAdded);
	  }

	    return currentCash.val();
	};
	
	function subtractClicks(val) {
		currentCash.sub(val);
	}
	
	var setBuyRate = function(val) {
	  buyRate(val);
	};
	
	/***********************************************
	                 SAVE/LOAD GAME
	***********************************************/
	
	var saveGame = function(isRestarting) {
    if (!currentlyRestarting || isRestarting) {
  	  var gameData = {
  	    stats: {},
  	    units: {},
  	    achievements: {},
        secretAchievements: {},
  	    upgrades: {},
  	    activeInvestments: {},
  	    emails: {},
        bankruptcies: {},
        time: new Date().toISOString(),
        name: 'Unnamed Business',
        mailStress: 0,
  	    settings: {
  	      bankruptcyModalViewed: bankruptcyModalViewed(),
          enableCharts: enableCharts(),
          enableHover: enableHover(),
          enableNotifications: enableNotifications(),
          enableEmptyUpgradesAndAchievements: enableEmptyUpgradesAndAchievements(),
          enableDarkMode: enableDarkMode(),
          enableFixedNavTabs: enableFixedNavTabs(),
          enableWindfallGuarantee: enableWindfallGuarantee(),
          maxType: maxType(),
          maxIncrement: maxIncrement(),
          targetIncrement: targetIncrement(),
          twoColumnEmployees: twoColumnEmployees()
  	    }
  	  };

      if (isRestarting) {
        gameData.restartBonus = nextBankruptcyBonus.val();
        gameData.restartSeminarBonus = nextBankruptcySeminars.val();
      }

      gameData.bankruptcies = pastBusinesses().map(function(b) {
        return {
          d: b.date,
          l: b.length,
          n: b.name,
          e: b.earned
        }
      });
  	  
  	  gameData.achievements = achievements().filter(function(a) {
  	    return a.awarded();  
  	  }).map(function(a) {
        return {
      		id: a.id,
          u: isRestarting ? false : a.upgradesUnlocked(),
      		d: a.date(),
      		r: a.read()
        }; 
      });

      gameData.secretAchievements = secretAchievements().filter(function(a) {
        return a.awarded();  
      }).map(function(a) {
        return {
          id: a.id,
          u: isRestarting ? false : a.upgradesUnlocked(),
          d: a.date(),
          r: a.read()
        }; 
      });

      gameData.career = careerUpgrades().map(function(u) {
        return { 
          id: u.id,
          l: u.level()
        }
      });
      
      if (isRestarting) {
        gameData.stats = handleRestartStats();
      } else {
        gameData.name = businessName().name()
        gameData.mailStress = composedMail().stressLevel.val()
        gameData.upgrades = upgrades().filter(function(u) {
          return u.available() || u.bought();
        }).map(function(u) {
          return {
            id: u.id,
            a: u.available(),
            b: u.bought(),
            r: u.read()
          };
        });
        
        gameData.stats = stats.filter(function(s) {
          return !ko.isComputed(s.val);
        }).map(function(s) {
          return {
            name: s.name,
            v: s.val()
          };
        });
        
        gameData.units = units().map(function(u) {
          return {
            id: u.id,
            a: u.available(),
            n: u.num.val(),
            m: u.mod.val(),
            l: u.numMod.val(),
            tb: u.trainingBonus.val(),
            itb: u.inProgressTrainingBonus.val(),
            tr: u.timeRemaining(),
            tt: u.targetTime,
            tf: u.trainingFinished()
          };
        });
        
        gameData.activeInvestments = activeInvestments().map(function(i) {
          return {
            name: i.name,
            base: i.baseInvestment.val(),
            loadedTargetTime: i.targetTime,
            loadedProgress: i.timeRemaining(),
          };
        });

        gameData.activeAcquisitions = activeAcquisitions().map(function(a) {
          return {
            active: a.active(),
            price: a.initialPrice.val(),
            iEmp: a.initialEmployees,
            cEmp: a.currentEmployees.val(),
            spent: a.cashSpent.val(),
            clicks: a.clicks.val(),
            sizeD: a.sizeDivider,
            name: a.name,
            desc: a.description,
            emp0: a.workers()[0].num(),
            emp1: a.workers()[1].num(),
            emp2: a.workers()[2].num(),
            emp3: a.workers()[3].num(),
            mail: a.mail().length,
            chats: a.chats().length
          };
        });
        
        gameData.emails = {
          n: mail().filter(function(m) {
            return !m.isSpecial() && !m.isCryptic();
          }).length,
          s: mail().filter(function(m) {
            return m.isSpecial();
          }).length,
          c: mail().filter(function(m) {
            return m.isCryptic();
          }).length
        };

        gameData.research = {
          i: research().intern() ? research().intern() : 0,
          w: research().wage() ? research().wage() : 0,
          s: research().sales() ? research().sales() : 0,
          m: research().manager() ? research().manager() : 0,
          patents: research().patents(),
          active: research().active(),
          timeRemaining: research().timeRemaining(),
          product: research().product()
        }

        gameData.elections = {
          of: election().selectedOffice() ? election().selectedOffice() : 0,
          bg: election().selectedBackground() ? election().selectedBackground() : 0,
          pe: election().selectedPersonality() ? election().selectedPersonality() : 0,
          bu: election().selectedBackup() ? election().selectedBackup() : 0,
          td: election().totalDonations.val(),
          tr: election().timeRemaining(),
          tt: election().targetTime,
          active: election().active(),
          poll: election().pollNumber()
        }
      }
      
      gameData = LZString.compressToBase64(JSON.stringify(gameData));
      localStorage.setItem(SAVE_FILE, gameData);
      setSaveFileSize();
      
      console.log('saved...');
    }
	};
	
	var loadGame = function(importData) {
	  console.log('checking load status...');
	  var data;
	  if (importData) {
        console.log('importing...');
        
        resetEverything(true);
        data = JSON.parse(LZString.decompressFromBase64(importData));
        loadGameHelper(data);
	  } else if (!localStorage || !localStorage.getItem(SAVE_FILE)) { // IE & Edge won't save locally
        return;
	  } else {
	    console.log('loading...');
	    
	    data = JSON.parse(LZString.decompressFromBase64(localStorage.getItem(SAVE_FILE)));
	    loadGameHelper(data);
	  }
	};

	function loadGameHelper(data) {
	  loadSegment(data.achievements, achievements(), 'id', 'id', function(loadData, newData) {
      newData.awarded(true);
      newData.upgradesUnlocked(loadData.u);
      newData.date(loadData.d);
      newData.read(loadData.r);

      if (loadData.u) {
        newData.earned = null;
      }
	  });

    if (data.secretAchievements) {
      loadSegment(data.secretAchievements, secretAchievements(), 'id', 'id', function(loadData, newData) {
        newData.awarded(true);
        newData.upgradesUnlocked(loadData.u);
        newData.date(loadData.d);
        newData.read(loadData.r);

        if (loadData.u) {
          newData.earned = null;
        }
      });
    }

    console.log('achievements loaded...')
	  
	  loadSegment(data.upgrades, upgrades(), 'id', 'id', function(loadData, newData) {
      newData.available(loadData.a);
      newData.bought(loadData.b);
      newData.read(loadData.r);

      if (loadData.b) {
        newData.cantAfford = ko.observable(false);
      }
	  });

    console.log('upgrades loaded...')
	  
	  loadSegment(data.stats, stats, 'name', 'name', function(loadData, newData) {
      newData.val(loadData.v);
	  });

    console.log('stats loaded...')

    if (data.bankruptcies) {
      for (var s = 0; s < data.bankruptcies.length; s++) {
        pastBusinesses.push({
          date: data.bankruptcies[s].d,
          length: data.bankruptcies[s].l,
          name: data.bankruptcies[s].n,
          earned: data.bankruptcies[s].e
        });
      }
    }

    console.log('bankruptcy history loaded...')
    
    activeInvestments.removeAll();
    for (var o = 0; o < data.activeInvestments.length; o++) {
      var inv = data.activeInvestments[o];
      activeInvestments.push(new Investment(inv.base, null, inv.loadedTargetTime, inv.loadedProgress, inv.name));
    }

    console.log('investments loaded...')

    activeAcquisitions.removeAll();
    if (data.activeAcquisitions) {
      for (var p = 0; p < data.activeAcquisitions.length; p++) {
        var loadData = data.activeAcquisitions[p];
        var acquisition = new Acquisition('medium', null, null, null, null, loadData);

        for (var q = 0; q < loadData.mail; q++) {
          acquisition.addMail();
        }

        for (var r = 0; r < loadData.chats; r++) {
          acquisition.addChat();
        }

        activeAcquisitions.push(acquisition);
      }
    }

    console.log('acquisitions loaded...')

    if (data.research) {
      research().intern(data.research.i);
      research().wage(data.research.w);
      research().sales(data.research.s);
      research().manager(data.research.m);
      research().active(data.research.active);
      research().timeRemaining(data.research.timeRemaining);
      research().product(data.research.product);

      if (research().active()) {
        research().startTimer();
      }

      for (var i = 0; i < data.research.patents.length; i++) {
        research().patents.push(data.research.patents[i]);
      }
    }

    console.log('research loaded...')

    if (data.elections && data.elections.of) {
      election().active(data.elections.active);
      if (election().active()) {
        election().start();
      }

      election().selectedOffice(data.elections.of);
      election().selectedBackground(data.elections.bg);
      election().selectedPersonality(data.elections.pe);
      election().selectedBackup(data.elections.bu);
      election().totalDonations.val(data.elections.td);
      election().timeRemaining(data.elections.tr);
      election().targetTime = data.elections.tt ? data.elections.tt : 30000;
      election().pollNumber(data.elections.poll);
    }

    console.log('elections loaded...');
	  
	  loadSegment(data.units, units(), 'id', 'id', function(loadData, newData) {
      newData.available(loadData.a);
      newData.num.val(loadData.n);
      newData.mod.val(loadData.m);
      newData.numMod.val(loadData.l ? loadData.l : 0);
      newData.trainingBonus.val(loadData.tb ? loadData.tb : 0);
      newData.inProgressTrainingBonus.val(loadData.itb ? loadData.itb : 0);

      if (loadData.tt) {
        newData.startTimer(loadData.tr, loadData.tt)

        if (loadData.tf) { 
          newData.trainingFinished(true);
        } 
      }

	  });

    console.log('employees loaded...')

    if (data.career) {
      loadSegment(data.career, careerUpgrades(), 'id', 'id', function(loadData, newData) {
        newData.level(loadData.l);
      });
    }

    mail.removeAll();
    for (var n = 0; n < parseInt(data.emails.n); n++) {
      mail.push(new Email(false, true));
    }

    for (var s = 0; s < parseInt(data.emails.s); s++) {
      mail.push(new SpecialEmail(true));
    }

    if (data.emails.c) {
      for (var a = 0; a < parseInt(data.emails.c); a++) {
        mail.push(new CrypticEmail(false))
      }
    }

    console.log('mail loaded...')
    
    if (data.mailStress) {
      composedMail().stressLevel.val(data.mailStress);
    }

    if (data.name) {
      businessName().name(data.name);
    }

    bankruptcyModalViewed(data.settings.bankruptcyModalViewed);
    enableHover(data.settings.enableHover != undefined ? data.settings.enableHover : true);
    enableCharts(data.settings.enableCharts != undefined ? data.settings.enableCharts : true);
    enableNotifications(data.settings.enableNotifications != undefined ? data.settings.enableNotifications : true);
    enableEmptyUpgradesAndAchievements(data.settings.enableEmptyUpgradesAndAchievements != undefined ? data.settings.enableEmptyUpgradesAndAchievements : true);
    enableDarkMode(data.settings.enableDarkMode != undefined ? data.settings.enableDarkMode : false);
    enableFixedNavTabs(data.settings.enableFixedNavTabs != undefined ? data.settings.enableFixedNavTabs : false);
    enableWindfallGuarantee(data.settings.enableWindfallGuarantee != undefined ? data.settings.enableWindfallGuarantee : true);
    maxType(data.settings.maxType != undefined ? data.settings.maxType : 'default');
    maxIncrement(data.settings.maxIncrement != undefined ? data.settings.maxIncrement : 1);
    targetIncrement(data.settings.targetIncrement != undefined ? data.settings.targetIncrement : 1);
    twoColumnEmployees(data.settings.twoColumnEmployees != undefined ? data.settings.twoColumnEmployees : false);

    console.log('settings loaded...')

    handleAwayEarnings(data.time);
    handlePatches(data);
	  
	  console.log('everything loaded!');

    if (data.restartBonus) {
      bankruptcyBonus.add(data.restartBonus);
      bankruptcies.add(1);

      if (data.restartSeminarBonus !== undefined) {
        trainingSeminars.add(data.restartSeminarBonus);
      }

      currentlyRestarting = false;
    }
	}

  var awayEarnings = ko.observable(new AwayEarnings());

  function AwayEarnings() {
    this.time = ko.observable(0),
    this.cashProgress = ko.observable(0),
    this.investmentProgress = ko.observable(0),
    this.acquisitionProgress = ko.observable(0),
    this.patentsStored = ko.observable(0),
    this.patentsSold = ko.observable(0),
    this.patentsSoldValue = ko.observable(0),
    this.employeesGone = ko.observable(0);
    this.electionEarnings = ko.observable(0);
    this.electionsWon = ko.observable(0);
    this.electionsLost = ko.observable(0);
    this.gaffesExperienced = ko.observable(0);
  }

  function handleAwayEarnings(timeStamp, elapsedTime) {
    awayEarnings(new AwayEarnings());
    var timeInMs = elapsedTime ? elapsedTime : (new Date() - new Date(timeStamp));
    var elapsedTimeInSeconds = timeInMs / 1000;

    awayEarnings().time(getFormattedTime(timeInMs));

    if (elapsedTimeInSeconds >= 2630000) {
      earnSecretAchievement('brk');
    }

    if (elapsedTimeInSeconds >= 31536000) {
      earnSecretAchievement('brk1')
    }

    // Cut off at 5 days
    var fiveDays = (60 * 60 * 24 * 5)
    //elapsedTimeInSeconds = 60 * 5; // TODO restore the line below
    elapsedTimeInSeconds = elapsedTimeInSeconds < fiveDays ? elapsedTimeInSeconds : fiveDays

    var awayRate = awayEarningRate.val() / 100;
    var amountToAdd = elapsedTimeInSeconds * (totalDPS.val() * awayRate);
    if (elapsedTimeInSeconds > 60 && amountToAdd > 0) {
      earnedWhileAway.add(amountToAdd);
      addClicks(amountToAdd);
      awayEarnings().cashProgress('$' + format(amountToAdd));

      if (activeInvestments().length > 0) {
        var investmentProgress = elapsedTimeInSeconds * 1000
        addAwayProgressToInvestments(investmentProgress);
        awayEarnings().investmentProgress(getFormattedTime(investmentProgress));
        console.log('Away Progress (Investments) Handled...')
      }

      if (activeAcquisitions().length > 0) {
        var acquisitionProgress = elapsedTimeInSeconds
        addAwayProgressToAcquisitions(acquisitionProgress);
        console.log('Away Progress (Acquisitions) Handled...')
        awayEarnings().acquisitionProgress(getFormattedTime(acquisitionProgress * 1000));
      }

      if (research().active()) {
        var researchProgress = (elapsedTimeInSeconds) * 1000;
        researchProgress += researchProgress * (research().speed.val() / 100);
        handleExtraResearchTime(researchProgress, true);
        console.log('Away Progress (Research) Handled...')
      }

      if (!locked().windfallGuarantee) {
        var numberOfTicks = elapsedTimeInSeconds / 2.5;
        incrementWindfallGuarantee(numberOfTicks);
      }

      if (!locked().composedMail) {
        var time = elapsedTimeInSeconds / 2.5;
        composedMail().lowerStress(time);
      }

      if (!locked().careerDev) {
        var trainingProgress = (elapsedTimeInSeconds) * 1000;
        addAwayProgressToTraining(trainingProgress);
      }

      setTimeout(function() {
        $('#awayEarningsModal').modal('show');
      }, 150)
    }
  }

  function handleExtraResearchTime(researchProgress, fromAway) {
    var count = 0;
    if (research().timeRemaining() > researchProgress) {
      research().timeRemaining(research().timeRemaining() - researchProgress);
    } else {
      // Handle the in-progress time
      count++;
      researchProgress -= research().timeRemaining();

      // Handle additional full rotations
      count += Math.floor(researchProgress / research().targetTime);

      // Handle the remainder
      research().timeRemaining(researchProgress % research().targetTime);

      // Handle the risk
      var killed = 0;
      for (var k = 0; k < count; k++) {
        if (Math.random() * 100 <= research().risk.val()) {
          killed++;
          research().killRandomEmployee();
        }
      }

      if (fromAway) {
        awayEarnings().employeesGone(format(killed));
      }

      employeesKilled.add(killed);

      // For the remaining count, see if you can auto-sell
      var soldCount = 0;
      var soldValue = 0;

      // If it's just a few, check each one. If it's a lot, just average it out
      if (count <= 10) {
        for (var j = 0; j < count; j++) {
          console.log('checking if sold...')
          if (Math.random() * 100 <= research().autoSell.val()) {
            soldCount++;
            soldValue += research().baseValue.val();
            research().handleSales(research().baseValue.val(), 1);
          }
        }
      } else {
          var total = count * (research().autoSell.val() / 100);
          total = total >= 1 ? total : 0;
          soldCount = Math.round(total);
          soldValue = total * research().baseValue.val();
          research().handleSales(soldValue, soldCount);
      }

      count -= soldCount;

      // If anything is left unsold, store as much as possible
      var storageRemaining = research().storage.val() - research().patents().length;
      var stored = 0;
      while (research().patents().length < research().storage.val() && count > 0) {
        count--;
        stored++;
        research().patents.push(research().baseValue.val());
      }

      if (fromAway) {
        awayEarnings().patentsStored(format(stored));
      }

      if (fromAway) {
        awayEarnings().patentsSold(format(soldCount));
        awayEarnings().patentsSoldValue(format(soldValue));
      }
      
      patentsSold.add(soldCount);
      //earnedFromResearch.add(soldValue);
      return soldCount;
    }
  }

  function addAwayProgressToTraining(reducedTimeInSeconds) {
    for (var i = 0; i < units().length; i++) {
      var reducedTime = units()[i].timeRemaining() - reducedTimeInSeconds;
      units()[i].timeRemaining(reducedTime > 0 ? reducedTime : 0);
    }
  }

  function addAwayProgressToInvestments(reducedTimeInSeconds) {
    for (var i = 0; i < activeInvestments().length; i++) {
      var reducedTime = activeInvestments()[i].timeRemaining() - reducedTimeInSeconds;
      activeInvestments()[i].timeRemaining(reducedTime > 0 ? reducedTime : 0);
    }
  }

  function addAwayProgressToAcquisitions(progress) {
    for (var i = 0; i < activeAcquisitions().length; i++) {
      var fired = activeAcquisitions()[i].autoMod.val() * progress;
      activeAcquisitions()[i].currentEmployees.val(activeAcquisitions()[i].currentEmployees.val() - fired);
    }
  }

  function handlePatches(data) {
    switch (timeToAnswerMail.val()) {
      case 30:
        timeToAnswerMail.val(60);
        break;
      case 35:
        timeToAnswerMail.val(90);
        break;
      case 40:
        timeToAnswerMail.val(120);
        break;
      case 50:
        timeToAnswerMail.val(150);
        break;
      case 60:
        if (getUpgrade('ef4').bought()) {
          timeToAnswerMail.val(180);
        }
        break;
    }

    // Temporary fix for increased away earnings
    if (awayEarningRate.val() < 10) {
      var remaining = awayEarningRate.val() - 3; // remove 3, the old default, to get the number of upgrades bought at 1% each
      awayEarningRate.val(15 + (remaining * 5)); // Add the new default to the number of upgrades bought
    }

    var upgradeCatchUp = [
      { 'eEm12': 'em6' },
      { 'rese2': 'rd1' },
      { 'rese4': 'rd2' },
      { 'rese6': 'rd3' },
      { 'rese8': 'rd4' },
      { 'rese10': 'rd5' },
      { 'rese12': 'rd6' },
      { 'rese14': 'rd7' },
      { 'ec14': 'gwf'}
    ];

    for (var i = 0; i < upgradeCatchUp.length; i++) {
      var item = upgradeCatchUp[i];
      var key = Object.keys(item)[0];
      if (getAchievementById(key).upgradesUnlocked() && !getUpgrade(item[key]).bought()) {
        getUpgrade(item[key]).available(true);
      }
    }

    // Temporary fix for adjusted investment time bonus rates
    timeBonusRate.val(15);
    if (getUpgrade('tb1').bought()) timeBonusRate.add(15);
    if (getUpgrade('tb2').bought()) timeBonusRate.add(15);
    if (getUpgrade('tb3').bought()) timeBonusRate.add(15);

    /**  Handle changes to symb upgrade values **/

    // Old values
    var symbChanges = {
      'symb1': [{'3': 6}, {'4': 5}],
      'symb2': [{'3': 6}, {'4': 5}],
      'symb3': [{'5': 5}, {'6': 5}, {'7': 4}],
      'symb4': [{'5': 5}, {'6': 5}, {'7': 4}],
      'symb5': [{'8': 3}, {'9': 2}],
      'symb6': [{'8': 3}, {'9': 2}],
      'symb7': [{'10': 2}, {'11': 1.5}],
      'symb8': [{'10': 2}, {'11': 1.5}],
      'symb9': [{'2': 18}, {'3': 6}],
      'symb10': [{'4': 5}, {'5': 4}],
      'symb11': [{'6': 4}, {'7': 3}],
      'symb12': [{'8': 3}, {'9': 2}],
      'symb13': [{'10': 2}, {'11': 1}],
    };

    for (var i = 0; i < data.upgrades.length; i++) {
      var d = data.upgrades[i]
      if (/^symb/.test(d.id)) {
        var oldValues = symbChanges[d.id];

        if (oldValues) {
          for (var j = 0; j < oldValues.length; j++) {
            var vals = oldValues[j];
            var key = Object.keys(vals)[0];
            getUnit(key).mod.sub(vals[key]);
          }
        }

        var newUpgrade = getUpgrade('n' + d.id);
        if (newUpgrade) {
          newUpgrade.available(d.a)
          newUpgrade.bought(d.b);
          newUpgrade.read(d.r);
          
          if (newUpgrade.bought()) {
            newUpgrade.handlePurchase();
          }
        }
      }
    }
  }
	
	function loadSegment(loadData, newData, loadDataId, newDataId, callback) {
	  for (var i = 0; i < loadData.length; i++) {
	    for (var j = 0; j < newData.length; j++) {
	      if (loadData[i][loadDataId] === newData[j][newDataId]) {
          callback(loadData[i], newData[j]); 
	      }
	    }
	  }
	}

  function setSaveFileSize() {
    var size = localStorage.getItem(SAVE_FILE).length + SAVE_FILE.length;
    saveFileSize.val((size / 1024));
  }

  var exportedSaveData = ko.observable(null);
	
	var exportGameData = function() {
    	earnAchievement('export');
    	saveGame();
      exportedSaveData(null);
    	exportedSaveData(localStorage.getItem(SAVE_FILE));
	};
	
	var importGameData = function(inputData) {
	    // TODO process the input a bit
	    // TODO check if it's a valid save file
	    loadGame(inputData);
	    earnAchievement('import');
	};
	
  /***********************************************
	                BANKRUPTCY
	***********************************************/
	
	function handleRestartStats() {
	  var statsToKeep = ['Manual Clicks (All Time)', 'Cash Earned in Total (All Time)', 
	    'Start Time (All Businesses)', 'Bankruptcies Declared', 'Bankruptcy Multiplier', 'Acquisitions Sold (All Businesses)', 'Outgoing Emails Sent (All Businesses)',
      'Policies Accepted (All Businesses)', 'Chats Completed (All Businesses)', 'Massive Layoffs Conducted (All Businesses)', 'Number Fudgings Occurred (All Businesses)',
      'Total Windfalls (All Businesses)', 'Emails Answered (All Businesses)', 'Time Spent Idle (All Businesses)', 'Patents Sold (All Businesses)',
      'Time Dedicated to Investments (All Businesses)', 'Urgent Emails Answered (All Businesses)', 'Earned While Away (All Businesses)', 'Overall Time Boosted (All Businesses)',
      'Time Spent Training (All Businesses)', 'Training Seminars Attended (All Businesses)', 'Cryptic Emails Received (All Businesses)', 'Training Seminars',
      'Elections Won (All Businesses)', 'Elections Lost (All Businesses)', 'Gaffes Experienced (All Businesses)', 'Smart Words Replied (All Businesses)'];
	  
	  var restartStats = stats.filter(function(s) {
      return !ko.isComputed(s.val);
    }).map(function(s) {
      if (statsToKeep.indexOf(s.name) === -1) {
        return {
          name: s.name,
          v: s.type && s.type === 'date' ? Date.now() : s.baseVal
        };
      } else {
        return {
          name: s.name,
          v: s.val()
        };
      }
    });
    
    return restartStats;
	}

  var currentlyRestarting = false;
  var recentlyRestarted = false;
	
	var restartGame = function() {
    if (!currentlyRestarting && !recentlyRestarted) {
      currentlyRestarting = true;
      addBankruptcyToRecord();

	    saveGame(true);
	    resetEverything(false);

	    loadGame(null);
      checkSpeedAwards();
      $('#storetab').click();

      recentlyRestarted = true;
      setTimeout(function() {
        recentlyRestarted = false;
      }, 10000);
    }
	};
	
	
	/***********************************************
	                 OTHER TOOLS
	***********************************************/

  var bankruptcyListToggled = ko.observable(window.screen.availWidth <= 400 ? true : false);
  var toggleBankruptcyList = function() {
    bankruptcyListToggled(!bankruptcyListToggled());
  };

  var lastVisibleUnit = ko.computed(function() {
    for (var i = units().length - 1; i > 0; i--) {
      if (units()[i].available()) {
        return units()[i].id;
      }
    }
  }, this);

  function resetEverything(wipeSave) {
    for (var i = 0; i < upgrades().length; i++) {
      upgrades()[i].available(false);
      upgrades()[i].bought(false);
      upgrades()[i].read(false);
      upgrades()[i].trackAffording();
    }

    for (var j = 0; j < units().length; j++) {
      if (units()[j].id !== '0') {
        units()[j].available(false);
      }

      units()[j].num.val(units()[j].num.baseVal);
      units()[j].mod.val(units()[j].mod.baseVal);
      units()[j].trainingBonus.val(0);
      units()[j].stopTraining();
      units()[j].trainingFinished(false);
    }

    for (var k = 0; k < stats.length; k++) {
      if (!ko.isComputed(stats[k].val)) {
        if (stats[k].type && stats[k].type === 'date') {
          stats[k].val(Date.now());
        } else {
          stats[k].val(stats[k].baseVal);
        }
      }
    }

    for (var l = 0; l < achievements().length; l++) {
      achievements()[l].awarded(false);
      achievements()[l].date(null);
      achievements()[l].read(false);

      if (achievements()[l].startTracking) {
        achievements()[l].startTracking();
      }
      
      if (wipeSave) {
        achievements()[l].upgradesUnlocked(false);
      }
    }

    for (var l = 0; l < secretAchievements().length; l++) {
      secretAchievements()[l].awarded(false);
      secretAchievements()[l].date(null);
      secretAchievements()[l].read(false);
      
      if (wipeSave) {
        secretAchievements()[l].upgradesUnlocked(false);
      }
    }

    if (wipeSave) {
      for (var m = 0; m < careerUpgrades().length; m++) {
        careerUpgrades()[m].level(0);
      } 
    }

    // If any achievements have been triggered in the process, kill their alerts
    $('.alert').remove();

    activeInvestments([]);
    activeAcquisitions([]);
    mail([])
    pastBusinesses([]);
    businessName().name('Unnamed Business');
    research().reset();
    election().reset();
    awayMailInbox().active(false);
    awayChatInbox().active(false);
    awayPolicyInbox().active(false);
    composedMail().stressLevel.val(0);
    console.log('everything reset')
  }
	
	function incrementMediumIntervalCounter() {
	  mediumIntervalCounter(mediumIntervalCounter() + 1);
	}

  function incrementWindfallGuarantee(numberOfTicks) {
    if (!locked().windfallGuarantee) {
      if (windfallProgress.val() + windfallGuaranteeRate.val() >= 100) {
        windfallProgress.val(100);
      } else {
        windfallProgress.add(windfallGuaranteeRate.val() * numberOfTicks);
      }
    }
  }
	
	var checkTimePlayedAwards = function() {
	  var minutesPlayed = Math.floor((Date.now() - startTimeAllTime.val()) / 1000 / 60);
	  
    if (minutesPlayed > 525600) { earnSecretAchievement('timePlayed7'); } // 1 year
    if (minutesPlayed > 40320) { earnAchievement('timePlayed6'); } // 1 month 
    if (minutesPlayed > 30240) { earnAchievement('timePlayed5'); } // 3 weeks
    if (minutesPlayed > 20160) { earnAchievement('timePlayed4'); } // 2 weeks
    if (minutesPlayed > 10080) { earnAchievement('timePlayed3'); } // 1 week 
    if (minutesPlayed > 1440) { earnAchievement('timePlayed2'); } // 1 day 
    if (minutesPlayed > 60) { earnAchievement('timePlayed1'); } // 1 hour
	  
	  // For random awards - if they aren't earned randomly after a certain period 
	  // of time, we'll go ahead and award them to avoid arbitrary frustration
	  var daysPlayed = Math.floor(hoursPlayedAllTime() / 24);
	  if ((Math.random() * 50000 <= 1 + daysPlayed) || daysPlayed >= 7) {
	    earnAchievement('lck1');
	  }
	  
	  if ((Math.random() * 200000 <= 1 * daysPlayed) || daysPlayed >= 14) {
	    earnAchievement('lck2');
	  }

    if ((Math.random() * 500000 <= 1 * daysPlayed) || daysPlayed >= 30) {
      earnAchievement('lck3');
    }
	};

  var speedCheck;
  function checkSpeedAwards() {
    setTimeout(function() {
      speedCheck = setInterval(function() {
        var secondsPlayed = (Date.now() - startTime.val()) / 1000;
        if (secondsPlayed < 65) {
          if (totalCash.val() >= 1000000000000) { earnAchievement('fst1'); } // 1 trillion
          if (totalCash.val() >= 1000000000000000) { earnAchievement('fst2'); } // 1 quad
          if (totalCash.val() >= 1000000000000000000) { earnAchievement('fst3'); } // 1 quint
          if (totalCash.val() >= 1000000000000000000000) { earnAchievement('fst4'); } // 1 sext
          if (totalCash.val() >= 1000000000000000000000000) { earnAchievement('fst5'); } // 1 sept
          if (totalCash.val() >= 1000000000000000000000000000) { earnAchievement('fst6'); } // 1 oct
        } else {
          clearInterval(speedCheck);
        }
      }, 500);
    }, 30000);
  }

  // Default check upon loading the game
  checkSpeedAwards();

  var buyAllUpgrades = function() {
    for (var i = 0; i < upgrades().length; i++) {
      if (upgrades()[i].available() && upgrades()[i].price.val() <= currentCash.val()) {
        upgrades()[i].buy();
      }
    }
  };

  var incrementViewCount = function(type, e) {
    if (type === 'statsTab') {
      statsTabViews.add(1);
    } else if (type === 'achievementTab') {
      achievementTabViews.add(1);
    }
  };

  var toggleTrainingView = function() {
    isTrainingView(!isTrainingView());
  }
  
  function checkEmployeePositionAchievements() {
    if (units().every(function(unit) { return unit.num.val() >= 1 })) {
      earnAchievement('have1');
      
      if (units().every(function(unit) { return unit.num.val() >= 50 })) {
          earnAchievement('have50');
          
           if (units().every(function(unit) { return unit.num.val() >= 100 })) {
              earnAchievement('have100');
              
               if (units().every(function(unit) { return unit.num.val() >= 150 })) {
                  earnAchievement('have150');
                  
                   if (units().every(function(unit) { return unit.num.val() >= 200 })) {
                      earnAchievement('have200');

                      if (units().every(function(unit) { return unit.num.val() >= 250 })) {
                        earnAchievement('have250');

                        if (units().every(function(unit) { return unit.num.val() >= 300 })) {
                          earnAchievement('have300');

                          if (units().every(function(unit) { return unit.num.val() >= 350 })) {
                            earnAchievement('have350');

                            if (units().every(function(unit) { return unit.num.val() >= 400 })) {
                              earnAchievement('have400');
                            }
                          }
                        }
                      }
                  }
              }
          }
      }
    }
  }

  var clearAllAwards = function() {
    for (var i = 0; i < achievements().length; i++) {
      if (!achievements()[i].read() && achievements()[i].awarded()) {
        achievements()[i].read(true);
      }
    }
  }

  var clearAllSecretAwards = function() {
    for (var i = 0; i < secretAchievements().length; i++) {
      if (!secretAchievements()[i].read() && secretAchievements()[i].awarded()) {
        secretAchievements()[i].read(true);
      }
    }
  }

  function achievementTimeSinceStart(startTime) {
    if (/^\S*T\S*Z$/.test(startTime)) { // Check if it's an ISO string
      return timeSinceStart(startTime);
    } else {
      return timeSinceStartFromLocaleStrings(startTime); // Hang on to this for old saves with locale string dates
    }
  }

  function timeSinceStartFromLocaleStrings(startTime) {
     return getFormattedTime(new Date(new Date().toLocaleString()) - new Date(startTime)) + " ago";
  }
	
	function timeSinceStart(startTime) {
     return getFormattedTime(new Date() - new Date(startTime)) + " ago";
	}

  function getFormattedTime(time, skipHours, doNotRound) {
    var mins = time / 1000 / 60;

    if (mins > 1) {
      mins = formattedTimeHelper(mins, doNotRound);
    }
    
    if (mins >= 2880 && !skipHours) { // Two days
        return formattedTimeHelper(mins / 60 / 24, doNotRound) + " days";
    } else if (mins >= 120) {
        return formattedTimeHelper(mins / 60, doNotRound) + " hours"; 
    } else if (mins >= 60) {
        return formattedTimeHelper(mins / 60, doNotRound) + (mins > 60 ? " hours" : " hour");
    } else if (mins >= 1) {
        return mins + (mins == 1 ? " minute" : " minutes");
    } else {
        var sec = Math.round(mins * 60);
        return sec + (sec === 1 ? " second" : " seconds");
    }
  }

  function formattedTimeHelper(time, doNotRound) {
    if (doNotRound) {
      return time.toFixed(2).replace(/\.00$/, '');
    } else {
      return Math.floor(time);
    }
  }
	
	function formatTimeRemaining(timeInSeconds) {
	    var mins = Math.floor(timeInSeconds / 60);
	    
	    if (mins >= 1440) {
	        return formatSingleDigit(mins / 60 / 24) + " days";
	    } else if (mins >= 60) {
	        return formatSingleDigit(mins / 60) + " hours"; 
	    } else {
	      var secs = timeInSeconds >= 60 ? Math.floor(timeInSeconds % 60) : Math.floor(timeInSeconds);
	      secs = secs < 10 ? '0' + secs : secs;
	      return mins + ':' + secs;
	    }
	}

  function formatSingleDigit(num) {
    return num.toFixed(1).replace(/\.0$/, '');
  }
  
  function setBankruptcyModalSetting(value) {
    bankruptcyModalViewed(value);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function getRandomFromArray(array) {
    return array[getRandomInt(0, array.length - 1)];
  }

  function getRandomFromArrayExcept(array, exceptions) {
    var random = getRandomFromArray(array);
    while (exceptions.indexOf(random) > -1) {
      random = getRandomFromArray(array);
    }

    return random;
  }
	
	/**
	 * num - the number to be formatted
	 * longerFormat - for numbers where you need a third decimal point for changes to be visible
	 * longerSingleDigit - for smaller numbers (usually multipliers) that require a third decimal point for changes to be visible
	 */
	function format(num, longerFormat, longerSingleDigit) {
    var name;

    if (num < 0) {
      num = Math.abs(num);
    }

    if (num < 1000000) {
      num = num.toFixed(longerSingleDigit ? 3 : 2).replace(/\.00$/, '').replace(/\.000$/, '');
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    
    var abrev = window.screen.availWidth <= 400;
    if (num >= 1000000000000000000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000000000000000000;
        name = abrev ? 'Qad' : 'quattuordecillion';
    } else if (num >= 1000000000000000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000000000000000;
        name = abrev ? 'Td' : 'tredecillion';
    } else if (num >= 1000000000000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000000000000;
        name = abrev ? 'Dd' : 'duodecillion';
    } else if (num >= 1000000000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000000000;
        name = abrev ? 'Ud' : 'undecillion';
    } else if (num >= 1000000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000000;
        name = abrev ? 'Dc' : 'decillion';
    } else if (num >= 1000000000000000000000000000000) {
        num = num / 1000000000000000000000000000000;
        name = abrev ? 'No' : 'nonillion';
    } else if (num >= 1000000000000000000000000000) {
        num = num / 1000000000000000000000000000;
        name = abrev ? 'Oc' : 'octillion';
    } else if (num >= 1000000000000000000000000) {
        num = num / 1000000000000000000000000;
        name = abrev ? 'Sp' : 'septillion';
    } else if (num >= 1000000000000000000000) {
        num = num / 1000000000000000000000;
        name = abrev ? 'Sx' : 'sextillion';
    } else if (num >= 1000000000000000000) {
        num = num / 1000000000000000000;
        name = abrev ? 'Qi' : 'quintillion';
    } else if (num >= 1000000000000000) {
        num = num / 1000000000000000;
        name = abrev ? 'Qa' : 'quadrillion';
    } else if (num >= 1000000000000) {
        num = num / 1000000000000;
        name = abrev ? 'T' : 'trillion';
    } else if (num >= 1000000000) {
        num = num / 1000000000;
        name = abrev ? 'B' : 'billion';
    } else if (num >= 1000000) {
        num = num / 1000000;
        name = abrev ? 'M' : 'million';
    }

    if (longerFormat) {
      return num.toFixed(3).replace(/\.000$/, '') + " " + name;
    } else {
      return num.toFixed(2).replace(/\.00$/, '') + " " + name;
    }

  }
  
  function wipeSaveFile() {
    localStorage.removeItem(SAVE_FILE);
    resetEverything(true);
  }

  /***********************************************
                 KO DEFAULT ANIMATIONS
  ***********************************************/

  var showItem = function(elem) {
    if (elem.nodeType === 1) {
      $(elem).hide().slideDown()
      //$(elem).fadeOut();
    }
  };
  var hideItem = function(elem) {
    if (elem.nodeType === 1) {
      //$(elem).slideUp(function() { $(elem).remove(); })
      $(elem).slideUp(function() { $(elem).remove(); })
    }
  };
	
	/***********************************************
                 EXPOSED FUNCTIONS
	***********************************************/
	
	var cheat = function(val) {
    earnSecretAchievement('cheat');
	  currentCash.add(val);
	  totalCash.add(val);
	  totalCashAllTime.add(val);
	};

  var getUpgradePrice = function(unitId, num, isSymb) {
    var price = (Math.pow(1.15, num) * getUnit(unitId).basePrice()) * (isSymb ? 100 : 25);
    console.log(price);
    console.log(format(price));
    var stringPrice = '' + price;
    var mainNum = '';
    var zeroes = '';
    for (var i = 0; i < stringPrice.length; i++) {
      if (i < 3) {
        mainNum += stringPrice[i];
      } else {
        zeroes += '0';
      }
    }

    mainNum = '' + Math.round((Math.round(parseInt(mainNum) / 10) / 10) * 100);

    console.log(parseInt(mainNum + zeroes))
  }

	return {
	  cheat: cheat,
	  format: format,
    saveFileSize: saveFileSize,
	  wipeSaveFile: wipeSaveFile,
	  saveGame: saveGame,
	  loadGame: loadGame,
		totalDPS: totalDPS,
    accessibleDPS: accessibleDPS,
		addClicks: addClicks,
		checkForMail: checkForMail,
		mail: mail,
		addManualClicks: addManualClicks,
		earnedPerClick: earnedPerClick,
		currentCash: currentCash,
    totalCash: totalCash,
		achievementCount: achievementCount,
    secretAchievementCount: secretAchievementCount,
		upgradeCount: upgradeCount,
		totalAchievementCount: totalAchievementCount,
		achievementPercentageEarned: achievementPercentageEarned,
		newAchievementCount: newAchievementCount,
    newSecretAchievementCount: newSecretAchievementCount,
		newUpgradesCount: newUpgradesCount,
		totalUpgradeCount: totalUpgradeCount,
		upgradePercentageEarned: upgradePercentageEarned,
		achievements: achievements,
    secretAchievements: secretAchievements,
		upgrades: upgrades,
    availableUpgrades: availableUpgrades,
		stats: stats,
		units: units,
		selectedUnit: selectedUnit,
		selectedUpgrade: selectedUpgrade,
    selectedAcquisitionWorker: selectedAcquisitionWorker,
		setBuyRate: setBuyRate,
		generalStats: generalStats,
		unitStats: unitStats,
		clickStats: clickStats,
    idleStats: idleStats,
    researchStats: researchStats,
		cashStats: cashStats,
		emailStats: emailStats,
		investmentStats: investmentStats,
    earningsStats: earningsStats,
    acquisitionStats: acquisitionStats,
    composedStats2: composedStats2,
    composedStats1: composedStats1,
		getAchievement: getAchievement,
    getAchievementById: getAchievementById,
		getUnit: getUnit,
		makeInvestment: makeInvestment,
		interestRate: interestRate,
		activeInvestments: activeInvestments,
    activeAcquisitions: activeAcquisitions,
    simultaneousInvestments: simultaneousInvestments,
    totalSimultaneousInvestmentsAllowed: totalSimultaneousInvestmentsAllowed,
    simultaneousAcquisitions: simultaneousAcquisitions,
		clearAllEmails: clearAllEmails,
		incrementMediumIntervalCounter: incrementMediumIntervalCounter,
		exportGameData: exportGameData,
    exportedSaveData: exportedSaveData,
		importGameData: importGameData,
		restartGame: restartGame,
		startTime: startTime,
		inboxMax: inboxMax,
		nextBankruptcyBonus: nextBankruptcyBonus,
		checkTimePlayedAwards: checkTimePlayedAwards,
    hoursPlayed: hoursPlayed,
    pendingInvestmentCount: pendingInvestmentCount,
    pendingAcquisitionCount: pendingAcquisitionCount,
    bankruptcyModalViewed: bankruptcyModalViewed,
    setBankruptcyModalSetting: setBankruptcyModalSetting,
    isWindfall: isWindfall,
    incrementViewCount: incrementViewCount,
    statsTabViews: statsTabViews,
    investmentPenaltyPercentage: investmentPenaltyPercentage,
    showItem: showItem,
    hideItem: hideItem,
    enableCharts: enableCharts,
    enableHover: enableHover,
    enableNotifications: enableNotifications,
    enableEmptyUpgradesAndAchievements: enableEmptyUpgradesAndAchievements,
    enableDarkMode: enableDarkMode,
    enableFixedNavTabs: enableFixedNavTabs,
    enableWindfallGuarantee: enableWindfallGuarantee,
    maxType: maxType,
    maxIncrement: maxIncrement,
    targetIncrement: targetIncrement,
    bankruptcyListToggled: bankruptcyListToggled,
    lastVisibleUnit: lastVisibleUnit,
    bankruptcies: bankruptcies,
    buyAllUpgrades: buyAllUpgrades,
    viewingAcquisition: viewingAcquisition,
    viewingChat: viewingChat,
    viewingInbox: viewingInbox,
    setViewingInbox: setViewingInbox,
    completedAcquisitions: completedAcquisitions,
    cashOutAllInvestments: cashOutAllInvestments,
    handleAwayEarnings: handleAwayEarnings,
    clearAllAwards: clearAllAwards,
    clearAllSecretAwards: clearAllSecretAwards,
    buyRate: buyRate,
    trainingHours: trainingHours,
    trainingHoursValidation: trainingHoursValidation,
    awayMailInbox: awayMailInbox,
    awayPolicyInbox: awayPolicyInbox,
    awayChatInbox: awayChatInbox,
    research: research,
    awayEarnings: awayEarnings,
    emailHelpView: emailHelpView,
    toggleEmailHelpView: toggleEmailHelpView,
    composeView: composeView,
    toggleComposeView: toggleComposeView,
    composeHelpView: composeHelpView,
    toggleComposeHelpView: toggleComposeHelpView,
    composedMail: composedMail,
    businessName: businessName,
    pastBusinesses: pastBusinesses,
    pastBusinessesFormatted: pastBusinessesFormatted,
    getFormattedTime: getFormattedTime,
    locked: locked,
    bankruptcyListToggled: bankruptcyListToggled,
    toggleBankruptcyList: toggleBankruptcyList,
    toggleTrainingView: toggleTrainingView,
    isTrainingView: isTrainingView,
    containsUrgent: containsUrgent,
    containsCryptic: containsCryptic,
    careerUpgrades: careerUpgrades,
    trainingSeminars: trainingSeminars,
    trainingsComplete: trainingsComplete,
    trainingsCanAfford: trainingsCanAfford,
    multiTrain: multiTrain,
    finishAllTrainings: finishAllTrainings,
    careerDevStats: careerDevStats,
    crypticStats: crypticStats,
    mysteryBoostResults: mysteryBoostResults,
    nextBankruptcySeminars: nextBankruptcySeminars,
    seminarsUsed: seminarsUsed,
    mysteryBoost: mysteryBoost,
    election: election,
    electionStats1: electionStats1,
    electionStats2: electionStats2,
    earnAchievement: earnAchievement,
    electionSupportRate: electionSupportRate,
    getUpgradePrice: getUpgradePrice,
    incrementWindfallGuarantee: incrementWindfallGuarantee,
    windfallProgress: windfallProgress,
    triggerManualWindfall: triggerManualWindfall,
    windfallGuarantee: windfallGuarantee,
    enableWindfallGuarantee: enableWindfallGuarantee,
    windfallGrowthMultiplier: windfallGrowthMultiplier,
    viewingTab: viewingTab,
    viewingModal: viewingModal,
    newAchievements: newAchievements,
    twoColumnEmployees: twoColumnEmployees,
    statsTabViews: statsTabViews,
    achievementTabViews: achievementTabViews
	};
})();