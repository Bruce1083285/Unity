/*================================================================================
项目说明：                98教育出品的公开课随堂项目。                                                
公开课(每周1到5)永久地址：  http://ke.qq.com/course/109510#term_id=100116836
咨询信息：                QQ：2098089928。 学习交流群：397056246。
往期视频：                http://bbs.98jy.net。
=================================================================================*/

using UnityEngine;
using System.Collections;

public class Spawner : MonoBehaviour {

    public GameObject[] groups;

	void Start () {

        spawnNext();
	}

    public void spawnNext()
    {
        int i = Random.Range(0, groups.Length);

        GameObject ins = Instantiate(groups[i], transform.position, Quaternion.identity) as GameObject;


    }
	

}
