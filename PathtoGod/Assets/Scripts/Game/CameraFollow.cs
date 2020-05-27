using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 相机跟随
/// </summary>
public class CameraFollow : MonoBehaviour
{
    /// <summary>
    /// 目标
    /// </summary>
    private Transform target;
    /// <summary>
    /// 偏移量
    /// </summary>
    private Vector3 offset;
    /// <summary>
    /// 当前速度值
    /// </summary>
    private Vector2 velocity;

    private void Update()
    {
        if (target == null && GameObject.FindGameObjectWithTag("Player") != null)
        {
            //找到目标游戏物体
            target = GameObject.FindGameObjectWithTag("Player").transform;
            //计算偏移量
            offset = target.position - transform.position;
        }
    }

    private void FixedUpdate()
    {
        if (target != null)
        {
            //Mathf.SmoothDamp平滑阻尼
            float posX = Mathf.SmoothDamp(transform.position.x, target.position.x - offset.x, ref velocity.x, 0.05f);
            float posY = Mathf.SmoothDamp(transform.position.y, target.position.y - offset.y, ref velocity.y, 0.05f);
            if (posY > transform.position.y)
            {
                transform.position = new Vector3(posX, posY, transform.position.z);
            }
        }
    }
}
