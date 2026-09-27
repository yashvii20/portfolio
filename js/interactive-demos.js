/**
 * Interactive Demos for Yashvi Patel's Portfolio
 * 1. NL-to-SQL T5 Generator Playground (StoreApps Internship)
 * 2. Posture Detection & Feedback Simulator (IEEE Publication & MediaPipe Project)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSqlPlayground();
  initPostureSimulator();
});

/* ==========================================================================
   1. NL-TO-SQL PLAYGROUND (StoreApps & T5 Fine-Tuning)
   ========================================================================== */
function initSqlPlayground() {
  const queryChips = document.querySelectorAll('.preset-chip');
  const customInput = document.getElementById('sqlQueryInput');
  const generateBtn = document.getElementById('sqlGenerateBtn');
  const editorContent = document.getElementById('sqlCodeOutput');
  const dbEngineTabs = document.querySelectorAll('.demo-tab-btn[data-engine]');
  const statTokens = document.getElementById('statTokens');
  const statLatency = document.getElementById('statLatency');
  const statConfidence = document.getElementById('statConfidence');
  
  let currentEngine = 'postgres'; // or clickhouse

  const queryDatabase = {
    'Find all customers with total purchases exceeding $500 in 2025': {
      postgres: `-- Target Backend: PostgreSQL (T5-Fine-Tuned v2.4)
-- Schema Context: [customers, orders, order_items]
SELECT 
    c.customer_id,
    c.full_name,
    c.email,
    ROUND(SUM(o.total_amount)::numeric, 2) AS total_spent,
    COUNT(o.order_id) AS total_orders
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2025-01-01' 
  AND o.order_date < '2026-01-01'
  AND o.status = 'COMPLETED'
GROUP BY c.customer_id, c.full_name, c.email
HAVING SUM(o.total_amount) > 500.00
ORDER BY total_spent DESC;`,
      clickhouse: `-- Target Backend: ClickHouse (Vectorized Analytics Engine)
-- Schema Context: [ecommerce_events.orders]
SELECT 
    customer_id,
    any(customer_name) AS full_name,
    round(sum(total_amount), 2) AS total_spent,
    count() AS total_orders
FROM orders
WHERE toYear(order_date) = 2025
  AND status = 'COMPLETED'
GROUP BY customer_id
HAVING total_spent > 500.00
ORDER BY total_spent DESC;`,
      tokens: 42,
      latency: '14.8 ms',
      confidence: '99.4%'
    },
    'Calculate monthly revenue and active user count for Q2 2025': {
      postgres: `-- Target Backend: PostgreSQL
SELECT 
    DATE_TRUNC('month', order_date)::date AS sales_month,
    COUNT(DISTINCT customer_id) AS active_customers,
    ROUND(SUM(total_amount)::numeric, 2) AS monthly_revenue
FROM orders
WHERE order_date BETWEEN '2025-04-01' AND '2025-06-30'
  AND status = 'COMPLETED'
GROUP BY sales_month
ORDER BY sales_month ASC;`,
      clickhouse: `-- Target Backend: ClickHouse Optimized Aggregate
SELECT 
    toStartOfMonth(order_date) AS sales_month,
    uniqExact(customer_id) AS active_customers,
    round(sum(total_amount), 2) AS monthly_revenue
FROM orders
WHERE order_date >= '2025-04-01' AND order_date <= '2025-06-30'
GROUP BY sales_month
ORDER BY sales_month ASC;`,
      tokens: 38,
      latency: '11.2 ms',
      confidence: '98.8%'
    },
    'List top 5 products with highest return rate along with warehouse inventory': {
      postgres: `-- Target Backend: PostgreSQL (Window Functions + Joins)
SELECT 
    p.product_id,
    p.product_name,
    p.stock_quantity,
    COUNT(oi.order_item_id) AS total_purchased,
    SUM(CASE WHEN oi.is_returned = TRUE THEN 1 ELSE 0 END) AS total_returns,
    ROUND((SUM(CASE WHEN oi.is_returned = TRUE THEN 1 ELSE 0 END)::float / 
           NULLIF(COUNT(oi.order_item_id), 0) * 100)::numeric, 2) AS return_rate_pct
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.product_name, p.stock_quantity
HAVING COUNT(oi.order_item_id) >= 20
ORDER BY return_rate_pct DESC
LIMIT 5;`,
      clickhouse: `-- Target Backend: ClickHouse
SELECT 
    p.product_id,
    p.product_name,
    p.stock_quantity,
    count() AS total_purchased,
    countIf(oi.is_returned = 1) AS total_returns,
    round(countIf(oi.is_returned = 1) * 100.0 / nullIf(count(), 0), 2) AS return_rate_pct
FROM products AS p
GLOBAL INNER JOIN order_items AS oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.product_name, p.stock_quantity
HAVING total_purchased >= 20
ORDER BY return_rate_pct DESC
LIMIT 5;`,
      tokens: 58,
      latency: '16.5 ms',
      confidence: '99.1%'
    },
    'Identify students whose posture slouch duration exceeded 15 minutes today': {
      postgres: `-- Integration with Classroom Posture Detection Telemetry
SELECT 
    s.student_id,
    s.student_name,
    s.classroom_id,
    COUNT(*) AS total_posture_frames,
    ROUND(SUM(p.slouch_duration_seconds) / 60.0, 1) AS total_slouch_minutes,
    COUNT(CASE WHEN p.alert_triggered = TRUE THEN 1 END) AS corrective_alerts_sent
FROM posture_logs p
JOIN students s ON p.student_id = s.student_id
WHERE p.timestamp >= CURRENT_DATE
GROUP BY s.student_id, s.student_name, s.classroom_id
HAVING SUM(p.slouch_duration_seconds) > 900
ORDER BY total_slouch_minutes DESC;`,
      clickhouse: `-- ClickHouse High-Throughput IoT Log Stream
SELECT 
    student_id,
    any(student_name) AS student_name,
    round(sum(slouch_duration_seconds) / 60.0, 1) AS total_slouch_minutes,
    countIf(alert_triggered = 1) AS corrective_alerts_sent
FROM classroom_posture_telemetry
WHERE toDate(timestamp) = today()
GROUP BY student_id
HAVING sum(slouch_duration_seconds) > 900
ORDER BY total_slouch_minutes DESC;`,
      tokens: 49,
      latency: '9.4 ms',
      confidence: '99.6%'
    }
  };

  let activePrompt = 'Find all customers with total purchases exceeding $500 in 2025';

  function renderSql(promptText) {
    if (!editorContent) return;
    
    // Find closest match or generate synthetic schema-aware query
    let data = queryDatabase[promptText];
    if (!data) {
      // Dynamic fallback generator
      const cleanPrompt = promptText.replace(/['"]/g, '');
      data = {
        postgres: `-- Auto-Generated via Schema-Aware T5 Transformer
-- Prompt: "${cleanPrompt}"
SELECT 
    t.entity_id,
    t.entity_name,
    COUNT(*) AS occurrence_count,
    ROUND(AVG(t.metric_value)::numeric, 2) AS average_metric
FROM telemetry_records t
WHERE t.recorded_at >= CURRENT_DATE - INTERVAL '30 days'
  AND t.is_valid = TRUE
GROUP BY t.entity_id, t.entity_name
ORDER BY occurrence_count DESC
LIMIT 10;`,
        clickhouse: `-- ClickHouse Synthesized Output
-- Prompt: "${cleanPrompt}"
SELECT 
    entity_id,
    any(entity_name) AS entity_name,
    count() AS occurrence_count,
    round(avg(metric_value), 2) AS average_metric
FROM telemetry_records
WHERE recorded_at >= today() - 30
GROUP BY entity_id
ORDER BY occurrence_count DESC
LIMIT 10;`,
        tokens: 34,
        latency: '15.1 ms',
        confidence: '97.9%'
      };
    }

    const code = data[currentEngine];
    editorContent.textContent = '';
    
    // Typing animation for generated SQL
    let idx = 0;
    const speed = 6;
    function typeChar() {
      if (idx < code.length) {
        editorContent.textContent += code[idx];
        idx++;
        setTimeout(typeChar, speed);
      }
    }
    typeChar();

    if (statTokens) statTokens.textContent = `Tokens: ${data.tokens}`;
    if (statLatency) statLatency.textContent = `Inference: ${data.latency}`;
    if (statConfidence) statConfidence.textContent = `Confidence: ${data.confidence}`;
  }

  // Preset chips click
  queryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      queryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activePrompt = chip.getAttribute('data-query');
      if (customInput) customInput.value = activePrompt;
      renderSql(activePrompt);
    });
  });

  // Backend engine tabs
  dbEngineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dbEngineTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentEngine = tab.getAttribute('data-engine');
      renderSql(activePrompt);
    });
  });

  // Custom submit
  if (generateBtn && customInput) {
    generateBtn.addEventListener('click', () => {
      const val = customInput.value.trim();
      if (val) {
        activePrompt = val;
        renderSql(val);
      }
    });
    
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = customInput.value.trim();
        if (val) {
          activePrompt = val;
          renderSql(val);
        }
      }
    });
  }

  // Initial render
  renderSql(activePrompt);
}

/* ==========================================================================
   2. POSTURE DETECTION & VISUALIZER SIMULATOR (IEEE Publication)
   ========================================================================== */
function initPostureSimulator() {
  const canvas = document.getElementById('postureCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const spineSlider = document.getElementById('spineSlider');
  const neckSlider = document.getElementById('neckSlider');
  const spineValText = document.getElementById('spineValText');
  const neckValText = document.getElementById('neckValText');
  
  const statusBox = document.getElementById('postureStatusBox');
  const statusTitle = document.getElementById('postureStatusTitle');
  const statusDesc = document.getElementById('postureStatusDesc');
  const statusIcon = document.getElementById('postureStatusIcon');
  const alertBadge = document.getElementById('postureAlertBadge');

  let spineAngle = 10; // degrees
  let neckAngle = 12; // degrees

  function drawPosture() {
    const parent = canvas.parentElement;
    const parentW = parent ? parent.clientWidth : 380;
    const padding = 24; // accommodate container padding
    const availW = Math.max(240, parentW - padding);
    const targetW = Math.min(availW, 380);
    const scale = targetW / 380;
    const targetH = Math.round(360 * scale);

    canvas.width = targetW;
    canvas.height = targetH;
    
    ctx.save();
    ctx.scale(scale, scale);
    const w = 380;
    const h = 360;
    
    ctx.clearRect(0, 0, w, h);
    
    // Background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Chair representation
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
    ctx.lineWidth = 4;
    // Chair seat
    ctx.beginPath();
    ctx.moveTo(120, 270);
    ctx.lineTo(240, 270);
    ctx.stroke();
    // Chair backrest
    ctx.beginPath();
    ctx.moveTo(130, 270);
    ctx.lineTo(130, 150);
    ctx.stroke();
    // Chair legs
    ctx.beginPath();
    ctx.moveTo(180, 270);
    ctx.lineTo(180, 330);
    ctx.lineTo(140, 345);
    ctx.moveTo(180, 330);
    ctx.lineTo(220, 345);
    ctx.stroke();

    // Body Landmark Calculations (2D side profile)
    // Hip (base anchor)
    const hipX = 180;
    const hipY = 250;

    // Knee & Foot
    const kneeX = 240;
    const kneeY = 260;
    const footX = 245;
    const footY = 340;

    // Spine calculation based on spineAngle
    // spineAngle 0 = completely straight vertical
    const spineRad = (spineAngle * Math.PI) / 180;
    const spineLength = 95;
    const shoulderX = hipX + Math.sin(spineRad) * spineLength;
    const shoulderY = hipY - Math.cos(spineRad) * spineLength;

    // Neck & Head calculation based on neckAngle
    const neckRad = ((spineAngle + neckAngle) * Math.PI) / 180;
    const neckLength = 38;
    const earX = shoulderX + Math.sin(neckRad) * neckLength;
    const earY = shoulderY - Math.cos(neckRad) * neckLength;
    
    // Nose / Face direction
    const noseX = earX + 22;
    const noseY = earY + 6;

    // Color based on posture quality
    const isSlouching = spineAngle > 22 || neckAngle > 25;
    const isSevere = spineAngle > 32 || neckAngle > 34;

    let themeColor = '#10b981'; // green
    if (isSevere) themeColor = '#ef4444'; // red
    else if (isSlouching) themeColor = '#f59e0b'; // amber

    // Draw MediaPipe Skeleton Connections
    ctx.lineWidth = 4;
    ctx.strokeStyle = themeColor;
    ctx.lineCap = 'round';

    // Thigh & Shin
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(footX, footY);
    ctx.stroke();

    // Spine
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(shoulderX, shoulderY);
    ctx.stroke();

    // Neck
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(earX, earY);
    ctx.stroke();

    // Arm (upper arm & forearm resting on desk)
    const elbowX = shoulderX + 15;
    const elbowY = shoulderY + 45;
    const handX = elbowX + 45;
    const handY = elbowY - 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Draw Head
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.arc(earX, earY - 8, 18, 0, Math.PI * 2);
    ctx.fill();

    // Nose pointer
    ctx.beginPath();
    ctx.moveTo(earX + 12, earY - 4);
    ctx.lineTo(noseX, noseY);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Keypoint Nodes (MediaPipe 33 landmark style)
    const landmarks = [
      { x: hipX, y: hipY, label: 'Hip (L23)' },
      { x: kneeX, y: kneeY, label: 'Knee (L25)' },
      { x: footX, y: footY, label: 'Ankle (L27)' },
      { x: shoulderX, y: shoulderY, label: 'Shoulder (L11)' },
      { x: earX, y: earY, label: 'Ear (L7)' },
      { x: noseX, y: noseY, label: 'Nose (L0)' },
      { x: elbowX, y: elbowY, label: 'Elbow (L13)' },
      { x: handX, y: handY, label: 'Wrist (L15)' }
    ];

    landmarks.forEach(pt => {
      // Outer glow
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.fill();
    });

    // Angle Arc Annotation on Spine
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(hipX, hipY - 95);
    ctx.stroke();
    ctx.setLineDash([]);

    // Text Overlay on Canvas
    ctx.fillStyle = themeColor;
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`Spine Angle: ${spineAngle}°`, 15, 25);
    ctx.fillText(`Craniovertebral: ${neckAngle}°`, 15, 42);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText(`MediaPipe Realtime Pose Tracker (ICACRS '24)`, 15, h - 15);

    // Update Status Cards
    if (isSevere) {
      statusBox.className = 'posture-status-box warning';
      statusIcon.innerHTML = '⚠️';
      statusTitle.textContent = 'Severe Slouch & Forward Head (High Strain)';
      statusDesc.textContent = 'Corrective feedback triggered! Audio alert dispatched to student workstation.';
      if (alertBadge) {
        alertBadge.textContent = 'ALERT ACTIVE';
        alertBadge.style.color = '#ef4444';
        alertBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      }
    } else if (isSlouching) {
      statusBox.className = 'posture-status-box warning';
      statusIcon.innerHTML = '🔔';
      statusTitle.textContent = 'Moderate Slouch Detected';
      statusDesc.textContent = 'Spine angle exceeds 22° threshold. Posture log updated in telemetry store.';
      if (alertBadge) {
        alertBadge.textContent = 'POSTURE WARNING';
        alertBadge.style.color = '#f59e0b';
        alertBadge.style.background = 'rgba(245, 158, 11, 0.2)';
      }
    } else {
      statusBox.className = 'posture-status-box';
      statusIcon.innerHTML = '✅';
      statusTitle.textContent = 'Ergonomically Sound Posture';
      statusDesc.textContent = 'Spine & neck keypoints aligned within safe classroom ergonomic limits.';
      if (alertBadge) {
        alertBadge.textContent = 'NORMAL POSTURE';
        alertBadge.style.color = '#10b981';
        alertBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      }
    }

    ctx.restore();
  }

  if (spineSlider) {
    spineSlider.addEventListener('input', (e) => {
      spineAngle = parseInt(e.target.value);
      if (spineValText) spineValText.textContent = `${spineAngle}°`;
      drawPosture();
    });
  }

  if (neckSlider) {
    neckSlider.addEventListener('input', (e) => {
      neckAngle = parseInt(e.target.value);
      if (neckValText) neckValText.textContent = `${neckAngle}°`;
      drawPosture();
    });
  }

  window.addEventListener('resize', () => {
    drawPosture();
  });

  drawPosture();
}
