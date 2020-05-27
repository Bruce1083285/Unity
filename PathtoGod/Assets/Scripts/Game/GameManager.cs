using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 游戏管理器
/// </summary>
public class GameManager : MonoBehaviour
{
    /// <summary>
    /// 单例
    /// </summary>
    public static GameManager Instance;
    /// <summary>
    /// 游戏是否开始
    /// </summary>
    public bool isGameStarted { get; set; }
    /// <summary>
    /// 游戏是否结束
    /// </summary>
    public bool isGameOver { get; set; }
    /// <summary>
    /// 是否暂停
    /// </summary>
    public bool isPause { get; set; }
    /// <summary>
    /// 玩家是否开始移动
    /// </summary>
    public bool PlayerIsMove { get; set; }
    /// <summary>
    /// 游戏成绩
    /// </summary>
    private int gameScore;
    /// <summary>
    /// 游戏钻石
    /// </summary>
    private int gameDiamont;
    private void Awake()
    {
        Instance = this;
        EventCenter.AddListener(EventDefine.AddScore, AddGameScore);
        EventCenter.AddListener(EventDefine.PlayerMove, PlayerMove);
        EventCenter.AddListener(EventDefine.AddDiamont, AddGameDiamont);

        if (GameData.IsRestart)
        {
            isGameStarted = true;
        }
    }

    private void OnDestroy()
    {
        EventCenter.RemoveListener(EventDefine.AddScore, AddGameScore);
        EventCenter.RemoveListener(EventDefine.PlayerMove, PlayerMove);
        EventCenter.RemoveListener(EventDefine.AddDiamont, AddGameDiamont);
    }

    /// <summary>
    /// 玩家移动
    /// </summary>
    private void PlayerMove()
    {
        PlayerIsMove = true;
    }

    /// <summary>
    /// 增加游戏成绩
    /// </summary>
    private void AddGameScore()
    {
        if (!isGameStarted || isGameOver || isPause)
        {
            return;
        }

        gameScore++;
        //广播事件
        EventCenter.Broadcast<int>(EventDefine.UpdateScoreText, gameScore);
    }

    /// <summary>
    /// 获取游戏成绩
    /// </summary>
    /// <returns>游戏成绩</returns>
    public int GetGameScore()
    {
        return gameScore;
    }

    /// <summary>
    /// 获取游戏钻石
    /// </summary>
    /// <returns></returns>
    public int GetGameDiamont()
    {
        return gameDiamont;
    }

    /// <summary>
    /// 增加游戏钻石
    /// </summary>
    private void AddGameDiamont()
    {
        gameDiamont++;
        EventCenter.Broadcast(EventDefine.UpdateDiamontText, gameDiamont);
    }
}
