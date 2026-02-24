# Nova Daily - AI 驱动的每日播客

Nova 的每日播客项目，包含 Sui 链上合约和官方网站。

## 项目结构

```
.
├── Move.toml              # 包配置
├── sources/
│   └── nova_daily.move    # 主合约
├── tests/
│   └── nova_daily_tests.move  # 测试
└── website/
    └── index.html         # 播客官网
```

## 合约功能

### 核心对象

- **NovaIdentity**: Nova 的身份信息（名称、简介、头像 Blob、管理员地址）
- **DailyEpisode**: 每日播客条目（标题、摘要、Walrus Blob、标签、时长）
- **EpisodeRegistry**: 全局注册表（日期索引、总数统计）

### 事件

- `NovaIdentityCreated`: 身份创建
- `EpisodePublished`: 新播客发布

## 快速开始

### 安装依赖

需要安装 Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui --branch testnet sui
```

### 构建与测试

```bash
# 构建
sui move build

# 测试
sui move test
```

### 部署

```bash
# 切换到目标网络
sui client switch --env testnet  # 或 mainnet

# 发布合约
sui client publish --gas-budget 50000000
```

### 创建 Nova 身份

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nova_daily \
  --function create_identity \
  --args "Nova" "AI Assistant & Daily Podcaster" "<avatar_walrus_blob_id>"
```

### 发布播客

```bash
sui client call \
  --package <PACKAGE_ID> \
  --module nova_daily \
  --function publish_episode \
  --args \
    <REGISTRY_OBJECT_ID> \
    <IDENTITY_OBJECT_ID> \
    "2026-02-24" \
    "Nova Daily #1: Hello World" \
    "Today we explore..." \
    "<audio_walrus_blob_id>" \
    '["AI", "Tech", "Daily"]' \
    300
```

## 查询函数

- `get_total_episodes(registry)`: 获取总期数
- `get_episode_id_by_date(registry, date)`: 按日期查 episode_id
- `get_episode_object_id(registry, episode_id)`: 查对象 ID
- `has_episode_on_date(registry, date)`: 检查某天是否有发布

## 播客官网

位于 `website/` 目录，使用 **UI UX Pro Max** 设计系统：

- 🎨 **设计风格**: Dark Mode (OLED) + Glassmorphism
- 🎯 **配色方案**: 深紫主色 (#1E1B4B) + 橙色 CTA (#F97316)
- ✍️ **字体搭配**: Newsreader (标题) + Roboto (正文)
- 📱 **响应式**: 支持移动端到桌面端
- 🎵 **特色**: 音频波形动画、固定播放器栏

### 本地预览

```bash
cd website
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## License

MIT