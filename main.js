// 資料處理器實例
let dataProcessor = null;
let realRecallData = {};
let cityToDistricts = {};

// 初始化資料處理器
async function initializeDataProcessor() {
  try {
    dataProcessor = new DataProcessor();
    await dataProcessor.loadData();
    
    // 取得處理後的資料
    realRecallData = dataProcessor.getRecallData();
    cityToDistricts = dataProcessor.getCityToDistricts();
    
    console.log('資料處理器初始化成功');
    return true;
  } catch (error) {
    console.error('資料處理器初始化失敗:', error);
    return false;
  }
}

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
          "properties": {"name": "臺北市", "districts": ["臺北市第3選舉區", "臺北市第4選舉區", "臺北市第6選舉區", "臺北市第7選舉區", "臺北市第8選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.46, 25.18], [121.62, 25.18], [121.62, 25.20], [121.60, 25.22], [121.55, 25.25], [121.50, 25.24], [121.46, 25.20], [121.46, 25.18]]]}
      },
      {
          "type": "Feature", 
          "properties": {"name": "新北市", "districts": ["新北市第1選舉區", "新北市第7選舉區", "新北市第8選舉區", "新北市第9選舉區", "新北市第12選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.30, 24.80], [121.80, 24.80], [121.85, 25.30], [121.82, 25.35], [121.75, 25.40], [121.65, 25.42], [121.45, 25.40], [121.35, 25.35], [121.25, 25.20], [121.20, 25.00], [121.30, 24.80]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "桃園市", "districts": ["桃園市第1選舉區", "桃園市第2選舉區", "桃園市第3選舉區", "桃園市第4選舉區", "桃園市第5選舉區", "桃園市第6選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.00, 24.70], [121.45, 24.70], [121.50, 24.90], [121.40, 25.10], [121.30, 25.05], [121.10, 24.95], [121.00, 24.80], [121.00, 24.70]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "臺中市", "districts": ["臺中市第4選舉區", "臺中市第5選舉區", "臺中市第6選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.40, 23.90], [121.00, 23.85], [121.05, 24.20], [120.95, 24.35], [120.80, 24.40], [120.60, 24.35], [120.45, 24.25], [120.35, 24.10], [120.40, 23.90]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "基隆市", "districts": ["基隆市選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.70, 25.10], [121.80, 25.15], [121.85, 25.20], [121.80, 25.25], [121.70, 25.20], [121.65, 25.15], [121.70, 25.10]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "新竹市", "districts": ["新竹市", "新竹市選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.90, 24.70], [121.10, 24.70], [121.15, 24.80], [121.10, 24.90], [120.95, 24.85], [120.90, 24.75], [120.90, 24.70]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "雲林縣", "districts": ["雲林縣第1選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.20, 23.50], [120.60, 23.45], [120.65, 23.70], [120.55, 23.85], [120.35, 23.80], [120.25, 23.65], [120.20, 23.50]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "臺東縣", "districts": ["臺東縣選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[120.80, 22.50], [121.20, 22.45], [121.25, 22.70], [121.15, 22.85], [120.95, 22.80], [120.85, 22.65], [120.80, 22.50]]]}
      },
      {
          "type": "Feature",
          "properties": {"name": "花蓮縣", "districts": ["花蓮縣選舉區"]},
          "geometry": {"type": "Polygon", "coordinates": [[[121.30, 23.50], [121.70, 23.45], [121.75, 23.70], [121.65, 23.85], [121.45, 23.80], [121.35, 23.65], [121.30, 23.50]]]}
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

async function initMap() {
  // 等待資料處理器初始化
  if (!dataProcessor || !dataProcessor.isDataReady()) {
    const success = await initializeDataProcessor();
    if (!success) {
      console.error('無法初始化地圖：資料載入失敗');
      return;
    }
  }
  
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

  // 縣市名稱對應表（簡體字對應繁體字，以及舊名稱對應新名稱）
  const cityNameMapping = {
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

  // 為每個縣市添加選舉區資訊
  const featuresWithDistricts = taiwanGeoData.features.map(feature => {
    const originalName = feature.properties.name;
    const mappedName = cityNameMapping[originalName] || originalName;
    
    return {
      ...feature,
      properties: {
        ...feature.properties,
        name: mappedName, // 使用對應後的繁體字名稱
        districts: cityToDistricts[mappedName] || []
      }
    };
  });

  // 繪製縣市邊界
  svg.selectAll(".district")
      .data(featuresWithDistricts)
      .enter()
      .append("path")
      .attr("class", d => {
          const hasRecall = d.properties.districts.some(district => dataProcessor.getDistrictData(district));
          if (!hasRecall) return "district no-recall";
          
          // 計算該縣市的平均同意票比例
          const avgAgreeRatio = dataProcessor.getCityAverageAgreeRatio(d.properties.name);
          
          // 根據同意票比例決定顏色深淺
          if (avgAgreeRatio > 0.45) return "district high-agree";
          if (avgAgreeRatio > 0.35) return "district medium-agree";
          return "district low-agree";
      })
      .attr("d", path)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);
  
  applyFilter();
}

function handleMouseOver(event, d) {
  // 只做視覺凸顯效果，不顯示資料
  // 資料顯示功能已移除
}

function handleMouseMove(event) {
  tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px");
}

function handleMouseOut() {
  // 移除工具提示顯示功能
}

function handleClick(event, d) {
  const hasRecall = d.properties.districts.some(district => dataProcessor.getDistrictData(district));
  
  if (hasRecall) {
    // 顯示長條圖模態框
    showBarChartModal(d.properties.name, d.properties.districts);
  } else {
    const infoPanel = document.getElementById('selected-info');
    infoPanel.innerHTML = `
        <strong>${d.properties.name}</strong><br/>
        本選區無罷免案
    `;
  }
}

function showBarChartModal(cityName, districts) {
  // 創建模態框
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${cityName} 罷免選舉結果</h2>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        <div id="bar-chart"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 關閉按鈕事件
  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };
  
  // 點擊模態框外部關閉
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
  
  // 繪製長條圖（延遲確保容器尺寸正確）
  setTimeout(() => {
    drawBarChart(districts);
  }, 100);
}

function drawBarChart(districts) {
  const chartContainer = document.getElementById('bar-chart');
  const containerWidth = chartContainer.clientWidth || 800;
  const width = Math.min(containerWidth - 40, 800);
  const height = 400;
  const margin = {top: 30, right: 120, bottom: 120, left: 80};
  
  // 清除現有內容
  chartContainer.innerHTML = '';
  
  const svg = d3.select(chartContainer)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // 準備資料
  const data = districts
    .filter(district => dataProcessor.getDistrictData(district))
    .map(district => {
      const recallData = dataProcessor.getDistrictData(district);
      return {
        district: district,
        candidate: recallData.candidate,
        agreeVotes: recallData.agreeVotes,
        disagreeVotes: recallData.disagreeVotes,
        totalVotes: recallData.totalVotes,
        agreePercentage: (recallData.agreeVotes / recallData.totalVotes * 100).toFixed(1),
        disagreePercentage: (recallData.disagreeVotes / recallData.totalVotes * 100).toFixed(1)
      };
    });
  
  if (data.length === 0) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .text('該縣市無罷免資料');
    return;
  }
  
  // 設定比例尺
  const x0 = d3.scaleBand()
    .domain(data.map(d => d.district))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  
  const x1 = d3.scaleBand()
    .domain(['同意', '不同意'])
    .range([0, x0.bandwidth()])
    .padding(0.05);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.agreeVotes, d.disagreeVotes))])
    .range([height - margin.bottom, margin.top]);
  
  // 添加座標軸
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)')
    .text(d => {
      const data = realRecallData[d];
      return data ? data.candidate : d;
    });
  
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d3.format(',.0f')));
  
  // 繪製長條圖
  const districtGroup = svg.selectAll('.district-group')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'district-group')
    .attr('transform', d => `translate(${x0(d.district)},0)`);
  
  // 同意票長條
  districtGroup.append('rect')
    .attr('x', x1('同意'))
    .attr('y', d => y(d.agreeVotes))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - margin.bottom - y(d.agreeVotes))
    .attr('fill', '#e74c3c')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .style('transition', 'opacity 0.2s ease')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .attr('opacity', 1)
        .style('filter', 'brightness(1.1)');
      showTooltip(event, `同意票: ${d.agreeVotes.toLocaleString()} (${d.agreePercentage}%)`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('opacity', 0.8)
        .style('filter', 'brightness(1)');
      hideTooltip();
    });
  
  // 不同意票長條
  districtGroup.append('rect')
    .attr('x', x1('不同意'))
    .attr('y', d => y(d.disagreeVotes))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - margin.bottom - y(d.disagreeVotes))
    .attr('fill', '#3498db')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .style('transition', 'opacity 0.2s ease')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .attr('opacity', 1)
        .style('filter', 'brightness(1.1)');
      showTooltip(event, `不同意票: ${d.disagreeVotes.toLocaleString()} (${d.disagreePercentage}%)`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('opacity', 0.8)
        .style('filter', 'brightness(1)');
      hideTooltip();
    });
  
  // 添加選區標籤
  districtGroup.append('text')
    .attr('x', x0.bandwidth() / 2)
    .attr('y', height - margin.bottom + 40)
    .attr('text-anchor', 'middle')
    .style('font-size', '10px')
    .style('fill', '#999')
    .text(d => d.district);
  
  // 添加圖例
  const legend = svg.append('g')
    .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
  
  legend.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', '#e74c3c');
  
  legend.append('text')
    .attr('x', 30)
    .attr('y', 15)
    .text('同意票');
  
  legend.append('rect')
    .attr('y', 30)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', '#3498db');
  
  legend.append('text')
    .attr('x', 30)
    .attr('y', 45)
    .text('不同意票');
}

function showTooltip(event, text) {
  // 先移除現有的工具提示
  hideTooltip();
  
  const tooltip = d3.select('body').append('div')
    .attr('class', 'chart-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.9)')
    .style('color', 'white')
    .style('padding', '10px 12px')
    .style('border-radius', '6px')
    .style('font-size', '13px')
    .style('font-weight', 'bold')
    .style('pointer-events', 'none')
    .style('z-index', 10001)
    .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
    .style('white-space', 'nowrap')
    .text(text);
  
  tooltip.style('left', (event.pageX + 15) + 'px')
    .style('top', (event.pageY - 15) + 'px');
}

function hideTooltip() {
  d3.selectAll('.chart-tooltip').remove();
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
          
          const hasRecall = d.properties.districts.some(district => dataProcessor.getDistrictData(district));
          
          if (currentFilter === 'high-agree') {
              if (!hasRecall) return 0.2;
              return dataProcessor.getCityAverageAgreeRatio(d.properties.name) > 0.45 ? 1 : 0.2;
          }
          
          if (currentFilter === 'medium-agree') {
              if (!hasRecall) return 0.2;
              const avgRatio = dataProcessor.getCityAverageAgreeRatio(d.properties.name);
              return avgRatio > 0.35 && avgRatio <= 0.45 ? 1 : 0.2;
          }
          
          if (currentFilter === 'high-turnout') {
              if (!hasRecall) return 0.2;
              const cityData = dataProcessor.getCityRecallData(d.properties.name);
              if (cityData.length === 0) return 0.2;
              const avgTurnout = cityData.reduce((sum, data) => sum + data.turnoutRate, 0) / cityData.length;
              return avgTurnout > 0.4 ? 1 : 0.2;
          }
          
          return 1;
      });
}

async function loadData() {
  // 顯示載入狀態
  const mapContainer = d3.select("#map");
  mapContainer.html('<div class="loading">正在載入最新資料...</div>');
  
  try {
    // 重新載入資料
    await dataProcessor.reloadData();
    
    // 更新全域變數
    realRecallData = dataProcessor.getRecallData();
    cityToDistricts = dataProcessor.getCityToDistricts();
    
    // 重新初始化地圖
    await initMap();
  } catch (error) {
    console.error('重新載入資料失敗:', error);
    mapContainer.html('<div class="loading">載入失敗，請重試</div>');
  }
}

// 頁面載入時初始化地圖
window.addEventListener('load', async () => {
  try {
    await initMap();
  } catch (error) {
    console.error('地圖初始化失敗:', error);
  }
});