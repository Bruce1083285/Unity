using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameoverPanel : MonoBehaviour
{
    /// <summary>
    /// 文本--->分数，最高分数,钻石数
    /// </summary>
    public Text txt_Score, txt_BestScore, txt_DiamontCount;
    /// <summary>
    /// 按钮--->再试一次，排行榜，主页
    /// </summary>
    public Button but_Restart, but_Rank, but_Home;

    public void Awake()
    {
        //注册按钮点击监听
        but_Restart.onClick.AddListener(OnRestartButtonClick);
        but_Rank.onClick.AddListener(OnRankButtonClick);
        but_Home.onClick.AddListener(OnHomeButtonClick);

        EventCenter.AddListener(EventDefine.ShowGameOverPanel, Show);
        gameObject.SetActive(false);
    }

    private void OnDestroy()
    {
        EventCenter.RemoveListener(EventDefine.ShowGameOverPanel, Show);
    }

    /// <summary>
    /// 显示
    /// </summary>
    private void Show()
    {
        txt_Score.text = GameManager.Instance.GetGameScore().ToString();
        txt_DiamontCount.text = "+" + GameManager.Instance.GetGameDiamont().ToString();
        gameObject.SetActive(true);
    }

    /// <summary>
    /// 注册--->再试一次按钮点击
    /// </summary>
    private void OnRestartButtonClick()
    {
        string name = SceneManager.GetActiveScene().name; 
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        GameData.IsRestart = true;
    }

    /// <summary>
    /// 注册--->排行榜按钮点击
    /// </summary>
    private void OnRankButtonClick()
    {

    }

    /// <summary>
    /// 注册--->主页按钮点击
    /// </summary>
    private void OnHomeButtonClick()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
        GameData.IsRestart = false;
    }
}
