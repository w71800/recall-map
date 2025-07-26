// 資料處理模組
class DataProcessor {
  constructor() {
    this.recallData = {};
    this.cityToDistricts = {};
    this.isDataLoaded = false;
  }

  // 從 result.json 載入資料
  async loadData() {
    try {
      const response = await fetch('./result.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();
      
      // 處理原始資料
      this.processRawData(rawData);
      this.isDataLoaded = true;
      
      console.log('資料載入成功', this.recallData);
      return this.recallData;
    } catch (error) {
      console.error('載入資料失敗:', error);
      throw error;
    }
  }

  // 縣市名稱對應表（簡體字對應繁體字，以及舊名稱對應新名稱）
  cityNameMapping = {
    '台東縣': '臺東縣',
    '台中市': '臺中市',
    '台北市': '臺北市',
    '台南市': '臺南市',
    '桃園縣': '桃園市',
    '新竹市': '新竹市',
    '基隆市': '基隆市',
    '雲林縣': '雲林縣',
    '花蓮縣': '花蓮縣'
  };

  // 處理原始資料
  processRawData(rawData) {
    this.recallData = {};
    this.cityToDistricts = {};

    rawData.forEach(item => {
      const districtKey = item['罷免選區'];
      let cityName = item['罷免行政區'];
      
      // 處理縣市名稱對應
      cityName = this.cityNameMapping[cityName] || cityName;
      
      // 處理資料格式
      const processedData = {
        candidate: item['被罷免人'],
        agreeVotes: parseInt(item['同意票']),
        disagreeVotes: parseInt(item['不同意票']),
        totalVotes: parseInt(item['投票人數']),
        turnoutRate: parseInt(item['投票率']) / 100,
        recallSuccess: false, // 根據實際資料判斷
        invalidVotes: parseInt(item['無效票']),
        totalEligibleVoters: parseInt(item['選舉人總數'])
      };

      // 判斷罷免是否成功（同意票 > 不同意票）
      processedData.recallSuccess = processedData.agreeVotes > processedData.disagreeVotes;

      // 儲存處理後的資料
      this.recallData[districtKey] = processedData;

      // 建立縣市與選舉區的對應關係
      if (!this.cityToDistricts[cityName]) {
        this.cityToDistricts[cityName] = [];
      }
      this.cityToDistricts[cityName].push(districtKey);
    });
  }

  // 取得所有罷免資料
  getRecallData() {
    return this.recallData;
  }

  // 取得縣市與選舉區對應表
  getCityToDistricts() {
    return this.cityToDistricts;
  }

  // 取得特定縣市的罷免資料
  getCityRecallData(cityName) {
    const districts = this.cityToDistricts[cityName] || [];
    return districts.map(district => ({
      district,
      ...this.recallData[district]
    })).filter(data => data.candidate); // 過濾掉無效資料
  }

  // 取得特定選舉區的資料
  getDistrictData(districtKey) {
    return this.recallData[districtKey] || null;
  }

  // 計算縣市的平均同意票比例
  getCityAverageAgreeRatio(cityName) {
    const cityData = this.getCityRecallData(cityName);
    if (cityData.length === 0) return 0;

    const totalRatio = cityData.reduce((sum, data) => {
      return sum + (data.agreeVotes / data.totalVotes);
    }, 0);

    return totalRatio / cityData.length;
  }

  // 取得統計資料
  getStatistics() {
    const districts = Object.keys(this.recallData);
    const totalDistricts = districts.length;
    const successfulRecalls = districts.filter(district => 
      this.recallData[district].recallSuccess
    ).length;
    const failedRecalls = totalDistricts - successfulRecalls;

    const totalAgreeVotes = districts.reduce((sum, district) => 
      sum + this.recallData[district].agreeVotes, 0
    );
    const totalDisagreeVotes = districts.reduce((sum, district) => 
      sum + this.recallData[district].disagreeVotes, 0
    );

    const avgTurnout = districts.reduce((sum, district) => 
      sum + this.recallData[district].turnoutRate, 0
    ) / totalDistricts;

    return {
      totalDistricts,
      districtsWithRecall: totalDistricts,
      successfulRecalls,
      failedRecalls,
      averageTurnout: avgTurnout,
      totalAgreeVotes,
      totalDisagreeVotes
    };
  }

  // 檢查資料是否已載入
  isDataReady() {
    return this.isDataLoaded;
  }

  // 重新載入資料
  async reloadData() {
    this.isDataLoaded = false;
    return await this.loadData();
  }
}

// 匯出資料處理器
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataProcessor;
} else {
  window.DataProcessor = DataProcessor;
} 