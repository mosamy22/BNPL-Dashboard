import React, { useState, useEffect } from 'react';
import { getPlans, payInstallment } from '../services/api';

const UserDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await getPlans();
            setPlans(response);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handlePayment = async (installmentId) => {
        setLoading(true);
        try {
            await payInstallment(installmentId);
            await fetchPlans();
        } catch (error) {
            console.error('Error processing payment:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800';
            case 'Late':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Payment Plans</h1>
            
            {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Plan #{plan.id}</h2>
                        <div className="text-lg">
                            Total: <span className="font-bold">{plan.total_amount} ريال</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {plan.installments.map((installment) => (
                                    <tr key={installment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(installment.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {installment.amount} ريال
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(installment.status)}`}>
                                                {installment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {installment.status === 'Pending' && (
                                                <button
                                                    onClick={() => handlePayment(installment.id)}
                                                    disabled={loading}
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                                >
                                                    {loading ? 'Processing...' : 'Pay Now'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserDashboard;