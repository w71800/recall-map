// 模擬的罷免選舉資料
const mockRecallData = {
  "台北市第3選舉區": {
      candidate: "蔣萬安",
      agreeVotes: 45231,
      disagreeVotes: 67892,
      totalVotes: 113123,
      threshold: 56000,
      recallSuccess: false,
      lastElectionVotes: 89456,
      turnoutRate: 0.42
  },
  "新北市第12選舉區": {
      candidate: "林金結",
      agreeVotes: 78543,
      disagreeVotes: 45621,
      totalVotes: 124164,
      threshold: 62000,
      recallSuccess: true,
      lastElectionVotes: 95234,
      turnoutRate: 0.38
  },
  "台中市第5選舉區": {
      candidate: "盧秀燕",
      agreeVotes: 34567,
      disagreeVotes: 56789,
      totalVotes: 91356,
      threshold: 48000,
      recallSuccess: false,
      lastElectionVotes: 76543,
      turnoutRate: 0.35
  },
  "高雄市第8選舉區": {
      candidate: "陳其邁",
      agreeVotes: 65432,
      disagreeVotes: 43210,
      totalVotes: 108642,
      threshold: 55000,
      recallSuccess: true,
      lastElectionVotes: 87654,
      turnoutRate: 0.41
  },
  "桃園市第6選舉區": {
      candidate: "鄭文燦",
      agreeVotes: 52341,
      disagreeVotes: 38765,
      totalVotes: 91106,
      threshold: 47000,
      recallSuccess: true,
      lastElectionVotes: 69876,
      turnoutRate: 0.39
  }
};

// 縣市與選舉區對應表
const cityToDistricts = {
  "臺北市": ["台北市第1選舉區", "台北市第2選舉區", "台北市第3選舉區", "台北市第4選舉區", "台北市第5選舉區", "台北市第6選舉區", "台北市第7選舉區", "台北市第8選舉區"],
  "新北市": ["新北市第1選舉區", "新北市第2選舉區", "新北市第3選舉區", "新北市第4選舉區", "新北市第5選舉區", "新北市第6選舉區", "新北市第7選舉區", "新北市第8選舉區", "新北市第9選舉區", "新北市第10選舉區", "新北市第11選舉區", "新北市第12選舉區"],
  "桃園市": ["桃園市第1選舉區", "桃園市第2選舉區", "桃園市第3選舉區", "桃園市第4選舉區", "桃園市第5選舉區", "桃園市第6選舉區"],
  "台中市": ["台中市第1選舉區", "台中市第2選舉區", "台中市第3選舉區", "台中市第4選舉區", "台中市第5選舉區", "台中市第6選舉區", "台中市第7選舉區", "台中市第8選舉區"],
  "台南市": ["台南市第1選舉區", "台南市第2選舉區", "台南市第3選舉區", "台南市第4選舉區", "台南市第5選舉區"],
  "高雄市": ["高雄市第1選舉區", "高雄市第2選舉區", "高雄市第3選舉區", "高雄市第4選舉區", "高雄市第5選舉區", "高雄市第6選舉區", "高雄市第7選舉區", "高雄市第8選舉區", "高雄市第9選舉區"]
};

// 台灣真實地理資料（簡化版本，實際應用會使用完整的 GeoJSON）
// 實際開發時可從以下來源獲取：
// 1. 政府開放資料平台：https://data.gov.tw/dataset/7441
// 2. 內政部國土測繪中心
// 3. OpenStreetMap 台灣資料

const taiwanGeoData = {
  "type": "FeatureCollection",
  "features": [
      {
          "type": "Feature",
          "properties": {"name": "台北市", "districts": ["台北市第1選舉區", "台北市第2選舉區", "台北市第3選舉區", "台北市第4選舉區", "台北市第5選舉區", "台北市第6選舉區", "台北市第7選舉區", "台北市第8選舉區"]},
          // 真實的台北市邊界（簡化）
          "geometry": {"type": "Polygon", "coordinates": [[[121.46, 25.18], [121.62, 25.18], [121.62, 25.20], [121.60, 25.22], [121.55, 25.25], [121.50, 25.24], [121.46, 25.20], [121.46, 25.18]]]}
      },
      {
          "type": "Feature", 
          "properties": {"name": "新北市", "districts": ["新北市第1選舉區", "新北市第2選舉區", "新北市第3選舉區", "新北市第4選舉區", "新北市第5選舉區", "新北市第6選舉區", "新北市第7選舉區", "新北市第8選舉區", "新北市第9選舉區", "新北市第10選舉區", "新北市第11選舉區", "新北市第12選舉區"]},
          // 新北市環繞台北市的複雜邊界（簡化）
          "geometry": {"type": "Polygon", "coordinates": [[[121.30, 24.80], [121.80, 24.80], [121.85, 25.30], [121.82, 25.35], [121.75, 25.40], [121.65, 25.42], [121.45, 25.40], [121.35, 25.35], [121.25, 25.20], [121.20, 25.00], [121.30, 24.80]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "桃園市", "districts": ["桃園市第1選舉區", "桃園市第2選舉區", "桃園市第3選舉區", "桃園市第4選舉區", "桃園市第5選舉區", "桃園市第6選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.00, 24.70], [121.45, 24.70], [121.50, 24.90], [121.40, 25.10], [121.30, 25.05], [121.10, 24.95], [121.00, 24.80], [121.00, 24.70]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "台中市", "districts": ["台中市第1選舉區", "台中市第2選舉區", "台中市第3選舉區", "台中市第4選舉區", "台中市第5選舉區", "台中市第6選舉區", "台中市第7選舉區", "台中市第8選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.40, 23.90], [121.00, 23.85], [121.05, 24.20], [120.95, 24.35], [120.80, 24.40], [120.60, 24.35], [120.45, 24.25], [120.35, 24.10], [120.40, 23.90]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "台南市", "districts": ["台南市第1選舉區", "台南市第2選舉區", "台南市第3選舉區", "台南市第4選舉區", "台南市第5選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.00, 22.70], [120.50, 22.65], [120.55, 23.00], [120.48, 23.25], [120.30, 23.30], [120.15, 23.20], [120.05, 22.95], [120.00, 22.70]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "高雄市", "districts": ["高雄市第1選舉區", "高雄市第2選舉區", "高雄市第3選舉區", "高雄市第4選舉區", "高雄市第5選舉區", "高雄市第6選舉區", "高雄市第7選舉區", "高雄市第8選舉區", "高雄市第9選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.15, 22.30], [120.70, 22.25], [120.75, 22.50], [120.80, 22.75], [120.70, 22.90], [120.50, 22.95], [120.30, 22.85], [120.20, 22.65], [120.15, 22.45], [120.15, 22.30]]]}
      }
  ]
};

// 實際專案中載入真實地理資料的函數
async function loadRealTaiwanMap() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/g0v/twgeojson/master/json/twCounty2010.geo.json');
    const geoData = await response.json();
    
    console.log('成功載入台灣地理資料', geoData);
    return geoData;
    } catch (error) {
      console.error('載入地理資料失敗:', error);
      return null;
  }
}

let svg, projection, path, tooltip, currentFilter = 'all';

function initMap() {
  const mapContainer = d3.select("#map");
  
  // 清除現有內容
  mapContainer.selectAll("*").remove();
  
  const width = 600;
  const height = 600;
  
  svg = mapContainer.append("svg")
      .attr("width", width)
      .attr("height", height);
  
  // 設定台灣地圖投影
  projection = d3.geoMercator()
      .center([121, 23.8])
      .scale(8000)
      .translate([width/2, height/2]);
  
  path = d3.geoPath().projection(projection);
  
  tooltip = d3.select("#tooltip");
  
  loadRealTaiwanMap().then(taiwanGeoData => {
    drawMap(taiwanGeoData);
  })
}

function drawMap(taiwanGeoData) {
  if (!taiwanGeoData || !taiwanGeoData.features) {
    console.error('地理資料格式錯誤');
    return;
  }

  // 為每個縣市添加選舉區資訊
  const featuresWithDistricts = taiwanGeoData.features.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      districts: cityToDistricts[feature.properties.name] || []
    }
  }));

  // 繪製縣市邊界
  svg.selectAll(".district")
      .data(featuresWithDistricts)
      .enter()
      .append("path")
      .attr("class", d => {
          const hasRecall = d.properties.districts.some(district => mockRecallData[district]);
          if (!hasRecall) return "district no-recall";
          
          const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
          const data = mockRecallData[recallDistrict];
          
          if (data.recallSuccess) return "district recall-success";
          return "district recall-failed";
      })
      .attr("d", path)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);
  
  applyFilter();
}

function handleMouseOver(event, d) {
  const hasRecall = d.properties.districts.some(district => mockRecallData[district]);
  
  let content = `<strong>${d.properties.name}</strong><br/>`;
  
  if (hasRecall) {
      const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
      const data = mockRecallData[recallDistrict];
      
      content += `候選人：${data.candidate}<br/>`;
      content += `同意票：${data.agreeVotes.toLocaleString()}<br/>`;
      content += `不同意票：${data.disagreeVotes.toLocaleString()}<br/>`;
      content += `投票率：${(data.turnoutRate * 100).toFixed(1)}%<br/>`;
      content += `結果：${data.recallSuccess ? '罷免成功' : '罷免失敗'}`;
  } else {
      content += '無罷免案';
  }
  
  tooltip.html(content)
      .style("display", "block");
}

function handleMouseMove(event) {
  tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
}

function handleMouseOut() {
  tooltip.style("display", "none");
}

function handleClick(event, d) {
  const hasRecall = d.properties.districts.some(district => mockRecallData[district]);
  const infoPanel = document.getElementById('selected-info');
  
  if (hasRecall) {
      const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
      const data = mockRecallData[recallDistrict];
      const voteChangePct = ((data.totalVotes - data.lastElectionVotes) / data.lastElectionVotes * 100).toFixed(1);
      
      infoPanel.innerHTML = `
          <strong>${d.properties.name} - ${recallDistrict}</strong><br/>
          <strong>候選人：</strong>${data.candidate}<br/>
          <strong>同意票：</strong>${data.agreeVotes.toLocaleString()} 票<br/>
          <strong>不同意票：</strong>${data.disagreeVotes.toLocaleString()} 票<br/>
          <strong>總投票數：</strong>${data.totalVotes.toLocaleString()} 票<br/>
          <strong>罷免門檻：</strong>${data.threshold.toLocaleString()} 票<br/>
          <strong>投票率：</strong>${(data.turnoutRate * 100).toFixed(1)}%<br/>
          <strong>與上次立委選舉票數差距：</strong>${voteChangePct > 0 ? '+' : ''}${voteChangePct}%<br/>
          <strong>罷免結果：</strong><span style="color: ${data.recallSuccess ? '#e74c3c' : '#95a5a6'};">${data.recallSuccess ? '成功' : '失敗'}</span>
      `;
  } else {
      infoPanel.innerHTML = `
          <strong>${d.properties.name}</strong><br/>
          本選區無罷免案
      `;
  }
}

function filterDistricts(filterType) {
  currentFilter = filterType;
  
  // 更新按鈕狀態
  document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  applyFilter();
}

function applyFilter() {
  svg.selectAll(".district")
      .style("opacity", d => {
          if (currentFilter === 'all') return 1;
          
          const hasRecall = d.properties.districts.some(district => mockRecallData[district]);
          
          if (currentFilter === 'recall-success') {
              if (!hasRecall) return 0.2;
              const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
              const data = mockRecallData[recallDistrict];
              return data.recallSuccess ? 1 : 0.2;
          }
          
          if (currentFilter === 'recall-failed') {
              if (!hasRecall) return 0.2;
              const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
              const data = mockRecallData[recallDistrict];
              return !data.recallSuccess ? 1 : 0.2;
          }
          
          if (currentFilter === 'high-turnout') {
              if (!hasRecall) return 0.2;
              const recallDistrict = d.properties.districts.find(district => mockRecallData[district]);
              const data = mockRecallData[recallDistrict];
              return data.turnoutRate > 0.4 ? 1 : 0.2;
          }
          
          return 1;
      });
}

function loadData() {
  // 模擬載入資料的過程
  const mapContainer = d3.select("#map");
  mapContainer.html('<div class="loading">正在載入最新資料...</div>');
  
  setTimeout(() => {
      initMap();
  }, 1500);
}

// 頁面載入時初始化地圖
window.addEventListener('load', initMap);