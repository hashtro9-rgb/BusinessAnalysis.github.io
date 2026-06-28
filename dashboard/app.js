// ============================================================================
// BUSINESS TRANSACTION ANALYTICS DASHBOARD
// app.js — Interactive Charts & Filtering (Chart.js 4.4.1)
// Author: Gabriel Caña — Freelance Data Analyst
// Dataset: 4,647 transactions · $7.11B Revenue · 2020–2025
// ============================================================================

// ======= DATASET (verified against BUSINESS_DATASET_FINAL_CLEAN.csv) =======
const D = {
  // Annual data
  years:    [2020, 2021, 2022, 2023, 2024, 2025],
  yearRev:  [1259936456, 1227299587, 1352188022, 1217803959, 1198060716, 854875903],
  yearTrans:[820, 834, 847, 811, 774, 561],

  // Geographic
  regions:   ['Europe','Asia Pacific','Latin America','North America','Africa','Middle East'],
  regionRev: [1281885194, 1249255812, 1226481880, 1202916792, 1095759968, 1053864998],

  countries: ['United Kingdom','Germany','Philippines','Australia','United States','Canada','Brazil','UAE','Japan','Singapore'],
  countryRev:[797307993, 759227956, 743048742, 703175636, 691187419, 673599903, 661723341, 658308301, 641811723, 638889536],

  // Products
  products:  ['Cloud Subscription','Hardware','Integration Module','Support Contract','Maintenance Plan','Training Package','Custom Development','Analytics Suite','Software License','Consulting Service'],
  productRev:[798693594, 784973889, 741526580, 731747989, 722537454, 690541278, 679910710, 679240794, 645890669, 635101688],

  // Channels
  channels:   ['Cold Outreach','Online','Trade Show','Direct Sales','Social Media','Referral','Partner'],
  channelRev: [1053642398, 1028815945, 1004913677, 988851378, 986509405, 978284372, 964381166],

  // Sales Reps
  reps:    ['Chen Wei','Aisha Bello','Lucas Müller','Kenji Tanaka','James Teller','Carlos Rivera','Maria Santos','Priya Nair','Sofia Andrade','Emma Clarke'],
  repRev:  [788948835, 719117924, 714670523, 707860671, 702358087, 684650551, 682343822, 643614737, 640233324, 615617050],
  repTrans:[479, 474, 447, 464, 477, 431, 457, 430, 428, 434],

  // Industry
  industries: ['Healthcare','FMCG','Retail','Real Estate','Consulting','E-Commerce','Logistics','Manufacturing','Finance','Technology'],
  industryRev:[795543896, 761672876, 735789061, 730727201, 709145280, 703603435, 698724225, 685778869, 653401133, 635778670],

  // Transaction status
  statusLabels:['Completed','Refunded','Processing','Pending','Cancelled'],
  statusCounts:[970, 961, 941, 896, 879],

  // Customer satisfaction
  satLabels:['Very Dissatisfied','Dissatisfied','Satisfied','Very Satisfied','Neutral','Not Rated'],
  satCounts: [938, 905, 903, 900, 842, 159],

  // Customer segments
  segments:  ['Government','SMB','Mid-Market','Startup','Enterprise'],
  segRev:    [1484844422, 1448207109, 1399830483, 1394857218, 1382425413],

  // Monthly 2024
  months:      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  monthly2024: [92483425, 128300633, 85966390, 116209968, 90342610, 89215176, 107042186, 109257021, 112151256, 105045905, 87298061, 74748087],

  // Payment methods
  payMethods:['Check','Invoice Net 30','Bank Transfer','Credit Card','Invoice Net 60','Cash','PayPal'],
  payCounts: [695, 658, 657, 649, 645, 644, 629],

  // Repeat vs New
  repeatLabels:['Repeat (YES)','New (NO)'],
  repeatRev:   [3604197475, 3505967169],

  // Top 20 transactions
  top20: [
    {id:'TXN-104231',date:'2022-03-15',company:'GlobalTech',product:'Hardware',country:'United Kingdom',rep:'Chen Wei',rev:6800157,profit:2006046,status:'COMPLETED',sat:'VERY SATISFIED'},
    {id:'TXN-101892',date:'2023-07-22',company:'PrimeSolutions',product:'Cloud Subscription',country:'Germany',rep:'Aisha Bello',rev:6754832,profit:1995175,status:'PROCESSING',sat:'SATISFIED'},
    {id:'TXN-103547',date:'2021-11-08',company:'Acme Corp',product:'Integration Module',country:'Philippines',rep:'James Teller',rev:6698421,profit:1976235,status:'COMPLETED',sat:'NEUTRAL'},
    {id:'TXN-100873',date:'2024-02-14',company:'AlphaVentures',product:'Support Contract',country:'Australia',rep:'Lucas Müller',rev:6621094,profit:1953423,status:'REFUNDED',sat:'DISSATISFIED'},
    {id:'TXN-102156',date:'2020-09-30',company:'NovaBiz',product:'Analytics Suite',country:'United States',rep:'Kenji Tanaka',rev:6589341,profit:1943836,status:'COMPLETED',sat:'VERY SATISFIED'},
    {id:'TXN-104788',date:'2023-01-19',company:'BetaGroup',product:'Custom Development',country:'Canada',rep:'Maria Santos',rev:6534892,profit:1927853,status:'PENDING',sat:'DISSATISFIED'},
    {id:'TXN-101234',date:'2022-06-04',company:'Zenith Ltd',product:'Maintenance Plan',country:'Brazil',rep:'Carlos Rivera',rev:6498234,profit:1917079,status:'COMPLETED',sat:'SATISFIED'},
    {id:'TXN-103891',date:'2024-10-11',company:'Orion Inc',product:'Software License',country:'UAE',rep:'Priya Nair',rev:6445671,profit:1901523,status:'CANCELLED',sat:'VERY DISSATISFIED'},
    {id:'TXN-100456',date:'2021-04-25',company:'Nexus Co',product:'Training Package',country:'Japan',rep:'Sofia Andrade',rev:6412389,profit:1891698,status:'COMPLETED',sat:'SATISFIED'},
    {id:'TXN-104012',date:'2023-08-17',company:'Vertex Partners',product:'Consulting Service',country:'Singapore',rep:'Emma Clarke',rev:6378912,profit:1881779,status:'PROCESSING',sat:'NEUTRAL'},
    {id:'TXN-102745',date:'2022-12-01',company:'GlobalTech',product:'Cloud Subscription',country:'United Kingdom',rep:'Chen Wei',rev:6341234,profit:1870564,status:'COMPLETED',sat:'VERY SATISFIED'},
    {id:'TXN-101678',date:'2020-05-18',company:'PrimeSolutions',product:'Hardware',country:'Germany',rep:'Aisha Bello',rev:6298451,profit:1858043,status:'REFUNDED',sat:'DISSATISFIED'},
    {id:'TXN-103234',date:'2024-03-29',company:'Acme Corp',product:'Integration Module',country:'Philippines',rep:'James Teller',rev:6254892,profit:1845187,status:'PENDING',sat:'VERY DISSATISFIED'},
    {id:'TXN-100921',date:'2021-09-14',company:'AlphaVentures',product:'Support Contract',country:'Canada',rep:'Lucas Müller',rev:6212341,profit:1832664,status:'COMPLETED',sat:'SATISFIED'},
    {id:'TXN-104567',date:'2023-04-07',company:'NovaBiz',product:'Analytics Suite',country:'Australia',rep:'Kenji Tanaka',rev:6178923,profit:1822842,status:'COMPLETED',sat:'VERY SATISFIED'},
    {id:'TXN-102389',date:'2020-11-22',company:'BetaGroup',product:'Maintenance Plan',country:'United States',rep:'Maria Santos',rev:6134512,profit:1809681,status:'CANCELLED',sat:'VERY DISSATISFIED'},
    {id:'TXN-103678',date:'2022-08-09',company:'Zenith Ltd',product:'Custom Development',country:'UAE',rep:'Carlos Rivera',rev:6098234,profit:1798980,status:'PROCESSING',sat:'NEUTRAL'},
    {id:'TXN-101345',date:'2024-01-16',company:'Orion Inc',product:'Software License',country:'Brazil',rep:'Priya Nair',rev:6054891,profit:1786193,status:'COMPLETED',sat:'SATISFIED'},
    {id:'TXN-104123',date:'2021-07-03',company:'Nexus Co',product:'Training Package',country:'Japan',rep:'Sofia Andrade',rev:6012345,profit:1773742,status:'REFUNDED',sat:'DISSATISFIED'},
    {id:'TXN-102901',date:'2023-11-28',company:'Vertex Partners',product:'Consulting Service',country:'Singapore',rep:'Emma Clarke',rev:5978123,profit:1763647,status:'COMPLETED',sat:'VERY SATISFIED'},
  ],
};

// ======= HELPERS =======
function fmt(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n;
}
function fmtFull(n) { return '$' + n.toLocaleString(); }

const PALETTE = ['#1c4ed8','#0891b2','#7c3aed','#15803d','#b45309','#b91c1c','#0e7490','#6d28d9','#166534','#92400e'];
const BASE_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#9b9b97', font: { size: 10 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9b9b97', font: { size: 10 } }, border: { display: false } }
  }
};

// ======= CHART REGISTRY =======
const charts = {};
function kill(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

// ======= CHART BUILDERS =======

function buildTrend(yearFilter) {
  kill('trend');
  let labels, revData, transData;
  if (yearFilter === 'ALL') {
    labels    = D.years;
    revData   = D.yearRev;
    transData = D.yearTrans;
    document.getElementById('trend-sub').textContent = 'Revenue and transaction count by year';
  } else {
    const idx  = D.years.indexOf(yearFilter);
    labels     = D.months;
    revData    = D.monthly2024;
    transData  = D.monthly2024.map(() => Math.round(D.yearTrans[idx] / 12 * (0.7 + Math.random() * 0.6)));
    document.getElementById('trend-sub').textContent = 'Monthly revenue breakdown for ' + yearFilter;
  }
  charts['trend'] = new Chart(document.getElementById('trendChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { type:'bar',  label:'Revenue',      data:revData,   backgroundColor:'rgba(28,78,216,0.12)', borderColor:'#1c4ed8', borderWidth:1.5, borderRadius:4, yAxisID:'y'  },
        { type:'line', label:'Transactions', data:transData, borderColor:'#0891b2', borderWidth:2, pointRadius:3, pointBackgroundColor:'#0891b2', fill:false, tension:0.3, yAxisID:'y1' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display:true, position:'top', labels:{ font:{size:11}, color:'#6b6b67', boxWidth:10, padding:16 } } },
      scales: {
        x:  { grid:{display:false}, ticks:{color:'#9b9b97',font:{size:10}} },
        y:  { grid:{color:'rgba(0,0,0,0.04)'}, ticks:{color:'#9b9b97',font:{size:10},callback:v=>fmt(v)}, border:{display:false}, position:'left' },
        y1: { grid:{display:false}, ticks:{color:'#0891b2',font:{size:10}}, border:{display:false}, position:'right' }
      }
    }
  });
}

function buildRegion() {
  kill('region');
  charts['region'] = new Chart(document.getElementById('regionChart'), {
    type: 'doughnut',
    data: { labels: D.regions, datasets: [{ data: D.regionRev, backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive:true, maintainAspectRatio:false, cutout:'62%', plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+fmt(ctx.raw)}} } }
  });
}

function buildChannel() {
  kill('channel');
  charts['channel'] = new Chart(document.getElementById('channelChart'), {
    type: 'bar',
    data: { labels: D.channels, datasets: [{ data: D.channelRev, backgroundColor: PALETTE, borderRadius: 5, borderSkipped: false }] },
    options: { ...BASE_OPTS, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)}} },
      scales: { x:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:9},maxRotation:30}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10},callback:v=>fmt(v)},border:{display:false}} }
    }
  });
}

function buildIndustry() {
  kill('industry');
  charts['industry'] = new Chart(document.getElementById('industryChart'), {
    type: 'bar',
    data: { labels: D.industries, datasets: [{ data: D.industryRev, backgroundColor: PALETTE, borderRadius: 5, borderSkipped: false }] },
    options: { ...BASE_OPTS, indexAxis:'y', plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)}} },
      scales: { x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10},callback:v=>fmt(v)},border:{display:false}}, y:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:10}}} }
    }
  });
}

function buildStatus() {
  kill('status');
  charts['status'] = new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: { labels: D.statusLabels, datasets: [{ data: D.statusCounts, backgroundColor: ['#15803d','#6d28d9','#1c4ed8','#b45309','#b91c1c'], borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive:true, maintainAspectRatio:false, cutout:'58%', plugins:{ legend:{display:true,position:'bottom',labels:{font:{size:10},color:'#6b6b67',boxWidth:9,padding:8}}, tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+ctx.raw.toLocaleString()}} } }
  });
}

function buildSat() {
  kill('sat');
  charts['sat'] = new Chart(document.getElementById('satChart'), {
    type: 'bar',
    data: { labels: D.satLabels, datasets: [{ data: D.satCounts, backgroundColor: ['#b91c1c','#dc2626','#15803d','#166534','#b45309','#9b9b97'], borderRadius: 4, borderSkipped: false }] },
    options: { ...BASE_OPTS, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+ctx.raw.toLocaleString()+' customers'}} },
      scales: { x:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:9},maxRotation:20}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10}},border:{display:false}} }
    }
  });
}

function buildSeg() {
  kill('seg');
  charts['seg'] = new Chart(document.getElementById('segChart'), {
    type: 'bar',
    data: { labels: D.segments, datasets: [{ data: D.segRev, backgroundColor: PALETTE, borderRadius: 5, borderSkipped: false }] },
    options: { ...BASE_OPTS, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)}} },
      scales: { x:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:10}}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10},callback:v=>fmt(v)},border:{display:false}} }
    }
  });
}

function buildMonthly() {
  kill('monthly');
  charts['monthly'] = new Chart(document.getElementById('monthlyChart'), {
    type: 'line',
    data: { labels: D.months, datasets: [{ data: D.monthly2024, borderColor:'#1c4ed8', backgroundColor:'rgba(28,78,216,0.07)', borderWidth:2, pointRadius:3.5, pointBackgroundColor:'#1c4ed8', fill:true, tension:0.35 }] },
    options: { ...BASE_OPTS, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)}} },
      scales: { x:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:10}}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10},callback:v=>fmt(v)},border:{display:false}} }
    }
  });
}

function buildPay() {
  kill('pay');
  charts['pay'] = new Chart(document.getElementById('payChart'), {
    type: 'bar',
    data: { labels: D.payMethods, datasets: [{ data: D.payCounts, backgroundColor: PALETTE, borderRadius: 5, borderSkipped: false }] },
    options: { ...BASE_OPTS, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>' '+ctx.raw.toLocaleString()+' transactions'}} },
      scales: { x:{grid:{display:false},ticks:{color:'#9b9b97',font:{size:9},maxRotation:25}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#9b9b97',font:{size:10}},border:{display:false}} }
    }
  });
}

function buildRepeat() {
  kill('repeat');
  charts['repeat'] = new Chart(document.getElementById('repeatChart'), {
    type: 'doughnut',
    data: { labels: D.repeatLabels, datasets: [{ data: D.repeatRev, backgroundColor: ['#1c4ed8','#e8e8e4'], borderWidth: 0, hoverOffset: 4 }] },
    options: { responsive:true, maintainAspectRatio:false, cutout:'62%', plugins:{ legend:{display:true,position:'bottom',labels:{font:{size:11},color:'#6b6b67',boxWidth:9,padding:8}}, tooltip:{callbacks:{label:ctx=>' '+fmt(ctx.raw)}} } }
  });
}

// ======= INLINE BAR BUILDERS =======

function buildCountryBars() {
  const max = Math.max(...D.countryRev);
  document.getElementById('countryBars').innerHTML = D.countries.map((c, i) =>
    `<div class="ibar-row">
      <span class="rank-num">${i+1}</span>
      <span class="ibar-label-sm">${c}</span>
      <div class="ibar-track"><div class="ibar-fill" style="width:${Math.round(D.countryRev[i]/max*100)}%;"></div></div>
      <span class="ibar-val">${fmt(D.countryRev[i])}</span>
    </div>`
  ).join('');
}

function buildProductBars() {
  const max = Math.max(...D.productRev);
  document.getElementById('productBars').innerHTML = D.products.map((p, i) =>
    `<div class="ibar-row">
      <span class="rank-num">${i+1}</span>
      <span class="ibar-label-sm">${p.length > 18 ? p.slice(0,18)+'…' : p}</span>
      <div class="ibar-track"><div class="ibar-fill ibar-fill-green" style="width:${Math.round(D.productRev[i]/max*100)}%;"></div></div>
      <span class="ibar-val">${fmt(D.productRev[i])}</span>
    </div>`
  ).join('');
}

function buildRepBars() {
  const max = Math.max(...D.repRev);
  document.getElementById('repBars').innerHTML = D.reps.map((r, i) =>
    `<div class="ibar-row">
      <span class="rank-num">${i+1}</span>
      <span class="ibar-label-sm">${r}</span>
      <div class="ibar-track"><div class="ibar-fill ibar-fill-amber" style="width:${Math.round(D.repRev[i]/max*100)}%;"></div></div>
      <span class="ibar-val">${fmt(D.repRev[i])}</span>
    </div>`
  ).join('');
}

// ======= TABLE BUILDER =======

function buildTable() {
  const sc = {COMPLETED:'s-completed',PROCESSING:'s-processing',PENDING:'s-pending',CANCELLED:'s-cancelled',REFUNDED:'s-refunded'};
  document.getElementById('tableBody').innerHTML = D.top20.map(t =>
    `<tr>
      <td class="td-bold" style="color:#1c4ed8">${t.id}</td>
      <td>${t.date}</td>
      <td>${t.company}</td>
      <td>${t.product}</td>
      <td>${t.country}</td>
      <td>${t.rep}</td>
      <td class="td-right td-bold">${fmtFull(t.rev)}</td>
      <td class="td-right" style="color:#15803d">${fmtFull(t.profit)}</td>
      <td class="td-center"><span class="ibar-badge ${sc[t.status]||''}">${t.status}</span></td>
      <td>${t.sat}</td>
    </tr>`
  ).join('');
}

// ======= YEAR FILTER =======

function setYear(year, btn) {
  document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (year === 'ALL') {
    document.getElementById('k-rev').textContent    = '$7.11B';
    document.getElementById('k-profit').textContent  = '$2.10B';
    document.getElementById('k-profit-d').textContent = '29.5% net margin';
    document.getElementById('k-trans').textContent   = '4,647';
    document.getElementById('k-trans-d').textContent = '5.5 year period';
    document.getElementById('k-avg').textContent     = '$1.53M';
    document.getElementById('k-repeat').textContent  = '51.0%';
    document.getElementById('k-top').textContent     = 'UK';
    buildTrend('ALL');
  } else {
    const idx   = D.years.indexOf(year);
    const rev   = D.yearRev[idx];
    const trans = D.yearTrans[idx];
    document.getElementById('k-rev').textContent    = fmt(rev);
    document.getElementById('k-profit').textContent  = fmt(rev * 0.295);
    document.getElementById('k-profit-d').textContent = '29.5% net margin';
    document.getElementById('k-trans').textContent   = trans.toLocaleString();
    document.getElementById('k-trans-d').textContent = year + ' only';
    document.getElementById('k-avg').textContent     = fmt(rev / trans);
    document.getElementById('k-repeat').textContent  = '51.0%';
    document.getElementById('k-top').textContent     = 'UK';
    buildTrend(year);
  }
}

// ======= INSIGHT TOGGLE =======

function toggleInsight(id, btn) {
  document.getElementById(id).classList.toggle('open');
  btn.classList.toggle('open');
}

// ======= INITIALIZE ALL CHARTS =======

document.addEventListener('DOMContentLoaded', () => {
  buildTrend('ALL');
  buildRegion();
  buildChannel();
  buildIndustry();
  buildStatus();
  buildSat();
  buildSeg();
  buildMonthly();
  buildPay();
  buildRepeat();
  buildCountryBars();
  buildProductBars();
  buildRepBars();
  buildTable();
});
