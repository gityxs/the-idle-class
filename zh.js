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
