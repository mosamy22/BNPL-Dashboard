import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../styles/Analytics.css';

const MerchantAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/analytics/');
                setAnalytics(response.data);
            } catch (error) {
                setError('Failed to fetch analytics data. Please try again later.');
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!analytics) {
        return <div>No analytics data available</div>;
    }

    const statusData = [
        { name: 'Active', value: analytics.active_plans },
        { name: 'Paid', value: analytics.paid_plans },
        { name: 'Overdue', value: analytics.overdue_installments }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="analytics-dashboard">
            <h1>Merchant Analytics Dashboard</h1>
            
            <div className="summary-cards">
                <div className="card">
                    <h3>Total Revenue</h3>
                    <p>{analytics.total_revenue} ريال</p>
                </div>
                <div className="card">
                    <h3>Success Rate</h3>
                    <p>{analytics.success_rate.toFixed(2)}%</p>
                </div>
                <div className="card">
                    <h3>Active Plans</h3>
                    <p>{analytics.active_plans}</p>
                </div>
                <div className="card">
                    <h3>Overdue Installments</h3>
                    <p>{analytics.overdue_installments}</p>
                </div>
            </div>

            <div className="charts">
                <div className="chart-container">
                    <h3>Plan Status Distribution</h3>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={statusData}
                            cx={200}
                            cy={150}
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            <div className="recent-activity">
                <h3>Recent Plans</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User Email</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analytics.recent_plans.map(plan => (
                            <tr key={plan.id}>
                                <td>{plan.user_email}</td>
                                <td>{plan.total_amount} ريال</td>
                                <td>{plan.status}</td>
                                <td>{new Date(plan.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MerchantAnalytics; 