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

// 平滑滚动到指定区域
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
} 