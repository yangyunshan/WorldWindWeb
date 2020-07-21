package com.sensorweb.model;

public class Node {
    String name;
    String pagerank;
    int community;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPagerank() {
        return pagerank;
    }

    public void setPagerank(String pagerank) {
        this.pagerank = pagerank;
    }

    public int getCommunity() {
        return community;
    }

    public void setCommunity(int community) {
        this.community = community;
    }
}
