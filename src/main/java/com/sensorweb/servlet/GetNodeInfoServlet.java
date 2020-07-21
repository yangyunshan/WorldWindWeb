package com.sensorweb.servlet;

import com.alibaba.fastjson.JSONObject;
import com.sensorweb.dao.GetNeo4jSession;
import org.neo4j.driver.v1.Session;
import org.neo4j.driver.v1.StatementResult;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

public class GetNodeInfoServlet extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        PrintWriter printWriter = response.getWriter();

        String cqlString = request.getParameter("CQL");

        Session session = GetNeo4jSession.session;
        StatementResult result;

        result = session.run(cqlString);
        List info = new ArrayList();
        while (result.hasNext()) {
            info.add(result.next().get(0));
        }

        Object json =JSONObject.parse(info.toString());
        System.out.println(json.toString());
        printWriter.write(json.toString());
        printWriter.flush();
        printWriter.close();

    }
}
