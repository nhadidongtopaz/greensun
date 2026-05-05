// Utilities
        const formatVND = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
        const formatFloat = (num) => parseFloat(num.toFixed(1)).toString().replace('.', ',');

        // Calculator DOM
        const billSlider = document.getElementById('billSlider');
        const billValueDisplay = document.getElementById('billValueDisplay');
        const systemSizeEl = document.getElementById('systemSize');
        const roofSpaceEl = document.getElementById('roofSpace');
        const investmentCostEl = document.getElementById('investmentCost');
        const yearlySavingsEl = document.getElementById('yearlySavings');
        const paybackYearsEl = document.getElementById('paybackYears');
        const installmentCostEl = document.getElementById('installmentCost');
        const evn25YearEl = document.getElementById('evn25Year');
        const solar25YearEl = document.getElementById('solar25Year');
        const profit25YearEl = document.getElementById('profit25Year');
        const solarBarWidthEl = document.getElementById('solarBarWidth');

        // Mode Logic
        const btnHome = document.getElementById('btnHome');
        const btnBusiness = document.getElementById('btnBusiness');
        let isBusinessMode = false;

        function setMode(mode) {
            isBusinessMode = (mode === 'business');
            if (isBusinessMode) {
                // Style Active: Business
                btnBusiness.className = "bg-brand-green text-white py-2.5 rounded-lg font-bold shadow-md transition-all border-2 border-brand-green";
                btnHome.className = "bg-white text-gray-500 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-all border-2 border-gray-200";
                
                billSlider.min = 20000000; billSlider.max = 200000000;
                billSlider.step = 5000000; billSlider.value = 50000000;
            } else {
                // Style Active: Home
                btnHome.className = "bg-brand-green text-white py-2.5 rounded-lg font-bold shadow-md transition-all border-2 border-brand-green";
                btnBusiness.className = "bg-white text-gray-500 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-all border-2 border-gray-200";
                
                billSlider.min = 500000; billSlider.max = 20000000;
                billSlider.step = 100000; billSlider.value = 2000000;
            }
            calculateSolarInfo();
        }
        btnHome.addEventListener('click', () => setMode('home'));
        btnBusiness.addEventListener('click', () => setMode('business'));

        // Calc Logic
        function calculateSolarInfo() {
            const monthlyBill = parseInt(billSlider.value);
            billValueDisplay.innerText = formatVND(monthlyBill);

            const pricePerKwh = 2800; // Giá điện sinh hoạt trung bình
            const dailySunHours = 3.2; // Số giờ nắng hiệu quả
            const costPerKwp = 14000000; // Suất đầu tư hệ bám tải
            const spacePerKwp = 6; // Diện tích mái yêu cầu (m2/kWp)

            // Lượng điện tiêu thụ hàng tháng
            const monthlyKwh = monthlyBill / pricePerKwh;
            
            // Lượng điện cần bù đắp ban ngày (giả sử 60%)
            const dailyKwh = (monthlyKwh * 0.6) / 30;

            // Công suất cần thiết
            let recommendedKwp = dailyKwh / dailySunHours;
            
            // Làm tròn C theo các module có sẵn (bước nhảy 0.5 kWp)
            recommendedKwp = Math.ceil(recommendedKwp * 2) / 2;

            // Gói nhỏ nhất khả thi để lắp ráp là 1.5 kWp
            if (recommendedKwp < 1.5) recommendedKwp = 1.5;

            const totalInvestment = recommendedKwp * costPerKwp;
            const spaceNeeded = recommendedKwp * spacePerKwp;
            
            // Sản lượng điện tạo ra trong 1 năm
            const annualGeneration = recommendedKwp * dailySunHours * 365;
            // Tiền tiết kiệm mỗi năm
            const annualSavings = annualGeneration * pricePerKwh;
            
            const paybackTime = totalInvestment / annualSavings;
            // Sửa trả góp: Trả góp thường kéo dài 24 - 36 tháng, chia 12 tháng làm phí hàng tháng quá cao
            const monthlyInstallment = totalInvestment / 24;
            const evn25YearCost = monthlyBill * 12 * 25 * 1.5;
            const solar25YearCost = totalInvestment * 1.1; 
            const profit = evn25YearCost - solar25YearCost;
            
            let widthPercent = (solar25YearCost / evn25YearCost) * 100;
            if(widthPercent < 5) widthPercent = 5; if(widthPercent > 95) widthPercent = 95;

            systemSizeEl.innerText = formatFloat(recommendedKwp);
            roofSpaceEl.innerText = Math.round(spaceNeeded);
            investmentCostEl.innerText = formatVND(Math.round(totalInvestment)).replace(' ₫', '');
            yearlySavingsEl.innerText = formatVND(Math.round(annualSavings)).replace(' ₫', '');
            paybackYearsEl.innerText = formatFloat(paybackTime);
            
            installmentCostEl.innerHTML = formatVND(Math.round(monthlyInstallment)).replace(' ₫', '') + ' ₫<span class="text-xs text-gray-400 font-medium">/tháng</span>';
            evn25YearEl.innerText = formatVND(Math.round(evn25YearCost));
            solar25YearEl.innerText = formatVND(Math.round(solar25YearCost));
            profit25YearEl.innerText = formatVND(Math.round(profit));
            solarBarWidthEl.style.width = `${widthPercent}%`;
        }
        billSlider.addEventListener('input', calculateSolarInfo);
        calculateSolarInfo();

        // Animations & Layout Fixes
        function reveal() {
            var reveals = document.querySelectorAll(".reveal");
            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var elementTop = reveals[i].getBoundingClientRect().top;
                if (elementTop < windowHeight - 100) reveals[i].classList.add("active");
            }
        }
        window.addEventListener("scroll", reveal);
        setTimeout(reveal, 100);

        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 10) header.classList.add('shadow-md');
            else header.classList.remove('shadow-md');
        });
        
        document.addEventListener("DOMContentLoaded", () => {
            const firstFaq = document.querySelector('.faq-item');
            if(firstFaq) firstFaq.classList.add('active');
        });

        // Before/After Slider
        const range = document.getElementById('compareRange');
        const overlay = document.getElementById('compareOverlay');
        const button = document.getElementById('compareButton');
        range.addEventListener('input', (e) => {
            const val = e.target.value;
            overlay.style.width = val + '%';
            button.style.left = val + '%';
        });

        // Live Sales Toast Fix
        const toastData = [
            { name: "Anh Minh***", loc: "Cầu Giấy", size: "5kWp", time: "2 phút trước" },
            { name: "Chị Hạnh***", loc: "Quốc Oai", size: "10kWp", time: "5 phút trước" },
            { name: "Cty TNHH ***", loc: "Bình Dương", size: "150kWp", time: "12 phút trước" },
            { name: "Anh Tuấn***", loc: "Hải Dương", size: "8kWp", time: "Vừa xong" }
        ];
        let toastIndex = 0;
        const toastEl = document.getElementById('salesToast');
        const msgEl = document.getElementById('toastMessage');
        const timeEl = document.getElementById('toastTime');

        function showNextToast() {
            const data = toastData[toastIndex];
            msgEl.innerText = `${data.name} tại ${data.loc} vừa chốt ${data.size}`;
            timeEl.innerText = data.time;
            
            toastEl.classList.add('show');
            setTimeout(() => { toastEl.classList.remove('show'); }, 4000);
            toastIndex = (toastIndex + 1) % toastData.length;
        }
        setTimeout(() => {
            showNextToast();
            setInterval(showNextToast, 18000);
        }, 8000);

        // Exit Popup
        let hasShownPopup = false;

        function triggerExitPopup() {
            if (!hasShownPopup) {
                document.getElementById('exitPopup').classList.add('show');
                hasShownPopup = true;
            }
        }

        // 1. Desktop: Phát hiện chuột di chuyển ra khỏi mép trên trình duyệt
        document.addEventListener('mouseout', (e) => {
            if (e.clientY < 10) triggerExitPopup();
        });

        // 2. Mobile: Phát hiện thao tác vuốt ngược lên trên (có ý định rời đi/về đầu trang)
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (hasShownPopup) return;
            if (window.innerWidth <= 768) {
                let currentScrollY = window.scrollY;
                // Nếu khách cuộn ngược lên hơn 50px và đang ở vị trí cách đầu trang hơn 400px
                if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY > 50) && currentScrollY > 400) {
                    triggerExitPopup();
                }
                lastScrollY = currentScrollY;
            }
        }, { passive: true });

        // 3. Fallback: Tự động hiển thị sau 30 giây (đảm bảo không bị lỡ khách mobile)
        setTimeout(() => {
            triggerExitPopup();
        }, 30000);

        document.getElementById('closePopup').addEventListener('click', () => { document.getElementById('exitPopup').classList.remove('show'); });
        document.getElementById('declinePopup').addEventListener('click', () => { document.getElementById('exitPopup').classList.remove('show'); });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuIcon = document.getElementById('mobileMenuIcon');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            } else {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-xmark');
            }
        });

        // Đóng menu khi bấm vào link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-xmark');
                mobileMenuIcon.classList.add('fa-bars');
            });
        });

        // --- YouTube Direct iFrame Unmute Logic ---
        const unmuteOverlayEl = document.getElementById('unmuteOverlay');
        const iframe = document.getElementById('youtubeIframe');
        
        if (unmuteOverlayEl && iframe) {
            unmuteOverlayEl.addEventListener('click', function() {
                // Đổi link iframe để bật tiếng và hiển thị control, tự động phát lại
                iframe.src = "https://www.youtube.com/embed/dXcNNcGcCvc?autoplay=1&mute=0&controls=1&playsinline=1&rel=0";
                
                // Ẩn lớp phủ đi
                unmuteOverlayEl.style.opacity = '0';
                setTimeout(() => {
                    unmuteOverlayEl.style.display = 'none';
                }, 300);
            });
        }