using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 对象池
/// </summary>
public class ObjectPool : MonoBehaviour
{
    /// <summary>
    /// 单例
    /// </summary>
    public static ObjectPool Instance;
    /// <summary>
    /// 初始生成次数
    /// </summary>
    public int initSpawnCount = 5;
    /// <summary>
    /// 普通（单个）平台集合
    /// </summary>
    private List<GameObject> normalPlatformList = new List<GameObject>();
    /// <summary>
    /// 通用组合平台集合
    /// </summary>
    private List<GameObject> commonPlatformList = new List<GameObject>();
    /// <summary>
    /// 草地组合平台集合
    /// </summary>
    private List<GameObject> grassPlatformList = new List<GameObject>();
    /// <summary>
    /// 冬季组合平台集合
    /// </summary>
    private List<GameObject> winterPlatformList = new List<GameObject>();
    /// <summary>
    /// 钉子组合平台集合>>>左
    /// </summary>
    private List<GameObject> spikePlatformLeftList = new List<GameObject>();
    /// <summary>
    /// 钉子组合平台集合>>>右
    /// </summary>
    private List<GameObject> spikePlatformRightList = new List<GameObject>();
    /// <summary>
    /// 死亡特效集合
    /// </summary>
    private List<GameObject> deathEffectList = new List<GameObject>();
    /// <summary>
    /// 钻石集合
    /// </summary>
    private List<GameObject> diamondList = new List<GameObject>();
    /// <summary>
    /// 资源管理器容器
    /// </summary>
    private ManagerVars vars;

    private void Awake()
    {
        Instance = this;
        Init();
    }

    /// <summary>
    /// 初始化
    /// </summary>
    private void Init()
    {
        vars = ManagerVars.GetManagerVars();
        SetPlatformList();
    }

    /// <summary>
    /// 设置平台集合
    /// </summary>
    private void SetPlatformList()
    {
        //普通（单个）平台
        for (int i = 0; i < initSpawnCount; i++)
        {
            InstantiateObject(vars.PlatformPre, normalPlatformList);
        }

        //通用组合平台
        for (int i = 0; i < vars.commonPlatformGroup.Count; i++)
        {
            for (int j = 0; j < initSpawnCount; j++)
            {
                InstantiateObject(vars.commonPlatformGroup[i], commonPlatformList);
            }
        }

        //草地组合平台
        for (int i = 0; i < vars.grassPlatformGroup.Count; i++)
        {
            for (int j = 0; j < initSpawnCount; j++)
            {
                InstantiateObject(vars.grassPlatformGroup[i], grassPlatformList);
            }
        }

        //冬季组合平台
        for (int i = 0; i < vars.winterPlatformGroup.Count; i++)
        {
            for (int j = 0; j < initSpawnCount; j++)
            {
                InstantiateObject(vars.winterPlatformGroup[i], winterPlatformList);
            }
        }

        //钉子组合平台>>>左
        for (int i = 0; i < initSpawnCount; i++)
        {
            InstantiateObject(vars.spikePlatformGroupLeft, spikePlatformLeftList);
        }

        //钉子组合平台>>>右
        for (int i = 0; i < initSpawnCount; i++)
        {
            InstantiateObject(vars.spikePlatformGroupRight, spikePlatformRightList);
        }

        //死亡特效
        for (int i = 0; i < initSpawnCount; i++)
        {
            InstantiateObject(vars.deathEffect, deathEffectList);
        }

        //钻石
        for (int i = 0; i < initSpawnCount; i++)
        {
            InstantiateObject(vars.diamond, diamondList);
        }
    }

    /// <summary>
    /// 实例化对象
    /// </summary>
    /// <param name="prefab">预制体</param>
    /// <param name="list">集合</param>
    private GameObject InstantiateObject(GameObject prefab, List<GameObject> list)
    {
        GameObject go = Instantiate(prefab, transform);
        go.SetActive(false);
        list.Add(go);
        return go;
    }

    /// <summary>
    /// 获取普通（单个）平台
    /// </summary>
    /// <returns>普通（单个）平台</returns>
    public GameObject GetNormalPlatfrom()
    {
        GameObject go = GetCanUseObject(normalPlatformList);
        if (go != null)
        {
            return go;
        }

        return InstantiateObject(vars.PlatformPre, normalPlatformList);
    }

    /// <summary>
    /// 获取通用组合平台
    /// </summary>
    /// <returns>通用组合平台</returns>
    public GameObject GetCommonPlatfromGroup()
    {
        GameObject go = GetCanUseObject(commonPlatformList);
        if (go != null)
        {
            return go;
        }

        int ran = Random.Range(0, vars.commonPlatformGroup.Count);
        return InstantiateObject(vars.commonPlatformGroup[ran], commonPlatformList);
    }


    /// <summary>
    /// 获取草地组合平台
    /// </summary>
    /// <returns>草地组合平台</returns>
    public GameObject GetGrassPlatfromGroup()
    {
        GameObject go = GetCanUseObject(grassPlatformList);
        if (go != null)
        {
            return go;
        }

        int ran = Random.Range(0, vars.grassPlatformGroup.Count);
        return InstantiateObject(vars.grassPlatformGroup[ran], grassPlatformList);
    }

    /// <summary>
    /// 获取冬季组合平台
    /// </summary>
    /// <returns>冬季组合平台</returns>
    public GameObject GetWinterPlatfromGroup()
    {
        GameObject go = GetCanUseObject(winterPlatformList);
        if (go != null)
        {
            return go;
        }

        int ran = Random.Range(0, vars.winterPlatformGroup.Count);
        return InstantiateObject(vars.winterPlatformGroup[ran], winterPlatformList);
    }

    /// <summary>
    /// 获取钉子组合平台>>>左
    /// </summary>
    /// <returns>钉子组合平台>>>左</returns>
    public GameObject GetSpikePlatfromGroupLeft()
    {
        GameObject go = GetCanUseObject(spikePlatformLeftList);
        if (go != null)
        {
            return go;
        }

        return InstantiateObject(vars.spikePlatformGroupLeft, spikePlatformLeftList);
    }

    /// <summary>
    /// 获取钉子组合平台>>>右
    /// </summary>
    /// <returns>钉子组合平台>>>右</returns>
    public GameObject GetSpikePlatfromGroupRight()
    {
        GameObject go = GetCanUseObject(spikePlatformRightList);
        if (go != null)
        {
            return go;
        }

        return InstantiateObject(vars.spikePlatformGroupRight, spikePlatformRightList);
    }

    /// <summary>
    /// 获取死亡特效
    /// </summary>
    /// <returns>死亡特效</returns>
    public GameObject GetDeathEffect()
    {
        GameObject go = GetCanUseObject(deathEffectList);
        if (go != null)
        {
            return go;
        }

        return InstantiateObject(vars.deathEffect, deathEffectList);
    }

    /// <summary>
    /// 获取钻石
    /// </summary>
    /// <returns>死亡特效</returns>
    public GameObject GetDiamond()
    {
        GameObject go = GetCanUseObject(diamondList);
        if (go != null)
        {
            return go;
        }

        return InstantiateObject(vars.diamond, diamondList);
    }

    /// <summary>
    /// 获取可以使用的对象
    /// </summary>
    /// <param name="list">集合</param>
    /// <returns>可以使用的对象，没有则为空</returns>
    public GameObject GetCanUseObject(List<GameObject> list)
    {
        //遍历集合
        for (int i = 0; i < list.Count; i++)
        {
            //判断是否有可以使用的对象
            if (!list[i].activeInHierarchy)
            {
                return list[i];
            }
        }

        return null;
    }
}
