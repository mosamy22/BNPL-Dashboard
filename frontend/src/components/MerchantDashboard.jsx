import React, { useState, useEffect } from 'react';
import { createPlan, getPlans, getAnalytics } from '../services/api';

const MerchantDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [formData, setFormData] = useState({
        total_amount: '',
        number_of_installments: '',
        user_email: '',
        start_date: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPlans();
        fetchAnalytics();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await getPlans();
            setPlans(response);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await getAnalytics();
            setAnalytics(response);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.number_of_installments) {
            setError('Number of installments is required');
            return false;
        }
        
        const installments = parseInt(formData.number_of_installments);
        if (isNaN(installments) || installments <= 0) {
            setError('Number of installments must be a positive number');
            return false;
        }

        if (!formData.total_amount) {
            setError('Total amount is required');
            return false;
        }

        const amount = parseFloat(formData.total_amount);
        if (isNaN(amount) || amount <= 0) {
            setError('Total amount must be a positive number');
            return false;
        }

        if (!formData.user_email) {
            setError('User email is required');
            return false;
        }

        if (!formData.start_date) {
            setError('Start date is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const planData = {
                ...formData,
                number_of_installments: parseInt(formData.number_of_installments),
                total_amount: parseFloat(formData.total_amount)
            };
            
            await createPlan(planData);
            fetchPlans();
            fetchAnalytics();
            setFormData({
                total_amount: '',
                number_of_installments: '',
                user_email: '',
                start_date: ''
            });
            setError('');
        } catch (error) {
            console.error('Error creating plan:', error);
            setError(error.response?.data?.error || 'Failed to create payment plan');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Merchant Dashboard</h1>
            
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
                        <p className="text-2xl font-bold">{analytics.total_revenue} ريال</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Active Plans</h3>
                        <p className="text-2xl font-bold">{analytics.active_plans}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                        <p className="text-2xl font-bold">{analytics.success_rate.toFixed(1)}%</p>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Payment Plan</h2>
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                            <input
                                type="number"
                                name="total_amount"
                                value={formData.total_amount}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Installments</label>
                            <input
                                type="number"
                                name="number_of_installments"
                                value={formData.number_of_installments}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                min="1"
                                step="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User Email</label>
                            <input
                                type="email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Create Plan
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Payment Plans</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installments</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {plans.map((plan) => (
                                <tr key={plan.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{plan.user_email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{plan.total_amount} ريال</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {plan.installments.filter(i => i.status === 'Paid').length} / {plan.number_of_installments}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {plan.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;