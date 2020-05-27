using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 组合平台类型
/// </summary>
public enum PlatformGroupType
{
    /// <summary>
    /// 草地
    /// </summary>
    Grass,
    /// <summary>
    /// 冬季
    /// </summary>
    Winter,
}
/// <summary>
/// 平台生成类
/// </summary>
public class PlatformSpawner : MonoBehaviour
{
    /// <summary>
    /// 里程碑数
    /// </summary>
    public int milestoneCount = 10;
    /// <summary>
    /// 掉落时间
    /// </summary>
    public float fallTime;
    /// <summary>
    /// 最小掉落时间
    /// </summary>
    public float minFallTime;
    /// <summary>
    /// 掉落时间系数
    /// </summary>
    public float multiple;
    /// <summary>
    /// 平台初始生成位置
    /// </summary>
    public Vector3 startSpawnPos;
    /// <summary>
    /// 平台生成数量
    /// </summary>
    private int spawnPlatformCount;
    /// <summary>
    /// 资源管理器容器
    /// </summary>
    private ManagerVars vars;
    /// <summary>
    /// 下一个平台生成位置
    /// </summary>
    private Vector3 platformSpawnPosition;
    /// <summary>
    /// 是否向左生成，反之向右生成
    /// </summary>
    private bool isLeftSpawn;
    /// <summary>
    /// 钉子平台是否生成在左边，反之在右边
    /// </summary>
    private bool isSpikePlatformSpawnList;
    /// <summary>
    /// 选中的平台精灵
    /// </summary>
    private Sprite selectPlatformSprite;
    /// <summary>
    /// 组合类型
    /// </summary>
    private PlatformGroupType groupType;
    /// <summary>
    /// 钉子方向平台的位置
    /// </summary>
    private Vector3 spikeDirPlatformPos;
    /// <summary>
    /// 生成钉子平台之后需要在钉子方向生成的平台数量
    /// </summary>
    private int afterSpawnSpikeSpawnCount;
    /// <summary>
    /// 是否生成钉子方向的平台
    /// </summary>
    private bool isSpawnSpike;

    private void Awake()
    {
        EventCenter.AddListener(EventDefine.DecidePath, DecidePath);
        vars = ManagerVars.GetManagerVars();
    }

    private void Start()
    {
        RandomPlatformTheme();
        platformSpawnPosition = startSpawnPos;
        for (int i = 0; i < 5; i++)
        {
            spawnPlatformCount = 5;
            DecidePath();
        }

        //实例化玩家角色
        GameObject go = Instantiate(vars.CharacterPre);
        go.transform.position = new Vector3(0, -1.8f, 0);
    }

    private void Update()
    {
        if (GameManager.Instance.isGameStarted && !GameManager.Instance.isGameOver)
        {
            UpdateFallTime();
        }
    }

    /// <summary>
    /// 更新平台掉落时间
    /// </summary>
    private void UpdateFallTime()
    {
        //判断分数是否大于里程碑数
        if (GameManager.Instance.GetGameScore() > milestoneCount)
        {
            milestoneCount *= 2;
            fallTime *= multiple;
            //判断掉落时间是否超出最小掉落时间
            if (fallTime < minFallTime)
            {
                fallTime = minFallTime;
            }
        }
    }

    /// <summary>
    /// 随机平台主题
    /// </summary>
    private void RandomPlatformTheme()
    {
        //随机数
        int ran = Random.Range(0, vars.platformThemeSpriteList.Count);
        selectPlatformSprite = vars.platformThemeSpriteList[ran];
        //判断主题类型
        if (ran == 2)
        {
            groupType = PlatformGroupType.Winter;
        }
        else
        {
            groupType = PlatformGroupType.Grass;
        }
    }

    /// <summary>
    /// 确定路径
    /// </summary>
    private void DecidePath()
    {
        if (isSpawnSpike)
        {
            AfterSpawnSpike();
            return;
        }
        if (spawnPlatformCount > 0)
        {
            spawnPlatformCount--;
            SpawnPlatform();
        }
        else
        {
            //反转生成方向
            isLeftSpawn = !isLeftSpawn;
            //随机平台生成数
            spawnPlatformCount = Random.Range(1, 4);
            SpawnPlatform();
        }
    }

    /// <summary>
    /// 生成平台
    /// </summary>
    private void SpawnPlatform()
    {
        int ranObstacleDir = Random.Range(0, 2);
        //生成单个平台
        if (spawnPlatformCount >= 1)
        {
            SpawnNormalPlatform(ranObstacleDir);
        }
        //生成组合平台
        else if (spawnPlatformCount == 0)
        {
            int ran = Random.Range(0, 3);
            //生成通用组合平台
            if (ran == 0)
            {
                SpawnCommonPlatformGroup(ranObstacleDir);
            }
            //生成主题组合平台
            else if (ran == 1)
            {
                switch (groupType)
                {
                    case PlatformGroupType.Grass:
                        SpawnGrassPlatformGroup(ranObstacleDir);
                        break;
                    case PlatformGroupType.Winter:
                        SpawnWinterPlatformGroup(ranObstacleDir);
                        break;
                    default:
                        break;
                }
            }
            //生成钉子组合平台
            else
            {
                //方向
                int value = -1;
                if (isLeftSpawn)
                {
                    value = 0;
                }
                else
                {
                    value = 1;
                }
                SpikePlatformSpawn(value);

                isSpawnSpike = true;
                afterSpawnSpikeSpawnCount = 4;
                //钉子方向在左边
                if (isSpikePlatformSpawnList)
                {
                    spikeDirPlatformPos = new Vector3(platformSpawnPosition.x - 1.65f, platformSpawnPosition.y + vars.nextYPos, 0);
                }
                else
                {
                    spikeDirPlatformPos = new Vector3(platformSpawnPosition.x + 1.65f, platformSpawnPosition.y + vars.nextYPos, 0);
                }
            }
        }

        int ranSpawnDiamond = Random.Range(0, 10);
        if (ranSpawnDiamond >= 8 && GameManager.Instance.PlayerIsMove)
        {
            GameObject go = ObjectPool.Instance.GetDiamond();
            go.transform.position = new Vector3(platformSpawnPosition.x, platformSpawnPosition.y + 0.5f, 0);
            go.SetActive(true);
        }

        if (isLeftSpawn)//向左生成
        {
            //下一个位置坐标
            platformSpawnPosition = new Vector3(platformSpawnPosition.x - vars.nextXPos, platformSpawnPosition.y + vars.nextYPos, 0);
        }
        else//向右生成
        {
            //下一个位置坐标
            platformSpawnPosition = new Vector3(platformSpawnPosition.x + vars.nextXPos, platformSpawnPosition.y + vars.nextYPos, 0);
        }
    }

    /// <summary>
    /// 生成普通平台（单个）
    /// </summary>
    private void SpawnNormalPlatform(int ObstacleDir)
    {
        GameObject go = ObjectPool.Instance.GetNormalPlatfrom();
        go.transform.position = platformSpawnPosition;
        go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, ObstacleDir);
        go.SetActive(true);
    }

    /// <summary>
    /// 生成通用组合平台
    /// </summary>
    private void SpawnCommonPlatformGroup(int ObstacleDir)
    {
        GameObject go = ObjectPool.Instance.GetCommonPlatfromGroup();
        go.transform.position = platformSpawnPosition;
        go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, ObstacleDir);
        go.SetActive(true);
    }

    /// <summary>
    /// 生成草地组合平台
    /// </summary>
    private void SpawnGrassPlatformGroup(int ObstacleDir)
    {
        GameObject go = ObjectPool.Instance.GetGrassPlatfromGroup();
        go.transform.position = platformSpawnPosition;
        go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, ObstacleDir);
        go.SetActive(true);
    }

    /// <summary>
    /// 生成冬季组合平台
    /// </summary>
    private void SpawnWinterPlatformGroup(int ObstacleDir)
    {
        GameObject go = ObjectPool.Instance.GetWinterPlatfromGroup();
        go.transform.position = platformSpawnPosition;
        go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, ObstacleDir);
        go.SetActive(true);
    }

    /// <summary>
    /// 钉子平台生成
    /// </summary>
    /// <param name="dir">方向</param>
    private void SpikePlatformSpawn(int dir)
    {
        GameObject go = null;
        if (dir == 0)
        {
            isSpikePlatformSpawnList = false;
            go = ObjectPool.Instance.GetSpikePlatfromGroupRight();
        }
        else
        {
            isSpikePlatformSpawnList = true;
            go = ObjectPool.Instance.GetSpikePlatfromGroupLeft();
        }
        go.transform.position = platformSpawnPosition;
        go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, dir);
        go.SetActive(true);
    }

    /// <summary>
    /// 生成钉子平台之后需要生成的平台
    /// 包括钉子方向，也包括原来的方向
    /// </summary>
    private void AfterSpawnSpike()
    {
        if (afterSpawnSpikeSpawnCount > 0)
        {
            afterSpawnSpikeSpawnCount--;
            for (int i = 0; i < 2; i++)
            {
                GameObject go = ObjectPool.Instance.GetNormalPlatfrom();
                //生成原来方向的平台
                if (i == 0)
                {
                    go.transform.position = platformSpawnPosition;
                    if (isSpikePlatformSpawnList)
                    {
                        platformSpawnPosition = new Vector3(platformSpawnPosition.x + vars.nextXPos, platformSpawnPosition.y + vars.nextYPos, 0);
                    }
                    else
                    {
                        platformSpawnPosition = new Vector3(platformSpawnPosition.x - vars.nextXPos, platformSpawnPosition.y + vars.nextYPos, 0);
                    }
                }
                //生成钉子方向的平台
                else
                {
                    go.transform.position = spikeDirPlatformPos;
                    if (isSpikePlatformSpawnList)
                    {
                        spikeDirPlatformPos = new Vector3(spikeDirPlatformPos.x - vars.nextXPos, spikeDirPlatformPos.y + vars.nextYPos, 0);
                    }
                    else
                    {
                        spikeDirPlatformPos = new Vector3(spikeDirPlatformPos.x + vars.nextXPos, spikeDirPlatformPos.y + vars.nextYPos, 0);
                    }
                }
                go.GetComponent<PlatformScript>().Init(selectPlatformSprite, fallTime, 0);
                go.SetActive(true);
            }
        }
        else
        {
            isSpawnSpike = false;
            DecidePath();
        }
    }
}
