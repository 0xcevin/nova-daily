#[test_only]
module podcast_contract::nova_daily_tests {
    use podcast_contract::nova_daily::{Self, EpisodeRegistry, NovaIdentity};
    use sui::test_scenario;

    #[test]
    fun test_full_flow() {
        let admin = @0xA;
        let mut scenario = test_scenario::begin(admin);

        // 初始化注册表
        {
            nova_daily::test_init(test_scenario::ctx(&mut scenario));
        };

        // 创建 Nova 身份
        test_scenario::next_tx(&mut scenario, admin);
        {
            nova_daily::create_identity(
                b"Nova",
                b"AI Assistant & Digital Companion",
                b"avatar_blob_123",
                test_scenario::ctx(&mut scenario)
            );
        };

        // 发布第一期播客
        test_scenario::next_tx(&mut scenario, admin);
        {
            let mut registry = test_scenario::take_shared<EpisodeRegistry>(&scenario);
            let identity = test_scenario::take_from_sender<NovaIdentity>(&scenario);
            
            let tags = vector[b"AI", b"Daily", b"Tech"];
            
            // publish_episode 返回 episode 对象
            let episode = nova_daily::publish_episode(
                &mut registry,
                &identity,
                b"2026-02-24",
                b"Nova Daily #1: First Episode",
                b"Today we discuss AI trends and new tools...",
                b"U0ue7_YssVF0sN6mipZW7wSz8nuh2x2bZgz--ldE3gE",
                tags,
                300,
                test_scenario::ctx(&mut scenario)
            );

            // 验证数据
            let (episode_id, date, title, _summary, blob_id, _tags_str, duration, _created_at) = 
                nova_daily::get_episode_info(&episode);
            
            assert!(episode_id == 0, 0);
            assert!(date == std::string::utf8(b"2026-02-24"), 1);
            assert!(title == std::string::utf8(b"Nova Daily #1: First Episode"), 2);
            assert!(blob_id == std::string::utf8(b"U0ue7_YssVF0sN6mipZW7wSz8nuh2x2bZgz--ldE3gE"), 3);
            assert!(duration == 300, 4);

            // 验证注册表
            assert!(nova_daily::get_total_episodes(&registry) == 1, 5);
            assert!(nova_daily::has_episode_on_date(&registry, &std::string::utf8(b"2026-02-24")), 6);

            // 转移 episode 到 admin（后续交易验证）
            sui::transfer::public_transfer(episode, admin);
            
            test_scenario::return_shared(registry);
            test_scenario::return_to_sender(&scenario, identity);
        };

        // 验证 episode 对象已存入 admin 账户
        test_scenario::next_tx(&mut scenario, admin);
        {
            let episode = test_scenario::take_from_sender<nova_daily::DailyEpisode>(&scenario);
            let blob_id = nova_daily::get_audio_blob_id(&episode);
            assert!(*blob_id == std::string::utf8(b"U0ue7_YssVF0sN6mipZW7wSz8nuh2x2bZgz--ldE3gE"), 7);
            test_scenario::return_to_sender(&scenario, episode);
        };

        test_scenario::end(scenario);
    }
}