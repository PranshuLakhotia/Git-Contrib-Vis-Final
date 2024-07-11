import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const GitHubContributions = ({ username }) => {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`https://api.github.com/users/${username}/events/public`);
                console.log('Data fetched:', result.data); // Debug statement
                const parsedData = parseGitHubData(result.data);
                setContributions(parsedData);
            } catch (error) {
                console.error("Error fetching GitHub data:", error);
            }
        };
        fetchData();
    }, [username]);

    const parseGitHubData = (data) => {
        const contribMap = new Map();
        data.forEach(event => {
            const date = event.created_at.split('T')[0];
            contribMap.set(date, (contribMap.get(date) || 0) + 1);
        });
        console.log('Parsed Data:', Array.from(contribMap)); // Debug statement
        return Array.from(contribMap).map(([date, count]) => ({ date, count }));
    };

    useEffect(() => {
        if (contributions.length > 0) {
            drawChart(contributions);
        }
    }, [contributions]);

    const drawChart = (data) => {
        const width = 800;
        const height = 150;
        const cellSize = 17;

        const svg = d3.select("#chart")
            .attr("width", width)
            .attr("height", height);

        const color = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range(["#ebedf0", "#1e6823"]);

        const dateFormat = d3.timeFormat("%Y-%m-%d");

        const rect = svg.selectAll("rect")
            .data(data, d => d.date);

        rect.enter().append("rect")
            .attr("x", d => d3.timeWeek.count(d3.timeYear(new Date(d.date)), new Date(d.date)) * cellSize)
            .attr("y", d => new Date(d.date).getDay() * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => color(d.count))
            .append("title")
            .text(d => `${dateFormat(new Date(d.date))}: ${d.count} contributions`);

        rect.exit().remove();
    };

    return (
        <div>
            <svg id="chart"></svg>
        </div>
    );
};

export default GitHubContributions;
