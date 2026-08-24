(function() {
    const svg = document.querySelector('#floating-bg svg');
    const count = 36;
    const position = -1;
    const paths = [];

    for (let i = 0; i < count; i++) {
        const d =
            `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', d);
        el.setAttribute('class', 'path-line');
        el.setAttribute('stroke-width', String(0.5 + i * 0.03));
        el.setAttribute('stroke-opacity', String(0.1 + i * 0.03));
        paths.push({
            el: el,
            phase: Math.random() * 2 * Math.PI,
            duration: 20 + Math.random() * 10,
            index: i,
        });
        svg.appendChild(el);
    }

    let lengths = [];
    let lengthsReady = false;

    function computeLengths() {
        const all = [];
        paths.forEach((p, idx) => {
            try {
                const len = p.el.getTotalLength();
                all[idx] = len;
            } catch (_) {
                all[idx] = 600;
            }
        });
        lengths = all;
        lengthsReady = true;
    }

    requestAnimationFrame(() => {
        setTimeout(computeLengths, 100);
    });

    let startTime = performance.now();

    function animatePaths(now) {
        if (!lengthsReady) {
            requestAnimationFrame(animatePaths);
            return;
        }

        const elapsed = (now - startTime) / 1000;

        paths.forEach((p, i) => {
            const totalLen = lengths[i] || 600;
            const period = p.duration;
            const raw = ((elapsed / period) + p.phase / (2 * Math.PI)) % 1;
            const progress = (Math.sin(raw * Math.PI * 2 - Math.PI / 2) + 1) / 2;
            const pathLen = 0.3 + progress * 0.7;
            const visibleLen = pathLen * totalLen;
            const dash = visibleLen + ', ' + totalLen;
            p.el.setAttribute('stroke-dasharray', dash);

            const baseOp = 0.1 + p.index * 0.03;
            const wave = 0.15 + 0.35 * (1 - Math.abs(progress - 0.5) * 2);
            const finalOp = Math.min(baseOp + wave * 0.25, 0.55);
            p.el.setAttribute('stroke-opacity', String(finalOp));
        });

        requestAnimationFrame(animatePaths);
    }

    requestAnimationFrame(animatePaths);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            computeLengths();
        }, 300);
    });
})();

(function() {
    const clockEl = document.getElementById('clock-time');

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
    }
    updateClock();
    setInterval(updateClock, 1000);
})();

(function() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(function(r) {
        observer.observe(r);
    });
})();

(function() {
    const pctEl = document.getElementById('batt-pct');
    const fillEl = document.getElementById('batt-fill');
    if (pctEl && fillEl) {
        let pct = 78;
        setInterval(function() {
            pct = 72 + Math.round(Math.random() * 13);
            pctEl.textContent = pct + '%';
            fillEl.style.width = pct + '%';
        }, 5000);
    }
})();

(function() {
    const translations = {
        heroTitle: {
            en: 'Precision Sensing<br><strong>Wireless Intelligence</strong>',
            vi: 'Cảm biến chính xác<br><strong>Trí tuệ không dây</strong>'
        },
        heroSub: {
            en: 'A dual-layer IoT ecosystem connecting a ruggedized Master Station to Sensor Nodes over LoRa long-range RF built for hydroponic environments.',
            vi: 'Hệ sinh thái IoT hai lớp kết nối Trạm Tổng bền bỉ với các Nút Cảm biến qua tần số LoRa tầm xa được thiết kế cho môi trường thủy canh.'
        },
        masterTitle: {
            en: 'Master Station',
            vi: 'Trạm Tổng'
        },
        masterDesc: {
            en: 'Central controller with microcontroller, touch display, LoRa and high-precision environmental sensors.',
            vi: 'Trung tâm điều khiển với vi điều khiển, màn hình cảm ứng, LoRa và cảm biến môi trường chính xác.'
        },
        masterHeroDesc: {
            en: 'Ruggedized central hub with LoRa transceiver, multi-sensor fusion, and on-device display. Designed for hydroponic environments with full battery independence.',
            vi: 'Trung tâm chắc chắn với thu phát LoRa, tích hợp đa cảm biến và màn hình. Thiết kế cho môi trường thủy canh, hoạt động độc lập với pin.'
        },
        specHardware: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="3" width="12" height="12" rx="2" /><rect x="6" y="6" width="6" height="6" rx="1" /></svg><div><span class="spec-value">Dual-Layer PCB</span><span class="spec-desc">High-density via shielding, EMI suppression</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="2" y="4" width="14" height="10" rx="2" /><line x1="6" y1="4" x2="6" y2="14" /><line x1="2" y1="9" x2="16" y2="9" /></svg><div><span class="spec-value">3.5″ Display</span><span class="spec-desc">Integrated TFT touchscreen UI panel</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="9" cy="9" r="6" /><circle cx="9" cy="9" r="2" fill="var(--gold)" stroke="none" /></svg><div><span class="spec-value">WS2812B RGB LEDs</span><span class="spec-desc">Addressable status indicators, 16M colors</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M9 3 L9 6 M9 12 L9 15 M3 9 L6 9 M12 9 L15 9" /><circle cx="9" cy="9" r="3" /></svg><div><span class="spec-value">Active Piezo Buzzer</span><span class="spec-desc">Audible alerts &amp; system feedback tones</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="3" width="12" height="12" rx="2" /><rect x="6" y="6" width="6" height="6" rx="1" /></svg><div><span class="spec-value">PCB 2 lớp</span><span class="spec-desc">Che chắn via mật độ cao, giảm nhiễm EMI</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="2" y="4" width="14" height="10" rx="2" /><line x1="6" y1="4" x2="6" y2="14" /><line x1="2" y1="9" x2="16" y2="9" /></svg><div><span class="spec-value">Màn hình 3.5″</span><span class="spec-desc">TFT cảm ứng, giao diện người dùng</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="9" cy="9" r="6" /><circle cx="9" cy="9" r="2" fill="var(--gold)" stroke="none" /></svg><div><span class="spec-value">LED WS2812B</span><span class="spec-desc">Đèn trạng thái địa chỉ, 16 triệu màu</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M9 3 L9 6 M9 12 L9 15 M3 9 L6 9 M12 9 L15 9" /><circle cx="9" cy="9" r="3" /></svg><div><span class="spec-value">Còi Piezo</span><span class="spec-desc">Cảnh báo âm thanh & phản hồi hệ thống</span></div></li>'
        },
        specConnectivity: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M3 9 Q9 3 15 9 Q9 15 3 9" /><circle cx="9" cy="9" r="2" /></svg><div><span class="spec-value">LoRa Transceiver</span><span class="spec-desc">433 MHz, up to 10 km, AES-128</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 14 Q9 4 14 14" /><path d="M6 12 Q9 7 12 12" /></svg><div><span class="spec-value">SHT30 Temp / Humi</span><span class="spec-desc">±0.2°C, ±2% RH precision</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="9" cy="8" r="4" /><path d="M7 12 L9 16 L11 12" /></svg><div><span class="spec-value">TEMT6000 Ambient Light</span><span class="spec-desc">Silicon phototransistor, 570 nm peak</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--slate)" stroke-width="1.5"><circle cx="9" cy="9" r="5" /><polyline points="9,5 9,9 12,11" /></svg><div><span class="spec-value">DS3231 RTC</span><span class="spec-desc">±2 ppm accuracy, TCXO</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--slate)" stroke-width="1.5"><rect x="4" y="6" width="10" height="8" rx="1" /><path d="M7 6 L7 4 L11 4 L11 6" /></svg><div><span class="spec-value">MicroSD Logger</span><span class="spec-desc">FAT32, up to 32 GB, CSV &amp; JSON</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M3 9 Q9 3 15 9 Q9 15 3 9" /><circle cx="9" cy="9" r="2" /></svg><div><span class="spec-value">Thu phát LoRa</span><span class="spec-desc">433 MHz, lên đến 10 km, AES-128</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 14 Q9 4 14 14" /><path d="M6 12 Q9 7 12 12" /></svg><div><span class="spec-value">SHT30 Nhiệt / Ẩm</span><span class="spec-desc">±0.2°C, ±2% RH độ chính xác</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><circle cx="9" cy="8" r="4" /><path d="M7 12 L9 16 L11 12" /></svg><div><span class="spec-value">Ánh sáng TEMT6000</span><span class="spec-desc">Quang transistor, đỉnh 570 nm</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--slate)" stroke-width="1.5"><circle cx="9" cy="9" r="5" /><polyline points="9,5 9,9 12,11" /></svg><div><span class="spec-value">RTC DS3231</span><span class="spec-desc">Độ chính xác ±2 ppm, TCXO</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--slate)" stroke-width="1.5"><rect x="4" y="6" width="10" height="8" rx="1" /><path d="M7 6 L7 4 L11 4 L11 6" /></svg><div><span class="spec-value">Ghi log MicroSD</span><span class="spec-desc">FAT32, lên đến 32 GB, CSV &amp; JSON</span></div></li>'
        },
        specPowerLeft: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /></svg><div><span class="spec-value">3000 mAh Lithium</span><span class="spec-desc">Onboard rechargeable battery pack</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M5 9 L9 4 L9 8 L13 8 L9 13 L9 9 Z" /></svg><div><span class="spec-value">Dedicated BMS IC</span><span class="spec-desc">Charge/discharge control, cell balancing</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /></svg><div><span class="spec-value">Pin Lithium 3000 mAh</span><span class="spec-desc">Pin sạc tích hợp trên bo</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M5 9 L9 4 L9 8 L13 8 L9 13 L9 9 Z" /></svg><div><span class="spec-value">IC BMS chuyên dụng</span><span class="spec-desc">Điều khiển sạc/xả, cân bằng tế bào</span></div></li>'
        },
        specPowerRight: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 6 L8 6 L8 4 L10 4 L10 6 L14 6 L14 12 L4 12 Z" /><line x1="7" y1="9" x2="11" y2="9" /></svg><div><span class="spec-value">Dual-Transistor Op-Amp</span><span class="spec-desc">Smart power switching, low quiescent</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><circle cx="9" cy="9" r="6" /><line x1="9" y1="5" x2="9" y2="13" /><line x1="5" y1="9" x2="13" y2="9" /></svg><div><span class="spec-value">PPTC Fuse Protection</span><span class="spec-desc">Resettable overcurrent protection</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 6 L8 6 L8 4 L10 4 L10 6 L14 6 L14 12 L4 12 Z" /><line x1="7" y1="9" x2="11" y2="9" /></svg><div><span class="spec-value">Op-Amp 2 transistor</span><span class="spec-desc">Chuyển mạch thông minh, dòng tĩnh thấp</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><circle cx="9" cy="9" r="6" /><line x1="9" y1="5" x2="9" y2="13" /><line x1="5" y1="9" x2="13" y2="9" /></svg><div><span class="spec-value">Bảo vệ cầu chì PPTC</span><span class="spec-desc">Chống quá dòng tự phục hồi</span></div></li>'
        },
        nodeWaterSpecs: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M9 3 Q13 8 13 11 A4 4 0 0 1 5 11 Q5 8 9 3Z" /></svg><div><span class="spec-value">TDS Sensor</span><span class="spec-desc">EC / TDS, 0-9990 ppm</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 14 Q9 4 14 14" /><path d="M6 12 Q9 7 12 12" /></svg><div><span class="spec-value">DS18B20 Water Temp</span><span class="spec-desc">1-Wire, ±0.5°C, waterproof</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><circle cx="9" cy="9" r="5" /><text x="5.5" y="12.5" font-size="6" fill="var(--blue-bright)" stroke="none" font-family="monospace">pH</text></svg><div><span class="spec-value">pH Probe</span><span class="spec-desc">Analog, pH 0-14, auto-cal</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M9 3 Q13 8 13 11 A4 4 0 0 1 5 11 Q5 8 9 3Z" /></svg><div><span class="spec-value">Cảm biến TDS</span><span class="spec-desc">EC / TDS, 0-9990 ppm</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><path d="M4 14 Q9 4 14 14" /><path d="M6 12 Q9 7 12 12" /></svg><div><span class="spec-value">Nhiệt độ nước DS18B20</span><span class="spec-desc">1-Wire, ±0.5°C, chống nước</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--blue-bright)" stroke-width="1.5"><circle cx="9" cy="9" r="5" /><text x="5.5" y="12.5" font-size="6" fill="var(--blue-bright)" stroke="none" font-family="monospace">pH</text></svg><div><span class="spec-value">Đầu dò pH</span><span class="spec-desc">Analog, pH 0-14, tự động hiệu chuẩn</span></div></li>'
        },
        nodeRelaySpecs: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="6" width="12" height="6" rx="2" /><line x1="6" y1="6" x2="6" y2="12" /><line x1="9" y1="6" x2="9" y2="12" /><line x1="12" y1="6" x2="12" y2="12" /></svg><div><span class="spec-value">4-Channel Relay</span><span class="spec-desc">10A/250VAC per ch, optoisolated</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M5 9 L9 4 L9 8 L13 8 L9 13 L9 9 Z" /></svg><div><span class="spec-value">220V SMPS</span><span class="spec-desc">5V/3A regulated</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /></svg><div><span class="spec-value">Battery Backup</span><span class="spec-desc">UPS mode, seamless failover</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="6" width="12" height="6" rx="2" /><line x1="6" y1="6" x2="6" y2="12" /><line x1="9" y1="6" x2="9" y2="12" /><line x1="12" y1="6" x2="12" y2="12" /></svg><div><span class="spec-value">Relay 4 kênh</span><span class="spec-desc">10A/250VAC mỗi kênh, cách ly quang</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><path d="M5 9 L9 4 L9 8 L13 8 L9 13 L9 9 Z" /></svg><div><span class="spec-value">Nguồn SMPS 220V</span><span class="spec-desc">5V/3A ổn áp</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="var(--gold)" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /></svg><div><span class="spec-value">Pin dự phòng</span><span class="spec-desc">Chế độ UPS, chuyển mạch liền mạch</span></div></li>'
        },
        nodeSolarSpecs: {
            en: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><rect x="2" y="5" width="14" height="8" rx="2" /><line x1="5" y1="5" x2="5" y2="13" /><line x1="9" y1="5" x2="9" y2="13" /><line x1="13" y1="5" x2="13" y2="13" /></svg><div><span class="spec-value">Solar Panel Input</span><span class="spec-desc">MPPT, 25W panel</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /><line x1="7" y1="5" x2="7" y2="13" /></svg><div><span class="spec-value">LiPo Backup</span><span class="spec-desc">3.7V / 3000 mAh, 12h autonomy</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><path d="M4 6 L8 6 L8 4 L10 4 L10 6 L14 6 L14 12 L4 12 Z" /></svg><div><span class="spec-value">BMS Protection</span><span class="spec-desc">OCP, UVP, OTP guard</span></div></li>',
            vi: '<li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><rect x="2" y="5" width="14" height="8" rx="2" /><line x1="5" y1="5" x2="5" y2="13" /><line x1="9" y1="5" x2="9" y2="13" /><line x1="13" y1="5" x2="13" y2="13" /></svg><div><span class="spec-value">Đầu vào pin mặt trời</span><span class="spec-desc">MPPT, tấm pin 25W</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><rect x="3" y="5" width="13" height="8" rx="2" /><path d="M16 8 L17 8 L17 10 L16 10" /><line x1="7" y1="5" x2="7" y2="13" /></svg><div><span class="spec-value">Pin LiPo dự phòng</span><span class="spec-desc">3.7V / 3000 mAh, tự chủ 12h</span></div></li><li><svg class="spec-icon" viewBox="0 0 18 18" fill="none" stroke="#3DCC7A" stroke-width="1.5"><path d="M4 6 L8 6 L8 4 L10 4 L10 6 L14 6 L14 12 L4 12 Z" /></svg><div><span class="spec-value">Bảo vệ BMS</span><span class="spec-desc">OCP, UVP, OTP</span></div></li>'
        },
        nodesTitle: {
            en: 'Sensor Nodes',
            vi: 'Nút Cảm Biến'
        },
        nodesDesc: {
            en: 'Distributed sensor nodes, LoRa-connected, specialized for water, relay control and solar power.',
            vi: 'Nút cảm biến phân tán, kết nối LoRa, chuyên biệt cho nước, điều khiển relay và năng lượng mặt trời.'
        },
        metricsTitle: {
            en: 'Performance',
            vi: 'Thông Số Kỹ Thuật'
        },
        featuresTitle: {
            en: 'Built for <strong>Hydroponic</strong>',
            vi: 'Dành cho <strong>Thủy canh</strong>'
        },
        featuresDesc: {
            en: 'Core features that ensure reliable, accurate operation independent of the grid.',
            vi: 'Những tính năng cốt lõi giúp hệ thống vận hành bền bỉ, chính xác và không phụ thuộc vào nguồn điện lưới.'
        },
        featTitle1: {
            en: 'Low-Power Architecture',
            vi: 'Kiến trúc tiết kiệm năng lượng'
        },
        featDesc1: {
            en: 'Intelligent power management with sleep mode, consuming only a few mA in active mode, extending runtime during power outages.',
            vi: 'Quản lý năng lượng thông minh với chế độ ngủ, chỉ tiêu thụ vài mA ở chế độ hoạt động, kéo dài thời gian vận hành khi mất điện.'
        },
        featTitle2: {
            en: 'LoRa Mesh',
            vi: 'Mạng lưới LoRa'
        },
        featDesc2: {
            en: 'LoRa protocol supports mesh networking, allowing nodes to relay data, extending coverage up to several dozen kilometers in real conditions.',
            vi: 'Giao thức LoRa hỗ trợ mesh network, cho phép các node trung chuyển dữ liệu, mở rộng phủ sóng lên đến vài chục km trong điều kiện thực tế.'
        },
        featTitle3: {
            en: 'Sensors',
            vi: 'Cảm biến'
        },
        featDesc3: {
            en: 'SHT30, DS18B20, TEMT6000, TDS, pH - all selected to standards with high stability, low noise and long lifetime.',
            vi: 'SHT30, DS18B20, TEMT6000, TDS, pH - tất cả đều được chọn lọc theo tiêu chuẩn, độ ổn định cao, nhiễu thấp và tuổi thọ dài.'
        },
        featTitle4: {
            en: 'Ruggedized Design',
            vi: 'Thiết kế bền bỉ'
        },
        featDesc4: {
            en: '2-layer PCB with via shielding, conformal coating protection, moisture-proof and dust-proof, stable in greenhouse and outdoor environments.',
            vi: 'PCB 2 lớp với via che chắn, lớp phủ bảo vệ conformal coating, chống ẩm, chống bụi, hoạt động ổn định trong môi trường nhà kính và ngoài trời.'
        }
    };

    const langToggle = document.getElementById('langToggle');
    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        document.getElementById('hero-title').innerHTML = translations.heroTitle[lang];
        document.getElementById('hero-sub').innerHTML = translations.heroSub[lang];
        document.getElementById('master-title').innerHTML = translations.masterTitle[lang];
        document.getElementById('master-desc').innerHTML = translations.masterDesc[lang];
        document.getElementById('master-hero-desc').innerHTML = translations.masterHeroDesc[lang];
        document.getElementById('spec-hardware').innerHTML = translations.specHardware[lang];
        document.getElementById('spec-connectivity').innerHTML = translations.specConnectivity[lang];
        document.getElementById('spec-power-left').innerHTML = translations.specPowerLeft[lang];
        document.getElementById('spec-power-right').innerHTML = translations.specPowerRight[lang];
        document.getElementById('nodes-title').innerHTML = translations.nodesTitle[lang];
        document.getElementById('nodes-desc').innerHTML = translations.nodesDesc[lang];
        document.getElementById('node-water-specs').innerHTML = translations.nodeWaterSpecs[lang];
        document.getElementById('node-relay-specs').innerHTML = translations.nodeRelaySpecs[lang];
        document.getElementById('node-solar-specs').innerHTML = translations.nodeSolarSpecs[lang];
        document.getElementById('metrics-title').innerHTML = translations.metricsTitle[lang];
        document.getElementById('features-title').innerHTML = translations.featuresTitle[lang];
        document.getElementById('features-desc').innerHTML = translations.featuresDesc[lang];
        document.getElementById('feat-title-1').innerHTML = translations.featTitle1[lang];
        document.getElementById('feat-desc-1').innerHTML = translations.featDesc1[lang];
        document.getElementById('feat-title-2').innerHTML = translations.featTitle2[lang];
        document.getElementById('feat-desc-2').innerHTML = translations.featDesc2[lang];
        document.getElementById('feat-title-3').innerHTML = translations.featTitle3[lang];
        document.getElementById('feat-desc-3').innerHTML = translations.featDesc3[lang];
        document.getElementById('feat-title-4').innerHTML = translations.featTitle4[lang];
        document.getElementById('feat-desc-4').innerHTML = translations.featDesc4[lang];
        langToggle.textContent = (lang === 'en') ? 'VI' : 'EN';
    }

    langToggle.addEventListener('click', function() {
        var newLang = (currentLang === 'en') ? 'vi' : 'en';
        setLanguage(newLang);
    });

    setLanguage('en');
})();