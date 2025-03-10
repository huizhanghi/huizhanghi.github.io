console.log('chat.js 已加载');

const BOT_APP_KEY = 'pJmhbrnm';
const API_URL = 'https://wss.lke.cloud.tencent.com/v1/qbot/chat/sse';
const VISITOR_BIZ_ID = '202403130001';  // 访客ID
const STREAMING_THROTTLE = 1;  // 节流控制

// 全局单例
let chatManagerInstance = null;

class ChatManager {
    constructor() {
        // 确保只有一个实例
        if (chatManagerInstance) {
            return chatManagerInstance;
        }
        
        console.log('ChatManager 构造函数开始执行');
        
        // 先确认DOM元素是否存在
        const messages = document.getElementById('chat-messages');
        const input = document.getElementById('chat-input');
        const button = document.getElementById('send-message');
        
        console.log('DOM元素检查:', {
            messages: messages,
            input: input,
            button: button
        });
        
        if (!messages || !input || !button) {
            console.error('无法找到必要的DOM元素');
            return;
        }

        this.messagesContainer = messages;
        this.inputElement = input;
        this.sendButton = button;
        this.sessionId = this.generateSessionId();
        this.isSending = false;

        // 监听输入框值的变化
        this.currentInputValue = '';
        this.inputElement.addEventListener('input', (e) => {
            this.currentInputValue = e.target.value;
            console.log('输入框值变化:', this.currentInputValue);
        });

        // 绑定事件处理器
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // 绑定事件
        this.sendButton.addEventListener('click', this.handleSendClick);
        this.inputElement.addEventListener('keypress', this.handleKeyPress);

        console.log('ChatManager 构造函数执行完成');
        chatManagerInstance = this;
    }

    generateSessionId() {
        // 生成一个简单的会话ID
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async handleSendClick(e) {
        e.preventDefault();
        if (this.isSending) return;

        const content = this.currentInputValue.trim();
        if (content) {
            this.isSending = true;
            await this.sendMessage(content);
            this.isSending = false;
        }
    }

    async handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.isSending) return;

            const content = this.currentInputValue.trim();
            if (content) {
                this.isSending = true;
                await this.sendMessage(content);
                this.isSending = false;
            }
        }
    }

    async sendMessage(content) {
        console.log('sendMessage 开始执行，内容:', content);

        // 显示用户消息
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = content;
        this.messagesContainer.appendChild(userMessageDiv);

        this.inputElement.value = '';
        this.currentInputValue = '';

        try {
            const requestData = {
                request_id: Date.now().toString(),
                content: content,
                bot_app_key: BOT_APP_KEY,
                visitor_biz_id: VISITOR_BIZ_ID,
                session_id: this.sessionId,
                streaming_throttle: STREAMING_THROTTLE
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let aiMessageDiv = null;

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        try {
                            const eventData = JSON.parse(line.slice(5));
                            
                            // 只处理来自AI助手的回复消息
                            if (eventData.type === 'reply' && 
                                eventData.payload.content && 
                                eventData.payload.from_name === 'zh助手') {
                                
                                // 第一次收到消息时创建消息div
                                if (!aiMessageDiv) {
                                    aiMessageDiv = document.createElement('div');
                                    aiMessageDiv.className = 'message ai-message';
                                    this.messagesContainer.appendChild(aiMessageDiv);
                                }
                                
                                // 更新消息内容
                                aiMessageDiv.textContent = eventData.payload.content;
                                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                            }
                        } catch (e) {
                            console.error('解析SSE数据失败:', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Chat Error:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message ai-message';
            errorDiv.textContent = '抱歉，发生了错误，请稍后重试。';
            this.messagesContainer.appendChild(errorDiv);
        }
    }
}

// 初始化
const chatManager = new ChatManager(); 