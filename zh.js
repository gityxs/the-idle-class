/**
 * 20190326@JAR:
 * 
 * 1.汉化字典'cnItems:obj',
 * 2.采集新词'cnItem:fun';
 * 
 */

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//1.汉化字典

var cnItems = {
    
    _STYLE_: [
        '符号', '待归类单词', '待归类词组', '待归类长句', '成就'
    ],
    _OTHER_: [],

    //.0.符号
    '': '',
    '---': '———',

    //.待归类
    
    //.1.待归类单词
    'AutoBiz#0':    '自动商务#0',
    'C-Levels':     'C级',
    'Caretaker':    '管理人',
    'Interns':      '实习生',

    //.2.待归类词组
    'A Fair Day\'s Wage':                           '公平日的工资',
    'A Leg Up on the Pile':                         '桩上的一条腿',
    'A New Sheriff In Town':                        '镇上的新警长',
    'A Team Player':                                '团队合作者',
    'Above and Beyond':                             '超越自我',
    'Acceptable Losses':                            '可接受的损失',
    'Achievement Descriptions Read':                '成就说明阅读',
    'Achievements Unlocked':                        '成就解锁',
    'Acquisition Boost Bonus':                      '收购提升奖金',
    'Acquisition Time Boosted':                     '收购时间提升',
    'Acquisition Value Multiplier':                 '收购价值乘数',
    'Acquisitions Sold':                            '收购已售出',
    'Acquisitions Sold (All Businesses)':           '收购已售出（所有业务）',
    'Acquisitions Waiting to Cash Out':             '收购等待兑现',
    'All In A Day\'s Work':                         '所有在一天的工作',
    'All Talk and Some Action':                     '所有谈话和一些行动',
    'All-Encompassing System':                      '包罗万象的系统',
    'All-Powerful Global Conglomerate':             '全能的全球企业集团',
    'All-Seeing':                                   '到处可见',
    'Alpha and Omega':                              '阿尔法和欧米茄',
    'Always Been Closing':                          '一向被关闭',
    'Always Bullish':                               '总是看涨',
    'An Eye for Efficiency':                        '注重效率',
    'Ancient Cyclopean Construct':                  '古代独立建筑',
    'Angel Investor':                               '天使投资人',
    'Annuit Cœptis':                                '年报',
    'Ascendant Nurturer':                           '转生培养者',
    'Attentive Executive':                          '细心的执行',
    'Auto Mod':                                     '自动模式',
    'Auto Sell':                                    '自动出售',
    'Away Earnings':                                '离线收益',
    'Away Fired':                                   '离线离职',
    'Away Quit':                                    '离线时长',
    'Babylonian Brother':                           '巴比伦兄弟',
    'Back for More':                                '回到更多',
    'Bankruptcies Declared':                        '破产宣告',
    'Bankruptcy Multiplier':                        '破产乘数',
    'Barely Lifted a Finger':                       '勉强抬起一根手指',
    'Base Email Chance':                            '基础电子邮件几率',
    'Base Mod to Cash Per Second':                  '基础模式现金每秒',
    'Basically Lazy':                               '基本上懒惰',
    'Basically Too Much Clicking':                  '基本上太多点击了',
    'Behold Now Behemoth':                          '看哪，现在庞然大物',
    'Best of Breed':                                '最佳品种',
    'Best Regards':                                 '最好的祝福',
    'Bewildered Herd':                              '迷茫的牛群',
    'Big Spender':                                  '大富豪',
    'Big-Box Factory':                              '大箱工厂',
    'Big-Game Coolhunter':                          '大型猎酷者',
    'Bilderberger':                                 '彼尔德伯格',
    'Bizmeth Artisan':                              '比斯米特工匠',
    'Bleeding Edge Visionary':                      '前沿有远见',
    'Bloodshot & Shaking':                          '充血和摇晃',
    'Blue Bloods':                                  '贵族',
    'Blue Chip Bigwig':                             '蓝筹要人',
    'Blue Lives Matter':                            '蓝色的生活问题',
    'Blue Ocean Strategist':                        '蓝海战略',
    'Blue-Sky Thinker':                             '蓝天思考者',
    'Bonus for Time Played':                        '游戏时间奖励',
    'Bonus Per Achievement':                        '每项成就奖金',
    'Bonus Per Employee':                           '每个员工的奖金',
    'Bonus to Email Payout':                        '电子邮件支付的奖金',
    'Born Leader':                                  '天生的领袖',
    'Bought the World a Coke':                      '给全世界买了一杯可乐',
    'Broken Spirit':                                '破碎的精神',
    'Broker of Mammon':                             '财神经纪人',
    'Brownian Ratcheter':                           '布朗·拉切特',
    'Brute Forcer':                                 '野蛮人',
    'Business Decimator':                           '业务抽取器',
    'Business Omniscient':                          '商业无所不知',
    'But Failure is Not a Crime':                   '但失败不是犯罪',
    'Canceled Investments':                         '取消的投资',
    'Cash Earned by Clicking':                      '通过点击获得的现金',
    'Cash Earned During Windfalls':                 '在意外收获期间获得的现金',
    'Cash Earned From Acquisitions':                '收购所得现金',
    'Cash Earned From Emails':                      '从电子邮件获得的现金',
    'Cash Earned From Expired Emails':              '从过期电子邮件中获得的现金',
    'Cash Earned From Fresh Emails':                '从新的电子邮件获得的现金',
    'Cash Earned From Investments':                 '投资赚取的现金',
    'Cash Earned From Long Investments':            '长期投资赚取的现金',
    'Cash Earned From Short Investments':           '短期投资赚取的现金',
    'Cash Earned From Urgent Emails':               '从紧急电子邮件中获得的现金',
    'Cash Earned in Total':                         '总计赚的现金',
    'Cash Earned in Total (All Time)':              '总计赚的现金（所有时间）',
    'Cash Earned Per Click':                        '每次点击赚取的现金',
    'Cash Earned Per Hour':                         '每小时赚取的现金',
    'Cash Earned Per Minute':                       '每分钟赚取的现金',
    'Cash Earned Per Second':                       '每秒赚取的现金',
    'Cash Earned Per Second (Minus Investments)':   '每秒赚取的现金（减去投资）',
    'Cash in Hand':                                 '手头现金',
    'Cash Spent':                                   '现金花费',
    'Catching all the Breaks':                      '抓住所有休息时间',
    'Cautious':                                     '谨慎',
    'Chain of Command':                             '指挥链',
    'Middle Managers':                              '中层管理',
    'Wage Slaves':                                  '工资奴隶',
    'Get Back to Me by EOD':                        '按计划返回给我',
    'Lead Magnet':                                  '领导引力',
    'Privatized Cops':                              '私有化警察',
    'Working Stiff':                                '劳动阶层',
    'War Profiteer':                                '战争利益',
    'Warrior Poet':                                 '战士诗人',
    'Waste Manager':                                '废物管理',
    'We Love Our Cops':                             '我们爱我们的警察',
    'Wealth Begets Wealth':                         '财富带来财富',
    'Wearer of All Hats':                           '所有帽子的佩戴者',
    'Wearer of Multiple Hats':                      '多个帽子的佩戴者',
    'Webinar Wizard':                               '研讨会向导',
    'Weekend Warrior':                              '周末战士',
    'Well-Deserved Winnings':                       '当之无愧的奖金',
    'Whitepaper Wunderkind':                        '白皮书神童',
    'Windfall Multiplier':                          '暴利倍增',
    'Winners Never Quit':                           '胜者永不退出',
    'Withering Serf':                               '萎凋农奴',
    'Words Chatted':                                '谈天说地',
    'Wordsmith':                                    '语言大师',
    'Work Harder, Not Smarter':                     '努力工作，不要太聪明',
    'Work Will Set You Free':                       '工作会让你自由',
    'You Clicked Too Many Times':                   '你点击太多次了',
    'You Have Clicked Too Much':                    '你已点击太多了',
    'You Have to Expedite This':                    '你必须加快这个',

    //.3.待归类长句
    'A million dollars isn\'t cool. You know what\'s cool? A billion dollars.': 
        '一百万美元并不酷。你知道什么才是酷吗？ 十亿美元。',
    'And So It Goes...':
        '如此这般……',
    'Any Update Here?': 
        '有什么更新？',
    'Are You Getting These?': 
        '你收到了吗？',
    'Benny, Bring Me Everyone': 
        '本尼，给我带来每个人',
    'Can I Speak to the Manager?': 
        '我可以和经理谈谈吗？',
    'Who Cares?':
        '谁在乎？',


    //1.2.成就
    'A City Upon a Hill':                       '山巅之城',
    'A Clear-Eyed Realist':                     '慧眼智者',
    'A Deal with the Devil':                    '与魔共舞',
    'A Few Extra Fingers':                      '额外控制',
    'A Shining Trapezohedron':                  '闪亮梯形',
    'A Silver Spoon':                           '银色茶匙',
    'Absentee Landlordism':                     '采邑领主',
    'Additional Buses':                         '附赠公交',
    'Administrative Dirty-Work':                '政治黑幕',
    'Aerospace Tech Group':                     '航天科工',
    'Aggressive Debt Collection':               '债务追索',
    'Aggressive Debt Collectors':               '专业追债',
    'All Accounts Deleted':                     '清除账户',
    'All-White Juries':                         '公平审判',
    'Amateur Debt Collectors':                  '业余追债',
    'Ambulance Chasers':                        '紧急救助',
    'Ancient Lobbyists':                        '古风说客',
    'Anthracite Coins':                         '亮煤货币',
    'Anti-Homeless Measures':                   '安民措施',
    'Anti-Union Literature':                    '革命手册',
    'Anxiety Medication':                       '焦虑药物',
    'Arbitrary Finger-Pointing':                '唯心指示',
    'Armed Militia Conscription':               '兵役法案',
    'Armed Rebel Groups':                       '武装叛军',
    'Army Surplus Gear':                        '备用军资',
    'Aspirational Loyalty':                     '忠诚伟志',
    'Attack Ads':                               '抨击广告',
    'Attorneys on Retainer':                    '授信讼师',
    'Automated Firing Algorithms':              '自动枪火',
    'Banana Coins':                             '香蕉货币',
    'Bane Capital':                             '灰色资本',
    'Baphometic Hypnotism':                     '宗教催眠',
    'Base Earnings':                            '基础收入',
    'Baseless Optimism':                        '盲目乐观',
    'Bathroom Panopticon':                      '单间浴室',
    'Bihourly Safety Meetings':                 '定期会晤',
    'Black Helicopters':                        '直升战机',
    'Black Site Debt Collectors':               '黑市追债',
    'Blackened Coins':                          '敦化货币',
    'Blood-Speckled Coins':                     '血斑货币',
    'Blood-Stained Coins':                      '血污货币',
    'Boardroom Lobbyists':                      '私房说客',
    'Bomb-Scorched Coins':                      '弹焦货币',
    'Bootstraps':                               '自力更生',
    'Borrowed Coins':                           '虚拟货币',
    'Bottle-Cap Coins':                         '瓶盖货币',
    'Boundless Advertising':                    '无边广告',
    'Boy\'s Club Comraderie':                   '光腚友情',
    'Brazen & Reckless Fraud':                  '无耻欺诈',
    'Budget Reductions':                        '削减预算',
    'Bullet-Riddled Coins':                     '弹孔货币',
    'Bullpen Lobbyists':                        '社交说客',
    'Bureaucratic Law Clerks':                  '官僚书记',
    'Bureaucratic Moneylenders':                '官商代理',
    'Burnt Coins':                              '燃烧货币',
    'Business Cards':                           '商业名片',
    'Business Precognition':                    '商业预感',
    'Campaign Contributions':                   '竞选献金',
    'Cash Bail Moneylenders':                   '保释代理',
    'Casual Fridays':                           '周五便装',
    'Casual Wage Discrimination':               '薪资歧视',
    'Casus Belli':                              '宣战理由',
    'Catastrophic Bailouts':                    '灾难救援',
    'Catastrophic Health Plans':                '救灾组织',
    'Centenarian Retirement':                   '百岁退休',
    'Chalky Coins':                             '白垩货币',
    'Champion of the Process':                  '工艺大师',
    'Chance of Windfall':                       '意外收获',
    'Chance to Receive Urgent Emails':          '提示机会',
    'Change Agent':                             '更换代理',
    'Chasing Returns':                          '追踪回报',
    'Chat Away Unlocked':                       '封锁回音',
    'Chat Messages':                            '聊天信息',
    'Chats Completed (All Businesses)':         '协商完成',
    'Cheap Hack Lawyers':                       '黑客律师',
    'Chem Trails':                              '化学痕迹',
    'Chemical-Burned Coins':                    '化工货币',
    'Chocolate Coins':                          '可可货币',
    'Choke Their Rivers With Our Bankruptcies': '破产策略',
    'Churning Out Innovation':                  '刺激创新',
    'CIA-Sponsored Coups':                      '煽动政变',
    'Circle Back':                              '圆滑回转',
    'Clearer Expectations':                     '明朗期待',
    'Click Mod':                                '点击模块',
    'Clicks':                                   '批量点击',
    'Client States':                            '客户形态',
    'Closed-Door Meetings':                     '封闭会议',
    'Coal-Dusted Coins':                        '煤尘货币',
    'Collateral Damage':                        '抵押损失',
    'Colonial Hegemony':                        '殖民霸权',
    'Colonial Sovereignty':                     '殖民主权',
    'Committed Crapshooter':                    '完整洗脑',
    'Community Policing':                       '社区保安',
    'Company Cultural Hegemony':                '公司洗脑',
    'Company Man':                              '公司成员',
    'Company Scrip':                            '公司票据',
    'Complete Deregulation':                    '完成释放',
    'Completionist':                            '完美主义',
    'Complimentary Amphetamines':               '免费药品',
    'Comprehensive Outsourcing':                '综合外包',
    'Compulsory Sedation':                      '强制镇静',
    'Congenial Encouragement':                  '正面鼓励',
    'Content Creator':                          '原创作者',

    _SHOWN_: function(){
        console.log(this._OTHER_);
        let
            $cni /*词汇数组*/ = arguments[0] || this._OTHER_,
            $str /*词汇字串*/ = document.createElement('div')
        ;
        $str = '汉化-待译（阳光汉化组）：\n\n';
        //整理元素
        for ( let i=0; i<$cni.length; i++ ) {
            $str += ( '/*' + i + '*/ "' + $cni[i] + '": "",\n');
        }
        $str += '\n\n刷新可继续游戏；愿支持汉化请联系QQ：505397145。';
        alert($str);
    },

};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//2.采集新词

var cnItem = function () {

    //.1.传参是否非空字串
    if (!arguments[0]) return;

    //.2.检验传参是否对象
    let text = arguments[0],
        s = '';
    if (typeof (text) != "string")
        return text;
    else
        s = arguments[0].charCodeAt();

    //.3.检验传参是否英文
    if (
        s < 'A' || (s > 'Z' && s < 'a') || (s > 'z')

    ) return text;

    //.4.检验字典是否可存
    if (!cnItems._OTHER_) cnItems._OTHER_ = [];

    //.5.遍历尝试匹配
    for (let i in cnItems) {
        //.5.1.字典已有词汇或译文、且译文不为空，则返回译文
        if (
            text == i || text == cnItems[i] &&
            cnItems[i] != ''
        )
            return cnItems[i];
    }

    //.6.遍历生词表是否收录
    for (
        let i = 0; i < cnItems._OTHER_.length; i++
    ) {
        //.6.1.已收录则直接返回
        if (text == cnItems._OTHER_[i])
            return text;
    }

    //.7.未收录则保存
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

    //.8.返回生词字串
    return text;
};


