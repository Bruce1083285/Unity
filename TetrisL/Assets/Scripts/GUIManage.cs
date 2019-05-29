/*================================================================================
项目说明：                98教育出品的公开课随堂项目。                                                
公开课(每周1到5)永久地址：  http://ke.qq.com/course/109510#term_id=100116836
咨询信息：                QQ：2098089928。 学习交流群：397056246。
往期视频：                http://bbs.98jy.net。
=================================================================================*/

using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class GUIManage : MonoBehaviour {

    float time, startTime;
    Text timer;
    bool isEnd = false;


    public GameObject gameOverUI;

	void Start () {

        timer = GameObject.Find("Canvas/Timer").GetComponent<Text>();

        //得到游戏开始的时间（单位：秒）
        startTime = Time.time;	
	}
	
	void Update () {

        if (isEnd) return;

        //得到当前时间跟游戏开始的时间的差别 (单位：秒)
        time = Time.time - startTime;

        //秒
        int seconds = (int) (time % 60);
        //分
        int minutes = (int) (time / 60);

        string strTime = string.Format("{0:00}:{1:00}", minutes, seconds);
        timer.text = strTime;	
	}

    public void GameOver()
    {
        gameOverUI.SetActive(true);

        isEnd = true;
    }
}
