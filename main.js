// 作品数据
const portfolioItems = [
    {
        title: "病理图像识别",
        description: "开发数字病理切片分析系统，实现自动化切片处理、数据清洗、模型训练及结果可视化。包含MongoDB数据管理、patch切割、数据预处理、深度学习训练与测试，以及热力图绘制和混淆矩阵分析等功能。",
        image: "images/OIP-C.jpg",
        details: {
            type: "workflow",
            steps: [
                { image: "截图/切分.png", title: "原始切片" },
                { image: "截图/dirty.png", title: "数据清洗", description: "清洗数据打标签（有污渍，马克笔的地方）" },
                { image: "截图/patch.png", title: "图像预处理", description: "归一化、高斯模糊，大块空白处理" },
                { 
                    image: "images/cnn-model.svg", 
                    title: "深度学习模型", 
                    description: "基于卷积神经网络的病理图像识别模型",
                    branches: [
                    { 
                        target: "截图/云服务器.jpg", 
                        title: "云端部署",
                        related: "截图/heatmap.png",
                        relatedTitle: "热力图分析"
                    },
                    { 
                        target: "截图/jetson.jpg", 
                        title: "jetson开发板部署",
                        related: "截图/屏幕.png",
                        relatedTitle: "实时显示"
                    }
                ] }
            ]
        }
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
    setupDetailModal();
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

// 创建项目详情模态框
function setupDetailModal() {
    // 创建模态框元素
    const detailModal = document.createElement('div');
    detailModal.id = 'projectDetailModal';
    detailModal.className = 'modal project-detail-modal';
    
    detailModal.innerHTML = `
        <div class="modal-content project-detail-content">
            <span class="close">&times;</span>
            <div class="project-detail-container">
                <h2 id="project-detail-title"></h2>
                <div id="project-workflow-container"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailModal);
    
    // 添加关闭事件
    const closeBtn = detailModal.querySelector('.close');
    closeBtn.onclick = () => detailModal.style.display = "none";
    
    window.onclick = (e) => {
        if (e.target == detailModal) {
            detailModal.style.display = "none";
        }
    };
    
    // 添加样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .project-detail-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.8);
        }
        
        .project-detail-content {
            background-color: #1a1a1a;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #444;
            width: 90%;
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
            color: #f0f0f0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border-radius: 10px;
        }
        
        #project-workflow-container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .workflow-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 40px;
            width: 100%;
            background-color: #222;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }
        
        .workflow-step:hover {
            transform: translateY(-5px);
        }
        
        .workflow-image {
            max-width: 100%;
            border: 2px solid #444;
            border-radius: 5px;
            margin: 15px 0;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .workflow-image:hover {
            transform: scale(1.02);
            border-color: #4fc3f7;
        }
        
        .workflow-title {
            font-size: 1.3em;
            font-weight: bold;
            margin: 10px 0;
            color: #4fc3f7;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .workflow-description {
            text-align: center;
            margin-bottom: 15px;
            max-width: 600px;
            line-height: 1.5;
            color: #ddd;
        }
        
        .workflow-arrow {
            font-size: 28px;
            margin: 20px 0;
            color: #4fc3f7;
            text-shadow: 0 0 5px rgba(79, 195, 247, 0.5);
        }
        
        .branches-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            width: 100%;
            margin-top: 20px;
        }
        
        .branch {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 45%;
            min-width: 300px;
            background-color: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        
        .branch:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .related-images {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(0,0,0,0.2);
            border-radius: 6px;
        }
        
        .related-image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        #project-detail-title {
            text-align: center;
            font-size: 2em;
            margin-bottom: 30px;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            border-bottom: 2px solid #4fc3f7;
            padding-bottom: 10px;
        }
    `;
    
    document.head.appendChild(styleSheet);
}

// 显示项目详情函数
function showProjectDetails(projectTitle) {
    const project = portfolioItems.find(item => item.title === projectTitle);
    if (!project || !project.details) return;
    
    const modal = document.getElementById('projectDetailModal');
    const titleElement = document.getElementById('project-detail-title');
    const workflowContainer = document.getElementById('project-workflow-container');
    
    titleElement.textContent = project.title;
    workflowContainer.innerHTML = '';
    
    if (project.details.type === 'workflow') {
        renderWorkflow(project.details.steps, workflowContainer);
    }
    
    modal.style.display = 'block';
}

// 渲染工作流程图
function renderWorkflow(steps, container) {
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'workflow-step';
        
        // 步骤标题
        const titleElement = document.createElement('div');
        titleElement.className = 'workflow-title';
        titleElement.textContent = step.title;
        stepElement.appendChild(titleElement);
        
        // 步骤图片
        const imgElement = document.createElement('img');
        imgElement.className = 'workflow-image';
        imgElement.src = step.image;
        imgElement.alt = step.title;
        
        // 针对SVG图像的特殊处理
        if (step.image.endsWith('.svg')) {
            imgElement.style.backgroundColor = '#fff';
            imgElement.style.padding = '10px';
            imgElement.style.maxWidth = '800px';
            imgElement.style.height = 'auto';
        }
        
        stepElement.appendChild(imgElement);
        
        // 步骤描述（如果有）
        if (step.description) {
            const descElement = document.createElement('div');
            descElement.className = 'workflow-description';
            descElement.textContent = step.description;
            stepElement.appendChild(descElement);
        }
        
        // 分支（如果有）
        if (step.branches && step.branches.length > 0) {
            const branchesContainer = document.createElement('div');
            branchesContainer.className = 'branches-container';
            
            step.branches.forEach(branch => {
                const branchElement = document.createElement('div');
                branchElement.className = 'branch';
                
                // 连接线和说明
                const arrowElement = document.createElement('div');
                arrowElement.className = 'workflow-arrow';
                arrowElement.innerHTML = '&#8595;';
                branchElement.appendChild(arrowElement);
                
                const branchTitleElement = document.createElement('div');
                branchTitleElement.className = 'workflow-title';
                branchTitleElement.textContent = branch.title;
                branchElement.appendChild(branchTitleElement);
                
                // 分支目标图片
                const targetImg = document.createElement('img');
                targetImg.className = 'workflow-image';
                targetImg.src = branch.target;
                targetImg.alt = branch.title;
                branchElement.appendChild(targetImg);
                
                // 相关图片（如果有）
                if (branch.related) {
                    const relatedContainer = document.createElement('div');
                    relatedContainer.className = 'related-images';
                    
                    const relatedImgContainer = document.createElement('div');
                    relatedImgContainer.className = 'related-image-container';
                    
                    const relatedTitle = document.createElement('div');
                    relatedTitle.className = 'workflow-title';
                    relatedTitle.textContent = branch.relatedTitle || '相关输出';
                    relatedImgContainer.appendChild(relatedTitle);
                    
                    const relatedImg = document.createElement('img');
                    relatedImg.className = 'workflow-image';
                    relatedImg.src = branch.related;
                    relatedImg.alt = branch.relatedTitle || '相关输出';
                    relatedImgContainer.appendChild(relatedImg);
                    
                    relatedContainer.appendChild(relatedImgContainer);
                    branchElement.appendChild(relatedContainer);
                }
                
                branchesContainer.appendChild(branchElement);
            });
            
            stepElement.appendChild(branchesContainer);
        }
        
        container.appendChild(stepElement);
        
        // 添加箭头连接（最后一个步骤不需要）
        if (index < steps.length - 1) {
            const arrowElement = document.createElement('div');
            arrowElement.className = 'workflow-arrow';
            arrowElement.innerHTML = '&#8595;';
            container.appendChild(arrowElement);
        }
    });
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