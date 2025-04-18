// 作品数据
const portfolioItems = [
    {
        title: "病理图像识别模型",
        description: "开发数字病理切片分析系统，实现自动化切片处理、数据清洗、模型训练及结果可视化。包含MongoDB数据管理、patch切割、数据预处理、深度学习训练与测试，以及热力图绘制和混淆矩阵分析等功能。",
        image: "images/OIP-C.jpg"
    },
    {
        title: "医疗书本知识对话",
        description: "第一版：检索方法KNN+BM25；第二版：基于Rawflow",
        images: ["images/搜表.png", "images/搜图.png"]
    },
    {
        title: "文本对比评分",
        description: "3000左右条数据，qwen2.5-7b，lora微调",
        image: "images/评分.png"
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    initModal();
});

// 初始化作品展示区
function initPortfolio() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;
    
    // 清空现有内容，防止重复
    portfolioGrid.innerHTML = '';
    
    portfolioItems.forEach(item => {
        const card = createPortfolioCard(item);
        portfolioGrid.appendChild(card);
    });
}

// 创建作品卡片
function createPortfolioCard(item) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    
    // 根据是否有多张图片使用不同的模板
    if (item.images) {
        card.innerHTML = `
            <div class="image-slider">
                <div class="slider-container">
                    ${item.images.map(img => `<img src="${img}" alt="${item.title}">`).join('')}
                </div>
                <div class="slider-dots">
                    ${item.images.map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`).join('')}
                </div>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <button onclick="showProjectDetails('${item.title}')">查看详情</button>
        `;
    } else {
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <button onclick="showProjectDetails('${item.title}')">查看详情</button>
        `;
    }
    
    // 如果有多张图片，初始化轮播功能
    if (item.images) {
        initializeSlider(card);
    }
    
    return card;
}

// 添加轮播功能
function initializeSlider(card) {
    const dots = card.querySelectorAll('.dot');
    const images = card.querySelectorAll('.slider-container img');
    let currentIndex = 0;

    // 点击圆点切换图片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // 自动轮播
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlider();
    }, 3000);

    function updateSlider() {
        const offset = -currentIndex * 100;
        card.querySelector('.slider-container').style.transform = `translateX(${offset}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('wechatModal');
    const btn = document.querySelector('.wechat-btn');
    const span = document.querySelector('.close');

    btn.onclick = () => modal.style.display = "block";
    span.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }
}

// 粒子浮动动画
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes float {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.5;
    }
    50% {
        transform: translateY(-20px) translateX(10px);
        opacity: 1;
    }
}
</style>
`);

// 滚动到指定区域的函数
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
        });
    }
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化模态框
    initModal();
    
    // 初始化微信弹窗
    const modal = document.getElementById('wechatModal');
    const wechatBtn = document.querySelector('.wechat-btn');
    const closeBtn = document.querySelector('.close');

    if (wechatBtn && modal && closeBtn) {
        wechatBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 添加鼠标移动效果
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.addEventListener('mousemove', function(e) {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const h1 = document.querySelector('.tech-text');
            const h2 = document.querySelector('.tech-text-2');
            
            if (h1) {
                h1.style.transform = `translate(${xPos * 0.5}px, ${yPos * 0.5}px)`;
            }
            
            if (h2) {
                h2.style.transform = `translate(${xPos * 0.3}px, ${yPos * 0.3}px)`;
            }
        });
    }

    // 动态创建更多粒子效果
    const techParticles = document.querySelector('.tech-particles');
    if (techParticles) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // 随机位置
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // 随机大小
            const size = Math.random() * 3 + 1;
            
            // 随机动画延迟
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                left: ${posX}%;
                top: ${posY}%;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                animation: float 5s ease-in-out infinite;
                animation-delay: ${delay}s;
            `;
            
            techParticles.appendChild(particle);
        }
    }
}); 