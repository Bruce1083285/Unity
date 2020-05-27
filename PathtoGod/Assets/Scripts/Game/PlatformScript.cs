using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 平台脚本类
/// </summary>
public class PlatformScript : MonoBehaviour
{
    /// <summary>
    /// 精灵组件数组
    /// </summary>
    public SpriteRenderer[] spriteRenderers;
    /// <summary>
    /// 障碍物
    /// </summary>
    public GameObject Obstacle;
    /// <summary>
    /// 是否开始计时
    /// </summary>
    private bool startTimer;
    /// <summary>
    /// 掉落时间
    /// </summary>
    private float fallTime;
    /// <summary>
    /// 自身刚体
    /// </summary>
    private Rigidbody2D my_Body;

    private void Awake()
    {
        my_Body = GetComponent<Rigidbody2D>();
    }

    /// <summary>
    /// 初始化
    /// </summary>
    /// <param name="sprite">精灵</param>
    /// <param name="falltime">掉落时间</param>
    /// <param name="ObstacleDir">障碍物方向</param>
    public void Init(Sprite sprite, float fallTime, int ObstacleDir)
    {
        //初始化刚体类型
        my_Body.bodyType = RigidbodyType2D.Static;
        this.fallTime = fallTime;
        startTimer = true;
        for (int i = 0; i < spriteRenderers.Length; i++)
        {
            spriteRenderers[i].sprite = sprite;
        }

        //障碍物朝向右边
        if (ObstacleDir == 0)
        {
            if (Obstacle != null)
            {
                Obstacle.transform.localPosition = new Vector3(-Obstacle.transform.localPosition.x, Obstacle.transform.localPosition.y, Obstacle.transform.localPosition.z);
            }
        }
    }

    private void Update()
    {
        if (!GameManager.Instance.isGameStarted || !GameManager.Instance.PlayerIsMove)
        {
            return;
        }

        if (startTimer)
        {
            fallTime -= Time.deltaTime;
            if (fallTime < 0)
            {
                //停止倒计时
                startTimer = false;
                //平台掉落
                if (my_Body.bodyType != RigidbodyType2D.Dynamic)
                {
                    //设置刚体类型
                    my_Body.bodyType = RigidbodyType2D.Dynamic;
                    StartCoroutine(DealyHide());
                }
            }
        }
        //当平台与主相机距离小于-6（平台未下落，角色移动太快，致使平台离开主相机范围）
        if (transform.position.y - Camera.main.transform.position.y < -6)
        {
            StartCoroutine(DealyHide());
        }
    }

    /// <summary>
    /// 协程延时
    /// </summary>
    /// <returns></returns>
    private IEnumerator DealyHide()
    {
        //延时1秒
        yield return new WaitForSeconds(1f);
        gameObject.SetActive(false);
    }
}
