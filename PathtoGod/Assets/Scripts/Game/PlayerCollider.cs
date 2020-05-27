using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;
using UnityEngine.EventSystems;
using System;

/// <summary>
/// 玩家碰撞
/// </summary>
public class PlayerCollider : MonoBehaviour
{
    /// <summary>
    /// 射线起始位置
    /// </summary>
    public Transform rayDown, rayLeft, rayRight;
    /// <summary>
    /// 需要被射线检测到的层>>>平台层和障碍物层
    /// </summary>
    public LayerMask PlatformLayer, ObstacleLayer;
    /// <summary>
    /// 是否向左移动，反之向右
    /// </summary>
    private bool isMoveLeft = false;
    /// <summary>
    /// 是否正在跳跃
    /// </summary>
    private bool isJumping = false;
    /// <summary>
    /// 向左下一个台阶位置，向右下一个台阶位置
    /// </summary>
    private Vector3 nextPlatformLeft, nextPlatformRight;
    /// <summary>
    /// 资源管理器容器
    /// </summary>
    private ManagerVars vars;
    /// <summary>
    /// 刚体2D
    /// </summary>
    private Rigidbody2D my_Body;
    /// <summary>
    /// 精灵组件
    /// </summary>
    private SpriteRenderer spriteRenderer;
    /// <summary>
    /// 上一个射线检测到的物体
    /// </summary>
    private GameObject lastHitGo = null;
    /// <summary>
    /// 是否移动
    /// </summary>
    private bool isMove = false;

    private void Awake()
    {
        vars = ManagerVars.GetManagerVars();
        my_Body = GetComponent<Rigidbody2D>();
        spriteRenderer = GetComponent<SpriteRenderer>();
    }

    private void Update()
    {
        //绘制射线
        Debug.DrawRay(rayDown.position, Vector2.down * 1, Color.red);
        Debug.DrawRay(rayLeft.position, Vector2.left * 0.15f, Color.red);
        Debug.DrawRay(rayRight.position, Vector2.right * 0.15f, Color.red);

        //判断当前事件是否触碰到UI需提前引入命名空间：UnityEngine.EventSystems;
        if (EventSystem.current.IsPointerOverGameObject())
        {
            return;
        }
        if (!GameManager.Instance.isGameStarted || GameManager.Instance.isGameOver || GameManager.Instance.isPause)
        {
            return;
        }
        //鼠标左键点击
        if (Input.GetMouseButtonDown(0) && !isJumping)
        {
            if (!isMove)
            {
                EventCenter.Broadcast(EventDefine.PlayerMove);
                isMove = true;
            }

            isJumping = true;
            EventCenter.Broadcast(EventDefine.DecidePath);
            //赋值鼠标点击位置
            Vector3 mousePos = Input.mousePosition;
            //鼠标点击左边屏幕
            if (mousePos.x <= Screen.width / 2)
            {
                isMoveLeft = true;
            }
            //鼠标点击右边屏幕
            else if (mousePos.x > Screen.width / 2)
            {
                isMoveLeft = false;
            }
            Jump();
        }

        //第一种游戏结束（踩空）
        if (my_Body.velocity.y < 0 && !IsRayPlatform() && !GameManager.Instance.isGameOver)
        {
            //修改渲染层级
            spriteRenderer.sortingLayerName = "Default";
            //关闭碰撞检测
            GetComponent<BoxCollider2D>().enabled = false;
            //游戏结束
            GameManager.Instance.isGameOver = true;
            //延时显示游戏结束面板
            StartCoroutine(DealyShowGameOverPanel());

        }

        //第二种游戏结束（碰到障碍物）
        if (isJumping && IsRayObstacle() && !GameManager.Instance.isGameOver)
        {
            //获取死亡特效预制体
            GameObject go = ObjectPool.Instance.GetDeathEffect();
            go.SetActive(true);
            //设置死亡特效预制体位置
            go.transform.position = transform.position;
            GameManager.Instance.isGameOver = true;
            spriteRenderer.enabled = false;
            //延时显示游戏结束面板
            StartCoroutine(DealyShowGameOverPanel());
        }
        //判断角色下落是否离开主摄像机范围及游戏是否结束
        if (transform.position.y - Camera.main.transform.position.y < -6 && !GameManager.Instance.isGameOver)
        {
            //游戏结束
            GameManager.Instance.isGameOver = true;
            spriteRenderer.enabled = false;
            //延时显示游戏结束面板
            StartCoroutine(DealyShowGameOverPanel());
        }
    }

    /// <summary>
    /// 延时显示游戏结束面板
    /// </summary>
    /// <returns></returns>
    private IEnumerator DealyShowGameOverPanel()
    {
        yield return new WaitForSeconds(1f);
        //游戏结束面板显示
        EventCenter.Broadcast(EventDefine.ShowGameOverPanel);
    }

    /// <summary>
    /// 射线检测是否检测到平台
    /// </summary>
    /// <returns>是否检测到平台</returns>
    private bool IsRayPlatform()
    {
        //2D物理射线
        RaycastHit2D hit = Physics2D.Raycast(rayDown.position, Vector2.down, 1f, PlatformLayer);
        if (hit.collider != null)
        {
            if (hit.collider.tag == "Platform")
            {

                //判断上一个射线检测到的物体是否与当前检测到的物体相同
                if (lastHitGo != hit.collider.gameObject)
                {
                    //判断上一个射线检测到的物体是否为空
                    if (lastHitGo == null)
                    {
                        lastHitGo = hit.collider.gameObject;
                        return true;
                    }
                    EventCenter.Broadcast(EventDefine.AddScore);
                    lastHitGo = hit.collider.gameObject;
                }
                return true;
            }
        }
        return false;
    }

    /// <summary>
    /// 射线检测是否检测到障碍物
    /// </summary>
    /// <returns></returns>
    private bool IsRayObstacle()
    {
        //2D物理射线
        RaycastHit2D lefthit = Physics2D.Raycast(rayLeft.position, Vector2.left, 0.15f, ObstacleLayer);
        RaycastHit2D righthit = Physics2D.Raycast(rayRight.position, Vector2.right, 0.15f, ObstacleLayer);

        //判断左侧射线检测是否检测到对象
        if (lefthit.collider != null)
        {
            //判断左侧射线检测到的对象是否为障碍物
            if (lefthit.collider.tag == "Obstacle")
            {
                return true;
            }
        }

        //判断右侧射线检测是否检测到对象
        if (righthit.collider != null)
        {
            //判断右侧射线检测到的对象是否为障碍物
            if (righthit.collider.tag == "Obstacle")
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// 跳跃
    /// </summary>
    private void Jump()
    {
        if (isMoveLeft)
        {
            //向左转向
            transform.localScale = new Vector3(-1, 1, 1);
            //X轴向左移动
            transform.DOMoveX(nextPlatformLeft.x, 0.2f);
            //Y轴向左移动
            transform.DOMoveY(nextPlatformLeft.y + 0.8f, 0.15f);
        }
        else
        {
            //向右转向
            transform.localScale = Vector3.one;
            //X轴向右移动
            transform.DOMoveX(nextPlatformRight.x, 0.2f);
            //Y轴向左移动
            transform.DOMoveY(nextPlatformRight.y + 0.8f, 0.15f);
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.tag == "Platform")
        {
            isJumping = false;
            //存储碰撞体位置
            Vector3 currentPlatformPos = collision.gameObject.transform.position;
            //向左下一个台阶位置
            nextPlatformLeft = new Vector3(currentPlatformPos.x - vars.nextXPos, currentPlatformPos.y + vars.nextYPos, 0);
            //向右下一个台阶位置
            nextPlatformRight = new Vector3(currentPlatformPos.x + vars.nextXPos, currentPlatformPos.y + vars.nextYPos, 0);
        }
    }

    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.collider.tag == "Pickup")
        {
            EventCenter.Broadcast(EventDefine.AddDiamont);
            //吃到钻石
            collision.gameObject.SetActive(false);
        }
    }
}
