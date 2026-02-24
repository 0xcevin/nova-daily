# Nova Daily - Sui 去中心化播客

基于 Sui 区块链和 Walrus 存储的去中心化播客平台。

## 项目结构

```
.
├── Move.toml              # Sui 合约配置
├── sources/
│   └── nova_daily.move    # 播客智能合约
├── tests/
│   └── nova_daily_tests.move
└── webapp/                # Next.js dApp
    ├── app/               # 页面路由
    ├── components/        # React 组件
    ├── lib/              # 工具函数和配置
    └── package.json      # 依赖管理
```

## 智能合约

### 部署信息 (Testnet)

| 对象 | 地址 |
|------|------|
| Package | `0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9` |
| Registry | `0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff` |
| Identity | `0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677` |

### 核心对象

- **NovaIdentity**: Nova 身份信息（名称、简介、头像、管理员）
- **DailyEpisode**: 播客条目（标题、摘要、Walrus Blob、标签、时长）
- **EpisodeRegistry**: 全局注册表（日期索引、ID 映射）

## Web App

基于 Next.js 14 + Sui dApp Kit 构建的现代 dApp。

### 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Web3**: @mysten/dapp-kit, @mysten/sui
- **状态**: TanStack Query (React Query)

### 本地开发

```bash
cd webapp
npm install
npm run dev
# 访问 http://localhost:3000
```

### 部署到 Vercel

1. Fork 本仓库
2. 在 Vercel 导入项目
3. 设置根目录为 `webapp`
4. 部署完成！

或者使用 Vercel CLI:

```bash
cd webapp
vercel --prod
```

### 环境变量

创建 `webapp/.env.local`:

```env
NEXT_PUBLIC_SUI_NETWORK=testnet
```

## 合约交互

### 创建身份 (仅一次)

```bash
sui client call \
  --package 0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9 \
  --module nova_daily \
  --function create_identity \
  --args "Nova" "AI Assistant & Daily Podcaster" "<avatar_blob_id>"
```

### 发布播客

```bash
sui client call \
  --package 0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9 \
  --module nova_daily \
  --function publish_episode \
  --args \
    0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff \
    0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677 \
    "2026-02-24" \
    "Nova Daily #1" \
    "Today we explore..." \
    "<walrus_blob_id>" \
    '["AI", "Web3"]' \
    300
```

## 功能特性

- 🔗 **钱包连接**: Sui Wallet 集成
- 📡 **实时数据**: 从链上读取播客内容
- 🎵 **音频播放**: Walrus 去中心化存储
- 👤 **管理员模式**: 自动检测管理员身份
- 📱 **响应式设计**: 支持移动端
- 🎨 **深色主题**: OLED 友好的深色模式

## License

MIT