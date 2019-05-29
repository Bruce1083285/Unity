/*================================================================================
项目说明：                98教育出品的公开课随堂项目。                                                
公开课(每周1到5)永久地址：  http://ke.qq.com/course/109510#term_id=100116836
咨询信息：                QQ：2098089928。 学习交流群：397056246。
往期视频：                http://bbs.98jy.net。
=================================================================================*/

using UnityEngine;
using System.Collections;

public class Groups : MonoBehaviour {

    float lastFall = 0;

	void Start () {

        if (!isValidGridPos())
        {
            Debug.Log("GAME OVER");

            GameObject.Find("Canvas").GetComponent<GUIManage>().GameOver();

            Destroy(gameObject);
        }	
	}
	
	void Update () {

        //控制group左移
        if (Input.GetKeyDown(KeyCode.LeftArrow))
        {
            transform.position += new Vector3(-1, 0, 0);

            if (isValidGridPos())
            {
                updateGrid();
            }
            else
            {
                transform.position += new Vector3(1, 0, 0);
            }
        }
        //控制group右移
        else if (Input.GetKeyDown(KeyCode.RightArrow))
        {
            transform.position += new Vector3(1, 0, 0);

            if (isValidGridPos())
            {
                updateGrid();
            }
            else
            {
                transform.position += new Vector3(-1, 0, 0);
            }
        }
        //控制group旋转
        else if (Input.GetKeyDown(KeyCode.UpArrow))
        {
            transform.Rotate(0, 0, -90);

            if (isValidGridPos())
            {
                updateGrid();
            }
            else
            {
                transform.Rotate(0, 0, 90);
            }
        }
        //控制group快速掉落
        else if (Input.GetKeyDown(KeyCode.DownArrow) || 
            Time.time - lastFall >= 1f)
        {
            transform.position += new Vector3(0, -1f, 0);

            if (isValidGridPos())
            {
                updateGrid();
            }
            else
            {
                transform.position += new Vector3(0, 1, 0);

                //已经到位，所以可以测试是否可以删除已经“满”的行
                Grid.deleteFullRows();

                FindObjectOfType<Spawner>().spawnNext();
                enabled = false;
            }

            lastFall = Time.time;
        }

    }

    bool isValidGridPos()
    {
        foreach(Transform child in transform)
        {
            Vector2 v = Grid.roundVec2(child.position);

            //1、判断是否在边界之内（左、右、下方）
            if (!Grid.insideBorder(v))
            {
                return false;
            }

            //2、现在的grid对应的格子里面是null
            if (Grid.grid[(int)v.x, (int)v.y] != null && 
                Grid.grid[(int)v.x, (int)v.y].parent != transform)
            {
                return false;
            }
        }

        return true;
    }

    void updateGrid()
    {
        //上一次的数据清理，移去原来占据的格子信息
        for (int y = 0; y < Grid.h; y++)
            for (int x = 0; x < Grid.w; x++)
            {
                if (Grid.grid[x, y] != null)
                    if (Grid.grid[x, y].parent == transform)
                        Grid.grid[x, y] = null;
            }

        //加入本次的更新的位置信息
        foreach (Transform child in transform)
        {
            Vector2 v = Grid.roundVec2(child.position);
            Grid.grid[(int)v.x, (int)v.y] = child;
        }
    }
}
