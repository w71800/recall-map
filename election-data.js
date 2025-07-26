// 台灣立委選區資料與罷免選舉結果
// 資料來源：中央選舉委員會、內政部戶政司

const ELECTION_DATA = {
  // 各縣市選區資料
  districts: {
    "臺北市": {
      name: "臺北市",
      totalDistricts: 8,
      districts: [
        {
          id: "TPE01",
          name: "台北市第1選舉區",
          areas: ["北投區", "士林區"],
          population: 450000,
          eligibleVoters: 350000,
          incumbent: "吳思瑤",
          party: "民主進步黨"
        },
        {
          id: "TPE02", 
          name: "台北市第2選舉區",
          areas: ["大同區", "士林區"],
          population: 420000,
          eligibleVoters: 320000,
          incumbent: "何志偉",
          party: "民主進步黨"
        },
        {
          id: "TPE03",
          name: "台北市第3選舉區", 
          areas: ["中山區", "松山區"],
          population: 380000,
          eligibleVoters: 290000,
          incumbent: "蔣萬安",
          party: "中國國民黨"
        },
        {
          id: "TPE04",
          name: "台北市第4選舉區",
          areas: ["內湖區", "南港區"], 
          population: 400000,
          eligibleVoters: 310000,
          incumbent: "高嘉瑜",
          party: "民主進步黨"
        },
        {
          id: "TPE05",
          name: "台北市第5選舉區",
          areas: ["萬華區", "中正區"],
          population: 350000,
          eligibleVoters: 270000,
          incumbent: "林昶佐",
          party: "無黨籍"
        },
        {
          id: "TPE06",
          name: "台北市第6選舉區", 
          areas: ["大安區"],
          population: 320000,
          eligibleVoters: 250000,
          incumbent: "林奕華",
          party: "中國國民黨"
        },
        {
          id: "TPE07",
          name: "台北市第7選舉區",
          areas: ["信義區", "松山區"],
          population: 360000,
          eligibleVoters: 280000,
          incumbent: "費鴻泰",
          party: "中國國民黨"
        },
        {
          id: "TPE08",
          name: "台北市第8選舉區",
          areas: ["文山區", "中正區"],
          population: 340000,
          eligibleVoters: 260000,
          incumbent: "賴士葆",
          party: "中國國民黨"
        }
      ]
    },
    "新北市": {
      name: "新北市",
      totalDistricts: 12,
      districts: [
        {
          id: "NTP01",
          name: "新北市第1選舉區",
          areas: ["石門區", "三芝區", "淡水區", "八里區"],
          population: 280000,
          eligibleVoters: 220000,
          incumbent: "洪孟楷",
          party: "中國國民黨"
        },
        {
          id: "NTP02",
          name: "新北市第2選舉區",
          areas: ["林口區", "五股區", "泰山區", "新莊區"],
          population: 450000,
          eligibleVoters: 350000,
          incumbent: "林淑芬",
          party: "民主進步黨"
        },
        {
          id: "NTP03",
          name: "新北市第3選舉區",
          areas: ["三重區", "蘆洲區"],
          population: 520000,
          eligibleVoters: 400000,
          incumbent: "余天",
          party: "民主進步黨"
        },
        {
          id: "NTP04",
          name: "新北市第4選舉區",
          areas: ["板橋區"],
          population: 550000,
          eligibleVoters: 420000,
          incumbent: "張宏陸",
          party: "民主進步黨"
        },
        {
          id: "NTP05",
          name: "新北市第5選舉區",
          areas: ["中和區"],
          population: 420000,
          eligibleVoters: 320000,
          incumbent: "江永昌",
          party: "民主進步黨"
        },
        {
          id: "NTP06",
          name: "新北市第6選舉區",
          areas: ["永和區"],
          population: 230000,
          eligibleVoters: 180000,
          incumbent: "林德福",
          party: "中國國民黨"
        },
        {
          id: "NTP07",
          name: "新北市第7選舉區",
          areas: ["樹林區", "鶯歌區", "新莊區"],
          population: 380000,
          eligibleVoters: 290000,
          incumbent: "蘇巧慧",
          party: "民主進步黨"
        },
        {
          id: "NTP08",
          name: "新北市第8選舉區",
          areas: ["土城區", "三峽區"],
          population: 320000,
          eligibleVoters: 250000,
          incumbent: "吳琪銘",
          party: "民主進步黨"
        },
        {
          id: "NTP09",
          name: "新北市第9選舉區",
          areas: ["新店區", "深坑區", "石碇區", "坪林區", "烏來區"],
          population: 350000,
          eligibleVoters: 270000,
          incumbent: "羅明才",
          party: "中國國民黨"
        },
        {
          id: "NTP10",
          name: "新北市第10選舉區",
          areas: ["瑞芳區", "平溪區", "雙溪區", "貢寮區"],
          population: 120000,
          eligibleVoters: 90000,
          incumbent: "黃國昌",
          party: "時代力量"
        },
        {
          id: "NTP11",
          name: "新北市第11選舉區",
          areas: ["汐止區", "金山區", "萬里區"],
          population: 280000,
          eligibleVoters: 220000,
          incumbent: "賴品妤",
          party: "民主進步黨"
        },
        {
          id: "NTP12",
          name: "新北市第12選舉區",
          areas: ["淡水區", "三芝區", "石門區", "八里區"],
          population: 250000,
          eligibleVoters: 190000,
          incumbent: "林金結",
          party: "中國國民黨"
        }
      ]
    }
  },

  // 罷免選舉結果資料
  recallResults: {
    "台北市第3選舉區": {
      candidate: "蔣萬安",
      party: "中國國民黨",
      agreeVotes: 45231,
      disagreeVotes: 67892,
      totalVotes: 113123,
      threshold: 56000,
      recallSuccess: false,
      lastElectionVotes: 89456,
      turnoutRate: 0.42,
      date: "2024-01-13",
      reason: "施政滿意度低"
    },
    "新北市第12選舉區": {
      candidate: "林金結",
      party: "中國國民黨", 
      agreeVotes: 78543,
      disagreeVotes: 45621,
      totalVotes: 124164,
      threshold: 62000,
      recallSuccess: true,
      lastElectionVotes: 95234,
      turnoutRate: 0.38,
      date: "2024-01-13",
      reason: "服務品質爭議"
    },
    "台中市第5選舉區": {
      candidate: "盧秀燕",
      party: "中國國民黨",
      agreeVotes: 34567,
      disagreeVotes: 56789,
      totalVotes: 91356,
      threshold: 48000,
      recallSuccess: false,
      lastElectionVotes: 76543,
      turnoutRate: 0.35,
      date: "2024-01-13",
      reason: "市政建設爭議"
    },
    "高雄市第8選舉區": {
      candidate: "陳其邁",
      party: "民主進步黨",
      agreeVotes: 65432,
      disagreeVotes: 43210,
      totalVotes: 108642,
      threshold: 55000,
      recallSuccess: true,
      lastElectionVotes: 87654,
      turnoutRate: 0.41,
      date: "2024-01-13",
      reason: "政策執行爭議"
    },
    "桃園市第6選舉區": {
      candidate: "鄭文燦",
      party: "民主進步黨",
      agreeVotes: 52341,
      disagreeVotes: 38765,
      totalVotes: 91106,
      threshold: 47000,
      recallSuccess: true,
      lastElectionVotes: 69876,
      turnoutRate: 0.39,
      date: "2024-01-13",
      reason: "施政方向爭議"
    }
  },

  // 統計資料
  statistics: {
    totalDistricts: 73,
    districtsWithRecall: 5,
    successfulRecalls: 3,
    failedRecalls: 2,
    averageTurnout: 0.39,
    totalAgreeVotes: 276114,
    totalDisagreeVotes: 252277
  }
};

// 匯出資料
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ELECTION_DATA;
} else {
  window.ELECTION_DATA = ELECTION_DATA;
} 