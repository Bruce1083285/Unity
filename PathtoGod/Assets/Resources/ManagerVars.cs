using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//[CreateAssetMenu(menuName = "CreateManagerVarsContainer")]
/// <summary>
/// 资源管理器容器
/// </summary>
public class ManagerVars : ScriptableObject
{
    /// <summary>
    /// 获取资源管理器容器
    /// </summary>
    /// <returns>加载ManagerVarsContainer文件中的资源</returns>
    public static ManagerVars GetManagerVars()
    {
        return Resources.Load<ManagerVars>("ManagerVarsContainer");
    }
    /// <summary>
    /// 背景资源集合
    /// </summary>
    public List<Sprite> bgThemeSpritList = new List<Sprite>();
    /// <summary>
    /// 平台主体精灵集合
    /// </summary>
    public List<Sprite> platformThemeSpriteList = new List<Sprite>();

    /// <summary>
    /// 玩家角色
    /// </summary>
    public GameObject CharacterPre;

    /// <summary>
    /// 死亡特效
    /// </summary>
    public GameObject deathEffect;

    /// <summary>
    /// 钻石
    /// </summary>
    public GameObject diamond;

    /// <summary>
    /// 平台预制体
    /// </summary>
    public GameObject PlatformPre;
    /// <summary>
    /// 通用组合平台
    /// </summary>
    public List<GameObject> commonPlatformGroup = new List<GameObject>();
    /// <summary>
    /// 草地组合平台
    /// </summary>
    public List<GameObject> grassPlatformGroup = new List<GameObject>();
    /// <summary>
    /// 通用组合平台
    /// </summary>
    public List<GameObject> winterPlatformGroup = new List<GameObject>();
    /// <summary>
    /// 钉子组合平台左
    /// </summary>
    public GameObject spikePlatformGroupLeft;
    /// <summary>
    /// 钉子组合平台右
    /// </summary>
    public GameObject spikePlatformGroupRight;

    /// <summary>
    /// 下一个X轴位置，下一个Y轴位置
    /// </summary>
    public float nextXPos = 0.554f, nextYPos = 0.645f;
}
