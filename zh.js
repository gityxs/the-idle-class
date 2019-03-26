/**
 * 20190319@JAR:
 * 
 * 1.汉化字典'cnItems:obj',
 * 2.采集新词'cnItem:fun';
 * 
 */

//1.汉化杂项
var cnItems = {
    _STYLE_: [
        '符号', '待归类', '成就', '防具', '武器', '道具', '属性', '敌人'
    ],
    _OTHER_: [],

    //1.0.符号
    '': '',
    '---': '———',

    //1.1.待归类
    'C-Levels': 'C级',
    'Interns': '实习生',
    'Middle Managers': '中层管理',
    'Sales Hotshots': '销售能人',
    'Wage Slaves': '工资奴隶',
    'Blue Bloods': '贵族',
    'A Fair Day\'s Wage': '公平日的工资',
    'A Leg Up on the Pile': '桩上的一条腿',
    'A million dollars isn\'t cool. You know what\'s cool? A billion dollars.': '一百万美元并不酷。 你知道什么很酷吗？ 十亿美元。',
    'A New Sheriff In Town': '镇上的新警长',
    'A Team Player': '团队合作者',
    'Above and Beyond': '超越自我',
    'Acceptable Losses': '可接受的损失',
    'Achievement Descriptions Read': '成就说明阅读',
    'Achievements Unlocked': '成就解锁',
    'Acquisition Boost Bonus': '收购提升奖金',
    'Acquisition Time Boosted': '收购时间提升',
    'Acquisition Value Multiplier': '收购价值乘数',
    'Acquisitions Sold': '收购已售出',
    'Acquisitions Sold (All Businesses)': '收购已售出（所有业务）',
    'Acquisitions Waiting to Cash Out': '收购等待兑现',
    'All In A Day\'s Work':'所有在一天的工作',
    'All Talk and Some Action': '所有谈话和一些行动',
    'All-Encompassing System': '包罗万象的系统',
    'All-Powerful Global Conglomerate': '全能的全球企业集团',
    'All-Seeing': '到处可见',
    'Alpha and Omega': '阿尔法和欧米茄',
    'Always Been Closing': '一向被关闭',
    'Always Bullish': '总是看涨',
    'An Eye for Efficiency': '注重效率',
    'Ancient Cyclopean Construct': '古代独立建筑',
    'And So It Goes...': '如此这般...',
    'Angel Investor': '天使投资人',
    'Annuit Cœptis': '年报',
    'Any Update Here?': '有什么更新？',
    'Are You Getting These?': '你收到了吗?',
    'Ascendant Nurturer': '转生培养者',
    'Attentive Executive': '细心的执行',
    'Auto Mod': '自动模式',
    'Auto Sell': '自动出售',
    'Away Earnings': '离线收益',
    'Away Fired': '离线离职',
    'Away Quit': '离线时长',
    'Babylonian Brother': '巴比伦兄弟',
    'Back for More': '回到更多',
    'Bankruptcies Declared': '破产宣告',
    'Bankruptcy Multiplier': '破产乘数',
    'Barely Lifted a Finger': '勉强抬起一根手指',
    'Base Email Chance': '基础电子邮件几率',
    'Base Mod to Cash Per Second': '基础模式现金每秒',
    'Basically Lazy': '基本上懒惰',
    'Basically Too Much Clicking': '基本上太多点击了',
    'Behold Now Behemoth': '看哪，现在庞然大物',
    'Benny, Bring Me Everyone': '本尼，给我带来每个人',
    'Best of Breed': '最佳品种',
    'Best Regards': '最好的祝福',
    'Bewildered Herd': '迷茫的牛群',
    'Big Spender': '大富豪',
    'Big-Box Factory': '大箱工厂',
    'Big-Game Coolhunter': '大型猎酷者',
    'Bilderberger': '彼尔德伯格',
    'Bizmeth Artisan': '比斯米特工匠',
    'Bleeding Edge Visionary': '前沿有远见',
    'Bloodshot & Shaking': '充血和摇晃',
    'Blue Chip Bigwig': '蓝筹要人',
    'Blue Lives Matter': '蓝色的生活问题',
    'Blue Ocean Strategist': '蓝海战略',
    'Blue-Sky Thinker': '蓝天思考者',
    'Bonus for Time Played': '游戏时间奖励',
    'Bonus Per Achievement': '每项成就奖金',
    'Bonus Per Employee': '每个员工的奖金',
    'Bonus to Email Payout': '电子邮件支付的奖金',
    'Born Leader': '天生的领袖',
    'Bought the World a Coke': '给全世界买了一杯可乐',
    'Broken Spirit': '破碎的精神',
    'Broker of Mammon': '财神经纪人',
    'Brownian Ratcheter': '布朗·拉切特',
    'Brute Forcer': '野蛮人',
    'Business Decimator': '业务抽取器',
    'Business Omniscient': '商业无所不知',
    'But Failure is Not a Crime': '但失败不是犯罪',
    'Can I Speak to the Manager?': '我可以和经理谈谈吗？',
    'Canceled Investments': '取消的投资',
    'Caretaker': '管理人',
    'Cash Earned by Clicking': '通过点击获得的现金',
    'Cash Earned During Windfalls': '在意外收获期间获得的现金',
    'Cash Earned From Acquisitions': '收购所得现金',
    'Cash Earned From Emails': '从电子邮件获得的现金',
    'Cash Earned From Expired Emails': '从过期电子邮件中获得的现金',
    'Cash Earned From Fresh Emails': '从新的电子邮件获得的现金',
    'Cash Earned From Investments': '投资赚取的现金',
    'Cash Earned From Long Investments': '长期投资赚取的现金',
    'Cash Earned From Short Investments': '短期投资赚取的现金',
    'Cash Earned From Urgent Emails': '从紧急电子邮件中获得的现金',
    'Cash Earned in Total': '总计赚的现金',
    'Cash Earned in Total (All Time)': '总计赚的现金（所有时间）',
    'Cash Earned Per Click': '每次点击赚取的现金',
    'Cash Earned Per Hour': '每小时赚取的现金',
    'Cash Earned Per Minute': '每分钟赚取的现金',
    'Cash Earned Per Second': '每秒赚取的现金',
    'Cash Earned Per Second (Minus Investments)': '每秒赚取的现金（减去投资）',
    'Cash in Hand': '手头现金',
    'Cash Spent': '现金花费',
    'Catching all the Breaks': '抓住所有休息时间',
    'Cautious': '谨慎',
    'Chain of Command': '指挥链',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'AutoBiz#0': '自动商务#0',

    //1.2.成就
    'Lead Magnet': '领导引力',
    'Working Stiff': '劳动阶层',
    'Get Back to Me by EOD': '按计划返回给我',
    'A City Upon a Hill': '一座山上的城市',
    'A Clear-Eyed Realist': '清醒的现实主义者',
    'A Deal with the Devil': '与魔鬼的交易',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    'War Profiteer': '战争利益',
    'Warrior Poet': '战士诗人',
    'Waste Manager': '废物管理',
    'We Love Our Cops': '我们爱我们的警察',
    'Wealth Begets Wealth': '财富带来财富',
    'Wearer of All Hats': '所有帽子的佩戴者',
    'Wearer of Multiple Hats': '多个帽子的佩戴者',
    'Webinar Wizard': '研讨会向导',
    'Weekend Warrior': '周末战士',
    'Well-Deserved Winnings': '当之无愧的奖金',
    'Whitepaper Wunderkind': '白皮书神童',
    'Who Cares?': '谁在乎？',
    'Windfall Multiplier': '暴利倍增',
    'Winners Never Quit': '胜者永不退出',
    'Withering Serf': '萎凋农奴',
    'Words Chatted': '谈天说地',
    'Wordsmith': '语言大师',
    'Work Harder, Not Smarter': '努力工作，不要太聪明',
    'Work Will Set You Free': '工作会让你自由',
    'You Clicked Too Many Times': '你点击太多次了',
    'You Have Clicked Too Much': '你已点击太多了',
    'You Have to Expedite This': '你必须加快这个',

    //1.3.防具
    //1.4.武器
    //1.5.道具

    //1.6.属性（30）
    '': '',

    //1.7.敌人 

};
//2.采集新词
//20190320@JAR

var cnItem = function () {

    //传参是否非空字串
    if (!arguments[0]) return;

    //检验传参是否对象
    let text = arguments[0],
        s = '';
    if (typeof (text) != "string")
        return text;
    else
        s = arguments[0].charCodeAt();

    //检验传参是否英文
    if (
        s < 65 || (s > 90 && s < 97) || (s > 122)

    ) return text;
    //检验字典是否可存
    if (!cnItems._OTHER_) cnItems._OTHER_ = [];

    //遍历尝试匹配
    for (let i in cnItems) {
        //字典已有词汇或译文、且译文不为空，则返回译文
        if (
            text == i || text == cnItems[i] &&
            cnItems[i] != ''
        )
            return cnItems[i];
    }

    //遍历生词表是否收录
    for (
        let i = 0; i < cnItems._OTHER_.length; i++
    ) {
        //已收录则直接返回
        if (text == cnItems._OTHER_[i])
            return text;
    }

    //未收录则保存
    cnItems._OTHER_.push(text);
    cnItems._OTHER_.sort(
        function (a, b) {
            return a.localeCompare(b)
        }
    );

    /*
        //开启生词打印
        //console.log(
            '有需要汉化的英文：', text
        );
    */

    //返回生词字串
    return text;
};
