using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 背景主题类
/// </summary>
public class BgTheme : MonoBehaviour
{
    /// <summary>
    /// 精灵渲染器
    /// </summary>
    private SpriteRenderer m_SpriteRenderer;
    /// <summary>
    /// 资源管理器容器
    /// </summary>
    private ManagerVars vars;

    public void Awake()
    {
        //获取资源管理容器
        vars = ManagerVars.GetManagerVars();
        //获取精灵渲染组件
        m_SpriteRenderer = GetComponent<SpriteRenderer>();
        //随机下标索引
        int ranValue = Random.Range(0, vars.bgThemeSpritList.Count);
        m_SpriteRenderer.sprite = vars.bgThemeSpritList[ranValue];
    }
}
