using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

/// <summary>
/// 游戏面板类
/// </summary>
public class GamePanel : MonoBehaviour
{

    /// <summary>
    /// 暂停按钮
    /// </summary>
    private Button but_Pause;
    /// <summary>
    /// 播放按钮
    /// </summary>
    private Button but_Play;
    /// <summary>
    /// 分数
    /// </summary>
    private Text txt_Score;
    /// <summary>
    /// 钻石数
    /// </summary>
    private Text txt_DiamondCount;

    private void Awake()
    {
        EventCenter.AddListener(EventDefine.ShowGamePanel, Show);
        EventCenter.AddListener<int>(EventDefine.UpdateScoreText, UpdateTxtScore);
        EventCenter.AddListener<int>(EventDefine.UpdateDiamontText, UpdateDiamontText);
        Init();
    }

    /// <summary>
    /// 初始化
    /// </summary>
    private void Init()
    {
        but_Pause = transform.Find("but_Pause").GetComponent<Button>();
        but_Pause.onClick.AddListener(OnPauseButtonClick);
        but_Play = transform.Find("but_Play").GetComponent<Button>();
        but_Play.onClick.AddListener(OnPlayButtonClick);
        txt_Score = transform.Find("txt_Score").GetComponent<Text>();
        txt_DiamondCount = transform.Find("Diamond/txt_DiamondCount").GetComponent<Text>();
        but_Play.gameObject.SetActive(false);
        gameObject.SetActive(false);
    }

    private void OnDestroy()
    {
        EventCenter.RemoveListener(EventDefine.ShowGamePanel, Show);
        EventCenter.RemoveListener<int>(EventDefine.UpdateScoreText, UpdateTxtScore);
        EventCenter.RemoveListener<int>(EventDefine.UpdateDiamontText, UpdateDiamontText);
    }

    /// <summary>
    /// 显示
    /// </summary>
    private void Show()
    {
        gameObject.SetActive(true);
    }

    /// <summary>
    /// 开始按钮点击注册
    /// </summary>
    private void OnPlayButtonClick()
    {
        but_Play.gameObject.SetActive(false);
        but_Pause.gameObject.SetActive(true);
        //游戏开始
        Time.timeScale = 1;
        GameManager.Instance.isPause = false;
    }

    /// <summary>
    /// 暂停按钮点击注册
    /// </summary>
    private void OnPauseButtonClick()
    {
        but_Play.gameObject.SetActive(true);
        but_Pause.gameObject.SetActive(false);
        //游戏暂停
        Time.timeScale = 0;
        GameManager.Instance.isPause = true;
    }

    /// <summary>
    /// 更新游戏显示成绩
    /// </summary>
    /// <param name="score">成绩</param>
    private void UpdateTxtScore(int score)
    {
        txt_Score.text = score.ToString();
    }

    /// <summary>
    /// 更新钻石数
    /// </summary>
    /// <param name="diamont">钻石数</param>
    private void UpdateDiamontText(int diamont)
    {
        txt_DiamondCount.text = diamont.ToString();
    }
}
