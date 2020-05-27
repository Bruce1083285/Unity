using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 主面板类
/// </summary>
public class MainPanel : MonoBehaviour
{
    /// <summary>
    /// 开始按钮
    /// </summary>
    private Button but_Start;
    /// <summary>
    /// 商店按钮
    /// </summary>
    private Button but_Shop;
    /// <summary>
    /// 排行榜按钮
    /// </summary>
    private Button but_Rank;
    /// <summary>
    /// 音效按钮
    /// </summary>
    private Button but_Sound;

    private void Awake()
    {
        Init();
    }

    private void Start()
    {
        if (GameData.IsRestart)
        {
            EventCenter.Broadcast(EventDefine.ShowGamePanel);
            gameObject.SetActive(false);
        }
    }

    /// <summary>
    /// 初始化
    /// </summary>
    private void Init()
    {
        but_Start = transform.Find("but_Start").GetComponent<Button>();
        //添加监听
        but_Start.onClick.AddListener(OnStartButtonClick);
        but_Shop = transform.Find("Buts/but_Shop").GetComponent<Button>();
        //添加监听
        but_Shop.onClick.AddListener(OnShopButtonClick);
        but_Rank = transform.Find("Buts/but_Rank").GetComponent<Button>();
        //添加监听
        but_Rank.onClick.AddListener(OnRankButtonClick);
        but_Sound = transform.Find("Buts/but_Sound").GetComponent<Button>();
        //添加监听
        but_Sound.onClick.AddListener(OnSoundButtonClick);
    }

    /// <summary>
    /// 开始按钮点击注册
    /// </summary>
    private void OnStartButtonClick()
    {
        GameManager.Instance.isGameStarted = true;
        EventCenter.Broadcast(EventDefine.ShowGamePanel);
        gameObject.SetActive(false);
    }

    /// <summary>
    /// 商店按钮点击注册
    /// </summary>
    private void OnShopButtonClick()
    {

    }

    /// <summary>
    /// 排行榜按钮点击注册
    /// </summary>
    private void OnRankButtonClick()
    {

    }

    /// <summary>
    /// 音效按钮点击注册
    /// </summary>
    private void OnSoundButtonClick()
    {

    }
}
