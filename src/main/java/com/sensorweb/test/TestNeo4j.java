package com.sensorweb.test;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sensorweb.dao.GetNeo4jSession;
import org.junit.Test;
import org.neo4j.driver.v1.*;
import static org.neo4j.driver.v1.Values.parameters;

import java.util.*;

import static java.util.Arrays.asList;

public class TestNeo4j {

    public static void main(String...args) {

    }

    @Test
    public void test() {
        Session session = GetNeo4jSession.session;

//        List data =
//                asList(asList("Jim","Mike"),asList("Jim","Billy"),asList("Anna","Jim"),
//                        asList("Anna","Mike"),asList("Sally","Anna"),asList("Joe","Sally"),
//                        asList("Joe","Bob"),asList("Bob","Sally"));
//
//        String insertQuery = "UNWIND {pairs} as pair " +
//                "MERGE (p1:Person {name:pair[0]}) " +
//                "MERGE (p2:Person {name:pair[1]}) " +
//                "MERGE (p1)-[:KNOWS]-(p2);";
//
//        Map<String,Object> map = new HashMap<>();
//        map.put("pairs",data);
//        session.run(insertQuery, map).consume();


        StatementResult result;

        String sql = "MATCH (n:y) RETURN properties(n)";
        result = session.run(sql);
//        List<Record> records = result.list();
        List info = new ArrayList();
        while (result.hasNext()) {
//            System.out.println(result.next().size());
//            System.out.println(result.next().get(0));
            info.add(result.next().get(0));
        }
        System.out.println(info.toString());
        Object json = JSONObject.parse(info.toString());
        System.out.println(json.toString());
    }
}
