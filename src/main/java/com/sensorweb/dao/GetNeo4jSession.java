package com.sensorweb.dao;

import org.neo4j.driver.v1.*;

public class GetNeo4jSession {
    public static Session session;
    static {
        Config noSSL = Config.build().withEncryptionLevel(Config.EncryptionLevel.NONE).toConfig();
        Driver driver = GraphDatabase.driver("bolt://localhost", AuthTokens.basic("neo4j","12345"),noSSL); // <password>
        try {
            session = driver.session();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
