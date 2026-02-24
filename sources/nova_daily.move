module podcast_contract::nova_daily {
    use std::string::{Self, String};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};

    // ============ 错误码 ============
    const ENotAuthorized: u64 = 0;
    const EEpisodeAlreadyExists: u64 = 1;
    const EEpisodeNotFound: u64 = 2;

    // ============ 核心对象 ============
    
    /// Nova 的身份配置 - 由部署者持有
    public struct NovaIdentity has key {
        id: UID,
        name: String,
        bio: String,
        avatar_blob_id: String,  // Walrus 头像
        admin: address,          // 可以发布内容的地址
    }

    /// 每日播客条目 - 每个 episode 是一个独立对象
    public struct DailyEpisode has key, store {
        id: UID,
        episode_id: u64,         // 第几期
        date: String,            // YYYY-MM-DD 格式
        title: String,
        summary: String,         // AI 生成的内容摘要
        blob_id: String,         // Walrus 音频文件
        tags: VecSet<String>,    // 标签集合
        duration_secs: u64,      // 音频时长（秒）
        created_at: u64,         // 时间戳
    }

    /// 播客注册表 - 全局共享
    public struct EpisodeRegistry has key {
        id: UID,
        total_episodes: u64,
        // 日期 -> episode_id
        date_to_episode: Table<String, u64>,
        // episode_id -> Episode 对象 ID
        id_lookup: Table<u64, ID>,
    }

    // ============ 事件 ============
    
    public struct EpisodePublished has copy, drop {
        episode_id: u64,
        date: String,
        title: String,
        blob_id: String,
    }

    public struct NovaIdentityCreated has copy, drop {
        identity_id: ID,
        admin: address,
    }

    // ============ 初始化 ============
    
    fun init(ctx: &mut TxContext) {
        let registry = EpisodeRegistry {
            id: object::new(ctx),
            total_episodes: 0,
            date_to_episode: table::new(ctx),
            id_lookup: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    /// 创建 Nova 身份（只在部署时调用一次）
    public fun create_identity(
        name: vector<u8>,
        bio: vector<u8>,
        avatar_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let identity = NovaIdentity {
            id: object::new(ctx),
            name: string::utf8(name),
            bio: string::utf8(bio),
            avatar_blob_id: string::utf8(avatar_blob_id),
            admin: tx_context::sender(ctx),
        };
        
        event::emit(NovaIdentityCreated {
            identity_id: object::id(&identity),
            admin: tx_context::sender(ctx),
        });
        
        transfer::transfer(identity, tx_context::sender(ctx));
    }

    // ============ 核心功能 ============

    /// 发布每日播客
    public fun publish_episode(
        registry: &mut EpisodeRegistry,
        identity: &NovaIdentity,
        date: vector<u8>,        // "2026-02-24"
        title: vector<u8>,
        summary: vector<u8>,     // AI 内容摘要
        blob_id: vector<u8>,     // Walrus 音频
        tags: vector<vector<u8>>,// ["AI", "科技", "每日播报"]
        duration_secs: u64,
        ctx: &mut TxContext
    ): DailyEpisode {
        // 验证权限
        assert!(tx_context::sender(ctx) == identity.admin, ENotAuthorized);
        
        let date_str = string::utf8(date);
        assert!(!table::contains(&registry.date_to_episode, date_str), EEpisodeAlreadyExists);

        let episode_id = registry.total_episodes;
        
        // 构建标签集合
        let mut tag_set = vec_set::empty<String>();
        let mut i = 0;
        while (i < vector::length(&tags)) {
            vec_set::insert(&mut tag_set, string::utf8(*vector::borrow(&tags, i)));
            i = i + 1;
        };

        let episode = DailyEpisode {
            id: object::new(ctx),
            episode_id,
            date: date_str,
            title: string::utf8(title),
            summary: string::utf8(summary),
            blob_id: string::utf8(blob_id),
            tags: tag_set,
            duration_secs,
            created_at: tx_context::epoch_timestamp_ms(ctx),
        };

        let episode_object_id = object::id(&episode);

        // 更新注册表
        table::add(&mut registry.date_to_episode, date_str, episode_id);
        table::add(&mut registry.id_lookup, episode_id, episode_object_id);
        registry.total_episodes = episode_id + 1;

        // 发送事件
        event::emit(EpisodePublished {
            episode_id,
            date: date_str,
            title: episode.title,
            blob_id: episode.blob_id,
        });

        episode
    }

    // ============ 查询函数 ============

    /// 获取总期数
    public fun get_total_episodes(registry: &EpisodeRegistry): u64 {
        registry.total_episodes
    }

    /// 根据日期查 episode_id
    public fun get_episode_id_by_date(registry: &EpisodeRegistry, date: &String): u64 {
        *table::borrow(&registry.date_to_episode, *date)
    }

    /// 根据 episode_id 查对象 ID
    public fun get_episode_object_id(registry: &EpisodeRegistry, episode_id: u64): &ID {
        table::borrow(&registry.id_lookup, episode_id)
    }

    /// 获取 episode 完整信息
    public fun get_episode_info(episode: &DailyEpisode): (u64, String, String, String, String, String, u64, u64) {
        (
            episode.episode_id,
            episode.date,
            episode.title,
            episode.summary,
            episode.blob_id,
            get_tags_string(episode),
            episode.duration_secs,
            episode.created_at
        )
    }

    /// 获取 episode 的 Walrus Blob ID
    public fun get_audio_blob_id(episode: &DailyEpisode): &String {
        &episode.blob_id
    }

    /// 将标签集合转为逗号分隔字符串
    fun get_tags_string(episode: &DailyEpisode): String {
        let tags = &episode.tags;
        let mut result = string::utf8(b"");
        let keys = vec_set::keys(tags);
        let len = vector::length(keys);
        let mut i = 0;
        
        while (i < len) {
            if (i > 0) {
                string::append(&mut result, string::utf8(b","));
            };
            string::append(&mut result, *vector::borrow(keys, i));
            i = i + 1;
        };
        
        result
    }

    /// 检查某天是否有发布
    public fun has_episode_on_date(registry: &EpisodeRegistry, date: &String): bool {
        table::contains(&registry.date_to_episode, *date)
    }

    // ============ 管理功能 ============

    /// 转移管理员权限
    public fun transfer_admin(identity: &mut NovaIdentity, new_admin: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == identity.admin, ENotAuthorized);
        identity.admin = new_admin;
    }

    /// 更新头像
    public fun update_avatar(identity: &mut NovaIdentity, new_avatar_blob_id: vector<u8>, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == identity.admin, ENotAuthorized);
        identity.avatar_blob_id = string::utf8(new_avatar_blob_id);
    }

    /// 更新简介
    public fun update_bio(identity: &mut NovaIdentity, new_bio: vector<u8>, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == identity.admin, ENotAuthorized);
        identity.bio = string::utf8(new_bio);
    }

    // ============ 测试辅助 ============
    #[test_only]
    public fun test_init(ctx: &mut TxContext) {
        init(ctx);
    }
}